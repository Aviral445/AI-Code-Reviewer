import subprocess
import tempfile
import os
import re
import requests
from dotenv import load_dotenv

load_dotenv()

# Provider configuration: 'groq' (default), 'openai', or 'ollama'
PROVIDER = os.getenv("PROVIDER", "groq").lower()

# Groq Config
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

# Fallback models in priority order
GROQ_FALLBACK_MODELS = [
    GROQ_MODEL,
    "openai/gpt-oss-120b",
    "qwen/qwen3.6-27b",
    "openai/gpt-oss-20b",
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
]

# OpenAI Config
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# Ollama Config
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")

# Initialize Groq client
groq_client = None
if PROVIDER == "groq" and GROQ_API_KEY:
    try:
        from groq import Groq
        groq_client = Groq(api_key=GROQ_API_KEY)
    except ImportError:
        pass

# Initialize OpenAI client
openai_client = None
if PROVIDER == "openai" and OPENAI_API_KEY:
    try:
        from openai import OpenAI
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
    except ImportError:
        pass

def is_python_code(code: str, language: str = "auto") -> bool:
    """Check if the code snippet is likely Python."""
    if language.lower() in ("python", "py"):
        return True
    if language.lower() in ("javascript", "typescript", "js", "ts", "html", "css", "java", "cpp", "c", "go", "rust"):
        return False
    # Auto-detection heuristic
    js_indicators = ["function ", "const ", "let ", "var ", "console.log", "=== ", "=>", "document.", "import React"]
    py_indicators = ["def ", "import ", "from ", "class ", "elif ", "print(", "__name__", "self."]
    
    js_score = sum(1 for ind in js_indicators if ind in code)
    py_score = sum(1 for ind in py_indicators if ind in code)
    
    if js_score > py_score:
        return False
    return True

def run_static_tools(code: str, language: str = "auto"):
    """Run pylint + bandit checks only if code is Python."""
    if not is_python_code(code, language):
        return []

    issues = []
    with tempfile.NamedTemporaryFile(delete=False, suffix=".py", mode="w", encoding="utf-8") as tmp:
        tmp.write(code)
        tmp_path = tmp.name

    try:
        pylint_output = subprocess.run(
            ["pylint", tmp_path, "--disable=all", "--enable=E,W"],
            capture_output=True, text=True
        )
        if pylint_output.stdout and pylint_output.stdout.strip():
            issues.append({
                "type": "style/syntax",
                "message": pylint_output.stdout.strip(),
                "explanation": "Pylint detected syntax errors, warnings, or style anomalies."
            })

        bandit_output = subprocess.run(
            ["bandit", "-q", "-r", tmp_path],
            capture_output=True, text=True
        )
        if bandit_output.stdout and bandit_output.stdout.strip():
            issues.append({
                "type": "security",
                "message": bandit_output.stdout.strip(),
                "explanation": "Bandit detected potential security vulnerabilities."
            })
    except Exception:
        pass
    finally:
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except OSError:
                pass

    return issues

