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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          <div className="flex space-x-1">
              <Link
                href="/markets"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/markets')
                    ? 'bg-accent text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Markets
              </Link>
              <Link
                href="/leaderboard"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/leaderboard')
                    ? 'bg-accent text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Leaderboard
              </Link>
          </div>
          <Link
            href="/markets"
            className="absolute left-1/2 transform -translate-x-1/2 text-3xl md:text-4xl lg:text-5xl font-bold text-accent"
          >
            Phil or No Phil
          </Link>
          {username && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{username}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

