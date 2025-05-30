import pool from '@/config/db';
import { User } from '@/interfaces';
import { hashPassword, comparePassword } from '@/utils/password';
import { generateToken } from '@/utils/jwt';
import { ApiError } from '@/utils/errorHandler';

export const registerUserService = async (email: string, password_raw: string): Promise<{ user: Omit<User, 'password_hash'>, token: string }> => {
  // Verificar se o usuário já existe
  const existingUserResult = await pool.query<User>('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUserResult.rows.length > 0) {
    throw new ApiError(409, 'User already exists with this email');
  }

  const password_hash = await hashPassword(password_raw);
  const result = await pool.query<User>(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at, updated_at',
    [email, password_hash]
  );

  if (result.rows.length === 0) {
    throw new ApiError(500, 'Could not create user');
  }
  const user = result.rows[0];
  const token = generateToken({ id: user.id, email: user.email });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const loginUserService = async (email: string, password_raw: string): Promise<{ user: Omit<User, 'password_hash'>, token: string }> => {
  const result = await pool.query<User>('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const user = result.rows[0];
  const isMatch = await comparePassword(password_raw, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = generateToken({ id: user.id, email: user.email });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};