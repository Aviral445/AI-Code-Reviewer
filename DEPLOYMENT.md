# 🚀 Deployment Information

### 🌐 Live Production Links

| Service | Platform | Live URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | Vercel | [https://ai-code-reviewer-five-delta.vercel.app](https://ai-code-reviewer-five-delta.vercel.app/) | 🟢 Live |
| **Backend API** | Render | [https://ai-code-reviewer-backend-810r.onrender.com](https://ai-code-reviewer-backend-810r.onrender.com) | 🟢 Live |
| **API Health Check** | Render | [https://ai-code-reviewer-backend-810r.onrender.com/health](https://ai-code-reviewer-backend-810r.onrender.com/health) | 🟢 Healthy |
| **API Documentation** | Render | [https://ai-code-reviewer-backend-810r.onrender.com/docs](https://ai-code-reviewer-backend-810r.onrender.com/docs) | 🟢 Interactive Swagger UI |

---

### 🔑 Environment Configuration Reference

#### Frontend (`frontend/.env.production` & Vercel Environment Variables):
```env
VITE_API_URL=https://ai-code-reviewer-backend-810r.onrender.com
```

#### Backend (Render Environment Variables):
```env
PROVIDER=groq
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
```
