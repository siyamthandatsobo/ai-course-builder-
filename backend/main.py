from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routers import auth

app = FastAPI(title="AI Course Builder API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "AI Course Builder API is running"}