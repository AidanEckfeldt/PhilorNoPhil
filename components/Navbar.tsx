'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [username, setUsername] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const updateUsername = () => {
      const storedUsername = localStorage.getItem('username')
      setUsername(storedUsername || '')
    }

    // Initial load
    updateUsername()

    // Listen for storage changes (e.g., logout from another tab)
    window.addEventListener('storage', updateUsername)

    return () => {
      window.removeEventListener('storage', updateUsername)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    router.push('/')
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Mobile: stacked layout */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center py-2 md:h-16">
          {/* Title - centered on mobile, absolute center on desktop */}
          <div className="flex justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2 mb-2 md:mb-0">
            <Link
              href="/markets"
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-accent whitespace-nowrap"
            >
              Phil or No Phil
            </Link>
          </div>
          
          {/* Bottom row on mobile: nav + user */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <div className="flex space-x-1">
              <Link
                href="/markets"
                className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  isActive('/markets')
                    ? 'bg-accent text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Markets
              </Link>
              <Link
                href="/leaderboard"
                className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  isActive('/leaderboard')
                    ? 'bg-accent text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Leaderboard
              </Link>
            </div>
            {username && (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-xs sm:text-sm text-gray-700 hidden sm:inline">{username}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

