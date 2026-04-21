import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Countdown helper ─────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function countdown(seconds: number): Promise<void> {
  for (let i = seconds; i > 0; i--) {
    process.stdout.write(`\r⏳  Deleting in ${i}... (Ctrl+C to cancel) `);
    await sleep(1000);
  }
  process.stdout.write('\r\n');
}

// ─── Wipe all tables ──────────────────────────────────────────────────────────
async function wipeDatabase(): Promise<void> {
  console.log('🗑️  Deleting all data...\n');

  // Order matters: children before parents (FK constraints)
  await prisma.quoteRequestItem.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.syncLog.deleteMany();
  await prisma.translation.deleteMany();
  await prisma.productSku.deleteMany();
  await prisma.colorPackshot.deleteMany();
  await prisma.productColor.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.emailVerification.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.user.deleteMany();
  await prisma.language.deleteMany();

  console.log('✅ All tables cleared.\n');
}

// ─── Seed languages ───────────────────────────────────────────────────────────
async function seedLanguages(): Promise<void> {
  await prisma.language.createMany({
    data: [
      { code: 'nl', name: 'Nederlands' },
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
      { code: 'de', name: 'Deutsch' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Languages seeded (nl, en, fr, de).');
}

// ─── Seed admin ───────────────────────────────────────────────────────────────
async function seedAdmin(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      '❌  ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables.',
    );
  }

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

  console.log(`✅ Admin "${adminEmail}" created.\n`);
  console.log('─────────────────────────────────────────────');
  console.log(`  Email    : ${adminEmail}`);
  console.log(`  Password : ${adminPassword}`);
  console.log('─────────────────────────────────────────────');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║           ⚠️   DANGER — FULL DATABASE RESET   ⚠️          ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log('║  This command will DELETE ALL data from every table.     ║');
  console.log('║  Only the admin account will be re-created afterwards.   ║');
  console.log('║                                                          ║');
  console.log('║  Press Ctrl+C NOW to cancel.                             ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('\n');

  await countdown(10);

  console.log('🚀 Starting reset...\n');

  await wipeDatabase();
  await seedLanguages();
  await seedAdmin();

  console.log('\n🌱 Reset complete. Database is fresh with admin only.');
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
