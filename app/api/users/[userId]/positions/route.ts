import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const trades = await prisma.trade.findMany({
      where: { userId: params.userId },
      include: {
        market: {
          select: {
            id: true,
            question: true,
            status: true,
          },
        },
      },
    })

    // Aggregate positions by market
    const positions = new Map<
      string,
      { market: any; yesShares: number; noShares: number }
    >()

    for (const trade of trades) {
      if (!positions.has(trade.marketId)) {
        positions.set(trade.marketId, {
          market: trade.market,
          yesShares: 0,
          noShares: 0,
        })
      }

      const position = positions.get(trade.marketId)!
      if (trade.side === 'YES') {
        position.yesShares += trade.shares
      } else {
        position.noShares += trade.shares
      }
    }

    return NextResponse.json(Array.from(positions.values()))
  } catch (error) {
    console.error('Error fetching positions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

