const prisma = require('../utils/database');

async function seedDatabase() {
  try {
    console.log('Seeding database...');

    // Clean existing data
    await prisma.auditLog.deleteMany();
    await prisma.financialRecord.deleteMany();
    await prisma.user.deleteMany();
    console.log('✓ Cleaned existing data');

    // Create sample users
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: 'admin123', // Not hashed for demo
        name: 'Admin User',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });

    const analystUser = await prisma.user.create({
      data: {
        email: 'analyst@example.com',
        password: 'analyst123',
        name: 'Analyst User',
        role: 'ANALYST',
        status: 'ACTIVE'
      }
    });

    const viewerUser = await prisma.user.create({
      data: {
        email: 'viewer@example.com',
        password: 'viewer123',
        name: 'Viewer User',
        role: 'VIEWER',
        status: 'ACTIVE'
      }
    });

    console.log('✓ Created sample users');

    // Create sample financial records for analyst
    const now = new Date();
    const records = [
      {
        userId: analystUser.id,
        type: 'INCOME',
        category: 'SALARY',
        amount: 5000,
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        notes: 'Monthly salary'
      },
      {
        userId: analystUser.id,
        type: 'INCOME',
        category: 'FREELANCE',
        amount: 1500,
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        notes: 'Project payment'
      },
      {
        userId: analystUser.id,
        type: 'EXPENSE',
        category: 'GROCERY',
        amount: 200,
        date: new Date(now.getFullYear(), now.getMonth(), 3),
        notes: 'Weekly groceries'
      },
      {
        userId: analystUser.id,
        type: 'EXPENSE',
        category: 'UTILITIES',
        amount: 150,
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        notes: 'Electricity and water'
      },
      {
        userId: analystUser.id,
        type: 'EXPENSE',
        category: 'ENTERTAINMENT',
        amount: 50,
        date: new Date(now.getFullYear(), now.getMonth(), 10),
        notes: 'Movie tickets'
      },
      {
        userId: analystUser.id,
        type: 'EXPENSE',
        category: 'TRAVEL',
        amount: 300,
        date: new Date(now.getFullYear(), now.getMonth(), 15),
        notes: 'Gas and car maintenance'
      }
    ];

    await prisma.financialRecord.createMany({
      data: records
    });

    console.log('✓ Created sample financial records');

    console.log('\n✓ Database seeding complete!');
    console.log('\nSample Users:');
    console.log('- Email: admin@example.com | Password: admin123 | Role: ADMIN');
    console.log('- Email: analyst@example.com | Password: analyst123 | Role: ANALYST');
    console.log('- Email: viewer@example.com | Password: viewer123 | Role: VIEWER');

    process.exit(0);
  } catch (error) {
    console.error('✗ Database seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
