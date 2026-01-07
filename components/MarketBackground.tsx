'use client'

import { useEffect, useState } from 'react'

interface MarketData {
  symbol: string
  value: number
  change: number
  trend: 'up' | 'down'
}

export default function MarketBackground() {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [positions, setPositions] = useState<{
    cards: Array<{ left: number; top: number }>
    charts: Array<{ left: number; top: number }>
    symbols: Array<{ left: number; top: number }>
    tickers: Array<{ left: number; top: number }>
    bars: Array<{ left: number; top: number }>
  }>({
    cards: [],
    charts: [],
    symbols: [],
    tickers: [],
    bars: [],
  })

  useEffect(() => {
    // Generate fake market data for visual effect
    const generateMarketData = () => {
      const symbols = ['PHIL', 'YES', 'NO', 'BET', 'WIN', 'TRADE', 'MARKET', 'SHARE']
      const data: MarketData[] = symbols.map((symbol) => ({
        symbol,
        value: Math.random() * 100 + 50,
        change: (Math.random() - 0.5) * 10,
        trend: Math.random() > 0.5 ? 'up' : 'down',
      }))
      setMarketData(data)
    }

    // Generate random scattered positions
    const generatePositions = (count: number) => {
      return Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
      }))
    }

    generateMarketData()
    setPositions({
      cards: generatePositions(30),
      charts: generatePositions(20),
      symbols: generatePositions(50),
      tickers: generatePositions(15),
      bars: generatePositions(25),
    })

    const interval = setInterval(generateMarketData, 3000) // Update every 3 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-50">
      {/* Rotating market cards - increased from 12 to 30 */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => {
          const pos = positions.cards?.[i] || { left: Math.random() * 100, top: Math.random() * 100 }
          return (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animationDuration: `${12 + (i % 5) * 2}s`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 border border-white/25 shadow-lg">
              <div className="text-xs font-bold text-gray-700 mb-0.5">
                {marketData[i % marketData.length]?.symbol || 'PHIL'}
              </div>
              <div className="text-xs font-semibold text-gray-800">
                {marketData[i % marketData.length]?.value.toFixed(2) || '75.50'}
              </div>
              <div
                className={`text-xs ${
                  marketData[i % marketData.length]?.trend === 'up'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {marketData[i % marketData.length]?.trend === 'up' ? '↑' : '↓'}{' '}
                {Math.abs(marketData[i % marketData.length]?.change || 0).toFixed(2)}%
              </div>
            </div>
          </div>
          )
        })}
      </div>

      {/* Rotating chart lines - increased from 8 to 20 */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => {
          const pos = positions.charts?.[i] || { left: Math.random() * 100, top: Math.random() * 100 }
          return (
          <svg
            key={i}
            className="absolute opacity-40 animate-rotate-slow"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              width: '150px',
              height: '80px',
              animationDuration: `${15 + (i % 4) * 2}s`,
              animationDelay: `${i * 0.5}s`,
            }}
            viewBox="0 0 200 100"
          >
            <polyline
              points={`0,${50 + (i % 3) * 10} ${50},${30 + (i % 4) * 5} ${100},${70 - (i % 3) * 10} ${150},${40 + (i % 2) * 10} 200,${60 + (i % 3) * 5}`}
              fill="none"
              stroke={i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#f43f5e' : '#3b82f6'}
              strokeWidth="2"
            />
          </svg>
          )
        })}
      </div>

      {/* Floating numbers and symbols - increased from 20 to 50 */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => {
          const pos = positions.symbols?.[i] || { left: Math.random() * 100, top: Math.random() * 100 }
          return (
          <div
            key={i}
            className="absolute font-bold text-gray-400/40 animate-drift"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              fontSize: `${20 + (i % 5) * 8}px`,
              animationDuration: `${20 + (i % 6) * 2}s`,
              animationDelay: `${i * 0.15}s`,
            }}
          >
            {['YES', 'NO', '↑', '↓', '📈', '📉', '%', '💰', '🎯', '📊', '💹', '🔺', '🔻'][i % 13]}
          </div>
          )
        })}
      </div>

      {/* Additional price tickers scrolling horizontally */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => {
          const pos = positions.tickers?.[i] || { left: Math.random() * 100, top: Math.random() * 100 }
          return (
          <div
            key={`ticker-${i}`}
            className="absolute text-xs font-mono text-gray-600/50 whitespace-nowrap"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animation: `scroll-horizontal ${30 + i * 2}s linear infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {marketData[i % marketData.length]?.symbol || 'PHIL'}:{' '}
            <span className={marketData[i % marketData.length]?.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
              ${marketData[i % marketData.length]?.value.toFixed(2) || '75.50'}
            </span>
          </div>
          )
        })}
      </div>

      {/* Mini bar charts */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => {
          const pos = positions.bars?.[i] || { left: Math.random() * 100, top: Math.random() * 100 }
          return (
          <div
            key={`bar-${i}`}
            className="absolute flex items-end gap-0.5"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animation: `float ${18 + (i % 4) * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.25}s`,
            }}
          >
            {[...Array(5)].map((_, j) => (
              <div
                key={j}
                className={`w-2 ${
                  j % 2 === 0 ? 'bg-green-500/40' : 'bg-red-500/40'
                } rounded-t`}
                style={{
                  height: `${20 + (i + j) % 30}px`,
                }}
              />
            ))}
          </div>
          )
        })}
      </div>
    </div>
  )
}

