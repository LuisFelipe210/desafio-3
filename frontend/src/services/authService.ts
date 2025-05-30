import apiClient from './apiClient';
import { User } from '../types';

interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export const loginUser = async (credentials: { email: string, password: string }): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData: { email: string, password: string }): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', userData);
  return response.data;
};
