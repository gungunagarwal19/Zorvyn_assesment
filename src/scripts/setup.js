const { connectDB, disconnectDB } = require('../utils/database');

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    await connectDB();
    console.log('✓ Database connection successful');

    await disconnectDB();
    console.log('✓ Database setup complete');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
