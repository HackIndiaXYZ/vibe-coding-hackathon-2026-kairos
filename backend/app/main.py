from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.dashboard import router as dashboard_router
from app.api.auth import router as auth_router
from app.api.emails import router as emails_router
from app.db.init_db import init_db
from app.api.phones import router as phones_router
from app.api.accounts import router as accounts_router
from app.api.permissions import router as permissions_router
from app.api.risks import router as risks_router
from app.api.profile import router as profile_router
from app.api.graph import router as graph_router
init_db()

app = FastAPI(
    title="Digital Footprint Mapper API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
app.include_router(emails_router)
app.include_router(phones_router)
app.include_router(accounts_router)
app.include_router(permissions_router)
app.include_router(risks_router)
app.include_router(profile_router)
app.include_router(graph_router)
app.include_router(dashboard_router)
@app.get("/")
def root():
    return {
        "message":
        "Digital Footprint Mapper API"
    }