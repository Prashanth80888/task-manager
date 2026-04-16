import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 1. Protect Middleware: Ensures the user is logged in
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// 2. Admin Middleware: Ensures the logged-in user is an Admin (NEW)
export const admin = (req, res, next) => {
  // Check if req.user exists (set by protect) and if the role is admin
  if (req.user && req.user.role === 'admin') {
    next(); // Access granted
  } else {
    // 403 Forbidden: The server understands the request but refuses to authorize it
    return res.status(403).json({ 
      message: 'ACCESS_DENIED: Admin privileges required for this operation.' 
    });
  }
};