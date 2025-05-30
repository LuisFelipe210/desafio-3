import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, CreateMaintenancePayload, UpdateMaintenancePayload } from '@/interfaces';
import {
  createMaintenanceRecordService,
  getMaintenanceRecordsByAssetService,
  getMaintenanceRecordByIdService,
  updateMaintenanceRecordService,
  deleteMaintenanceRecordService,
} from './maintenance.service';
import { ApiError } from '@/utils/errorHandler';

export const createMaintenanceRecord = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const assetIdString = req.params.assetId;
  const payload = req.body as CreateMaintenancePayload;

  console.log(`[Controller - createMaintenance] userId=${userId}, assetIdString=${assetIdString}, payload:`, payload); // LOG

  if (!userId) return next(new ApiError(401, 'User not authenticated'));
  
  const assetIdNum = parseInt(assetIdString, 10);
  if (isNaN(assetIdNum)) {
    console.error(`[Controller - createMaintenance] Invalid assetId: ${assetIdString}`); // LOG
    return next(new ApiError(400, 'Invalid asset ID in URL parameter'));
  }
  if (!payload.service_description || !payload.date_performed) {
    return next(new ApiError(400, 'Service description and date performed are required'));
  }

  try {
    const record = await createMaintenanceRecordService(userId, assetIdNum, payload);
    res.status(201).json(record);
  } catch (error) {
    console.error(`[Controller - createMaintenance] Error:`, error); // LOG
    next(error);
  }
};

export const getMaintenanceRecordsForAsset = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const assetIdString = req.params.assetId;

  console.log(`[Controller - getByAsset] userId=${userId}, assetIdString=${assetIdString}`); // LOG

  if (!userId) return next(new ApiError(401, 'User not authenticated'));

  const assetIdNum = parseInt(assetIdString, 10);
  if (isNaN(assetIdNum)) {
    console.error(`[Controller - getByAsset] Invalid assetId: ${assetIdString}`); // LOG
    return next(new ApiError(400, 'Invalid asset ID in URL parameter'));
  }

  try {
    const records = await getMaintenanceRecordsByAssetService(userId, assetIdNum);
    console.log(`[Controller - getByAsset] Records found by service for assetId=${assetIdNum}:`, records.length); // LOG
    res.status(200).json(records);
  } catch (error) {
    console.error(`[Controller - getByAsset] Error:`, error); // LOG
    next(error);
  }
};

export const getMaintenanceRecordById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const recordIdString = req.params.recordId;

    console.log(`[Controller - getById] userId=${userId}, recordIdString=${recordIdString}`); // LOG

    if (!userId) return next(new ApiError(401, 'User not authenticated'));

    const recordIdNum = parseInt(recordIdString, 10);
    if (isNaN(recordIdNum)) {
        console.error(`[Controller - getById] Invalid recordId: ${recordIdString}`); // LOG
        return next(new ApiError(400, 'Invalid maintenance record ID in URL parameter'));
    }

    try {
        const record = await getMaintenanceRecordByIdService(userId, recordIdNum);
        if (!record) {
            return next(new ApiError(404, 'Maintenance record not found or access denied'));
        }
        res.status(200).json(record);
    } catch (error) {
        console.error(`[Controller - getById] Error:`, error); // LOG
        next(error);
    }
};

export const updateMaintenanceRecord = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const recordIdString = req.params.recordId;
  const payload = req.body as UpdateMaintenancePayload;

  console.log(`[Controller - update] userId=${userId}, recordIdString=${recordIdString}, payload:`, payload); // LOG

  if (!userId) return next(new ApiError(401, 'User not authenticated'));
  
  const recordIdNum = parseInt(recordIdString, 10);
  if (isNaN(recordIdNum)) {
    console.error(`[Controller - update] Invalid recordId: ${recordIdString}`); // LOG
    return next(new ApiError(400, 'Invalid record ID in URL parameter'));
  }
  if (Object.keys(payload).length === 0) return next(new ApiError(400, 'No update data provided'));

  try {
    const updatedRecord = await updateMaintenanceRecordService(userId, recordIdNum, payload);
    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error(`[Controller - update] Error:`, error); // LOG
    next(error);
  }
};

export const deleteMaintenanceRecord = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const recordIdString = req.params.recordId;

  console.log(`[Controller - delete] userId=${userId}, recordIdString=${recordIdString}`); // LOG

  if (!userId) return next(new ApiError(401, 'User not authenticated'));

  const recordIdNum = parseInt(recordIdString, 10);
  if (isNaN(recordIdNum)) {
    console.error(`[Controller - delete] Invalid recordId: ${recordIdString}`); // LOG
    return next(new ApiError(400, 'Invalid record ID in URL parameter'));
  }

  try {
    await deleteMaintenanceRecordService(userId, recordIdNum);
    res.status(204).send();
  } catch (error) {
    console.error(`[Controller - delete] Error:`, error); // LOG
    next(error);
  }
};