import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    // We destructure adminSecret here so we can use it for checking
    const { name, email, password, role, adminSecret } = req.body;

    // Pulling from .env for security
    const MASTER_ADMIN_KEY = process.env.ADMIN_SECRET_KEY;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // --- ADMIN SECURITY LOGIC ---
    let finalRole = 'user'; 
    
    if (role === 'admin') {
      // If the .env key is missing or the input doesn't match, block it
      if (!MASTER_ADMIN_KEY || adminSecret !== MASTER_ADMIN_KEY) {
        return res.status(403).json({ 
          message: 'Invalid Admin Secret Key. Access Denied.' 
        });
      }
      finalRole = 'admin';
    }

    // Create user - We pass ONLY the fields defined in the Schema
    // This prevents the "422 Unprocessable Entity" error
    const user = await User.create({
      name,
      email,
      password,
      role: finalRole
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    // If it is a validation error, this will show you exactly which field failed
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get all users - ADMIN ONLY
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Don't send passwords!
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user - ADMIN ONLY
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user && user.role !== 'admin') { // Prevent admin from deleting themselves
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found or is an Admin' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};