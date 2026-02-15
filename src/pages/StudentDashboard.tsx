import { useAuth } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import api from '../api/client'
import { Course } from '../types'

export default function StudentDashboard() {
  const { user, logout } = useAuth()

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
          <span className="text-gray-400 text-sm">{user?.email}</span>
          <span className="bg-amber-500/10 text-amber-500 text-xs px-2 py-1 rounded-full font-medium border border-amber-500/20">
            {user?.role}
          </span>
          <button onClick={logout} className="text-gray-400 hover:text-white text-sm transition-colors">
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-amber-500 text-xs uppercase tracking-widest mb-2">// student dashboard</p>
          <h1 className="text-3xl font-bold text-white">
            Good morning, <span className="italic text-amber-500">{user?.full_name}</span> 👋
          </h1>
          <p className="text-gray-400 text-sm mt-2">Track your learning progress and continue where you left off.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Courses Enrolled', value: courses?.length || 0, delta: '' },
            { label: 'Lessons Completed', value: 0, delta: '' },
            { label: 'Avg Quiz Score', value: '—', delta: '' },
            { label: 'Day Streak', value: '🔥 1', delta: '' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Courses */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-white font-semibold">Available Courses</h2>
          {user?.role === 'teacher' || user?.role === 'admin' ? (
            <a href="/builder" className="bg-amber-500 text-gray-950 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-amber-400 transition-colors">
              ✨ Create Course
            </a>
          ) : null}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 animate-pulse">
                <div className="h-24 bg-gray-800 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-800 rounded mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : courses?.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-white font-semibold mb-2">No courses yet</h3>
            <p className="text-gray-400 text-sm mb-4">
              {user?.role === 'teacher' ? 'Create your first AI-generated course!' : 'Check back soon for new courses.'}
            </p>
            {user?.role === 'teacher' && (
              <a href="/builder" className="bg-amber-500 text-gray-950 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors">
                ✨ Generate a course
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses?.map(course => (
              <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors cursor-pointer">
                <div className="h-24 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-4xl">
                  📚
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-amber-500/10 text-amber-500 text-xs px-2 py-0.5 rounded border border-amber-500/20">
                      {course.difficulty}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{course.title}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2">{course.description}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span className="text-amber-500">0%</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full">
                      <div className="h-1 bg-amber-500 rounded-full" style={{width: '0%'}}></div>
                    </div>
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