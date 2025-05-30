import apiClient from './apiClient';
import { MaintenanceRecord, MaintenanceFormData } from '../types';

/**
 * Busca todos os registros de manutenção para um ativo específico.
 * @param assetId - O ID do ativo.
 */
export const getMaintenanceForAssetService = async (assetId: number | string): Promise<MaintenanceRecord[]> => {
  try {
    const response = await apiClient.get<MaintenanceRecord[]>(`/assets/${assetId}/maintenance`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching maintenance records for asset ID ${assetId}:`, error);
    throw error;
  }
};

/**
 * Cria um novo registro de manutenção para um ativo.
 * @param assetId - O ID do ativo.
 * @param maintenanceData - Os dados do registro de manutenção.
 */
export const createMaintenanceRecordService = async (
  assetId: number | string,
  maintenanceData: MaintenanceFormData
): Promise<MaintenanceRecord> => {
  try {
    const response = await apiClient.post<MaintenanceRecord>(`/assets/${assetId}/maintenance`, maintenanceData);
    return response.data;
  } catch (error) {
    console.error('Error creating maintenance record:', error);
    throw error;
  }
};

/**
 * Busca um registro de manutenção específico pelo seu ID.
 * @param recordId - O ID do registro de manutenção.
 */
export const getMaintenanceRecordByIdService = async (recordId: number | string): Promise<MaintenanceRecord> => {
  try {
    const response = await apiClient.get<MaintenanceRecord>(`/maintenance/${recordId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching maintenance record with ID ${recordId}:`, error);
    throw error;
  }
};


/**
 * Atualiza um registro de manutenção existente.
 * @param recordId - O ID do registro de manutenção.
 * @param maintenanceData - Os dados para atualização.
 */
export const updateMaintenanceRecordService = async (
  recordId: number | string,
  maintenanceData: Partial<MaintenanceFormData> // Partial para permitir atualização de campos específicos
): Promise<MaintenanceRecord> => {
  try {
    const response = await apiClient.put<MaintenanceRecord>(`/maintenance/${recordId}`, maintenanceData);
    return response.data;
  } catch (error) {
    console.error(`Error updating maintenance record with ID ${recordId}:`, error);
    throw error;
  }
};

/**
 * Deleta um registro de manutenção.
 * @param recordId - O ID do registro de manutenção.
 */
export const deleteMaintenanceRecordService = async (recordId: number | string): Promise<void> => {
  try {
    await apiClient.delete(`/maintenance/${recordId}`);
  } catch (error) {
    console.error(`Error deleting maintenance record with ID ${recordId}:`, error);
    throw error;
  }
};