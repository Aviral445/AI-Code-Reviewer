# ⚡ AI Code Reviewer

An intelligent, full-stack code review assistant combining **static linters** (`pylint`, `bandit`) and **lightning-fast AI code review** powered by **Groq LPU** (`llama-3.3-70b-versatile`).

---

## ✨ Features

- ⚡ **Groq LPU Acceleration**: Millisecond code evaluation with `llama-3.3-70b-versatile` (or `llama-3.1-8b-instant`).
- 🛡️ **Dual Static Analysis**: Integrated `pylint` (syntax & code anomalies) and `bandit` (security vulnerability scan) for Python snippets.
- 🌐 **Multi-Language Support**: Reviews Python, JavaScript, TypeScript, Go, Rust, Java, C++, and SQL with auto-detection.
- 🎨 **Modern Dark Mode Interface**: Split-screen developer dashboard built with React 18, Vite, and Tailwind CSS.
- 📋 **Sample Bug Library**: Preloaded templates demonstrating common real-world bugs (SQL injection, off-by-one loops, unclosed file descriptors, XSS, and memory leaks).
- 🔄 **Flexible AI Providers**: Primary support for **Groq**, with seamless fallback to **OpenAI** or local offline **Ollama**.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- Free **Groq API Key** (from [console.groq.com](https://console.groq.com))

---

### 2. Backend Setup

```bash
cd backend

# 1. Install Python dependencies (including Groq SDK and linters)
pip install -r requirements.txt

# 2. Configure environment variables
cp .env.example .env

# 3. Edit .env and paste your Groq API key:
# GROQ_API_KEY=gsk_...
# PROVIDER=groq
# GROQ_MODEL=llama-3.3-70b-versatile

# 4. Start the FastAPI backend
uvicorn main:app --reload
```

The backend runs at `http://localhost:8000`. You can test it in your browser:
- Health check: `http://localhost:8000/health`
- API documentation: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🪟 Windows Quick Start Scripts

To start both the backend and frontend simultaneously in separate terminals:
- **PowerShell**: `.\run-dev.ps1`
- **Command Prompt**: `run-dev.bat`

---

## ⚙️ AI Provider Configuration

Edit `backend/.env` to switch between AI providers:

### Option A: Groq (Recommended — Free & Super Fast)
```env
PROVIDER=groq
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
```

### Option B: OpenAI
```env
PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

### Option C: Ollama (100% Local / Offline)
```env
PROVIDER=ollama
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

---

## 📁 Project Structure

```
ai-code-reviewer/
├── backend/
│   ├── .env.example       # Sample environment configuration
│   ├── main.py            # FastAPI endpoints & CORS
│   ├── requirements.txt   # Python dependencies (groq, fastapi, pylint, bandit)
│   └── review.py          # AI analysis engine & static linter runners
├── frontend/
│   ├── index.html         # Application entry HTML
│   ├── package.json       # Frontend scripts and packages
│   ├── src/
│   │   ├── App.jsx        # Main React dashboard component
│   │   ├── api.js         # Axios API client
│   │   ├── samples.js     # Buggy & vulnerable code templates
│   │   └── components/
│   │       ├── About.jsx
│   │       ├── ProviderBadge.jsx
│   │       └── SamplePicker.jsx
├── run-dev.bat            # Windows CMD dev starter
├── run-dev.ps1            # Windows PowerShell dev starter
└── README.md
```
