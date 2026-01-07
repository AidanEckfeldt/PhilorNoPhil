'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BannerData {
  lastTrade: {
    username: string
    marketQuestion: string
    marketId: string
    side: string
    shares: number
    createdAt: string
  } | null
  soonestMarket: {
    question: string
    id: string
    resolveAt: string
    creator: string
  } | null
  mostPopular: {
    question: string
    id: string
    tradeCount: number
    creator: string
  } | null
  topUser: {
    username: string
    balance: number
  } | null
  lastUser: {
    username: string
    balance: number
  } | null
  highestVolume: {
    question: string
    id: string
    totalShares: number
    creator: string
  } | null
}

interface TickerItem {
  id: string
  content: React.ReactNode
  color: 'green' | 'red' | 'blue' | 'yellow'
}

export default function InfoBanner() {
  const [bannerData, setBannerData] = useState<BannerData | null>(null)
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])

  useEffect(() => {
    fetchBannerData()
    const interval = setInterval(fetchBannerData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (bannerData) {
      const newItems: TickerItem[] = []

      if (bannerData.lastTrade) {
        const isYes = bannerData.lastTrade.side === 'YES'
        newItems.push({
          id: `trade-${bannerData.lastTrade.marketId}`,
          color: isYes ? 'green' : 'red',
          content: (
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span className={`font-bold ${isYes ? 'text-green-600' : 'text-red-600'}`}>
                {bannerData.lastTrade.side}
              </span>
              <span className="text-gray-700">
                <span className="font-semibold">{bannerData.lastTrade.username}</span> placed{' '}
                <span className="font-bold">{bannerData.lastTrade.shares}</span> shares on{' '}
                <Link
                  href={`/markets/${bannerData.lastTrade.marketId}`}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {bannerData.lastTrade.marketQuestion}
                </Link>
              </span>
            </span>
          ),
        })
      }

      if (bannerData.soonestMarket) {
        const resolveDate = new Date(bannerData.soonestMarket.resolveAt)
        const now = new Date()
        const diffMs = resolveDate.getTime() - now.getTime()
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

        newItems.push({
          id: `soonest-${bannerData.soonestMarket.id}`,
          color: 'yellow',
          content: (
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-yellow-600 font-bold">⚡</span>
              <span className="text-gray-700">
                <Link
                  href={`/markets/${bannerData.soonestMarket.id}`}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {bannerData.soonestMarket.question}
                </Link>{' '}
                ends in{' '}
                <span className="font-bold text-yellow-600">
                  {diffDays > 0 ? `${diffDays} day${diffDays !== 1 ? 's' : ''}` : 'today'}
                </span>
              </span>
            </span>
          ),
        })
      }

      if (bannerData.mostPopular) {
        newItems.push({
          id: `popular-${bannerData.mostPopular.id}`,
          color: 'blue',
          content: (
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-blue-600 font-bold">🔥</span>
              <span className="text-gray-700">
                Most popular:{' '}
                <Link
                  href={`/markets/${bannerData.mostPopular.id}`}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {bannerData.mostPopular.question}
                </Link>{' '}
                with <span className="font-bold text-blue-600">{bannerData.mostPopular.tradeCount}</span> trades
              </span>
            </span>
          ),
        })
      }

      if (bannerData.topUser) {
        newItems.push({
          id: `top-${bannerData.topUser.username}`,
          color: 'green',
          content: (
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-green-600 font-bold">🏆</span>
              <span className="text-gray-700">
                <span className="font-bold text-green-600">{bannerData.topUser.username}</span> leading with{' '}
                <span className="font-bold text-green-600">{bannerData.topUser.balance.toFixed(2)}</span> points
              </span>
            </span>
          ),
        })
      }

      if (bannerData.lastUser) {
        newItems.push({
          id: `last-${bannerData.lastUser.username}`,
          color: 'red',
          content: (
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-red-600 font-bold">💪</span>
              <span className="text-gray-700">
                <span className="font-bold text-red-600">{bannerData.lastUser.username}</span> in last with{' '}
                <span className="font-bold text-red-600">{bannerData.lastUser.balance.toFixed(2)}</span> points
              </span>
            </span>
          ),
        })
      }

      if (bannerData.highestVolume) {
        newItems.push({
          id: `volume-${bannerData.highestVolume.id}`,
          color: 'blue',
          content: (
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-blue-600 font-bold">📊</span>
              <span className="text-gray-700">
                Highest volume:{' '}
                <Link
                  href={`/markets/${bannerData.highestVolume.id}`}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {bannerData.highestVolume.question}
                </Link>{' '}
                with <span className="font-bold text-blue-600">{bannerData.highestVolume.totalShares}</span> shares
              </span>
            </span>
          ),
        })
      }

      // Fallback items when there is no data yet
      if (newItems.length === 0) {
        newItems.push(
          {
            id: 'welcome',
            color: 'blue',
            content: (
              <span className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-blue-600 font-bold">🎉</span>
                <span className="text-gray-700">Welcome to Phil or No Phil</span>
              </span>
            ),
          },
          {
            id: 'create-market',
            color: 'green',
            content: (
              <span className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-green-600 font-bold">➕</span>
                <Link href="/markets/new" className="text-blue-600 hover:underline font-semibold">
                  Create your first market
                </Link>
              </span>
            ),
          },
          {
            id: 'place-trade',
            color: 'yellow',
            content: (
              <span className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-yellow-600 font-bold">⚡</span>
                <span className="text-gray-700">Place a trade to light up the ticker</span>
              </span>
            ),
          }
        )
      }

      // Duplicate items for seamless loop
      setTickerItems([...newItems, ...newItems, ...newItems])
    }
  }, [bannerData])

  const fetchBannerData = async () => {
    try {
      const response = await fetch('/api/banner')
      const data = await response.json()
      setBannerData(data)
    } catch (error) {
      console.error('Error fetching banner data:', error)
    }
  }

  if (!bannerData || tickerItems.length === 0) {
    return null
  }

  return (
    <div className="bg-white border-b-2 border-gray-200 overflow-hidden relative shadow-sm">
      <div className="relative h-10 flex items-center">
        {/* Scrolling ticker */}
        <div className="absolute inset-0 flex items-center">
          <div className="flex items-center gap-8 animate-scroll">
            {tickerItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center gap-2 text-sm font-medium text-gray-800 flex-shrink-0"
              >
                {item.content}
                <span className="text-gray-400">•</span>
              </div>
            ))}
          </div>
        </div>
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  )
}

