import { verifyToken } from '../services/authService.js';

/**
 * Middleware to authenticate requests using secure token signatures.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Access token is missing or invalid',
      });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Access token has expired or is invalid',
      });
    }

    // Attach validated payload to request object
    req.user = payload;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error in Authentication Middleware',
    });
  }
};

export default authMiddleware;
