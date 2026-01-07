'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MarketBackground from '@/components/MarketBackground'

export default function Home() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (userId) {
      router.push('/markets')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!username.trim()) {
      setError('Username is required')
      setLoading(false)
      return
    }

    if (!password) {
      setError('Password is required')
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        // Login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Login failed')
          setLoading(false)
          return
        }

        localStorage.setItem('userId', data.id)
        localStorage.setItem('username', data.username)
        router.push('/markets')
      } else {
        // Signup
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Signup failed')
          setLoading(false)
          return
        }

        localStorage.setItem('userId', data.id)
        localStorage.setItem('username', data.username)
        router.push('/markets')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 relative overflow-hidden">
      <MarketBackground />
      <div className="bg-white/98 backdrop-blur-md rounded-lg shadow-xl p-8 w-full max-w-md relative z-10">
        <h1 className="text-3xl font-bold text-center mb-2 text-accent">
          Phil or No Phil
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {isLogin ? 'Login to your account' : 'Create a new account'}
        </p>

        <div className="flex space-x-1 mb-6 border-b border-gray-200">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true)
              setError('')
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              isLogin
                ? 'border-b-2 border-accent text-accent'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false)
              setError('')
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              !isLogin
                ? 'border-b-2 border-accent text-accent'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              disabled={loading}
              autoComplete="username"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              disabled={loading}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
            {!isLogin && (
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters
              </p>
            )}
          </div>
          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading
              ? 'Loading...'
              : isLogin
              ? 'Login'
              : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  )
}

