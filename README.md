# Memex — Personal Knowledge Base

Upload documents (PDF, TXT, MD), organise them into collections and chat with them.

**Stack:** React + Vite + Tailwind + Firebase Auth (frontend) · FastAPI (backend) · Google Gemini for chat and embeddings.

## Run locally

Backend:
```bash
cd backend
python -m venv venv && venv\Scripts\activate      # Windows (use source venv/bin/activate on Mac/Linux)
pip install -r requirements.txt
copy .env.example .env                              # then fill in the values
uvicorn main:app --reload --port 8000
```

Frontend:
```bash
cd frontend
npm install
copy .env.example .env                              # fill in the Firebase values, leave VITE_API_URL empty
npm run dev
```
Open http://localhost:5173

## Deploy
Frontend → Vercel (root directory `frontend`). Backend → Render (root directory `backend`,
build `pip install -r requirements.txt`, start `uvicorn main:app --host 0.0.0.0 --port $PORT`).

Backend environment variables: `GEMINI_API_KEY`, `FIREBASE_PROJECT_ID`, `ALLOWED_ORIGINS` (your Vercel URL).
Frontend environment variables: all `VITE_FIREBASE_*` values plus `VITE_API_URL` (your backend URL).
Add your Vercel domain in Firebase → Authentication → Settings → Authorized domains.

## Notes
- Every API route requires a Firebase ID token; data is stored per user.
- Data is kept in `db.json` + `uploads/` on the server's disk. On free hosting tiers this disk is
  wiped on restart/redeploy — use a persistent disk or move to a database for long-term storage.
