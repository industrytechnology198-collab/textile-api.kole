import { PrismaClient, Role, QuoteStatus } from '@prisma/client';
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

  // ── Quote requests (dashboard test data) ──────────────────────────────────
  console.log('\n⏳ Seeding quote requests for dashboard testing...');

  // 1. Check that SKUs exist (requires Toptex sync to have run first)
  const availableSkus = await prisma.productSku.findMany({
    where: { saleState: 'active', isDiscontinued: false },
    select: { id: true, price: true },
    take: 20,
  });

  if (availableSkus.length === 0) {
    console.log('⚠️  No active SKUs found in database.');
    console.log('   Please run the Toptex sync first, then re-run the seed.');
    console.log('   Skipping quote request seeding.');
  } else {
    console.log(`   Found ${availableSkus.length} SKU(s) to use.`);

    // 2. Load all seeded customers with their default address
    const customers = await prisma.user.findMany({
      where: { role: Role.CUSTOMER },
      include: { addresses: { where: { isDefault: true }, take: 1 } },
    });

    const eligibleCustomers = customers.filter((c) => c.addresses.length > 0);

    if (eligibleCustomers.length === 0) {
      console.log('⚠️  No customers with addresses found. Skipping quote seeding.');
    } else {
      // Check if quotes already seeded
      const existingQuoteCount = await prisma.quoteRequest.count();
      if (existingQuoteCount >= 20) {
        console.log(`⚠️  ${existingQuoteCount} quote request(s) already exist. Skipping.`);
      } else {
        // Helper: pick a random item from an array
        const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

        // Helper: date N days ago
        const daysAgo = (n: number): Date => {
          const d = new Date();
          d.setDate(d.getDate() - n);
          return d;
        };

        // 3. Define 20 quote scenarios spread across 3 months
        //    Each scenario: customer index, status, isPaid, daysAgo created, daysAgo paid
        type Scenario = {
          customerIndex: number;
          status: QuoteStatus;
          isPaid: boolean;
          createdDaysAgo: number;
          paidDaysAgo?: number;
          skuCount: number; // how many different SKUs in this quote
          quantities: number[]; // quantity per SKU
        };

        const scenarios: Scenario[] = [
          // ── DELIVERED + paid (old, high value) ─────────────────────────
          { customerIndex: 0, status: QuoteStatus.DELIVERED, isPaid: true,  createdDaysAgo: 90, paidDaysAgo: 82, skuCount: 3, quantities: [50, 30, 20] },
          { customerIndex: 1, status: QuoteStatus.DELIVERED, isPaid: true,  createdDaysAgo: 75, paidDaysAgo: 67, skuCount: 2, quantities: [40, 40] },
          { customerIndex: 2, status: QuoteStatus.DELIVERED, isPaid: true,  createdDaysAgo: 60, paidDaysAgo: 53, skuCount: 2, quantities: [25, 25] },
          { customerIndex: 0, status: QuoteStatus.DELIVERED, isPaid: true,  createdDaysAgo: 55, paidDaysAgo: 48, skuCount: 1, quantities: [60] },
          { customerIndex: 3, status: QuoteStatus.DELIVERED, isPaid: true,  createdDaysAgo: 45, paidDaysAgo: 38, skuCount: 3, quantities: [20, 30, 10] },

          // ── SHIPPED + paid ───────────────────────────────────────────────
          { customerIndex: 1, status: QuoteStatus.SHIPPED,   isPaid: true,  createdDaysAgo: 35, paidDaysAgo: 28, skuCount: 2, quantities: [30, 20] },
          { customerIndex: 4, status: QuoteStatus.SHIPPED,   isPaid: true,  createdDaysAgo: 20, paidDaysAgo: 14, skuCount: 1, quantities: [50] },

          // ── PROCESSING + paid ────────────────────────────────────────────
          { customerIndex: 2, status: QuoteStatus.PROCESSING, isPaid: true, createdDaysAgo: 18, paidDaysAgo: 12, skuCount: 2, quantities: [40, 20] },
          // Stuck in PROCESSING > 7 days (feeds action queue alert)
          { customerIndex: 5, status: QuoteStatus.PROCESSING, isPaid: true, createdDaysAgo: 25, paidDaysAgo: 18, skuCount: 1, quantities: [30] },

          // ── CONFIRMED + paid but not advanced (feeds action queue) ───────
          { customerIndex: 0, status: QuoteStatus.CONFIRMED, isPaid: true,  createdDaysAgo: 10, paidDaysAgo: 5,  skuCount: 2, quantities: [20, 20] },
          { customerIndex: 6, status: QuoteStatus.CONFIRMED, isPaid: true,  createdDaysAgo: 8,  paidDaysAgo: 3,  skuCount: 1, quantities: [40] },

          // ── CONFIRMED + unpaid (feeds action queue — chase payment) ──────
          { customerIndex: 1, status: QuoteStatus.CONFIRMED, isPaid: false, createdDaysAgo: 12, skuCount: 2, quantities: [30, 15] },
          { customerIndex: 3, status: QuoteStatus.CONFIRMED, isPaid: false, createdDaysAgo: 7,  skuCount: 1, quantities: [50] },
          { customerIndex: 7, status: QuoteStatus.CONFIRMED, isPaid: false, createdDaysAgo: 5,  skuCount: 2, quantities: [20, 30] },

          // ── PENDING (feeds action queue — needs admin response) ──────────
          { customerIndex: 4, status: QuoteStatus.PENDING,   isPaid: false, createdDaysAgo: 3,  skuCount: 1, quantities: [25] },
          { customerIndex: 5, status: QuoteStatus.PENDING,   isPaid: false, createdDaysAgo: 2,  skuCount: 2, quantities: [10, 20] },
          { customerIndex: 8, status: QuoteStatus.PENDING,   isPaid: false, createdDaysAgo: 1,  skuCount: 1, quantities: [30] },
          { customerIndex: 9, status: QuoteStatus.PENDING,   isPaid: false, createdDaysAgo: 1,  skuCount: 2, quantities: [15, 25] },
          { customerIndex: 2, status: QuoteStatus.PENDING,   isPaid: false, createdDaysAgo: 0,  skuCount: 1, quantities: [40] },

          // ── CANCELLED ────────────────────────────────────────────────────
          { customerIndex: 6, status: QuoteStatus.CANCELLED, isPaid: false, createdDaysAgo: 50, skuCount: 1, quantities: [20] },
        ];

        let quoteCount = 0;
        for (const s of scenarios) {
          const customer = eligibleCustomers[s.customerIndex % eligibleCustomers.length];
          const address = customer.addresses[0];

          // Pick SKUs for this quote (random, no duplicates)
          const shuffled = [...availableSkus].sort(() => Math.random() - 0.5);
          const chosenSkus = shuffled.slice(0, Math.min(s.skuCount, shuffled.length));

          const items = chosenSkus.map((sku, i) => ({
            skuId: sku.id,
            quantity: s.quantities[i] ?? 10,
            unitPrice: Number(sku.price) * 2, // ×2 markup as per schema comment
          }));

          const totalPrice = items.reduce(
            (sum, item) => sum + item.unitPrice * item.quantity,
            0,
          );

          const createdAt = daysAgo(s.createdDaysAgo);
          const confirmedAt =
            s.status !== QuoteStatus.PENDING && s.status !== QuoteStatus.CANCELLED
              ? daysAgo(s.createdDaysAgo - 1)
              : undefined;
          const paidAt = s.isPaid && s.paidDaysAgo !== undefined
            ? daysAgo(s.paidDaysAgo)
            : undefined;

          await prisma.quoteRequest.create({
            data: {
              userId: customer.id,
              addressId: address.id,
              status: s.status,
              totalPrice,
              isPaid: s.isPaid,
              ...(paidAt && { paidAt }),
              ...(confirmedAt && { confirmedAt }),
              createdAt,
              updatedAt: paidAt ?? confirmedAt ?? createdAt,
              items: { create: items },
            },
          });
          quoteCount++;
        }

        console.log(`✅ ${quoteCount} quote request(s) created.`);
      }
    }
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
