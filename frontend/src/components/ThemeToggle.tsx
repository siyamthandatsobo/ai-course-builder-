import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none border border-gray-700 dark:bg-gray-800 bg-gray-200"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center text-xs
        ${theme === 'dark' ? 'translate-x-0 bg-amber-500' : 'translate-x-6 bg-amber-500'}`}>
        {theme === 'dark' ? '🌙' : '☀️'}
      </div>
    </button>
  )
}