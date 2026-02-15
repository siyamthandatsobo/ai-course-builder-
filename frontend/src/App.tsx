import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import CourseBuilder from './pages/CourseBuilder'
import QuizPage from './pages/QuizPage'
import QuizHistory from './pages/QuizHistory'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function DashboardRoute() {
  const { user } = useAuth()
  if (user?.role === 'teacher' || user?.role === 'admin') {
    return <TeacherDashboard />
  }
  return <StudentDashboard />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardRoute /></PrivateRoute>} />
      <Route path="/builder" element={<PrivateRoute><CourseBuilder /></PrivateRoute>} />
      <Route path="/quiz/:quizId" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
      <Route path="/quiz-history" element={<PrivateRoute><QuizHistory /></PrivateRoute>} />
    </Routes>
  )
}