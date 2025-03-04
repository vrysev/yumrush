import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

// Generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'mysecretkey123', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, isAdmin } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create user (optionally as admin if specified in request)
    const user = await User.create({
      name,
      email,
      password,
      isAdmin: isAdmin || false, // Only set to true if explicitly requested
    });

    if (user) {
      const userDoc = user as unknown as IUser;
      res.status(201).json({
        _id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        isAdmin: userDoc.isAdmin,
        address: userDoc.address,
        city: userDoc.city,
        postalCode: userDoc.postalCode,
        country: userDoc.country,
        phone: userDoc.phone,
        token: generateToken(userDoc._id.toString())
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      const userDoc = user as unknown as IUser;
      res.json({
        _id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        isAdmin: userDoc.isAdmin,
        address: userDoc.address,
        city: userDoc.city,
        postalCode: userDoc.postalCode,
        country: userDoc.country,
        phone: userDoc.phone,
        token: generateToken(userDoc._id.toString())
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const user = await User.findById(req.user._id);

    if (user) {
      const userDoc = user as unknown as IUser;
      res.json({
        _id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        isAdmin: userDoc.isAdmin,
        address: userDoc.address,
        city: userDoc.city,
        postalCode: userDoc.postalCode,
        country: userDoc.country,
        phone: userDoc.phone,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.address = req.body.address !== undefined ? req.body.address : user.address;
      user.city = req.body.city !== undefined ? req.body.city : user.city;
      user.postalCode = req.body.postalCode !== undefined ? req.body.postalCode : user.postalCode;
      user.country = req.body.country !== undefined ? req.body.country : user.country;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const userDoc = updatedUser as unknown as IUser;

      res.json({
        _id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        isAdmin: userDoc.isAdmin,
        address: userDoc.address,
        city: userDoc.city,
        postalCode: userDoc.postalCode,
        country: userDoc.country,
        phone: userDoc.phone,
        token: generateToken(userDoc._id.toString())
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const adminUser = await User.findById(req.user._id);
    
    if (!adminUser?.isAdmin) {
      res.status(401).json({ message: 'Not authorized as admin' });
      return;
    }

    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create admin user (if no admin user exists)
// @route   POST /api/users/create-admin
// @access  Public (but can only be used once)
export const createAdminUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if any admin user already exists
    const adminExists = await User.findOne({ isAdmin: true });
    
    if (adminExists) {
      res.status(400).json({ message: 'Admin user already exists' });
      return;
    }
    
    const { name, email, password } = req.body;
    
    // Create admin user
    const adminUser = await User.create({
      name,
      email,
      password,
      isAdmin: true
    });
    
    if (adminUser) {
      const userDoc = adminUser as unknown as IUser;
      res.status(201).json({
        _id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        isAdmin: userDoc.isAdmin,
        address: userDoc.address,
        city: userDoc.city,
        postalCode: userDoc.postalCode,
        country: userDoc.country,
        phone: userDoc.phone,
        token: generateToken(userDoc._id.toString())
      });
    } else {
      res.status(400).json({ message: 'Invalid admin user data' });
    }
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};