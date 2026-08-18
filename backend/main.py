from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Code Reviewer API", version="2.0.0")

class CodeRequest(BaseModel):
    code: str
    language: str = "auto"

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "⚡ AI Code Reviewer Backend running! Use POST /review to submit code."}

@app.get("/health")
def health():
    try:
        import review as review_module  # type: ignore
        info = review_module.get_provider_info()
        return {"status": "ok", **info}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.post("/review")
def review_code(request: CodeRequest):
    import review as review_module  # type: ignore

    try:
        if not request.code or not request.code.strip():
            return {"error": "Code snippet cannot be empty."}

        result = review_module.review_code(request.code, request.language)
        static_issues = result.get("static_analysis", [])
        ai_feedback = result.get("ai_review", "")
        
        static_text_parts = []
        for idx, issue in enumerate(static_issues, start=1):
            kind = issue.get("type", "issue")
            explanation = issue.get("explanation", "")
            message = issue.get("message", "")
            static_text_parts.append(f"**Issue {idx} ({kind})** — {explanation}\n```text\n{message}\n```")
            
        static_section = "\n\n".join(static_text_parts) if static_text_parts else "✅ No static analysis issues or security vulnerabilities flagged by static linters."
        
        combined_markdown = (
            "## 🔍 Static Analysis (pylint / bandit)\n\n" + static_section +
            "\n\n---\n\n## 🤖 AI Code Review\n\n" + (ai_feedback or "No AI feedback generated.")
        )
        
        return {
            "review": combined_markdown,
            "static_issues": static_issues,
            "ai_review": ai_feedback
        }
    except Exception as e:
        import traceback
        traceback_str = traceback.format_exc()
        print("🔥 Backend Error:\n", traceback_str)
        return {"error": str(e)}
