import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DEMO_LESSONS = [
  'What is Machine Learning?',
  'Supervised vs Unsupervised Learning',
  'Your First Model with scikit-learn',
  'Neural Networks Demystified',
  'Model Evaluation & Metrics',
  'Deploying Your Model',
]

const FEATURES = [
  { icon: '⚡', title: 'AI Course Generation', desc: 'Full curriculum from a topic in under 30 seconds.' },
  { icon: '🧪', title: 'Smart Quiz Builder', desc: 'Auto-generate MCQs with explanations from course content.' },
  { icon: '📈', title: 'Progress Tracking', desc: 'Students see completion rates, scores, and streaks.' },
  { icon: '✏️', title: 'Fully Editable', desc: 'AI is the starting point. Edit every lesson inline.' },
  { icon: '👥', title: 'Role-Based Access', desc: 'Student, Teacher, and Admin experiences.' },
  { icon: '🚀', title: 'One-Click Publish', desc: 'Publish to students the moment a course is ready.' },
]

export default function Landing() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [visibleLessons, setVisibleLessons] = useState<string[]>([])
  const [typing, setTyping] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentLesson, setCurrentLesson] = useState(0)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated])

  // Animate lessons appearing one by one
  useEffect(() => {
    if (currentLesson >= DEMO_LESSONS.length) return
    const lesson = DEMO_LESSONS[currentLesson]
    setIsTyping(true)
    setTyping('')
    let i = 0
    const typeInterval = setInterval(() => {
      setTyping(lesson.slice(0, i + 1))
      i++
      if (i >= lesson.length) {
        clearInterval(typeInterval)
        setIsTyping(false)
        setTimeout(() => {
          setVisibleLessons(prev => [...prev, lesson])
          setTyping('')
          setCurrentLesson(prev => prev + 1)
        }, 400)
      }
    }, 35)
    return () => clearInterval(typeInterval)
  }, [currentLesson])

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-gray-950 font-bold text-lg">L</div>
          <span className="text-white font-semibold text-lg">Learnify <span className="text-amber-500">AI</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="text-gray-400 hover:text-white text-sm transition-colors px-4 py-2">
            Sign in
          </button>
          <button onClick={() => navigate('/register')} className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
            Get started free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
            Powered by GPT-4o
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Build courses with{' '}
            <span className="italic text-amber-500">AI,</span>
            <br />teach what matters.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Learnify generates full course curricula, interactive quizzes, and lesson content in seconds — so teachers can focus on teaching, not authoring.
          </p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/register')}
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-6 py-3 rounded-lg transition-all hover:-translate-y-0.5">
              ✨ Generate a course free
            </button>
            <button onClick={() => navigate('/login')}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium px-6 py-3 rounded-lg transition-colors border border-gray-700">
              Sign in →
            </button>
          </div>
        </div>

        {/* Live AI Demo */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">AI generating course…</div>
          <div className="bg-gray-800 border border-amber-500/30 rounded-lg px-4 py-3 text-sm text-gray-300 mb-4">
            Topic: <span className="text-amber-500 font-medium">"Intro to Machine Learning"</span> · Beginner · 6 lessons
          </div>
          <div className="space-y-2">
            {visibleLessons.map((lesson, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2.5 animate-fadeIn">
                <div className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-sm text-white">{lesson}</span>
                <span className="ml-auto text-xs text-gray-500">{8 + i * 2} min</span>
              </div>
            ))}
            {currentLesson < DEMO_LESSONS.length && (
              <div className="flex items-center gap-3 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2.5 opacity-60">
                <div className="w-5 h-5 rounded-md bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500 text-xs font-bold flex-shrink-0">
                  {visibleLessons.length + 1}
                </div>
                <span className="text-sm text-gray-400">
                  {typing}<span className="animate-pulse">▍</span>
                </span>
              </div>
            )}
          </div>
          {currentLesson >= DEMO_LESSONS.length && (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-500">
              <span className="animate-pulse">✨</span> Course generated in 4.2s
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-800 py-10">
        <div className="max-w-4xl mx-auto px-8 flex items-center justify-center gap-16 flex-wrap">
          {[
            { num: '2,400+', label: 'Courses Created' },
            { num: '38k', label: 'Students Enrolled' },
            { num: '4.9★', label: 'Avg Rating' },
            { num: '< 30s', label: 'Generation Time' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-amber-500 mb-1">{s.num}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Everything you need to <span className="italic text-amber-500">teach smarter</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-800 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to build your first AI course?</h2>
        <p className="text-gray-400 mb-8">Free to get started. No credit card required.</p>
        <button onClick={() => navigate('/register')}
          className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:-translate-y-1">
          ✨ Get started free
        </button>
      </section>

      <footer className="border-t border-gray-800 py-6 text-center">
        <p className="text-gray-500 text-sm">Built with ❤️ by a solo developer · React + FastAPI + OpenAI</p>
      </footer>
    </div>
  )
}