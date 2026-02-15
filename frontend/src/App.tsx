import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import CourseBuilder from './pages/CourseBuilder'
import QuizPage from './pages/QuizPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
      <Route path="/builder" element={<PrivateRoute><CourseBuilder /></PrivateRoute>} />
      <Route path="/quiz/:quizId" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}