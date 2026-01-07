import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pickEmojiForMarket } from '@/lib/emoji-picker'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const where: any = {}
    if (status === 'OPEN' || status === 'RESOLVED') {
      where.status = status
    }

    const markets = await prisma.market.findMany({
      where,
      include: {
        creator: {
          select: {
            username: true,
          },
        },
        trades: {
          select: {
            shares: true,
          },
        },
        _count: {
          select: {
            trades: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Add totalShares to each market for sorting
    const marketsWithShares = markets.map((market) => ({
      ...market,
      totalShares: market.trades.reduce((sum, trade) => sum + trade.shares, 0),
    }))

    return NextResponse.json(marketsWithShares)
  } catch (error) {
    console.error('Error fetching markets:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { question, description, resolveAt } = await request.json()
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!question || typeof question !== 'string' || !question.trim()) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Parse resolveAt date if provided
    let resolveAtDate: Date | null = null
    if (resolveAt && typeof resolveAt === 'string' && resolveAt.trim()) {
      try {
        resolveAtDate = new Date(resolveAt)
        // Check if date is valid
        if (isNaN(resolveAtDate.getTime())) {
          resolveAtDate = null
        }
      } catch (error) {
        console.error('Error parsing resolveAt date:', error)
        resolveAtDate = null
      }
    }

    // Pick emoji based on market content
    const emoji = pickEmojiForMarket(question.trim(), description?.trim() || null)

    const market = await prisma.market.create({
      data: {
        question: question.trim(),
        description: description?.trim() || null,
        emoji,
        creatorId: userId,
        status: 'OPEN',
        yesPrice: 0.5,
        noPrice: 0.5,
        resolveAt: resolveAtDate,
      },
      include: {
        creator: {
          select: {
            username: true,
          },
        },
      },
    })

    return NextResponse.json(market)
  } catch (error: any) {
    console.error('Error creating market:', error)
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

