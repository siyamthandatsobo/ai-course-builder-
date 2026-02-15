from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from database import get_db
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models import Course, Lesson
from routers.auth import create_access_token, SECRET_KEY, ALGORITHM
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(prefix="/courses", tags=["courses"])
security = HTTPBearer()

# ── Schemas ───────────────────────────────────────────────────
class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    topic: str
    difficulty: str

class CourseResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    topic: str
    difficulty: str
    is_published: bool
    created_by: int

    class Config:
        from_attributes = True

# ── Auth helper ───────────────────────────────────────────────
def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ── Routes ────────────────────────────────────────────────────
@router.post("/", response_model=CourseResponse)
def create_course(
    course: CourseCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user_id)
):
    from models import User
    db_user = db.query(User).filter(User.email == user["sub"]).first()
    if not db_user or db_user.role not in ["teacher", "admin"]:
        raise HTTPException(status_code=403, detail="Only teachers and admins can create courses")
    new_course = Course(
        title=course.title,
        description=course.description,
        topic=course.topic,
        difficulty=course.difficulty,
        created_by=db_user.id
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@router.get("/", response_model=List[CourseResponse])
def list_courses(db: Session = Depends(get_db)):
    return db.query(Course).filter(Course.is_published == True).all()

@router.get("/{course_id}", response_model=CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.put("/{course_id}")
def update_course(
    course_id: int,
    course: CourseCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user_id)
):
    from models import User
    db_user = db.query(User).filter(User.email == user["sub"]).first()
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    if db_course.created_by != db_user.id and db_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorised")
    db_course.title = course.title
    db_course.description = course.description
    db_course.topic = course.topic
    db_course.difficulty = course.difficulty
    db.commit()
    db.refresh(db_course)
    return db_course

@router.delete("/{course_id}")
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user_id)
):
    from models import User
    db_user = db.query(User).filter(User.email == user["sub"]).first()
    if db_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete courses")
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(db_course)
    db.commit()
    return {"message": "Course deleted"}