# PrepWise — AI Voice Interview Platform

A production-ready AI-powered mock interview platform with real-time voice processing, multi-LLM routing, and structured evaluation.

## 🚀 Getting Started (Local Development)

### 1. Clone the repo
```bash
git clone https://github.com/aziz04076/Real-Time-AI-Voice-Agent-Interview-Platform.git
cd Real-Time-AI-Voice-Agent-Interview-Platform
```

### 2. Install dependencies
```bash
npm install
cd frontend && npm install
```

### 3. Configure environment variables
```bash
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local and fill in your keys
```

### 4. Run the dev server
```bash
npm run dev
# Open http://localhost:4000
```

---

## 🌐 Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import this repo
3. Set **Root Directory** to `frontend`
4. Add all environment variables from `.env.example`
5. Set `MONGODB_URI` to your **MongoDB Atlas SRV** URI (not localhost)
6. Set `NEXT_PUBLIC_BASE_URL` to your Vercel URL (e.g. `https://your-app.vercel.app`)
7. Click Deploy ✅

---

## 🔑 Required Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas SRV connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `OPENAI_API_KEY` | OpenAI API key |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key |
| `DEEPGRAM_API_KEY` | Deepgram STT API key |
| `ELEVENLABS_API_KEY` | ElevenLabs TTS API key |
| `NEXT_PUBLIC_BASE_URL` | Your deployed URL |

See `frontend/.env.example` for the full list.

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-4o, Google Gemini 1.5 Flash
- **Voice**: Deepgram STT, ElevenLabs TTS, Web Speech API
- **Database**: MongoDB Atlas + Mongoose
- **Auth**: JWT + bcryptjs
- **Payments**: Stripe