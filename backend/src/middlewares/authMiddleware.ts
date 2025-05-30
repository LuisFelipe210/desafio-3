import { Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';
import { AuthenticatedRequest } from '@/interfaces';
import { ApiError } from '@/utils/errorHandler';

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Not authorized, no token'));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new ApiError(401, 'Not authorized, no token provided after Bearer'));
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return next(new ApiError(401, 'Not authorized, token failed'));
  }

  req.user = { id: decoded.id, email: decoded.email };
  next();
};