def extract_refactored_code(ai_text: str) -> str:
    """Extract just the fixed code block from the review output."""
    if not ai_text:
        return ""
    pattern = r"(?:###?\s*.*Refactored Code.*?\n+```[a-zA-Z0-9_-]*\n)([\s\S]*?)(?:```)"
    match = re.search(pattern, ai_text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    
    blocks = re.findall(r"```[a-zA-Z0-9_-]*\n([\s\S]*?)```", ai_text)
    if blocks:
        return blocks[-1].strip()
    return ""

def run_ai_review(code: str, language: str = "auto"):
    """Call the selected AI provider (Groq, OpenAI, or Ollama) for comprehensive review and automated fix."""
    system_prompt = (
        "You are a Principal Software Engineer and Security Specialist performing a professional code review and automated fix. "
        "Review the provided code thoroughly and return a well-structured markdown report formatted with the exact following sections:\n\n"
        "### 🎯 Summary\n"
        "A brief 1-2 sentence assessment of the code's quality, functionality, and intent.\n\n"
        "### 🚨 Bugs & Security Vulnerabilities\n"
        "List all critical bugs, security vulnerabilities (e.g., SQL injection, XSS, resource/memory leaks, unhandled exceptions, off-by-one errors).\n\n"
        "### ⚡ Performance & Complexity\n"
        "Highlight any runtime/memory bottlenecks (e.g. O(N^2) loops) and how to optimize them.\n\n"
        "### 🧹 Best Practices & Clean Code\n"
        "Constructive feedback on naming, modularity, type safety, and maintainability.\n\n"
        "### 💡 Refactored Code\n"
        "Provide the complete, bug-free, production-ready fixed code inside a single markdown code block with inline explanatory comments."
    )
    user_prompt = f"Language: {language}\n\n```\n{code}\n```"

    # 1. Groq Provider
    if PROVIDER == "groq":
        global groq_client
        if not groq_client and GROQ_API_KEY:
            try:
                from groq import Groq
                groq_client = Groq(api_key=GROQ_API_KEY)
            except ImportError:
                raise RuntimeError("groq Python package is not installed. Run: pip install groq")

        if not groq_client:
            raise RuntimeError("GROQ_API_KEY is missing. Please set GROQ_API_KEY in backend/.env")

        # Try configured model with automatic fallback
        last_err = None
        models_to_try = list(dict.fromkeys(GROQ_FALLBACK_MODELS))
        for m in models_to_try:
            try:
                resp = groq_client.chat.completions.create(
                    model=m,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    temperature=0.2,
                    max_tokens=2048,
                )
                return resp.choices[0].message.content
            except Exception as e:
                last_err = e
                continue
        
        raise RuntimeError(f"Groq review failed: {str(last_err)}")

    # 2. Ollama Provider
    elif PROVIDER == "ollama":
        url = f"{OLLAMA_HOST.rstrip('/')}/api/chat"
        payload = {
            "model": OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "stream": False,
        }
        r = requests.post(url, json=payload, timeout=120)
        r.raise_for_status()
        data = r.json()
        msg = data.get("message", {}).get("content")
        if not msg:
            msgs = data.get("messages") or []
            if msgs:
                msg = msgs[-1].get("content")
        return msg or "No AI feedback returned from Ollama."

    # 3. OpenAI Provider
    elif PROVIDER == "openai":
        global openai_client
        if not openai_client and OPENAI_API_KEY:
            try:
                from openai import OpenAI
                openai_client = OpenAI(api_key=OPENAI_API_KEY)
            except ImportError:
                raise RuntimeError("openai Python package is not installed.")

        if not openai_client:
            raise RuntimeError("OPENAI_API_KEY is not set in backend/.env.")

        resp = openai_client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            max_tokens=2048,
        )
        return resp.choices[0].message.content

    else:
        raise ValueError(f"Unsupported PROVIDER: {PROVIDER}. Supported providers: 'groq', 'openai', 'ollama'.")

def review_code(code: str, language: str = "auto"):
    static_issues = run_static_tools(code, language)
    ai_feedback = run_ai_review(code, language)
    fixed_code = extract_refactored_code(ai_feedback)
    return {
        "static_analysis": static_issues,
        "ai_review": ai_feedback,
        "fixed_code": fixed_code
    }

def get_provider_info() -> dict:
    """Return current provider configuration for frontend health badge."""
    info = {
        "provider": PROVIDER,
        "model": GROQ_MODEL if PROVIDER == "groq" else (OPENAI_MODEL if PROVIDER == "openai" else OLLAMA_MODEL),
    }
    if PROVIDER == "groq":
        info["configured"] = bool(GROQ_API_KEY and GROQ_API_KEY != "your_groq_api_key_here")
    elif PROVIDER == "openai":
        info["configured"] = bool(OPENAI_API_KEY and OPENAI_API_KEY != "your_openai_api_key_here")
    elif PROVIDER == "ollama":
        info["host"] = OLLAMA_HOST
        info["configured"] = True
    return info
