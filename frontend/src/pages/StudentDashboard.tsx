import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { Course } from '../types'
import ThemeToggle from '../components/ThemeToggle'

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

// Mock streak data — 12 weeks
const STREAK_DATA = Array.from({ length: 84 }, (_, i) => ({
  active: Math.random() > 0.55,
  count: Math.floor(Math.random() * 5),
}))

const LEADERBOARD = [
  { name: 'Aisha K.', score: 97, avatar: '👩🏽' },
  { name: 'Marcus T.', score: 94, avatar: '👨🏾' },
  { name: 'Priya S.', score: 91, avatar: '👩🏽' },
  { name: 'You', score: 84, avatar: '⭐', isYou: true },
  { name: 'James L.', score: 79, avatar: '👨🏻' },
]

const XP_LEVEL = 3
const XP_CURRENT = 340
const XP_NEXT = 500
const XP_TITLES = ['Newcomer', 'Explorer', 'Learner', 'Scholar', 'Expert', 'Master']

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showCert, setShowCert] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await api.get('/courses/')
      return res.data as Course[]
    }
  })
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.topic.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || course.difficulty === filter
    return matchesSearch && matchesFilter
  })
  const xpPercent = Math.round((XP_CURRENT / XP_NEXT) * 100)


 

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-gray-950 font-bold">L</div>
          <span className="text-white font-semibold">Learnify <span className="text-amber-500">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
            <span className="text-amber-500 text-xs font-bold">Lv.{XP_LEVEL}</span>
            <span className="text-amber-500/60 text-xs">{XP_TITLES[XP_LEVEL]}</span>
          </div>
          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full border border-gray-700">student</span>
          <ThemeToggle />
<button onClick={logout} className="text-gray-400 hover:text-white text-sm">Sign out</button>
          <button onClick={logout} className="text-gray-400 hover:text-white text-sm">Sign out</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Hero greeting */}
        <div className="relative bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-8 mb-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
          <div className="relative">
          <p className="text-amber-500 text-xs uppercase tracking-widest mb-2">// student dashboard</p>
          <h1 className="text-3xl font-bold mb-1 text-gray-800 dark:text-white">
  Welcome back, <span className="italic text-amber-500">{user?.full_name}</span> 👋
</h1>
<p className="text-sm mb-6 text-gray-500 dark:text-gray-300">You're on a <span className="text-amber-500 font-semibold">🔥 7-day streak</span> — keep it up!</p>
            {/* XP Bar */}
            <div className="max-w-sm">
              <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-amber-500">Level {XP_LEVEL} · {XP_TITLES[XP_LEVEL]}</span>
              <span className="text-xs text-amber-500 font-semibold">{XP_CURRENT} / {XP_NEXT} XP</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-1000"
                  style={{ width: `${xpPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-amber-500/60 mt-1">{XP_NEXT - XP_CURRENT} XP to Level {XP_LEVEL + 1} · {XP_TITLES[XP_LEVEL + 1]}</p>            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Courses Enrolled', value: courses?.length || 0, icon: '📚', color: 'text-white' },
            { label: 'Lessons Done', value: 0, icon: '✅', color: 'text-green-400' },
            { label: 'Avg Quiz Score', value: '84%', icon: '🎯', color: 'text-amber-500' },
            { label: 'Day Streak', value: '🔥 7', icon: '', color: 'text-orange-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* Streak calendar — spans 2 cols */}
          <div className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Activity Streak</h3>
              <span className="text-xs text-gray-400">Last 12 weeks</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {STREAK_DATA.map((day, i) => (
                <div
                  key={i}
                  title={day.active ? `${day.count} lessons` : 'No activity'}
                  className={`w-3 h-3 rounded-sm transition-colors ${
                    day.active
                      ? day.count >= 4 ? 'bg-amber-400'
                      : day.count >= 2 ? 'bg-amber-500/70'
                      : 'bg-amber-500/40'
                      : 'bg-gray-800'
                  }`}
                ></div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs text-gray-500">Less</span>
              {['bg-gray-800', 'bg-amber-500/40', 'bg-amber-500/70', 'bg-amber-400'].map((c, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${c}`}></div>
              ))}
              <span className="text-xs text-gray-500">More</span>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">🏆 Leaderboard</h3>
            <div className="space-y-2">
              {LEADERBOARD.map((entry, i) => (
                <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  (entry as any).isYou ? 'bg-amber-500/10 border border-amber-500/20' : 'hover:bg-gray-800'
                }`}>
                  <span className="text-sm w-5 text-center font-bold text-gray-400">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                  </span>
                  <span className="text-lg">{entry.avatar}</span>
                  <span className={`text-sm flex-1 ${(entry as any).isYou ? 'text-amber-500 font-semibold' : 'text-gray-300'}`}>
                    {entry.name}
                  </span>
                  <span className="text-xs font-semibold text-amber-500">{entry.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="mb-4">
  <div className="flex items-center justify-between mb-3">
    <h2 className="text-white font-semibold">⚡ Available Courses</h2>
    <span className="text-xs text-gray-400">
      {filteredCourses?.length || 0} of {courses?.length || 0} courses
    </span>
  </div>
  <div className="flex gap-3 flex-wrap">
    {/* Search bar */}
    <div className="flex-1 min-w-48 relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search courses..."
        className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder-gray-500"
      />
      {search && (
        <button
          onClick={() => setSearch('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
        >
          ✕
        </button>
      )}
    </div>
    {/* Filter pills */}
    <div className="flex gap-2">
      {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(level => (
        <button
          key={level}
          onClick={() => setFilter(level)}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
            filter === level
              ? 'bg-amber-500 text-gray-950'
              : 'bg-gray-900 border border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
          }`}
        >
          {level === 'all' ? '✨ All' : level}
        </button>
      ))}
    </div>
  </div>
