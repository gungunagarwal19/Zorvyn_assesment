const { getDB } = require('../utils/database');
const AppError = require('../utils/appError');
const { generateToken } = require('../utils/jwt');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

class UserService {
  async createUser(userData, role = 'VIEWER') {
    const { email, password, name } = userData;
    const db = getDB();
    const usersCollection = db.collection('User');

    try {
      // Check if email already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        throw new AppError('Email already in use.', 409);
      }

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await usersCollection.insertOne({
        email,
        password: hashedPassword,
        name,
        role: role,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return {
        id: user.insertedId,
        email,
        name,
        role: role
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    const db = getDB();
    const usersCollection = db.collection('User');
    return usersCollection.findOne({ email });
  }

  async getUserById(userId) {
    const db = getDB();
    const usersCollection = db.collection('User');
    return usersCollection.findOne({ _id: new ObjectId(userId) });
  }

  async getAllUsers(page = 1, limit = 10) {
    const db = getDB();
    const usersCollection = db.collection('User');
    const skip = (page - 1) * limit;

    const users = await usersCollection
      .find({}, {
        projection: {
          email: 1,
          name: 1,
          role: 1,
          status: 1,
          createdAt: 1
        }
      })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await usersCollection.countDocuments();

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateUserRole(userId, newRole) {
    const db = getDB();
    const usersCollection = db.collection('User');

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role: newRole, updatedAt: new Date() } }
    );

    return usersCollection.findOne({ _id: new ObjectId(userId) });
  }

  async updateUserStatus(userId, newStatus) {
    const db = getDB();
    const usersCollection = db.collection('User');

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { status: newStatus, updatedAt: new Date() } }
    );

    return usersCollection.findOne({ _id: new ObjectId(userId) });
  }

  async authenticateUser(email, password) {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    // Compare passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password.', 401);
    }

    if (user.status === 'INACTIVE') {
      throw new AppError('User account is inactive.', 403);
    }

    const token = generateToken(user._id.toString());

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }
}

module.exports = new UserService();
