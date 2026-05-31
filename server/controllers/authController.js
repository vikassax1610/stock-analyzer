import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config/env.js';
import { signToken } from '../services/authService.js';

/**
 * Handle direct admin login
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    // Direct check against our single allowed user (normalized to lowercase)
    if (
      email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
      password !== ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Sign token with 24 hours expiry
    const token = signToken({
      email: ADMIN_EMAIL,
      exp: Date.now() + 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        email: ADMIN_EMAIL,
      },
    });
  } catch (error) {
    next(error);
  }
};
