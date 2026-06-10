
# 🛡️ LinkSys

### Know Your Digital Footprint

[![React](https://img.shields.io/badge/React_19-Vite-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Graph-black?style=flat-square&logo=threedotjs)](https://threejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

**Discover. Visualize. Secure. — Your entire digital identity, mapped in one place.**

[📖 Setup Guide](./setup_instructions.md)

*Built at HackIndia Vibe Coding Hackathon 2026 by Team Kairos*


---

## The Problem

> *The average internet user has **90+ online accounts**. Most can't name half of them.*

Every time you sign in with Google, grant OAuth access, or use your email as a recovery address, you're building an invisible web of dependencies. One compromised account can cascade silently — taking down your banking app, cloud storage, professional network, and everything linked to it.

Users today have no unified view of their accounts, no visibility into which ones act as critical hubs, and no actionable path to reduce their exposure. Existing tools show accounts in isolation. LinkSys shows the whole picture.

---

## Solution

LinkSys is a **digital identity intelligence platform** that aggregates your online accounts, maps their interdependencies as an interactive graph, scores security risks, and surfaces personalized guidance — all in a single dashboard.

---

## Features

### 🔐 Google OAuth Onboarding
Authenticate securely with Google. Your Google identity becomes the seed node from which LinkSys begins mapping connected accounts, OAuth grants, and recovery chains. No passwords are ever stored.

### 🕸️ Interactive Dependency Graph
Built with **ReactFlow**, the graph view renders your accounts as nodes with edges representing OAuth grants, recovery links, and shared identities. Pan, zoom, and click nodes to inspect each account.

### 🌐 Immersive 3D Visualization
A **Three.js + React Three Fiber** powered 3D scene lets you navigate your digital footprint in space — animated, interactive, and designed to make invisible data feel tangible.

### 📊 Risk Intelligence Dashboard
LinkSys analyses your account graph and flags:
- High-privilege accounts acting as master recovery points
- Dormant or unused accounts still holding active permissions
- Accounts with broad third-party OAuth grants
- Identity consolidation vulnerabilities

### 👤 Identities & Permissions Audit
Dedicated views for all linked identities and active permission grants — a granular breakdown of what's connected to what, and what you should revoke.

### 📋 Unified Account Inventory
A complete inventory of all discovered accounts with metadata, status, and risk indicators in one searchable view.

---

## Architecture

```
                         ┌─────────────────────────────┐
                         │          LINKSYS            │
                         └─────────────────────────────┘
                                       │
              ┌────────────────────────┴────────────────────────┐
              │                                                 │
     ┌────────▼─────────┐                             ┌─────────▼────────┐
     │    FRONTEND      │                             │      BACKEND     │
     │  React 19 + Vite │◄──────── REST API ──────────│ FastAPI + Python │
     │   TypeScript     │          (Axios)            │   Uvicorn ASGI   │
     └─────────┬────────┘                             └──────────┬───────┘
               │                                                 │
    ┌──────────┴──────────┐                       ┌─────────────┴─────────────┐
    │                     │                       │                           │
 ┌──▼──────────┐   ┌──────▼──────┐        ┌───────▼──────┐           ┌────────▼────────┐
 │ Graph View  │   │  Dashboard  │        │  API Routes  │           │   Data Layer    │
 │ (ReactFlow) │   │  (Recharts) │        │              │           │                 │
 │             │   │             │        │ /accounts    │           │  SQLAlchemy ORM │
 │  3D Scene   │   │  Risks Page │        │ /graph       │           │  SQLite         │
 │  (Three.js  │   │  Identities │        │ /risks       │           │  footprint.db   │
 │   + R3F)    │   │  Accounts   │        │ /identities  │           └─────────────────┘
 │             │   │  Profile    │        │ /permissions │
 └─────────────┘   └─────────────┘        │ /dashboard   │
                                          │ /profile     │
                                          │ /auth        │
                                          └──────┬───────┘
                                                 │
                                    ┌────────────▼────────────┐
                                    │      Google OAuth 2.0   │
                                    │  python-jose JWT tokens │
                                    │  passlib bcrypt hashing │
                                    └─────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + Vite + TypeScript | App shell, routing, fast HMR |
| **Graph Visualization** | ReactFlow v11 | Interactive account dependency graph |
| **3D Visualization** | Three.js + React Three Fiber + Drei | Immersive 3D footprint scene |
| **Post-processing** | postprocessing | Visual effects on 3D scene |
| **Animations** | Framer Motion | Page transitions and UI motion |
| **Charts** | Recharts | Risk scores and dashboard analytics |
| **Styling** | Tailwind CSS v4 | Utility-first design system |
| **Icons** | Lucide React | UI icon set |
| **HTTP Client** | Axios | Frontend → Backend API calls |
| **Backend Framework** | FastAPI | REST API, async Python |
| **Server** | Uvicorn[standard] | ASGI production server |
| **ORM** | SQLAlchemy | Database models and queries |
| **Database** | SQLite (`footprint.db`) | Persistent local storage |
| **Authentication** | Google OAuth 2.0 + JWT | Secure login, stateless sessions |
| **JWT** | python-jose[cryptography] | Token creation and verification |
| **Hashing** | passlib[bcrypt] | Secure credential hashing |
| **Validation** | Pydantic[email] | Request/response schema validation |

---

## Project Structure

```
linksys/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── accounts.py       # Account CRUD endpoints
│   │   │   ├── auth.py           # JWT auth endpoints
│   │   │   ├── dashboard.py      # Dashboard summary data
│   │   │   ├── dependencies.py   # FastAPI dependency injection
│   │   │   ├── google_auth.py    # Google OAuth 2.0 flow
│   │   │   ├── graph.py          # Graph nodes & edges data
│   │   │   ├── identities.py     # Linked identities management
│   │   │   ├── permissions.py    # OAuth permissions audit
│   │   │   ├── profile.py        # User profile endpoints
│   │   │   └── risks.py          # Risk scoring & analysis
│   │   ├── core/
│   │   │   ├── config.py         # App config (loads .env)
│   │   │   └── security.py       # JWT creation & verification
│   │   ├── db/
│   │   │   ├── database.py       # SQLAlchemy engine & session
│   │   │   ├── init_db.py        # Database initialisation
│   │   │   └── seed.py           # Optional seed data
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── models.py         # SQLAlchemy table definitions
│   │   ├── schemas/
│   │   │   └── auth.py           # Pydantic request/response schemas
│   │   └── services/
│   │       └── __init__.py       # Business logic layer
│   ├── main.py                   # FastAPI app entry point
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── assets/
│       ├── components/
│       │   └── Sidebar.tsx       # Navigation sidebar
│       ├── pages/
│       │   ├── Dashboard.tsx     # Overview & stats
│       │   ├── Graph.tsx         # ReactFlow dependency graph
│       │   ├── Accounts.tsx      # Full account inventory
│       │   ├── Identities.tsx    # Linked identities view
│       │   ├── Risks.tsx         # Risk analysis & scores
│       │   ├── Profile.tsx       # User profile
│       │   └── LoginPage.tsx     # Google OAuth entry point
│       ├── services/
│       │   └── api.ts            # Axios API client (base URL config)
│       ├── App.tsx               # Root component + React Router
│       ├── App.css
│       ├── main.tsx              # React DOM entry point
│       └── index.css
│
├── .gitignore
├── LICENSE
├── README.md
└── setup_instructions.md
```

---

## Getting Started

See the full [Setup Guide](./setup_instructions.md) for detailed instructions with troubleshooting.

```bash
# Clone
git clone https://github.com/HackIndiaXYZ/vibe-coding-hackathon-2026-kairos.git
cd vibe-coding-hackathon-2026-kairos

# Backend (terminal 1)
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# Add your .env file (see setup_instructions.md)
uvicorn main:app --reload

# Frontend (terminal 2)
cd frontend
npm install && npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| API Docs (ReDoc) | http://localhost:8000/redoc |

---

## Privacy & Security

- **No passwords stored** — authentication is delegated entirely to Google OAuth 2.0
- **Stateless JWT sessions** — short-lived tokens signed with `python-jose`, nothing persisted server-side
- **Local-first** — all account data lives in your local `footprint.db`, not a remote server
- **Minimal OAuth scope** — LinkSys requests only what it needs to map your footprint

---

## Team Kairos

- Trisha Deshmukh
- Sanika Mane
- Bliss Gonsalves
- Shravani Joshi

---


## License

MIT License — see [LICENSE](./LICENSE) for details.
