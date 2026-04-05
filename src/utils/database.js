const { MongoClient } = require('mongodb');

let db;
let client;

const connectDB = async () => {
  if (db) {
    return db;
  }

  try {
    const mongoURL = process.env.DATABASE_URL || 'mongodb://localhost:27017/zorvyn';
    client = new MongoClient(mongoURL);
    await client.connect();
    
    db = client.db();
    console.log('✓ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    throw error;
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return db;
};

const disconnectDB = async () => {
  if (client) {
    await client.close();
    db = null;
    client = null;
    console.log('✓ Disconnected from MongoDB');
  }
};

module.exports = {
  connectDB,
  getDB,
  disconnectDB
};
