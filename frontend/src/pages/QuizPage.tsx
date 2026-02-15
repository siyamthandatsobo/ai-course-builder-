import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/client'

interface Question {
  id: number
  question_text: string
  options: string[]
}

interface QuizData {
  id: number
  title: string
  questions: Question[]
}

interface Result {
  question_text: string
  your_answer: string
  correct_answer: string
  explanation: string
  is_correct: boolean
}

export default function QuizPage() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<{ score: number; correct: number; total: number; results: Result[] } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const res = await api.get(`/quizzes/${quizId}`)
      return res.data as QuizData
    }
  })

  const handleSelect = (option: string) => {
    setSelected(option)
  }

  const handleNext = () => {
    if (!selected) return
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    setSelected(null)

    if (currentQ + 1 < (quiz?.questions.length || 0)) {
      setCurrentQ(currentQ + 1)
    } else {
      handleSubmit(newAnswers)
    }
  }

  const handleSubmit = async (finalAnswers: string[]) => {
    setSubmitting(true)
    try {
      const res = await api.post(`/quizzes/${quizId}/attempt`, {
        answers: finalAnswers,
      })
      setResults(res.data)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-amber-500 animate-pulse">Loading quiz...</div>
    </div>
  )

  if (submitting) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-amber-500 animate-pulse">Grading your answers...</div>
    </div>
  )

  // Score screen
  if (submitted && results) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center mb-6">
          <div className="w-24 h-24 rounded-full border-4 border-amber-500 flex items-center justify-center mx-auto mb-4 bg-amber-500/10">
            <span className="text-3xl font-bold text-amber-500">{results.score}%</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h1>
          <p className="text-gray-400">You got <span className="text-amber-500 font-semibold">{results.correct}</span> out of <span className="text-white font-semibold">{results.total}</span> correct</p>
          <div className="mt-4">
            {results.score >= 80 ? (
              <span className="bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm border border-green-500/20">🎉 Excellent work!</span>
            ) : results.score >= 60 ? (
              <span className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full text-sm border border-amber-500/20">👍 Good effort!</span>
            ) : (
              <span className="bg-red-500/10 text-red-400 px-4 py-2 rounded-full text-sm border border-red-500/20">📚 Keep studying!</span>
            )}
          </div>
        </div>

        {/* Results breakdown */}
        <div className="space-y-3 mb-6">
          {results.results.map((r, i) => (
            <div key={i} className={`bg-gray-900 border rounded-xl p-4 ${r.is_correct ? 'border-green-500/20' : 'border-red-500/20'}`}>
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{r.is_correct ? '✅' : '❌'}</span>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-2">{r.question_text}</p>
                  <p className="text-xs text-gray-400">Your answer: <span className={r.is_correct ? 'text-green-400' : 'text-red-400'}>{r.your_answer}</span></p>
                  {!r.is_correct && (
                    <p className="text-xs text-gray-400">Correct: <span className="text-green-400">{r.correct_answer}</span></p>
                  )}
                  <p className="text-xs text-gray-500 mt-1 italic">{r.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/dashboard')}
          className="w-full bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold rounded-lg py-3 text-sm transition-colors">
          Back to Dashboard
        </button>
      </div>
    </div>
  )

  const question = quiz?.questions[currentQ]
  const progress = ((currentQ) / (quiz?.questions.length || 1)) * 100

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-white font-semibold text-sm">{quiz?.title}</h1>
            <span className="text-gray-400 text-sm">{currentQ + 1} / {quiz?.questions.length}</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full">
            <div className="h-1.5 bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Question card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center text-amber-500 text-xs font-bold">
              {currentQ + 1}
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Question {currentQ + 1}</span>
          </div>
          <p className="text-white font-medium text-lg leading-relaxed mb-6">{question?.question_text}</p>

          <div className="space-y-3">
            {question?.options.map((option, i) => (
              <button key={i} onClick={() => handleSelect(option)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-center gap-3 ${
                  selected === option
                    ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                    : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                }`}>
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 border ${
                  selected === option ? 'bg-amber-500 border-amber-500 text-gray-950' : 'border-gray-600 text-gray-400'
                }`}>
                  {['A','B','C','D'][i]}
                </div>
                {option}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleNext} disabled={!selected}
          className="w-full bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold rounded-lg py-3 text-sm transition-colors disabled:opacity-30">
          {currentQ + 1 === quiz?.questions.length ? 'Submit Quiz' : 'Next Question →'}
        </button>
      </div>
    </div>
  )
}