import { useAuth } from '../context/AuthContext'

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, <span className="text-amber-500">{user?.full_name}</span> 👋</h1>
            <p className="text-gray-400 text-sm mt-1">Role: {user?.role}</p>
          </div>
          <button onClick={logout} className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-700">
            Sign out
          </button>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-white font-semibold text-lg mb-2">Dashboard coming soon</h2>
          <p className="text-gray-400 text-sm">Auth is working! More features being built...</p>
        </div>
      </div>
    </div>
  )
}