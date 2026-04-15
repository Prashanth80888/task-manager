import express from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/authController.js';
import validate from '../middleware/validateMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * responses:
 * 201:
 * description: Success
 */
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

/**
 * @swagger
 * /api/v1/auth/login:
 * post:
 * summary: Login user
 * tags: [Auth]
 * responses:
 * 200:
 * description: Success
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').exists().withMessage('Password is required'),
    validate
  ],
  login
);

export default router;