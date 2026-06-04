from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routers import auth, courses, ai, quiz

app = FastAPI(title="AI Course Builder API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:5173"),
        "http://localhost:5173",
        "https://learnify-siyamthandas-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(ai.router)
app.include_router(quiz.router)

import uvicorn
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
@app.get("/")
def root():
    return {"message": "AI Course Builder API is running"}
