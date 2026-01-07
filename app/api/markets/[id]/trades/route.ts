import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function recalculatePrices(marketId: string) {
  const trades = await prisma.trade.findMany({
    where: { marketId },
    select: {
      side: true,
      shares: true,
    },
  })

  const totalYesShares = trades
    .filter((t) => t.side === 'YES')
    .reduce((sum, t) => sum + t.shares, 0)
  const totalNoShares = trades
    .filter((t) => t.side === 'NO')
    .reduce((sum, t) => sum + t.shares, 0)

  let yesPrice = 0.5
  let noPrice = 0.5

  if (totalYesShares + totalNoShares > 0) {
    const total = totalYesShares + totalNoShares
    yesPrice = totalYesShares / total
    noPrice = totalNoShares / total
  }

  await prisma.market.update({
    where: { id: marketId },
    data: {
      yesPrice,
      noPrice,
    },
  })

  return { yesPrice, noPrice, totalYesShares, totalNoShares }
}

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

    const { side, shares } = await request.json()

    if (!side || (side !== 'YES' && side !== 'NO')) {
      return NextResponse.json(
        { error: 'Side must be YES or NO' },
        { status: 400 }
      )
    }

    if (!shares || typeof shares !== 'number' || shares < 1 || shares > 100) {
      return NextResponse.json(
        { error: 'Shares must be between 1 and 100' },
        { status: 400 }
      )
    }

    // Get market
    const market = await prisma.market.findUnique({
      where: { id: params.id },
    })

    if (!market) {
      return NextResponse.json(
        { error: 'Market not found' },
        { status: 404 }
      )
    }

    if (market.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Market is not open for trading' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate cost
    const price = side === 'YES' ? market.yesPrice : market.noPrice
    const cost = price * shares

    // Check balance
    if (user.balance < cost) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }

    // Create trade and update balance
    await prisma.$transaction(async (tx) => {
      await tx.trade.create({
        data: {
          userId,
          marketId: params.id,
          side,
          shares,
          price,
        },
      })

      await tx.user.update({
        where: { id: userId },
        data: {
          balance: {
            decrement: cost,
          },
        },
      })
    })

    // Recalculate prices
    const { yesPrice, noPrice, totalYesShares, totalNoShares } =
      await recalculatePrices(params.id)

    // Get updated user balance
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    })

    return NextResponse.json({
      market: {
        ...market,
        yesPrice,
        noPrice,
        totalYesShares,
        totalNoShares,
      },
      userBalance: updatedUser?.balance || 0,
    })
  } catch (error) {
    console.error('Error creating trade:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

