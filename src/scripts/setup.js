const prisma = require('../utils/database');

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Test connection
    await prisma.$executeRaw`SELECT 1`;
    console.log('✓ Database connection successful');

    console.log('✓ Database setup complete');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
