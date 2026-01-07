import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function makeAdmin(username: string) {
  try {
    const user = await prisma.user.update({
      where: { username },
      data: { isAdmin: true },
    })
    console.log(`✅ ${user.username} is now an admin!`)
  } catch (error: any) {
    if (error.code === 'P2025') {
      console.error(`❌ User "${username}" not found`)
    } else {
      console.error('Error:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Get username from command line argument
const username = process.argv[2]

if (!username) {
  console.log('Usage: npx tsx scripts/make-admin.ts <username>')
  console.log('Example: npx tsx scripts/make-admin.ts Master')
  process.exit(1)
}

makeAdmin(username)

