import os
import json
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ── Mock responses for development (no API key needed) ────────
MOCK_COURSE = {
    "lessons": [
        {"title": "Introduction to the Topic", "content": "This lesson covers the fundamentals and key concepts you need to understand before diving deeper.", "duration": "8 min"},
        {"title": "Core Concepts Explained", "content": "Here we explore the main ideas in detail with examples and practical applications.", "duration": "10 min"},
        {"title": "Hands-on Practice", "content": "Time to apply what you have learned with real exercises and projects.", "duration": "14 min"},
        {"title": "Advanced Techniques", "content": "Taking your knowledge further with advanced patterns and best practices.", "duration": "12 min"},
        {"title": "Real World Applications", "content": "How this topic is used in industry and production environments.", "duration": "11 min"},
        {"title": "Final Project and Next Steps", "content": "Build a complete project and learn where to go from here.", "duration": "13 min"},
    ]
}

MOCK_QUIZ = {
    "questions": [
        {
            "question_text": "What is the main purpose of this topic?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "Option A",
            "explanation": "Option A is correct because it best describes the core purpose."
        },
        {
            "question_text": "Which approach is considered best practice?",
            "options": ["Approach 1", "Approach 2", "Approach 3", "Approach 4"],
            "correct_answer": "Approach 2",
            "explanation": "Approach 2 is the industry standard for this use case."
        },
        {
            "question_text": "What happens when you apply this concept incorrectly?",
            "options": ["Nothing", "Errors occur", "Performance degrades", "Both B and C"],
            "correct_answer": "Both B and C",
            "explanation": "Incorrect application typically causes both errors and performance issues."
        },
    ]
}

def generate_course(topic: str, difficulty: str, num_lessons: int = 6) -> dict:
    """Generate course lessons using OpenAI or mock data"""
    
    # Return mock data if no API key
    if not OPENAI_API_KEY or OPENAI_API_KEY == "sk-your-key-here":
        print("⚠️  No OpenAI key — using mock data")
        return MOCK_COURSE

    # Real OpenAI call
    try:
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_API_KEY)
        
        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert course creator. Always respond with valid JSON only."
                },
                {
                    "role": "user",
                    "content": f"""Create a {difficulty} level course on '{topic}' with exactly {num_lessons} lessons.
                    Return JSON in this exact format:
                    {{
                        "lessons": [
                            {{
                                "title": "lesson title",
                                "content": "full lesson content in markdown, at least 3 paragraphs",
                                "duration": "X min"
                            }}
                        ]
                    }}"""
                }
            ]
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"OpenAI error: {e} — falling back to mock data")
        return MOCK_COURSE


def generate_quiz(course_content: str, num_questions: int = 10) -> dict:
    """Generate quiz questions using OpenAI or mock data"""
    
    if not OPENAI_API_KEY or OPENAI_API_KEY == "sk-your-key-here":
        print("⚠️  No OpenAI key — using mock data")
        return MOCK_QUIZ

    try:
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_API_KEY)
        
        response = client.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert quiz creator. Always respond with valid JSON only."
                },
                {
                    "role": "user",
                    "content": f"""Create {num_questions} multiple choice questions based on this content:
                    {course_content[:3000]}
                    
                    Return JSON in this exact format:
                    {{
                        "questions": [
                            {{
                                "question_text": "the question",
                                "options": ["A", "B", "C", "D"],
                                "correct_answer": "the correct option text",
                                "explanation": "why this is correct"
                            }}
                        ]
                    }}"""
                }
            ]
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"OpenAI error: {e} — falling back to mock data")
        return MOCK_QUIZ