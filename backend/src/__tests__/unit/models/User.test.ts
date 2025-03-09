import mongoose from 'mongoose';
import User, { IUser } from '../../../models/User';

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/yumrush_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Disconnect after tests
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clean up after each test
    await User.deleteMany({});
  });

  it('should hash the password before saving', async () => {
    // Create a user with a plain text password
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      isAdmin: false,
    };

    const user = new User(userData);
    await user.save();

    // Retrieve the user from DB
    const savedUser = await User.findOne({ email: 'test@example.com' });
    
    // Password should be hashed and not match the original
    expect(savedUser?.password).not.toBe('password123');
    
    // Using the matchPassword method should return true for the original password
    const isMatch = await savedUser?.matchPassword('password123');
    expect(isMatch).toBe(true);
  });

  it('should validate a user with required fields', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const savedUser = await user.save();
    expect(savedUser.name).toBe('Test User');
    expect(savedUser.email).toBe('test@example.com');
    expect(savedUser.isAdmin).toBe(false); // Default value
  });

  it('should not validate a user without required fields', async () => {
    const userWithoutName = new User({
      email: 'test@example.com',
      password: 'password123',
    });

    await expect(userWithoutName.save()).rejects.toThrow();
  });
});