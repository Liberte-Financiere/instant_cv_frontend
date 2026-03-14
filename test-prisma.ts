import { prisma } from './lib/prisma';
async function run() {
  const cvs = await prisma.cV.findMany({ take: 5 });
  console.log("Done");
}
run();
