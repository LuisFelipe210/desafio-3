import { Request, Response, NextFunction } from 'express';
import { registerUserService, loginUserService } from './auth.service';
import { ApiError } from '@/utils/errorHandler';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError(400, 'Email and password are required'));
  }
  if (password.length < 6) {
    return next(new ApiError(400, 'Password must be at least 6 characters long'));
  }

  try {
    const { user, token } = await registerUserService(email, password);
    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError(400, 'Email and password are required'));
  }

  try {
    const { user, token } = await loginUserService(email, password);
    res.status(200).json({
      message: 'Login successful',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};