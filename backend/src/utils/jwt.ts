import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '@/config/env';

interface JwtPayload {
  id: number;
  email: string;
}

export const generateToken = (payload: JwtPayload): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined. Check .env');
  }

  const secret: Secret = JWT_SECRET;

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN, // e.g. '1d' or 3600
  };

  try {
    return jwt.sign(payload, secret, options);
  } catch (error) {
    console.error('Error signing JWT:', error);
    throw new Error('Failed to sign JWT.');
  }
};

export const verifyToken = (token: string): JwtPayload | null => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined for verification. Check .env');
  }

  const secret: Secret = JWT_SECRET;

  try {
    const decoded = jwt.verify(token, secret);
    return decoded as JwtPayload;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Invalid JWT:', error);
    }
    return null;
  }
};
