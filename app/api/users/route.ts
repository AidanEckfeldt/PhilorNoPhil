import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        balance: true,
        isAdmin: true,
      },
      orderBy: {
        balance: 'desc',
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || typeof username !== 'string' || !username.trim()) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const trimmedUsername = username.trim()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: trimmedUsername },
    })

    if (existingUser) {
      // If user exists but has no password, they can set one
      if (!existingUser.password) {
        // Update existing user with password
        const hashedPassword = await bcrypt.hash(password, 10)
        const updatedUser = await prisma.user.update({
          where: { username: trimmedUsername },
          data: { password: hashedPassword },
          select: {
            id: true,
            username: true,
            balance: true,
            isAdmin: true,
            createdAt: true,
          },
        })
        return NextResponse.json(updatedUser)
      }
      
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user with default balance of 1000
    const newUser = await prisma.user.create({
      data: {
        username: trimmedUsername,
        password: hashedPassword,
        balance: 1000,
        isAdmin: false,
      },
      select: {
        id: true,
        username: true,
        balance: true,
        isAdmin: true,
        createdAt: true,
      },
    })

    return NextResponse.json(newUser)
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      )
    }
    console.error('Error creating user:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    })
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
