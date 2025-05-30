import apiClient from './apiClient';
import { Asset, AssetFormData } from '../types'; 

/**
 * Busca todos os ativos do usuário logado.
 */
export const getAssetsService = async (): Promise<Asset[]> => {
  try {
    const response = await apiClient.get<Asset[]>('/assets');
    return response.data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    // Em uma aplicação real, você poderia lançar um erro customizado ou tratar
    // de forma mais específica (ex: se for 401, deslogar o usuário)
    throw error;
  }
};

/**
 * Busca um ativo específico pelo seu ID.
 * @param assetId - O ID do ativo a ser buscado.
 */
export const getAssetByIdService = async (assetId: number | string): Promise<Asset> => {
  try {
    const response = await apiClient.get<Asset>(`/assets/${assetId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching asset with ID ${assetId}:`, error);
    throw error;
  }
};

/**
 * Cria um novo ativo.
 * @param assetData - Os dados do ativo a ser criado.
 */
export const createAssetService = async (assetData: AssetFormData): Promise<Asset> => {
  try {
    const response = await apiClient.post<Asset>('/assets', assetData);
    return response.data;
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
};

/**
 * Atualiza um ativo existente.
 * @param assetId - O ID do ativo a ser atualizado.
 * @param assetData - Os dados para atualização do ativo.
 */
export const updateAssetService = async (assetId: number | string, assetData: Partial<AssetFormData>): Promise<Asset> => {
  try {
    const response = await apiClient.put<Asset>(`/assets/${assetId}`, assetData);
    return response.data;
  } catch (error) {
    console.error(`Error updating asset with ID ${assetId}:`, error);
    throw error;
  }
};

/**
 * Deleta um ativo.
 * @param assetId - O ID do ativo a ser deletado.
 */
export const deleteAssetService = async (assetId: number | string): Promise<void> => {
  try {
    await apiClient.delete(`/assets/${assetId}`);
    // Retorna void pois DELETE geralmente resulta em 204 No Content
  } catch (error) {
    console.error(`Error deleting asset with ID ${assetId}:`, error);
    throw error;
  }
};