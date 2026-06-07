from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router

from app.db.init_db import init_db

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


@app.get("/")
def root():
    return {
        "message":
        "Digital Footprint Mapper API"
    }