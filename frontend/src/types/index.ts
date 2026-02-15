export interface User {
    email: string
    full_name: string
    role: 'student' | 'teacher' | 'admin'
  }
  
  export interface AuthResponse {
    access_token: string
    token_type: string
    role: string
    full_name: string
  }
  
  export interface Course {
    id: number
    title: string
    description: string
    topic: string
    difficulty: string
    is_published: boolean
    created_by: number
  }
  
  export interface Lesson {
    id: number
    course_id: number
    title: string
    content: string
    order_index: number
  }
  
  export interface Question {
    id: number
    question_text: string
    options: string[]
    correct_answer: string
    explanation: string
  }