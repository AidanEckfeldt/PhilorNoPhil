'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface Market {
  id: string
  question: string
  description: string | null
  emoji: string | null
  status: 'OPEN' | 'RESOLVED'
  resolution: 'YES' | 'NO' | null
  yesPrice: number
  noPrice: number
  createdAt: string
  resolveAt: string | null
  totalYesShares: number
  totalNoShares: number
  creator: {
    username: string
    id: string
  }
}

interface Position {
  yesShares: number
  noShares: number
}

export default function MarketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [market, setMarket] = useState<Market | null>(null)
  const [position, setPosition] = useState<Position>({ yesShares: 0, noShares: 0 })
  const [userBalance, setUserBalance] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [trading, setTrading] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [shares, setShares] = useState<number | ''>(1)
  const [sharesInput, setSharesInput] = useState('1')
  const [side, setSide] = useState<'YES' | 'NO'>('YES')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Safely get market ID from params
  const marketId = Array.isArray(params.id) ? params.id[0] : params.id

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      router.push('/')
      return
    }

    if (!marketId) {
      setError('Invalid market ID')
      setLoading(false)
      return
    }

    fetchMarket()
    fetchUserPosition()
  }, [marketId, router])

  const fetchMarket = async () => {
    if (!marketId) return
    try {
      const response = await fetch(`/api/markets/${marketId}`)
      const data = await response.json()
      setMarket(data)

      // Check if user is admin
      const userId = localStorage.getItem('userId')
      if (userId) {
        const userResponse = await fetch(`/api/users/${userId}`)
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setIsAdmin(userData.isAdmin || false)
        }
      }
    } catch (error) {
      console.error('Error fetching market:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPosition = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) return

      const response = await fetch(`/api/users/${userId}/positions`)
      const positions = await response.json()
      const marketPosition = positions.find(
        (p: any) => p.market.id === marketId
      )

      if (marketPosition) {
        setPosition({
          yesShares: marketPosition.yesShares,
          noShares: marketPosition.noShares,
        })
      }

      // Also fetch user balance
      const userResponse = await fetch(`/api/users/${userId}`)
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUserBalance(userData.balance)
      }
    } catch (error) {
      console.error('Error fetching position:', error)
    }
  }

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setTrading(true)

    const userId = localStorage.getItem('userId')
    if (!userId) {
      router.push('/')
      return
    }

    // Validate shares
    const sharesNum = typeof shares === 'number' ? shares : parseInt(sharesInput) || 0
    if (sharesNum < 1) {
      setError('Shares must be at least 1')
      setTrading(false)
      return
    }

    if (!marketId) return
    try {
      const response = await fetch(`/api/markets/${marketId}/trades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ side, shares: sharesNum }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to place trade')
        setTrading(false)
        return
      }

      setSuccess(`Successfully bought ${sharesNum} ${side} shares!`)
      setShares(1)
      setSharesInput('1')
      if (data.userBalance !== undefined) {
        setUserBalance(data.userBalance)
      }
      await fetchMarket()
      await fetchUserPosition()
      setTrading(false)
    } catch (err: any) {
      console.error('Error placing trade:', err)
      setError(err?.message || 'Network error. Please try again.')
      setTrading(false)
    }
  }

  const handleResolve = async (resolution: 'YES' | 'NO') => {
    if (!confirm(`Are you sure you want to resolve this market as ${resolution}?`)) {
      return
    }

    setError('')
    setResolving(true)

    const userId = localStorage.getItem('userId')
    if (!userId) {
      router.push('/')
      return
    }

    if (!marketId) return
    try {
      const response = await fetch(`/api/markets/${marketId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ resolution }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.error || `Failed to resolve market (${response.status})`)
        setResolving(false)
        return
      }

      const data = await response.json()

      await fetchMarket()
      await fetchUserPosition()
      // Refresh user balance after resolution (payouts may have been applied)
      const userResponse = await fetch(`/api/users/${userId}`)
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUserBalance(userData.balance)
      }
      setResolving(false)
    } catch (err: any) {
      console.error('Error resolving market:', err)
      setError(err?.message || 'Network error. Please try again.')
      setResolving(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </>
    )
  }

  if (!market) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Market not found</div>
        </div>
      </>
    )
  }

  const canResolve = market.status === 'OPEN' && isAdmin
  const sharesNum = typeof shares === 'number' ? shares : parseInt(sharesInput) || 0
  const cost = (side === 'YES' ? market.yesPrice : market.noPrice) * (sharesNum || 0)

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
            {market.emoji && (
              <span className="text-3xl sm:text-5xl flex-shrink-0">{market.emoji}</span>
            )}
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 flex-1">
              {market.question}
            </h1>
          </div>
          {market.description && (
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{market.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            <span>Created by {market.creator.username}</span>
            <span className="hidden sm:inline">•</span>
            <span>
              {new Date(market.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            {market.resolveAt && market.status === 'OPEN' && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="text-accent font-medium w-full sm:w-auto mt-1 sm:mt-0">
                  Ends: {new Date(market.resolveAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </>
            )}
          </div>

          {market.status === 'OPEN' ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6">
              <div className="border-2 border-green-200 rounded-lg p-3 sm:p-4 bg-green-50">
                <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">YES</div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
                  {(market.yesPrice * 100).toFixed(1)}%
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  {market.totalYesShares} shares
                </div>
              </div>
              <div className="border-2 border-red-200 rounded-lg p-3 sm:p-4 bg-red-50">
                <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">NO</div>
                <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1 sm:mb-2">
                  {(market.noPrice * 100).toFixed(1)}%
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  {market.totalNoShares} shares
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <div
                className={`inline-block px-4 py-2 rounded-lg text-lg font-semibold ${
                  market.resolution === 'YES'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                Resolved: {market.resolution}
              </div>
            </div>
          )}

          {position.yesShares > 0 || position.noShares > 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Your Position
              </div>
              <div className="flex space-x-4">
                <div>
                  <span className="text-gray-600">YES: </span>
                  <span className="font-semibold">{position.yesShares} shares</span>
                </div>
                <div>
                  <span className="text-gray-600">NO: </span>
                  <span className="font-semibold">{position.noShares} shares</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {market.status === 'OPEN' && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Place a Trade</h2>
            <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
              Balance: <span className="font-semibold">{userBalance.toFixed(2)}</span> points
            </div>
            <form onSubmit={handleTrade}>
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Side
                </label>
                <div className="flex space-x-3 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => setSide('YES')}
                    className={`flex-1 py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg font-semibold text-sm sm:text-base transition-colors ${
                      side === 'YES'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => setSide('NO')}
                    className={`flex-1 py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg font-semibold text-sm sm:text-base transition-colors ${
                      side === 'NO'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>
              <div className="mb-3 sm:mb-4">
                <label
                  htmlFor="shares"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                >
                  Shares
                </label>
                <input
                  type="number"
                  id="shares"
                  min="1"
                  value={sharesInput}
                  onChange={(e) => {
                    const value = e.target.value
                    setSharesInput(value)
                    const numValue = parseInt(value)
                    if (value === '' || isNaN(numValue)) {
                      setShares('' as any)
                    } else {
                      setShares(Math.max(1, numValue))
                    }
                  }}
                  onBlur={(e) => {
                    const numValue = parseInt(e.target.value)
                    if (e.target.value === '' || isNaN(numValue) || numValue < 1) {
                      setSharesInput('1')
                      setShares(1)
                    } else {
                      setSharesInput(e.target.value)
                      setShares(Math.max(1, numValue))
                    }
                  }}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-base"
                  disabled={trading}
                />
              </div>
              <div className="mb-3 sm:mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-600">
                  Price per share:{' '}
                  <span className="font-semibold">
                    {(side === 'YES' ? market.yesPrice : market.noPrice).toFixed(3)}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Total cost:{' '}
                  <span className="font-semibold">{cost.toFixed(2)}</span> points
                </div>
              </div>
              {error && (
                <div className="mb-3 sm:mb-4 text-red-600 text-xs sm:text-sm">{error}</div>
              )}
              {success && (
                <div className="mb-3 sm:mb-4 text-green-600 text-xs sm:text-sm">{success}</div>
              )}
              <button
                type="submit"
                disabled={trading || cost > userBalance || sharesNum < 1}
                className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2.5 sm:py-2 px-4 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                {trading ? 'Processing...' : 'Buy Shares'}
              </button>
            </form>
          </div>
        )}

        {canResolve && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Resolve Market</h2>
            <div className="flex space-x-3 sm:space-x-4">
              <button
                onClick={() => handleResolve('YES')}
                disabled={resolving}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                Resolve YES
              </button>
              <button
                onClick={() => handleResolve('NO')}
                disabled={resolving}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                Resolve NO
              </button>
            </div>
            {error && (
              <div className="mt-3 sm:mt-4 text-red-600 text-xs sm:text-sm">{error}</div>
            )}
          </div>
        )}
      </div>
    </>
  )
}


