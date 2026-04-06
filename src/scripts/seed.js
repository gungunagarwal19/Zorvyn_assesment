const { connectDB, getDB, disconnectDB } = require('../utils/database');

async function seedDatabase() {
  try {
    console.log('Seeding database...');

    // Ensure DB connection
    await connectDB();
    const db = getDB();

    // Clean existing data
    await db.collection('AuditLog').deleteMany({});
    await db.collection('FinancialRecord').deleteMany({});
    await db.collection('User').deleteMany({});
    console.log('✓ Cleaned existing data');

    // Create sample users
    const adminUserRes = await db.collection('User').insertOne({
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const analystUserRes = await db.collection('User').insertOne({
      email: 'analyst@example.com',
      password: 'analyst123',
      name: 'Analyst User',
      role: 'ANALYST',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const viewerUserRes = await db.collection('User').insertOne({
      email: 'viewer@example.com',
      password: 'viewer123',
      name: 'Viewer User',
      role: 'VIEWER',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✓ Created sample users');

    // Create sample financial records for analyst
    const now = new Date();
    const records = [
      {
        userId: analystUserRes.insertedId,
        type: 'INCOME',
        category: 'SALARY',
        amount: 5000,
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        notes: 'Monthly salary',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        userId: analystUserRes.insertedId,
        type: 'INCOME',
        category: 'FREELANCE',
        amount: 1500,
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        notes: 'Project payment',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        userId: analystUserRes.insertedId,
        type: 'EXPENSE',
        category: 'GROCERY',
        amount: 200,
        date: new Date(now.getFullYear(), now.getMonth(), 3),
        notes: 'Weekly groceries',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        userId: analystUserRes.insertedId,
        type: 'EXPENSE',
        category: 'UTILITIES',
        amount: 150,
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        notes: 'Electricity and water',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        userId: analystUserRes.insertedId,
        type: 'EXPENSE',
        category: 'ENTERTAINMENT',
        amount: 50,
        date: new Date(now.getFullYear(), now.getMonth(), 10),
        notes: 'Movie tickets',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        userId: analystUserRes.insertedId,
        type: 'EXPENSE',
        category: 'TRAVEL',
        amount: 300,
        date: new Date(now.getFullYear(), now.getMonth(), 15),
        notes: 'Gas and car maintenance',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
    ];

    await db.collection('FinancialRecord').insertMany(records);

    console.log('✓ Created sample financial records');

    console.log('\n✓ Database seeding complete!');
    console.log('\nSample Users:');
    console.log('- Email: admin@example.com | Password: admin123 | Role: ADMIN');
    console.log('- Email: analyst@example.com | Password: analyst123 | Role: ANALYST');
    console.log('- Email: viewer@example.com | Password: viewer123 | Role: VIEWER');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('✗ Database seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
