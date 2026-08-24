import { prisma } from '../lib/prisma';

async function main() {
  const args = process.argv.slice(2);
  const email = args[0];

  if (!email) {
    console.error('Erreur : Vous devez fournir l\'adresse email du recruteur.');
    console.log('Usage : npx tsx scripts/seed-recruiter.ts <email>');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`Erreur : Aucun utilisateur trouvé avec l'email ${email}`);
    process.exit(1);
  }

  if (user.role !== 'RECRUITER' && user.role !== 'ADMIN') {
    console.error(`Erreur : L'utilisateur ${email} n'est pas un recruteur ou un admin.`);
    process.exit(1);
  }

  console.log(`Seeding data for recruiter: ${user.name || user.email} (${user.id})...`);

  // 1. Offres d'emploi
  const job1 = await prisma.jobOffer.create({
    data: {
      title: 'Développeur Fullstack React / Node.js',
      company: user.name || 'Entreprise Test',
      location: 'Ouagadougou, Burkina Faso',
      type: 'CDI',
      description: "Nous recherchons un développeur passionné pour rejoindre notre équipe tech. Vous travaillerez sur des projets innovants et à fort impact.",
      requirements: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
      salary: '600 000 - 800 000 FCFA',
      applyMethod: 'URL',
      applyUrlOrMail: 'https://example.com/apply/1',
      status: 'ACTIVE',
      recruiterId: user.id,
      viewsCount: 142,
    }
  });

  const job2 = await prisma.jobOffer.create({
    data: {
      title: 'Product Manager Senior',
      company: user.name || 'Entreprise Test',
      location: 'Dakar, Sénégal (Remote possible)',
      type: 'CDI',
      description: "En tant que Product Manager, vous serez responsable de la vision produit et travaillerez en étroite collaboration avec l'équipe de développement.",
      requirements: ['Agile', 'Jira', 'UX/UI', 'Stratégie Produit'],
      salary: '1 000 000 - 1 500 000 FCFA',
      applyMethod: 'EMAIL',
      applyUrlOrMail: 'recrutement@example.com',
      status: 'ACTIVE',
      recruiterId: user.id,
      viewsCount: 89,
    }
  });

  const job3 = await prisma.jobOffer.create({
    data: {
      title: 'Stagiaire UX/UI Designer',
      company: user.name || 'Entreprise Test',
      location: 'Abidjan, Côte d\'Ivoire',
      type: 'Stage',
      description: "Nous cherchons un(e) stagiaire créatif(ve) pour nous aider à améliorer l'expérience utilisateur de notre plateforme SaaS.",
      requirements: ['Figma', 'Prototypage', 'Design Thinking'],
      applyMethod: 'EMAIL',
      applyUrlOrMail: 'design@example.com',
      status: 'CLOSED', // Pour tester l'affichage des annonces fermées
      recruiterId: user.id,
      viewsCount: 230,
    }
  });

  console.log('✅ 3 offres d\'emploi créées.');

  // 2. Candidatures
  const fakeApplications = [
    {
      jobOfferId: job1.id,
      firstName: 'Alice',
      lastName: 'Ouedraogo',
      email: 'alice.ouedraogo@example.com',
      phone: '+226 70 00 00 01',
      cvUrl: 'https://example.com/cv-alice.pdf',
      status: 'NEW',
      experienceYears: 4,
      profileSummary: 'Développeuse fullstack avec 4 ans d\'expérience sur React et Node. Passionnée par le web.',
    },
    {
      jobOfferId: job1.id,
      firstName: 'Bob',
      lastName: 'Diop',
      email: 'bob.diop@example.com',
      phone: '+221 77 000 00 02',
      cvUrl: 'https://example.com/cv-bob.pdf',
      status: 'REVIEWING',
      experienceYears: 2,
      profileSummary: 'Junior très motivé. J\'ai travaillé sur 3 projets React en freelance.',
    },
    {
      jobOfferId: job2.id,
      firstName: 'Charlie',
      lastName: 'Kouamé',
      email: 'charlie.kouame@example.com',
      phone: '+225 07 00 00 00 03',
      cvUrl: 'https://example.com/cv-charlie.pdf',
      status: 'RETAINED',
      experienceYears: 6,
      profileSummary: 'Product Manager avec une solide expérience en SaaS B2B.',
    },
    {
      jobOfferId: job3.id,
      firstName: 'Diana',
      lastName: 'Traoré',
      email: 'diana.traore@example.com',
      phone: '+226 76 00 00 04',
      cvUrl: 'https://example.com/cv-diana.pdf',
      status: 'REJECTED',
      experienceYears: 0,
      profileSummary: 'Étudiante en Master Design à la recherche d\'un stage de fin d\'études.',
    }
  ];

  for (const app of fakeApplications) {
    await prisma.jobApplication.create({ data: app });
  }

  console.log('✅ 4 candidatures créées.');
  console.log('Seeding terminé avec succès ! 🎉');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
