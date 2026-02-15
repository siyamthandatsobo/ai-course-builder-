# AI Course Builder + Quiz Generator

> AI-powered platform for generating, editing and delivering online courses.
> Built as a recruiter-ready portfolio project by a solo developer.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Tailwind CSS (Vite) |
| Backend | Python 3.14 + FastAPI |
| Database | PostgreSQL + SQLAlchemy + Alembic |
| AI | OpenAI GPT-4o |
| Auth | JWT + bcrypt |
| Deployment | Vercel (frontend) + Render (backend) |

## Features
- AI course generation from a topic in under 30 seconds
- AI quiz generation with 10 MCQs and explanations
- Role-based access: Student / Teacher / Admin
- Student dashboard with progress tracking
- Teacher dashboard with course analytics
- Admin course approval workflow

## Getting Started

### 1. Clone the repo
\\\ash
git clone git@github.com:siyamthandatsobo/ai-course-builder-.git
cd ai-course-builder-
\\\

### 2. Backend
\\\ash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
\\\

### 3. Frontend
\\\ash
cd frontend
npm install
npm run dev
\\\

## Status
Currently in active development!
