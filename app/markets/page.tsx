'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import InfoBanner from '@/components/InfoBanner'

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
  totalShares?: number
  creator: {
    username: string
  }
}

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([])
  const [activeTab, setActiveTab] = useState<'OPEN' | 'RESOLVED'>('OPEN')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'active'>('recent')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      router.push('/')
      return
    }

    fetchMarkets()
  }, [activeTab, router])

  const fetchMarkets = async () => {
    try {
      const response = await fetch(`/api/markets?status=${activeTab}`)
      const data = await response.json()
      setMarkets(data)
    } catch (error) {
      console.error('Error fetching markets:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (markets.length === 0) {
      setFilteredMarkets([])
      return
    }

    let filtered = [...markets]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (market) =>
          market.question.toLowerCase().includes(query) ||
          market.description?.toLowerCase().includes(query) ||
          market.creator.username.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === 'active') {
      // Sort by total shares traded (most active = most shares)
      filtered.sort((a, b) => {
        const aShares = a.totalShares || 0
        const bShares = b.totalShares || 0
        return bShares - aShares
      })
    }

    setFilteredMarkets(filtered)
  }, [searchQuery, sortBy, markets])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <InfoBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Markets</h1>
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setSortBy('recent')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  sortBy === 'recent'
                    ? 'bg-accent text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Most Recent
              </button>
              <button
                onClick={() => setSortBy('active')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  sortBy === 'active'
                    ? 'bg-accent text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Most Active
              </button>
            </div>
            <Link
              href="/markets/new"
              className="bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Create Market
            </Link>
          </div>
        </div>

        <div className="flex space-x-1 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('OPEN')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'OPEN'
                ? 'border-b-2 border-accent text-accent'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'RESOLVED'
                ? 'border-b-2 border-accent text-accent'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Resolved
          </button>
        </div>

        {filteredMarkets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchQuery
              ? `No ${activeTab.toLowerCase()} markets found matching "${searchQuery}".`
              : `No ${activeTab.toLowerCase()} markets yet.`}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMarkets.map((market) => (
              <Link
                key={market.id}
                href={`/markets/${market.id}`}
                className="bg-white rounded-lg shadow-md border-2 border-gray-900 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3 mb-2">
                  {market.emoji && (
                    <span className="text-3xl flex-shrink-0">{market.emoji}</span>
                  )}
                  <h2 className="text-xl font-semibold text-gray-900 flex-1">
                    {market.question}
                  </h2>
                </div>
                {market.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {market.description}
                  </p>
                )}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    {market.creator.username}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(market.createdAt)}
                  </span>
                </div>
                {market.status === 'OPEN' ? (
                  <div className="flex space-x-4 mt-4">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">YES</div>
                      <div className="text-lg font-bold text-green-600">
                        {(market.yesPrice * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">NO</div>
                      <div className="text-lg font-bold text-red-600">
                        {(market.noPrice * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        market.resolution === 'YES'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      Resolved: {market.resolution}
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

