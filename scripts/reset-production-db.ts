import { PrismaClient } from '@prisma/client'

// Use the production DATABASE_URL from environment
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function main() {
  console.log('🗑️  Starting PRODUCTION database reset...')
  console.log(`📍 Connected to: ${process.env.DATABASE_URL?.substring(0, 30)}...`)
  
  // First, let's see what we have
  const userCount = await prisma.user.count()
  const marketCount = await prisma.market.count()
  const tradeCount = await prisma.trade.count()
  
  console.log(`\nFound:`)
  console.log(`  - ${userCount} users`)
  console.log(`  - ${marketCount} markets`)
  console.log(`  - ${tradeCount} trades`)
  
  // Keep only Eckfeldt as admin
  const eckfeldt = await prisma.user.findUnique({
    where: { username: 'Eckfeldt' }
  })

  if (!eckfeldt) {
    console.log('\n⚠️  Warning: Eckfeldt user not found. All users will be deleted.')
  }

  console.log('\nDeleting all data except Eckfeldt...')

  // Delete all trades
  console.log('Deleting trades...')
  const deletedTrades = await prisma.trade.deleteMany()
  console.log(`✅ Deleted ${deletedTrades.count} trades`)

  // Delete all markets
  console.log('Deleting markets...')
  const deletedMarkets = await prisma.market.deleteMany()
  console.log(`✅ Deleted ${deletedMarkets.count} markets`)

  // Delete all users except Eckfeldt
  console.log('Deleting test users...')
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      username: {
        not: 'Eckfeldt'
      }
    }
  })
  console.log(`✅ Deleted ${deletedUsers.count} users`)

  // Reset Eckfeldt's balance to 1000 and ensure admin
  if (eckfeldt) {
    await prisma.user.update({
      where: { id: eckfeldt.id },
      data: {
        balance: 1000,
        isAdmin: true,
      }
    })
    console.log('✅ Reset Eckfeldt balance to 1000 points')
  }

  console.log('\n✨ Production database cleaned!')
  console.log('📊 Remaining: 1 user (Eckfeldt as admin)')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

