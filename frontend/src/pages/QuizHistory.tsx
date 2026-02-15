import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

function getCourseTheme(topic: string): { emoji: string } {
  const t = topic?.toLowerCase() || ''
  if (t.includes('machine learning') || t.includes('ml') || t.includes('ai')) return { emoji: '🤖' }
  if (t.includes('python')) return { emoji: '🐍' }
  if (t.includes('react') || t.includes('frontend') || t.includes('javascript')) return { emoji: '⚛️' }
  if (t.includes('data') || t.includes('sql')) return { emoji: '📊' }
  return { emoji: '📚' }
}

function getScoreColor(score: number) {
  if (score >= 90) return 'text-green-400'
  if (score >= 75) return 'text-amber-500'
  if (score >= 60) return 'text-orange-400'
  return 'text-red-400'
}

function getScoreBg(score: number) {
  if (score >= 90) return 'bg-green-500/10 border-green-500/20'
  if (score >= 75) return 'bg-amber-500/10 border-amber-500/20'
  if (score >= 60) return 'bg-orange-500/10 border-orange-500/20'
  return 'bg-red-500/10 border-red-500/20'
}

function getScoreLabel(score: number) {
  if (score >= 90) return '🏆 Excellent'
  if (score >= 75) return '👍 Good'
  if (score >= 60) return '📖 Keep studying'
  return '💪 Try again'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

interface Attempt {
  attempt_id: number
  quiz_id: number
  quiz_title: string
  course_title: string
  course_topic: string
  score: number
  attempted_at: string
}

export default function QuizHistory() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const { data: attempts, isLoading } = useQuery({
    queryKey: ['quiz-history'],
    queryFn: async () => {
      const res = await api.get('/quizzes/history/me')
      return res.data as Attempt[]
    }
  })

  const avgScore = attempts?.length
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : 0

  const bestScore = attempts?.length
    ? Math.max(...attempts.map(a => a.score))
    : 0

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-gray-950 font-bold">L</div>
          <span className="text-white font-semibold">Learnify <span className="text-amber-500">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Dashboard
          </button>
          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full border border-gray-700">{user?.role}</span>
          <button onClick={logout} className="text-gray-400 hover:text-white text-sm">Sign out</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-amber-500 text-xs uppercase tracking-widest mb-2">// quiz history</p>
          <h1 className="text-3xl font-bold text-white">Your <span className="italic text-amber-500">Quiz Results</span></h1>
          <p className="text-gray-400 text-sm mt-2">Track your performance across all quizzes.</p>
        </div>

        {/* Summary stats */}
        {attempts && attempts.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{attempts.length}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Quizzes Taken</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold mb-1 ${getScoreColor(avgScore)}`}>{avgScore}%</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Average Score</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold mb-1 ${getScoreColor(bestScore)}`}>{bestScore}%</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Best Score</div>
            </div>
          </div>
        )}

        {/* Attempts list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 animate-pulse h-20"></div>
            ))}
          </div>
        ) : attempts?.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-white font-semibold mb-2">No quizzes taken yet</h3>
            <p className="text-gray-400 text-sm mb-4">Complete a course and take a quiz to see your results here.</p>
            <button onClick={() => navigate('/dashboard')}
              className="bg-amber-500 text-gray-950 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-400">
              Browse courses →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts?.map((attempt, i) => (
              <div key={attempt.attempt_id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors flex items-center gap-4">
                {/* Rank */}
                <div className="w-8 text-center text-gray-500 text-sm font-medium flex-shrink-0">
                  {i + 1}
                </div>

                {/* Course emoji */}
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  {getCourseTheme(attempt.course_topic).emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm truncate">{attempt.quiz_title}</h3>
                  <p className="text-gray-400 text-xs truncate">{attempt.course_title}</p>
                  {attempt.attempted_at && (
                    <p className="text-gray-500 text-xs mt-0.5">{formatDate(attempt.attempted_at)}</p>
                  )}
                </div>

                {/* Score badge */}
                <div className={`flex flex-col items-center px-4 py-2 rounded-lg border ${getScoreBg(attempt.score)} flex-shrink-0`}>
                  <span className={`text-xl font-bold ${getScoreColor(attempt.score)}`}>{attempt.score}%</span>
                  <span className="text-xs text-gray-400">{getScoreLabel(attempt.score)}</span>
                </div>

                {/* Retake button */}
                <button
                  onClick={() => navigate(`/quiz/${attempt.quiz_id}`)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium px-3 py-2 rounded-lg transition-colors flex-shrink-0">
                  Retake →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}