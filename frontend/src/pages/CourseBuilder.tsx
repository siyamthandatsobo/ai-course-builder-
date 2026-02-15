import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

interface Lesson {
  title: string
  content: string
  duration: string
}

export default function CourseBuilder() {
  const { user, logout } = useAuth()
  const [form, setForm] = useState({
    title: '',
    topic: '',
    difficulty: 'beginner',
    description: '',
  })
  const [numLessons, setNumLessons] = useState(6)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<number>(0)
  const [generating, setGenerating] = useState(false)
  const [courseId, setCourseId] = useState<number | null>(null)
  const [quizId, setQuizId] = useState<number | null>(null)
  const [step, setStep] = useState<'form' | 'preview'>('form')
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!form.title || !form.topic) {
      setError('Please fill in title and topic')
      return
    }
    setGenerating(true)
    setError('')
    setLessons([])
  
    try {
      // Step 1 — Create the course
      const courseRes = await api.post('/courses/', {
        title: form.title,
        description: form.description,
        topic: form.topic,
        difficulty: form.difficulty,
      })
      const newCourseId = courseRes.data.id
      setCourseId(newCourseId)
  
      // Step 2 — Generate lessons (no streaming for compatibility)
      const aiRes = await api.post('/ai/generate-course', {
        course_id: newCourseId,
        num_lessons: numLessons,
      })
  
      // Simulate streaming by revealing lessons one by one
      const generated = aiRes.data.lessons
      for (let i = 0; i < generated.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 400))
        setLessons(prev => [...prev, generated[i]])
      }
  
      setStep('preview')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateQuiz = async () => {
    if (!courseId) return
    try {
      const res = await api.post('/ai/generate-quiz', {
        course_id: courseId,
        num_questions: 10,
      })
      setQuizId(res.data.quiz_id)
      alert('Quiz generated! Click "Take Quiz" to start.')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Quiz generation failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-gray-950 font-bold">L</div>
          <span className="text-white font-semibold">Learnify <span className="text-amber-500">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">Dashboard</a>
          <span className="bg-amber-500/10 text-amber-500 text-xs px-2 py-1 rounded-full border border-amber-500/20">{user?.role}</span>
          <button onClick={logout} className="text-gray-400 hover:text-white text-sm">Sign out</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="text-amber-500 text-xs uppercase tracking-widest mb-2">// ai course builder</p>
          <h1 className="text-3xl font-bold text-white">Generate a <span className="italic text-amber-500">new course</span></h1>
          <p className="text-gray-400 text-sm mt-2">Describe your topic and AI will create a full curriculum with lesson content.</p>
        </div>

        {step === 'form' || generating ? (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Form */}
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-6">
        <span className="text-amber-500 text-sm">✨ GPT-4o · JSON structured output</span>
      </div>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Course Title</label>
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            disabled={generating}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
            placeholder="e.g. Intro to Machine Learning" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Topic</label>
          <input value={form.topic} onChange={e => setForm({...form, topic: e.target.value})}
            disabled={generating}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
            placeholder="e.g. Machine Learning, Python, React" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Difficulty</label>
            <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}
              disabled={generating}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Lessons</label>
            <select value={numLessons} onChange={e => setNumLessons(Number(e.target.value))}
              disabled={generating}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50">
              <option value={4}>4 lessons</option>
              <option value={6}>6 lessons</option>
              <option value={8}>8 lessons</option>
              <option value={10}>10 lessons</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Description (optional)</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
            disabled={generating}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 resize-none disabled:opacity-50"
            rows={3} placeholder="Brief description of the course..." />
        </div>
        <button onClick={handleGenerate} disabled={generating}
          className="w-full bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold rounded-lg py-3 text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {generating ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Generating...
            </>
          ) : '✨ Generate course'}
        </button>
      </div>
    </div>

    {/* Live streaming preview */}
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-white font-semibold">
          {generating ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              AI is generating...
            </span>
          ) : '📚 Curriculum preview'}
        </h2>
        {lessons.length > 0 && (
          <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20">
            {lessons.length} lessons
          </span>
        )}
      </div>
      {lessons.length === 0 && !generating ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="text-4xl mb-4">✨</div>
            <p className="text-gray-400 text-sm">Your course will appear here</p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-800">
          {lessons.map((lesson, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 animate-fadeIn">
              <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center text-xs font-bold text-gray-950 flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">{lesson.title}</div>
                <div className="text-xs text-gray-400">{lesson.duration}</div>
              </div>
              <span className="text-green-400 text-xs">✓</span>
            </div>
          ))}
          {generating && (
            <div className="flex items-center gap-3 px-4 py-3 opacity-50">
              <div className="w-6 h-6 rounded-md bg-gray-800 flex items-center justify-center flex-shrink-0">
                <svg className="animate-spin h-3 w-3 text-amber-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              </div>
              <span className="text-sm text-gray-400">Generating next lesson<span className="animate-pulse">...</span></span>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-white font-semibold">📚 Generated curriculum</h2>
                <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20">
                  {lessons.length} lessons
                </span>
              </div>
              {lessons.map((lesson, i) => (
                <div key={i} onClick={() => setSelectedLesson(i)}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-gray-800 cursor-pointer transition-colors ${selectedLesson === i ? 'bg-amber-500/10' : 'hover:bg-gray-800'}`}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${selectedLesson === i ? 'bg-amber-500 text-gray-950' : 'bg-gray-800 text-gray-400'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{lesson.title}</div>
                    <div className="text-xs text-gray-400">{lesson.duration}</div>
                  </div>
                </div>
              ))}
              <div className="p-4 flex gap-2">
                <button onClick={() => setStep('form')}
                  className="flex-1 bg-gray-800 text-gray-300 text-sm font-medium rounded-lg py-2 hover:bg-gray-700 transition-colors">
                  ← Regenerate
                </button>
                {quizId ? (
                  <a href={`/quiz/${quizId}`}
                    className="flex-1 bg-amber-500 text-gray-950 text-sm font-semibold rounded-lg py-2 hover:bg-amber-400 transition-colors text-center">
                    📝 Take Quiz
                  </a>
                ) : (
                  <button onClick={handleGenerateQuiz}
                    className="flex-1 bg-gray-800 text-gray-300 text-sm font-medium rounded-lg py-2 hover:bg-gray-700 transition-colors">
                    📝 Generate Quiz
                  </button>
                )}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              {lessons[selectedLesson] && (
                <>
                  <h2 className="text-xl font-bold text-white mb-1">{lessons[selectedLesson].title}</h2>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 pb-4 border-b border-gray-800">
                    <span>⏱ {lessons[selectedLesson].duration}</span>
                    <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20">AI Generated</span>
                  </div>
                  <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {lessons[selectedLesson].content}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-800 flex gap-2">
                    <button className="bg-gray-800 text-gray-300 text-xs font-medium px-3 py-2 rounded-lg hover:bg-gray-700">
                      ✏️ Edit lesson
                    </button>
                    <button className="bg-gray-800 text-gray-300 text-xs font-medium px-3 py-2 rounded-lg hover:bg-gray-700">
                      ✨ Improve with AI
                    </button>
                    <button className="ml-auto bg-amber-500 text-gray-950 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-amber-400">
                      Publish course →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}