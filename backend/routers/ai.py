from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Course, Lesson, Quiz, Question
from routers.courses import get_current_user_id
import sys, os, json, asyncio
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from services.ai_service import generate_course, generate_quiz

router = APIRouter(prefix="/ai", tags=["ai"])

class GenerateCourseRequest(BaseModel):
    course_id: int
    num_lessons: int = 6

class GenerateQuizRequest(BaseModel):
    course_id: int
    num_questions: int = 10

@router.post("/generate-course")
def ai_generate_course(
    request: GenerateCourseRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user_id)
):
    course = db.query(Course).filter(Course.id == request.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    result = generate_course(course.topic, course.difficulty, request.num_lessons)

    db.query(Lesson).filter(Lesson.course_id == course.id).delete()

    lessons = []
    for i, lesson_data in enumerate(result["lessons"]):
        lesson = Lesson(
            course_id=course.id,
            title=lesson_data["title"],
            content=lesson_data["content"],
            order_index=i
        )
        db.add(lesson)
        lessons.append(lesson_data)

    db.commit()
    return {"message": f"Generated {len(lessons)} lessons", "lessons": lessons}


@router.post("/generate-course-stream")
async def ai_generate_course_stream(
    request: GenerateCourseRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user_id)
):
    course = db.query(Course).filter(Course.id == request.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    result = generate_course(course.topic, course.difficulty, request.num_lessons)

    # Delete existing lessons
    db.query(Lesson).filter(Lesson.course_id == course.id).delete()
    db.commit()

    async def stream_lessons():
        for i, lesson_data in enumerate(result["lessons"]):
            # Save lesson to DB
            lesson = Lesson(
                course_id=course.id,
                title=lesson_data["title"],
                content=lesson_data["content"],
                order_index=i
            )
            db.add(lesson)
            db.commit()

            # Stream lesson data to frontend
            yield f"data: {json.dumps({'lesson': lesson_data, 'index': i})}\n\n"
            await asyncio.sleep(0.6)  # Dramatic pause between lessons

        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(
        stream_lessons(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )


@router.post("/generate-quiz")
def ai_generate_quiz(
    request: GenerateQuizRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user_id)
):
    course = db.query(Course).filter(Course.id == request.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    lessons = db.query(Lesson).filter(Lesson.course_id == course.id).all()
    course_content = " ".join([l.content or "" for l in lessons])

    result = generate_quiz(course_content, request.num_questions)

    quiz = Quiz(course_id=course.id, title=f"{course.title} — Quiz")
    db.add(quiz)
    db.flush()

    questions = []
    for q in result["questions"]:
        question = Question(
            quiz_id=quiz.id,
            question_text=q["question_text"],
            options=q["options"],
            correct_answer=q["correct_answer"],
            explanation=q["explanation"]
        )
        db.add(question)
        questions.append(q)

    db.commit()
    return {"message": f"Generated {len(questions)} questions", "quiz_id": quiz.id}