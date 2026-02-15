import { useAuth } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { Course } from '../types'

function getCourseTheme(topic: string): { emoji: string; gradient: string } {
  const t = topic?.toLowerCase() || ''
  if (t.includes('machine learning') || t.includes('ml') || t.includes('ai'))
    return { emoji: '🤖', gradient: 'from-violet-900 to-indigo-900' }
  if (t.includes('python'))
    return { emoji: '🐍', gradient: 'from-green-900 to-teal-900' }
  if (t.includes('react') || t.includes('frontend') || t.includes('javascript'))
    return { emoji: '⚛️', gradient: 'from-cyan-900 to-blue-900' }
  if (t.includes('data') || t.includes('sql'))
    return { emoji: '📊', gradient: 'from-amber-900 to-orange-900' }
  return { emoji: '📚', gradient: 'from-gray-800 to-gray-900' }
}

const MOCK_STATS = [
  { month: 'Sep', enrollments: 12 },
  { month: 'Oct', enrollments: 19 },
  { month: 'Nov', enrollments: 15 },
  { month: 'Dec', enrollments: 28 },
  { month: 'Jan', enrollments: 35 },
  { month: 'Feb', enrollments: 42 },
]

const MOCK_SCORES = [
  { name: 'Intro to ML', score: 88 },
  { name: 'Python Basics', score: 76 },
  { name: 'React Course', score: 92 },
  { name: 'SQL Zero to Hero', score: 81 },
]

export default function TeacherDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const maxEnrollment = Math.max(...MOCK_STATS.map(s => s.enrollments))

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await api.get('/courses/')
      return res.data as Course[]
    }
  })

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-gray-950 font-bold">L</div>
          <span className="text-white font-semibold">Learnify <span className="text-amber-500">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/builder')}
            className="bg-amber-500 text-gray-950 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-amber-400">
            ✨ New Course
          </button>
          <span className="bg-amber-500/10 text-amber-500 text-xs px-2 py-1 rounded-full border border-amber-500/20">{user?.role}</span>
          <button onClick={logout} className="text-gray-400 hover:text-white text-sm">Sign out</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-amber-500 text-xs uppercase tracking-widest mb-2">// teacher dashboard</p>
          <h1 className="text-3xl font-bold text-white">
            Platform <span className="italic text-amber-500">Analytics</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">Overview of your courses, student performance, and engagement.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Courses', value: courses?.length || 0, delta: '↑ 2 this month', color: 'text-white' },
            { label: 'Total Students', value: '142', delta: '↑ 8% this month', color: 'text-white' },
            { label: 'Avg Quiz Score', value: '84%', delta: '↑ 3pts vs last month', color: 'text-green-400' },
            { label: 'Completion Rate', value: '79%', delta: '↑ 5% this month', color: 'text-amber-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-xs text-green-400">{stat.delta}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Enrollment bar chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold text-sm mb-6">Monthly Enrollments</h3>
            <div className="flex items-end gap-3 h-32">
              {MOCK_STATS.map((s, i) => (
                <div key={i} className="flex-1 flex flex-direction-col items-center gap-2 flex-col">
                  <span className="text-xs text-gray-400">{s.enrollments}</span>
                  <div
                    className={`w-full rounded-t-md transition-all duration-700 ${i === MOCK_STATS.length - 1 ? 'bg-amber-500' : 'bg-gray-700'}`}
                    style={{ height: `${(s.enrollments / maxEnrollment) * 100}px` }}
                  ></div>
                  <span className="text-xs text-gray-500">{s.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz scores horizontal bars */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold text-sm mb-6">Avg Quiz Score by Course</h3>
            <div className="space-y-4">
              {MOCK_SCORES.map((s, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-300 truncate max-w-[140px]">{s.name}</span>
                    <span className="text-xs font-semibold text-amber-500">{s.score}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{
                        width: `${s.score}%`,
                        background: s.score >= 90 ? '#4ade80' : s.score >= 75 ? '#f5a623' : '#fb7185'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Courses */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-white font-semibold">My Courses</h2>
          <button onClick={() => navigate('/builder')}
            className="text-amber-500 text-xs hover:text-amber-400">
            + Create new →
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 animate-pulse h-40"></div>
            ))}
          </div>
        ) : courses?.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 border-dashed rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-white font-semibold mb-2">No courses yet</h3>
            <p className="text-gray-400 text-sm mb-4">Create your first AI-generated course!</p>
            <button onClick={() => navigate('/builder')}
              className="bg-amber-500 text-gray-950 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-400">
              ✨ Generate a course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses?.map(course => (
              <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors">
                <div className={`h-20 bg-gradient-to-br ${getCourseTheme(course.topic).gradient} flex items-center justify-center text-3xl`}>
                  {getCourseTheme(course.topic).emoji}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-amber-500/10 text-amber-500 text-xs px-2 py-0.5 rounded border border-amber-500/20">
                      {course.difficulty}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${course.is_published ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                      {course.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{course.title}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2">{course.description}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-gray-800 text-gray-300 text-xs rounded-lg py-1.5 hover:bg-gray-700 transition-colors">
                      ✏️ Edit
                    </button>
                    <button className="flex-1 bg-gray-800 text-gray-300 text-xs rounded-lg py-1.5 hover:bg-gray-700 transition-colors">
                      📊 Stats
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}