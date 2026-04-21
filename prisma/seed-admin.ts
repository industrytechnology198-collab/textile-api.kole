import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      '❌  ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables.',
    );
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Delete all existing admin accounts
  const deleted = await prisma.user.deleteMany({ where: { role: Role.ADMIN } });
  console.log(`🗑️  Removed ${deleted.count} existing admin account(s).`);

  // Create the new admin from env
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

  console.log('─────────────────────────────────────────────');
  console.log(`✅ New admin created.`);
  console.log(`  Email    : ${adminEmail}`);
  console.log(`  Password : ${adminPassword}`);
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
