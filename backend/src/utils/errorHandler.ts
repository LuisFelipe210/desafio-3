import { Response } from 'express';

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype); // Mantém a cadeia de protótipos
  }
}

export const handleError = (err: Error | ApiError, res: Response) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error('Unhandled Error:', err); // Log do erro para depuração
  return res.status(500).json({ message: 'Internal Server Error' });
};