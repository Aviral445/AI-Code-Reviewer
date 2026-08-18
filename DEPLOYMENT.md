# 🚀 Deployment Information

### 🌐 Live Services

| Service | Platform | Live URL | Health Status |
| :--- | :--- | :--- | :--- |
| **Backend API** | Render | [https://ai-code-reviewer-backend-810r.onrender.com](https://ai-code-reviewer-backend-810r.onrender.com) | 🟢 Live & Configured |
| **API Health Check** | Render | [https://ai-code-reviewer-backend-810r.onrender.com/health](https://ai-code-reviewer-backend-810r.onrender.com/health) | `{"status":"ok","provider":"groq"}` |
| **API Documentation** | Render | [https://ai-code-reviewer-backend-810r.onrender.com/docs](https://ai-code-reviewer-backend-810r.onrender.com/docs) | Interactive Swagger UI |
| **Frontend** | Vercel (Pending) | *Add URL here after Vercel deployment* | - |

---

### 🔑 Environment Configuration

#### Frontend (`frontend/.env.production` / Vercel Environment Variable):
```env
VITE_API_URL=https://ai-code-reviewer-backend-810r.onrender.com
```

#### Backend (Render Environment Variables):
```env
PROVIDER=groq
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
```
