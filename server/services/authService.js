import crypto from 'crypto';
import { JWT_SECRET } from '../config/env.js';

/**
 * Sign a payload using HMAC-SHA256 and return a token.
 * @param {object} payload - The token payload (e.g., { email, exp })
 * @returns {string} The signed token string
 */
export const signToken = (payload) => {
  const part1 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(part1)
    .digest('base64url');
  return `${part1}.${signature}`;
};

/**
 * Verify a token and return the payload if valid.
 * @param {string} token - The signed token string
 * @returns {object|null} The decoded payload or null if invalid/expired
 */
export const verifyToken = (token) => {
  if (!token || typeof token !== 'string') return null;
  
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  
  const [part1, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(part1)
    .digest('base64url');
    
  if (signature !== expectedSignature) {
    return null; // Signature mismatch
  }
  
  try {
    const payload = JSON.parse(Buffer.from(part1, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Token has expired
    }
    return payload;
  } catch (error) {
    return null; // Parsing error
  }
};
