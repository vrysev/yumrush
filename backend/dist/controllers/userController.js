"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserById = exports.getUserById = exports.updateUserAdminStatus = exports.createAdminUser = exports.getUsers = exports.updateUserProfile = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
// Generate JWT
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || 'mysecretkey123', {
        expiresIn: '30d'
    });
};
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, isAdmin } = req.body;
    try {
        // Check if user exists
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // Create user (optionally as admin if specified in request)
        const user = yield User_1.default.create({
            name,
            email,
            password,
            isAdmin: isAdmin || false, // Only set to true if explicitly requested
        });
        if (user) {
            const userDoc = user;
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
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.registerUser = registerUser;
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find user
        const user = yield User_1.default.findOne({ email });
        // Check if user exists and password matches
        if (user && (yield user.matchPassword(password))) {
            const userDoc = user;
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
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.loginUser = loginUser;
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const user = yield User_1.default.findById(req.user._id);
        if (user) {
            const userDoc = user;
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
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserProfile = getUserProfile;
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const user = yield User_1.default.findById(req.user._id);
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
            const updatedUser = yield user.save();
            const userDoc = updatedUser;
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
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateUserProfile = updateUserProfile;
// @desc    Get all users
// @route   GET /api/users
// @access  Admin
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const adminUser = yield User_1.default.findById(req.user._id);
        if (!(adminUser === null || adminUser === void 0 ? void 0 : adminUser.isAdmin)) {
            res.status(401).json({ message: 'Not authorized as admin' });
            return;
        }
        const users = yield User_1.default.find({}).select('-password');
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUsers = getUsers;
// @desc    Create admin user (if no admin user exists)
// @route   POST /api/users/create-admin
// @access  Public (but can only be used once)
const createAdminUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if any admin user already exists
        const adminExists = yield User_1.default.findOne({ isAdmin: true });
        if (adminExists) {
            res.status(400).json({ message: 'Admin user already exists' });
            return;
        }
        const { name, email, password } = req.body;
        // Create admin user
        const adminUser = yield User_1.default.create({
            name,
            email,
            password,
            isAdmin: true
        });
        if (adminUser) {
            const userDoc = adminUser;
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
        }
        else {
            res.status(400).json({ message: 'Invalid admin user data' });
        }
    }
    catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createAdminUser = createAdminUser;
// @desc    Update user admin status
// @route   PATCH /api/users/:id
// @access  Admin
const updateUserAdminStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user making the request is an admin
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const adminUser = yield User_1.default.findById(req.user._id);
        if (!(adminUser === null || adminUser === void 0 ? void 0 : adminUser.isAdmin)) {
            res.status(401).json({ message: 'Not authorized as admin' });
            return;
        }
        // Validate user ID
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }
        // Get user to update
        const user = yield User_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Check if isAdmin field is provided
        if (req.body.isAdmin === undefined) {
            res.status(400).json({ message: 'isAdmin field is required' });
            return;
        }
        // Update isAdmin status
        user.isAdmin = Boolean(req.body.isAdmin);
        // Save updated user
        const updatedUser = yield user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            address: updatedUser.address,
            city: updatedUser.city,
            postalCode: updatedUser.postalCode,
            country: updatedUser.country,
            phone: updatedUser.phone,
        });
    }
    catch (error) {
        console.error('Update user admin status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateUserAdminStatus = updateUserAdminStatus;
// @desc    Get user by ID (admin only)
// @route   GET /api/users/:id
// @access  Admin
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user making the request is an admin
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const adminUser = yield User_1.default.findById(req.user._id);
        if (!(adminUser === null || adminUser === void 0 ? void 0 : adminUser.isAdmin)) {
            res.status(401).json({ message: 'Not authorized as admin' });
            return;
        }
        // Validate user ID
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }
        // Get user by ID
        const user = yield User_1.default.findById(req.params.id).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserById = getUserById;
// @desc    Update user by ID (admin only)
// @route   PUT /api/users/:id
// @access  Admin
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user making the request is an admin
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const adminUser = yield User_1.default.findById(req.user._id);
        if (!(adminUser === null || adminUser === void 0 ? void 0 : adminUser.isAdmin)) {
            res.status(401).json({ message: 'Not authorized as admin' });
            return;
        }
        // Validate user ID
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }
        // Get user to update
        const user = yield User_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Update user fields if provided
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
        user.address = req.body.address !== undefined ? req.body.address : user.address;
        user.city = req.body.city !== undefined ? req.body.city : user.city;
        user.postalCode = req.body.postalCode !== undefined ? req.body.postalCode : user.postalCode;
        user.country = req.body.country !== undefined ? req.body.country : user.country;
        user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
        if (req.body.password) {
            user.password = req.body.password;
        }
        // Save updated user
        const updatedUser = yield user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            address: updatedUser.address,
            city: updatedUser.city,
            postalCode: updatedUser.postalCode,
            country: updatedUser.country,
            phone: updatedUser.phone,
        });
    }
    catch (error) {
        console.error('Update user by ID error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateUserById = updateUserById;