</div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 animate-pulse h-48"></div>
            ))}
          </div>
        ) : filteredCourses?.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 border-dashed rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-white font-semibold mb-2">
  {search || filter !== 'all' ? 'No courses match your search' : 'No courses yet'}
</h3>
<p className="text-gray-400 text-sm">
  {search || filter !== 'all'
    ? <button onClick={() => { setSearch(''); setFilter('all') }} className="text-amber-500 hover:text-amber-400">Clear filters</button>
    : 'Check back soon for new courses!'
  }
</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {filteredCourses?.map(course => (
              <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all hover:-translate-y-0.5 cursor-pointer group">
                <div className={`h-24 bg-gradient-to-br ${getCourseTheme(course.topic).gradient} flex items-center justify-center text-4xl`}>
                  {getCourseTheme(course.topic).emoji}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-amber-500/10 text-amber-500 text-xs px-2 py-0.5 rounded border border-amber-500/20">
                      {course.difficulty}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{course.title}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2 mb-3">{course.description}</p>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span className="text-amber-500">0%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-1.5 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700" style={{width:'0%'}}></div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 rounded-full bg-gray-800 flex items-center justify-center text-gray-600 text-xs">·</div>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">0 / 5 lessons</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificate preview */}
        <div className="bg-gray-900 border border-amber-500/30 rounded-xl p-6 flex items-center justify-between">  <div className="flex items-center gap-4">
    <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-2xl">
      🎓
    </div>
    <div>
    <h3 className="text-amber-500 font-semibold">Earn your certificate</h3>
    <p className="text-amber-500/70 text-sm">Complete a course 100% to unlock your shareable certificate.</p>
    </div>
  </div>
  <button
    onClick={() => setShowCert(true)}
    className="bg-amber-500 hover:bg-amber-400 text-gray-950 text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0">
    Preview →
  </button>
</div>
      </div>

      {/* Certificate modal */}
      {showCert && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={() => setShowCert(false)}>
          <div className="bg-gray-900 border-2 border-amber-500/40 rounded-2xl p-10 max-w-lg w-full text-center relative" onClick={e => e.stopPropagation()}>
            <div className="absolute top-4 right-4">
              <button onClick={() => setShowCert(false)} className="text-gray-500 hover:text-white text-sm">✕</button>
            </div>
            <div className="w-16 h-16 bg-amber-500/10 border-2 border-amber-500/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🎓</div>
            <p className="text-amber-500 text-xs uppercase tracking-widest mb-2">Certificate of Completion</p>
            <h2 className="text-2xl font-bold text-white mb-1">This certifies that</h2>
            <h3 className="text-3xl font-bold text-amber-500 italic mb-2">{user?.full_name}</h3>
            <p className="text-gray-400 text-sm mb-4">has successfully completed</p>
            <div className="bg-gray-800 border border-gray-700 rounded-xl px-6 py-3 mb-6 inline-block">
              <span className="text-white font-semibold">Intro to Machine Learning</span>
            </div>
            <div className="border-t border-gray-800 pt-4">
              <p className="text-xs text-gray-500">Issued by Learnify AI · {new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}</p>
            </div>
            <button className="mt-4 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-6 py-2 rounded-lg text-sm transition-colors">
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}