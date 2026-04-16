import express from 'express';
import { body } from 'express-validator';
import { register, login, getAllUsers, deleteUser } from '../controllers/authController.js'; // Added new controllers
import validate from '../middleware/validateMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // Added auth middlewares

const router = express.Router();

// @route   POST /api/v1/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Min 6 characters'),
    validate
  ],
  register
);

// @route   POST /api/v1/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').exists().withMessage('Password is required'),
    validate
  ],
  login
);

// --- ADMIN ROUTES (NEW) ---

// @desc    Get all users for the Identity Ledger
// @route   GET /api/v1/auth/admin/users
router.get('/admin/users', protect, admin, getAllUsers);

// @desc    Delete a user from the system
// @route   DELETE /api/v1/auth/admin/users/:id
router.delete('/admin/users/:id', protect, admin, deleteUser);

// --------------------------

export default router;