import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Starting database reset...')

  // Delete in order due to foreign key constraints
  console.log('Deleting trades...')
  const deletedTrades = await prisma.trade.deleteMany()
  console.log(`✅ Deleted ${deletedTrades.count} trades`)

  console.log('Deleting markets...')
  const deletedMarkets = await prisma.market.deleteMany()
  console.log(`✅ Deleted ${deletedMarkets.count} markets`)

  console.log('Deleting users...')
  const deletedUsers = await prisma.user.deleteMany()
  console.log(`✅ Deleted ${deletedUsers.count} users`)

  console.log('✨ Database reset complete!')
  console.log('\n📝 Note: When you create a new account, you can make it admin with:')
  console.log('   npx tsx scripts/make-admin.ts <username>')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

