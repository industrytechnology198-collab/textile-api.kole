import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Mock customers ───────────────────────────────────────────────────────────
const MOCK_CUSTOMERS = [
  {
    email: 'alice.martin@example.com',
    password: 'Customer123!',
    firstName: 'Alice',
    lastName: 'Martin',
    phoneNumber: '+33 6 12 34 56 78',
    addresses: [
      {
        fullName: 'Alice Martin',
        phoneNumber: '+33 6 12 34 56 78',
        addressLine1: '12 Rue de la Paix',
        addressLine2: 'App. 3B',
        city: 'Paris',
        state: 'Île-de-France',
        postalCode: '75001',
        country: 'France',
        isDefault: true,
      },
      {
        fullName: 'Alice Martin',
        phoneNumber: '+33 6 12 34 56 78',
        addressLine1: '5 Avenue des Fleurs',
        city: 'Lyon',
        state: 'Auvergne-Rhône-Alpes',
        postalCode: '69002',
        country: 'France',
        isDefault: false,
      },
    ],
  },
  {
    email: 'bob.dupont@example.com',
    password: 'Customer123!',
    firstName: 'Bob',
    lastName: 'Dupont',
    phoneNumber: '+33 6 98 76 54 32',
    addresses: [
      {
        fullName: 'Bob Dupont',
        phoneNumber: '+33 6 98 76 54 32',
        addressLine1: '47 Boulevard Haussmann',
        city: 'Paris',
        state: 'Île-de-France',
        postalCode: '75008',
        country: 'France',
        isDefault: true,
      },
    ],
  },
  {
    email: 'claire.bernard@example.com',
    password: 'Customer123!',
    firstName: 'Claire',
    lastName: 'Bernard',
    phoneNumber: '+32 499 12 34 56',
    addresses: [
      {
        fullName: 'Claire Bernard',
        phoneNumber: '+32 499 12 34 56',
        addressLine1: 'Rue Neuve 10',
        city: 'Brussels',
        postalCode: '1000',
        country: 'Belgium',
        isDefault: true,
      },
    ],
  },
  {
    email: 'david.lefevre@example.com',
    password: 'Customer123!',
    firstName: 'David',
    lastName: 'Lefèvre',
    phoneNumber: '+33 7 11 22 33 44',
    addresses: [
      {
        fullName: 'David Lefèvre',
        phoneNumber: '+33 7 11 22 33 44',
        addressLine1: '3 Impasse du Moulin',
        city: 'Bordeaux',
        state: 'Nouvelle-Aquitaine',
        postalCode: '33000',
        country: 'France',
        isDefault: true,
      },
      {
        fullName: 'David Lefèvre',
        phoneNumber: '+33 7 11 22 33 44',
        addressLine1: 'Zone Industrielle B, Bâtiment 7',
        city: 'Mérignac',
        state: 'Nouvelle-Aquitaine',
        postalCode: '33700',
        country: 'France',
        isDefault: false,
      },
    ],
  },
  {
    email: 'emma.thomas@example.com',
    password: 'Customer123!',
    firstName: 'Emma',
    lastName: 'Thomas',
    phoneNumber: '+41 78 900 11 22',
    addresses: [
      {
        fullName: 'Emma Thomas',
        phoneNumber: '+41 78 900 11 22',
        addressLine1: 'Bahnhofstrasse 22',
        city: 'Zurich',
        postalCode: '8001',
        country: 'Switzerland',
        isDefault: true,
      },
    ],
  },
  {
    email: 'francois.moreau@example.com',
    password: 'Customer123!',
    firstName: 'François',
    lastName: 'Moreau',
    phoneNumber: '+33 6 55 44 33 22',
    addresses: [
      {
        fullName: 'François Moreau',
        phoneNumber: '+33 6 55 44 33 22',
        addressLine1: '18 Rue Victor Hugo',
        city: 'Marseille',
        state: "Provence-Alpes-Côte d'Azur",
        postalCode: '13001',
        country: 'France',
        isDefault: true,
      },
    ],
  },
  {
    email: 'grace.nguyen@example.com',
    password: 'Customer123!',
    firstName: 'Grace',
    lastName: 'Nguyen',
    phoneNumber: '+33 6 77 88 99 00',
    addresses: [
      {
        fullName: 'Grace Nguyen',
        phoneNumber: '+33 6 77 88 99 00',
        addressLine1: '9 Rue du Faubourg Saint-Antoine',
        addressLine2: 'Esc. C, 2e étage',
        city: 'Paris',
        state: 'Île-de-France',
        postalCode: '75011',
        country: 'France',
        isDefault: true,
      },
    ],
  },
  {
    email: 'hugo.simon@example.com',
    password: 'Customer123!',
    firstName: 'Hugo',
    lastName: 'Simon',
    phoneNumber: '+49 171 234 5678',
    addresses: [
      {
        fullName: 'Hugo Simon',
        phoneNumber: '+49 171 234 5678',
        addressLine1: 'Kurfürstendamm 100',
        city: 'Berlin',
        postalCode: '10709',
        country: 'Germany',
        isDefault: true,
      },
    ],
  },
  {
    email: 'isabelle.petit@example.com',
    password: 'Customer123!',
    firstName: 'Isabelle',
    lastName: 'Petit',
    phoneNumber: '+33 6 30 41 52 63',
    addresses: [
      {
        fullName: 'Isabelle Petit',
        phoneNumber: '+33 6 30 41 52 63',
        addressLine1: '25 Rue de la République',
        city: 'Nantes',
        state: 'Pays de la Loire',
        postalCode: '44000',
        country: 'France',
        isDefault: true,
      },
      {
        fullName: 'Isabelle Petit',
        phoneNumber: '+33 6 30 41 52 63',
        addressLine1: '1 Place du Capitole',
        city: 'Toulouse',
        state: 'Occitanie',
        postalCode: '31000',
        country: 'France',
        isDefault: false,
      },
    ],
  },
  {
    email: 'julien.garcia@example.com',
    password: 'Customer123!',
    firstName: 'Julien',
    lastName: 'Garcia',
    phoneNumber: '+34 612 345 678',
    addresses: [
      {
        fullName: 'Julien Garcia',
        phoneNumber: '+34 612 345 678',
        addressLine1: 'Calle Gran Via 50',
        city: 'Madrid',
        postalCode: '28013',
        country: 'Spain',
        isDefault: true,
      },
    ],
  },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────
async function main() {
  // ── Languages ─────────────────────────────────────────────────────────────
  await prisma.language.createMany({
    data: [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
      { code: 'de', name: 'Deutsch' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Languages seeded.');

  // ── Admin ──────────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables',
    );
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (existingAdmin) {
    console.log(`⚠️  Admin "${adminEmail}" already exists. Skipping.`);
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Koletex',
        isEmailVerified: true,
        provider: 'local',
        role: Role.ADMIN,
      },
    });
    console.log(`✅ Admin "${adminEmail}" created.`);
  }

  // ── Mock customers ─────────────────────────────────────────────────────────
  for (const customer of MOCK_CUSTOMERS) {
    const existing = await prisma.user.findUnique({
      where: { email: customer.email },
    });
    if (existing) {
      console.log(`⚠️  Customer "${customer.email}" already exists. Skipping.`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(customer.password, 10);

    await prisma.user.create({
      data: {
        email: customer.email,
        password: hashedPassword,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phoneNumber,
        isEmailVerified: true,
        provider: 'local',
        role: Role.CUSTOMER,
        addresses: {
          create: customer.addresses,
        },
      },
    });

    console.log(
      `✅ Customer "${customer.email}" created with ${customer.addresses.length} address(es).`,
    );
  }

  console.log('\n🌱 Seed complete.');
  console.log('─────────────────────────────────────────────');
  console.log(`Admin  : ${adminEmail}  /  ${adminPassword}`);
  console.log('Customers password (all): Customer123!');
  console.log('─────────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
