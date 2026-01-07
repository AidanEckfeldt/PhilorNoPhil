import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { resolution } = await request.json()

    if (!resolution || (resolution !== 'YES' && resolution !== 'NO')) {
      return NextResponse.json(
        { error: 'Resolution must be YES or NO' },
        { status: 400 }
      )
    }

    // Get market
    const market = await prisma.market.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!market) {
      return NextResponse.json(
        { error: 'Market not found' },
        { status: 404 }
      )
    }

    if (market.status === 'RESOLVED') {
      return NextResponse.json(
        { error: 'Market is already resolved' },
        { status: 400 }
      )
    }

    // Check if user is creator or admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const isCreator = market.creatorId === userId
    const isAdmin = user.isAdmin

    if (!isCreator && !isAdmin) {
      return NextResponse.json(
        { error: 'Only market creator or admin can resolve' },
        { status: 403 }
      )
    }

    // Get all trades for this market
    const trades = await prisma.trade.findMany({
      where: { marketId: params.id },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    })

    // Calculate payouts
    const payouts = new Map<string, number>()

    for (const trade of trades) {
      if (trade.side === resolution) {
        const currentPayout = payouts.get(trade.userId) || 0
        payouts.set(trade.userId, currentPayout + trade.shares * 1.0)
      }
    }

    // Update market and user balances in a transaction
    await prisma.$transaction(async (tx) => {
      // Update market
      await tx.market.update({
        where: { id: params.id },
        data: {
          status: 'RESOLVED',
          resolution,
          resolveAt: new Date(),
        },
      })

      // Update user balances
      for (const [userId, payout] of payouts.entries()) {
        await tx.user.update({
          where: { id: userId },
          data: {
            balance: {
              increment: payout,
            },
          },
        })
      }
    })

    const updatedMarket = await prisma.market.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            username: true,
          },
        },
      },
    })

    return NextResponse.json(updatedMarket)
  } catch (error: any) {
    console.error('Error resolving market:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

