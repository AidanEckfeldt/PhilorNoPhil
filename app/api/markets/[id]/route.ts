import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const market = await prisma.market.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            username: true,
            id: true,
          },
        },
        trades: {
          select: {
            side: true,
            shares: true,
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

    // Calculate total shares
    const totalYesShares = market.trades
      .filter((t: any) => t.side === 'YES')
      .reduce((sum: number, t: any) => sum + t.shares, 0)
    const totalNoShares = market.trades
      .filter((t: any) => t.side === 'NO')
      .reduce((sum: number, t: any) => sum + t.shares, 0)

    return NextResponse.json({
      ...market,
      totalYesShares,
      totalNoShares,
    })
  } catch (error) {
    console.error('Error fetching market:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

