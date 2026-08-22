import { PrismaClient } from './lib/generated'
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.osgzexcxofrciuwvxtmv:asv1srO0YWp1UPXT@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
})

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'bikiengahassan43@gmail.com' },
    include: { school: true }
  })
  console.log("USER DATA:", JSON.stringify(user, null, 2))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
