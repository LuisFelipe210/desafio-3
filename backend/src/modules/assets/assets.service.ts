import pool from '@/config/db';
import { Asset, CreateAssetPayload, UpdateAssetPayload } from '@/interfaces';
import { ApiError } from '@/utils/errorHandler';

export const createAssetService = async (userId: number, payload: CreateAssetPayload): Promise<Asset> => {
  const { name, description } = payload;
  const result = await pool.query<Asset>(
    'INSERT INTO assets (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
    [userId, name, description || null]
  );
  if (result.rows.length === 0) {
    throw new ApiError(500, 'Could not create asset');
  }
  return result.rows[0];
};

export const getAssetsByUserService = async (userId: number): Promise<Asset[]> => {
  const result = await pool.query<Asset>('SELECT * FROM assets WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
};

export const getAssetByIdService = async (assetId: number, userId: number): Promise<Asset | null> => {
  const result = await pool.query<Asset>('SELECT * FROM assets WHERE id = $1 AND user_id = $2', [assetId, userId]);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};

export const updateAssetService = async (assetId: number, userId: number, payload: UpdateAssetPayload): Promise<Asset | null> => {
  const { name, description } = payload;
  // Construir a query dinamicamente para atualizar apenas os campos fornecidos
  const fields: string[] = [];
  const values: (string | number | null)[] = [];
  let queryIndex = 1;

  if (name !== undefined) {
    fields.push(`name = $${queryIndex++}`);
    values.push(name);
  }
  if (description !== undefined) {
    fields.push(`description = $${queryIndex++}`);
    values.push(description);
  }

  if (fields.length === 0) {
    // Nada para atualizar, buscar e retornar o ativo existente
    return getAssetByIdService(assetId, userId);
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(assetId, userId); // Para as cláusulas WHERE

  const queryString = `UPDATE assets SET ${fields.join(', ')} WHERE id = $${queryIndex++} AND user_id = $${queryIndex++} RETURNING *`;

  const result = await pool.query<Asset>(queryString, values);

  if (result.rows.length === 0) {
    return null; // Ou lançar erro se o ativo não foi encontrado ou não pertence ao usuário
  }
  return result.rows[0];
};

export const deleteAssetService = async (assetId: number, userId: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM assets WHERE id = $1 AND user_id = $2', [assetId, userId]);
  return result.rowCount !== null && result.rowCount > 0;
};