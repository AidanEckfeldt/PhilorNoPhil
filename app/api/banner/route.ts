import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get last trade
    const lastTrade = await prisma.trade.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        market: {
          select: {
            question: true,
            id: true,
          },
        },
      },
    })

    // Get market ending soonest (with resolveAt date)
    const soonestMarket = await prisma.market.findFirst({
      where: {
        status: 'OPEN',
        resolveAt: {
          not: null,
        },
      },
      orderBy: {
        resolveAt: 'asc',
      },
      include: {
        creator: {
          select: {
            username: true,
          },
        },
      },
    })

    // Get most popular market (by trade count)
    const mostPopular = await prisma.market.findFirst({
      where: {
        status: 'OPEN',
      },
      include: {
        _count: {
          select: {
            trades: true,
          },
        },
        creator: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        trades: {
          _count: 'desc',
        },
      },
    })

    // Get top leaderboard user
    const topUser = await prisma.user.findFirst({
      orderBy: {
        balance: 'desc',
      },
      select: {
        username: true,
        balance: true,
      },
    })

    // Get last place user
    const lastUser = await prisma.user.findFirst({
      orderBy: {
        balance: 'asc',
      },
      select: {
        username: true,
        balance: true,
      },
    })

    // Get market with highest volume (total shares)
    const highestVolume = await prisma.market.findFirst({
      where: {
        status: 'OPEN',
      },
      include: {
        trades: {
          select: {
            shares: true,
          },
        },
        creator: {
          select: {
            username: true,
          },
        },
      },
    })

    let highestVolumeTotal = 0
    if (highestVolume) {
      highestVolumeTotal = highestVolume.trades.reduce(
        (sum, trade) => sum + trade.shares,
        0
      )
    }

    return NextResponse.json({
      lastTrade: lastTrade
        ? {
            username: lastTrade.user.username,
            marketQuestion: lastTrade.market.question,
            marketId: lastTrade.market.id,
            side: lastTrade.side,
            shares: lastTrade.shares,
            createdAt: lastTrade.createdAt,
          }
        : null,
      soonestMarket: soonestMarket
        ? {
            question: soonestMarket.question,
            id: soonestMarket.id,
            resolveAt: soonestMarket.resolveAt,
            creator: soonestMarket.creator.username,
          }
        : null,
      mostPopular: mostPopular
        ? {
            question: mostPopular.question,
            id: mostPopular.id,
            tradeCount: mostPopular._count.trades,
            creator: mostPopular.creator.username,
          }
        : null,
      topUser: topUser
        ? {
            username: topUser.username,
            balance: topUser.balance,
          }
        : null,
      lastUser: lastUser
        ? {
            username: lastUser.username,
            balance: lastUser.balance,
          }
        : null,
      highestVolume: highestVolume
        ? {
            question: highestVolume.question,
            id: highestVolume.id,
            totalShares: highestVolumeTotal,
            creator: highestVolume.creator.username,
          }
        : null,
    })
  } catch (error) {
    console.error('Error fetching banner data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

