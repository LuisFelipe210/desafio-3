import pool from '@/config/db';
import { MaintenanceRecord, CreateMaintenancePayload, UpdateMaintenancePayload } from '@/interfaces';
import { ApiError } from '@/utils/errorHandler';

// Helper para verificar se o ativo pertence ao usuário
const checkAssetOwnership = async (assetId: number, userId: number): Promise<boolean> => {
  console.log(`[Service - checkAssetOwnership] assetId=${assetId}, userId=${userId}`);
  const assetResult = await pool.query('SELECT id FROM assets WHERE id = $1 AND user_id = $2', [assetId, userId]);
  console.log(`[Service - checkAssetOwnership] Result (rowCount): ${assetResult.rowCount}`);
  return assetResult.rows.length > 0;
};

export const createMaintenanceRecordService = async (
  userId: number,
  assetId: number,
  payload: CreateMaintenancePayload
): Promise<MaintenanceRecord> => {
  console.log(`[Service - createMaintenance] For assetId=${assetId}, userId=${userId}`);
  if (!(await checkAssetOwnership(assetId, userId))) {
    throw new ApiError(403, 'Access to asset denied or asset does not exist for this user.');
  }
  console.log(`[Service - createMaintenance] Ownership check passed for assetId=${assetId}`);

  const { service_description, date_performed, notes, next_maintenance_due_date, next_maintenance_condition } = payload;
  const result = await pool.query<MaintenanceRecord>(
    `INSERT INTO maintenance_records
     (asset_id, service_description, date_performed, notes, next_maintenance_due_date, next_maintenance_condition)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
        assetId,
        service_description,
        date_performed,
        notes || null,
        next_maintenance_due_date || null,
        next_maintenance_condition || null
    ]
  );
  if (result.rows.length === 0) {
    throw new ApiError(500, 'Could not create maintenance record');
  }
  console.log(`[Service - createMaintenance] Record created:`, result.rows[0]);
  return result.rows[0];
};

export const getMaintenanceRecordsByAssetService = async (
  userId: number,
  assetId: number // Deve ser number aqui
): Promise<MaintenanceRecord[]> => {
  console.log(`[Service - getByAsset] For assetId=${assetId}, userId=${userId}`);
  if (!(await checkAssetOwnership(assetId, userId))) {
    console.warn(`[Service - getByAsset] Asset ownership check FAILED for assetId=${assetId}, userId=${userId}`);
    throw new ApiError(403, 'Access to asset denied or asset does not exist for this user.');
  }
  console.log(`[Service - getByAsset] Ownership check passed for assetId=${assetId}`);

  const result = await pool.query<MaintenanceRecord>(
    'SELECT * FROM maintenance_records WHERE asset_id = $1 ORDER BY date_performed DESC, created_at DESC',
    [assetId]
  );
  console.log(`[Service - getByAsset] DB query result for assetId=${assetId} (rowCount): ${result.rowCount}`);
  // console.log(`[Service - getByAsset] DB query result (rows):`, result.rows); (pode ser muito verboso)
  return result.rows;
};

export const getMaintenanceRecordByIdService = async (
  userId: number,
  recordId: number
): Promise<MaintenanceRecord | null> => {
  console.log(`[Service - getById] For recordId=${recordId}, userId=${userId}`);
  const result = await pool.query<MaintenanceRecord & { asset_user_id: number }>(
    `SELECT mr.*, a.user_id as asset_user_id
     FROM maintenance_records mr
     JOIN assets a ON mr.asset_id = a.id
     WHERE mr.id = $1`,
    [recordId]
  );

  if (result.rows.length === 0) {
    console.log(`[Service - getById] Record not found for recordId=${recordId}`);
    return null;
  }

  const recordData = result.rows[0];
  if (recordData.asset_user_id !== userId) {
    console.warn(`[Service - getById] Access denied for recordId=${recordId}, userId=${userId}, asset_user_id=${recordData.asset_user_id}`);
    throw new ApiError(403, 'Access to this maintenance record is denied.');
  }
  console.log(`[Service - getById] Record found and access granted for recordId=${recordId}`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { asset_user_id, ...maintenanceRecord } = recordData;
  return maintenanceRecord;
};


export const updateMaintenanceRecordService = async (
  userId: number,
  recordId: number,
  payload: UpdateMaintenancePayload
): Promise<MaintenanceRecord | null> => {
  console.log(`[Service - update] For recordId=${recordId}, userId=${userId}`);
  const existingRecord = await getMaintenanceRecordByIdService(userId, recordId); // Isso já vai logar e verificar permissão
  if (!existingRecord) {
    throw new ApiError(404, 'Maintenance record not found or access denied for update.');
  }
  // ... (resto da lógica de update como antes) ...
  const { service_description, date_performed, notes, next_maintenance_due_date, next_maintenance_condition } = payload;
  const fieldsToUpdate: string[] = [];
  const values: (string | number | null | Date)[] = [];
  let placeholderIndex = 1;

  const addUpdateField = (fieldValue: any, fieldName: string) => {
    if (fieldValue !== undefined) {
      fieldsToUpdate.push(`${fieldName} = $${placeholderIndex++}`);
      values.push(fieldValue === null ? null : fieldValue);
    }
  };

  addUpdateField(service_description, 'service_description');
  addUpdateField(date_performed, 'date_performed');
  addUpdateField(notes, 'notes');
  addUpdateField(next_maintenance_due_date, 'next_maintenance_due_date');
  addUpdateField(next_maintenance_condition, 'next_maintenance_condition');

  if (fieldsToUpdate.length === 0) {
    return existingRecord;
  }

  fieldsToUpdate.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(recordId);

  const queryString = `UPDATE maintenance_records SET ${fieldsToUpdate.join(', ')} WHERE id = $${placeholderIndex} RETURNING *`;

  const result = await pool.query<MaintenanceRecord>(queryString, values);
  if (result.rows.length === 0) {
    throw new ApiError(500, 'Failed to update maintenance record.');
  }
  console.log(`[Service - update] Record updated:`, result.rows[0]);
  return result.rows[0];
};

export const deleteMaintenanceRecordService = async (userId: number, recordId: number): Promise<boolean> => {
  console.log(`[Service - delete] For recordId=${recordId}, userId=${userId}`);
  const record = await getMaintenanceRecordByIdService(userId, recordId); // Isso já vai logar e verificar permissão
  if (!record) {
    throw new ApiError(404, 'Maintenance record not found or access denied for deletion.');
  }

  const result = await pool.query('DELETE FROM maintenance_records WHERE id = $1', [recordId]);
  console.log(`[Service - delete] Delete result (rowCount): ${result.rowCount} for recordId=${recordId}`);
  return result.rowCount !== null && result.rowCount > 0;
};