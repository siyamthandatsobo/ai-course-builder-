from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from database import get_db
from models import Quiz, Question, QuizAttempt
from routers.courses import get_current_user_id
from routers.auth import SECRET_KEY, ALGORITHM
from jose import jwt
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

router = APIRouter(prefix="/quizzes", tags=["quizzes"])

class SubmitAnswers(BaseModel):
    answers: List[str]

@router.get("/{quiz_id}")
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    return {
        "id": quiz.id,
        "title": quiz.title,
        "questions": [
            {
                "id": q.id,
                "question_text": q.question_text,
                "options": q.options,
            }
            for q in questions
        ]
    }

@router.post("/{quiz_id}/attempt")
def submit_quiz(
    quiz_id: int,
    submission: SubmitAnswers,
    db: Session = Depends(get_db),
    user=Depends(get_current_user_id)
):
    from models import User
    db_user = db.query(User).filter(User.email == user["sub"]).first()
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="Quiz not found")

    # Server-side grading
    correct = 0
    results = []
    for i, question in enumerate(questions):
        user_answer = submission.answers[i] if i < len(submission.answers) else ""
        is_correct = user_answer == question.correct_answer
        if is_correct:
            correct += 1
        results.append({
            "question_text": question.question_text,
            "your_answer": user_answer,
            "correct_answer": question.correct_answer,
            "explanation": question.explanation,
            "is_correct": is_correct,
        })

    score = round((correct / len(questions)) * 100)

    # Save attempt
    attempt = QuizAttempt(
        user_id=db_user.id,
        quiz_id=quiz_id,
        score=score,
        answers=submission.answers,
    )
    db.add(attempt)
    db.commit()

    return {
        "score": score,
        "correct": correct,
        "total": len(questions),
        "results": results,
    }

@router.get("/course/{course_id}")
def get_quiz_by_course(course_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.course_id == course_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="No quiz for this course")
    return {"quiz_id": quiz.id, "title": quiz.title}