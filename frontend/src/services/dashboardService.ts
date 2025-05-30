import apiClient from './apiClient';
import { DashboardUpcomingItem } from '../types'; 

/**
 * Busca os itens de manutenção próximas ou pendentes para o dashboard.
 */
export const getUpcomingMaintenanceService = async (): Promise<DashboardUpcomingItem[]> => {
  try {
    const response = await apiClient.get<DashboardUpcomingItem[]>('/dashboard/upcoming');
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming maintenance data:', error);
    throw error;
  }
};  