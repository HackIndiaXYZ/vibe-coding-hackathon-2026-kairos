# ⚙️ LinkSys — Setup Instructions

> Full stack running locally in under 10 minutes.

---

## Prerequisites

| Tool | Minimum Version | Check |
|---|---|---|
| Node.js | v18+ | `node --version` |
| npm | v9+ | `npm --version` |
| Python | 3.10+ | `python --version` |
| pip | 23+ | `pip --version` |
| Git | Any | `git --version` |

---

## Before You Start — Google OAuth Credentials

LinkSys uses Google OAuth for authentication. You need credentials from Google Cloud Console before the app will run.

### 1. Create the OAuth Client

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Set Application type to **Web application**
6. Under **Authorised redirect URIs**, add exactly:
   ```
   http://localhost:8000/auth/google/callback
   ```
7. Copy your **Client ID** and **Client Secret** — you'll need them shortly

### 2. Configure the OAuth Consent Screen (Testing Mode)

Before anyone can log in, you need to set up the consent screen and add test users.

1. In the left sidebar go to **APIs & Services → OAuth consent screen**
2. Select **External** as the user type and click **Create**
3. Fill in the required fields (App name, support email) and click **Save and Continue** through the Scopes step
4. On the **Test users** step:
   - Click **Add Users**
   - Enter the Google email address(es) of everyone who needs to test the app
   - Click **Add**, then **Save and Continue**
5. On the **Summary** page, confirm the publishing status shows **Testing**

> Only the email addresses you add as test users will be able to sign in while the app is in Testing mode. Anyone else will see an "access blocked" error from Google.

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/HackIndiaXYZ/vibe-coding-hackathon-2026-kairos.git
cd vibe-coding-hackathon-2026-kairos
```

---

## Step 2 — Backend Setup

```bash
cd backend
```

**Create and activate a virtual environment:**

```bash
# macOS / Linux
python -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

**Install dependencies:**

```bash
pip install -r requirements.txt
```

**Create your `.env` file** in the `backend/` directory:

```env
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-secret-here
SECRET_KEY=anyrandomstring
DATABASE_URL=sqlite:///./footprint.db
FRONTEND_URL=http://localhost:5173
```

Replace `your-actual-client-id-here` and `your-actual-secret-here` with the values from Google Cloud Console.

> For a stronger `SECRET_KEY` in production: `openssl rand -hex 32`

**Initialise the database:**

```bash
python -m app.db.init_db
```

This creates `footprint.db` in the `backend/` directory.

**Start the backend server:**

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server is ready when you see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

FastAPI auto-generates interactive API documentation — no extra setup needed:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## Step 3 — Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The dev server is ready when you see:
```
  VITE v8.x  ready in Xms
  ➜  Local:   http://localhost:5173/
```

---

## Step 4 — Verify

1. Open [http://localhost:5173](http://localhost:5173)
2. You should see the LinkSys login page
3. Click **Sign in with Google**
4. After authentication, you land on the Dashboard
5. Navigate to **Graph** to see the dependency visualization
6. Navigate to **Risks** for the risk analysis

---

## What Each Dependency Does

**Backend (`requirements.txt`)**

| Package | Purpose |
|---|---|
| `fastapi` | Web framework |
| `uvicorn[standard]` | ASGI server with WebSocket support |
| `sqlalchemy` | ORM — database models and queries |
| `python-jose[cryptography]` | JWT token creation and verification |
| `passlib[bcrypt]` | Secure password/token hashing |
| `python-dotenv` | Loads `.env` variables into the app |
| `requests` | HTTP calls (used in OAuth flow) |
| `python-multipart` | Enables form data / file upload parsing |
| `pydantic[email]` | Schema validation with email support |

**Frontend (`package.json`)**

| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI framework |
| `react-router-dom` | Client-side routing |
| `reactflow` | Interactive account dependency graph |
| `three` | 3D rendering engine |
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Helper components for R3F scenes |
| `postprocessing` | Visual effects on the 3D scene |
| `framer-motion` | Page and UI animations |
| `recharts` | Dashboard charts and data visualizations |
| `axios` | HTTP client for API calls |
| `lucide-react` | Icon set |
| `tailwindcss` | Utility-first CSS |

---

## Common Issues & Fixes

**`redirect_uri_mismatch` from Google**

The redirect URI in Google Cloud Console must be exactly:
```
http://localhost:8000/auth/google/callback
```
No trailing slash, no `https`, no different port.

**`footprint.db` not found**

```bash
cd backend
source venv/bin/activate
python -m app.db.init_db
```

**`ModuleNotFoundError` on backend start**

Virtual environment is not activated. Run:
```bash
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

**Frontend can't reach backend**

Make sure the backend is running on port 8000. Check `src/services/api.ts` — the base URL should point to `http://localhost:8000`.

**Port already in use**

```bash
# macOS / Linux
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

---


⚡ Built at **HackIndia Vibe Coding Hackathon 2026** by Team Kairos

</div>
