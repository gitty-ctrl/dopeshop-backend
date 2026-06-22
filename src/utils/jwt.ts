import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'change-this-too';

export const JwtUtils = {
  generateToken(payload: AuthPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  },

  generateRefreshToken(payload: AuthPayload): string {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });
  },

  verifyToken(token: string): AuthPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as AuthPayload;
    } catch {
      return null;
    }
  },

  verifyRefreshToken(token: string): AuthPayload | null {
    try {
      return jwt.verify(token, REFRESH_SECRET) as AuthPayload;
    } catch {
      return null;
    }
  },

  decodeToken(token: string): AuthPayload | null {
    try {
      return jwt.decode(token) as AuthPayload;
    } catch {
      return null;
    }
  },
};