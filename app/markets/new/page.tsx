'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function NewMarketPage() {
  const [question, setQuestion] = useState('')
  const [description, setDescription] = useState('')
  const [resolveAt, setResolveAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      router.push('/')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const userId = localStorage.getItem('userId')
    if (!userId) {
      router.push('/')
      return
    }

    try {
      const response = await fetch('/api/markets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          question: question.trim(),
          description: description.trim() || null,
          resolveAt: resolveAt || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create market')
        setLoading(false)
        return
      }

      router.push(`/markets/${data.id}`)
    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Create New Market
        </h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Question *
            </label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Will it rain tomorrow?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional context about this market..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="resolveAt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Expected Resolve Date (optional)
            </label>
            <input
              type="datetime-local"
              id="resolveAt"
              value={resolveAt}
              onChange={(e) => setResolveAt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">
              This is for reference only and does not automatically resolve the market.
            </p>
          </div>
          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Market'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

