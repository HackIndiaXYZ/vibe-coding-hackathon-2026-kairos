from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.init_db import init_db
from app.core.config import settings

# Init DB tables on startup
init_db()

from app.api.auth import router as auth_router
from app.api.google_auth import router as google_auth_router
from app.api.profile import router as profile_router
from app.api.dashboard import router as dashboard_router
from app.api.accounts import router as accounts_router
from app.api.identities import emails_router, phones_router
from app.api.risks import router as risks_router
from app.api.graph import router as graph_router
from app.api.permissions import router as permissions_router

app = FastAPI(title="Digital Footprint Mapper API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(google_auth_router)
app.include_router(profile_router)
app.include_router(dashboard_router)
app.include_router(accounts_router)
app.include_router(emails_router)
app.include_router(phones_router)
app.include_router(risks_router)
app.include_router(graph_router)
app.include_router(permissions_router)


@app.get("/")
def root():
    return {"message": "Digital Footprint Mapper API", "docs": "/docs"}