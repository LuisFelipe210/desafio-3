import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, CreateAssetPayload, UpdateAssetPayload } from '@/interfaces';
import {
  createAssetService,
  getAssetsByUserService,
  getAssetByIdService,
  updateAssetService,
  deleteAssetService,
} from './assets.service';
import { ApiError } from '@/utils/errorHandler';

export const createAsset = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) return next(new ApiError(401, 'User not authenticated'));

  const { name, description } = req.body as CreateAssetPayload;
  if (!name) return next(new ApiError(400, 'Asset name is required'));

  try {
    const asset = await createAssetService(userId, { name, description });
    res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
};

export const getAssets = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) return next(new ApiError(401, 'User not authenticated'));

  try {
    const assets = await getAssetsByUserService(userId);
    res.status(200).json(assets);
  } catch (error) {
    next(error);
  }
};

export const getAssetById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const assetId = parseInt(req.params.assetId, 10);

  if (!userId) return next(new ApiError(401, 'User not authenticated'));
  if (isNaN(assetId)) return next(new ApiError(400, 'Invalid asset ID'));

  try {
    const asset = await getAssetByIdService(assetId, userId);
    if (!asset) {
      return next(new ApiError(404, 'Asset not found or access denied'));
    }
    res.status(200).json(asset);
  } catch (error) {
    next(error);
  }
};

export const updateAsset = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const assetId = parseInt(req.params.assetId, 10);
  const payload = req.body as UpdateAssetPayload;

  if (!userId) return next(new ApiError(401, 'User not authenticated'));
  if (isNaN(assetId)) return next(new ApiError(400, 'Invalid asset ID'));
  if (Object.keys(payload).length === 0) return next(new ApiError(400, 'No update data provided'));
  if (payload.name !== undefined && !payload.name.trim()) return next(new ApiError(400, 'Asset name cannot be empty'));

  try {
    const updatedAsset = await updateAssetService(assetId, userId, payload);
    if (!updatedAsset) {
      return next(new ApiError(404, 'Asset not found or access denied for update'));
    }
    res.status(200).json(updatedAsset);
  } catch (error) {
    next(error);
  }
};

export const deleteAsset = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const assetId = parseInt(req.params.assetId, 10);

  if (!userId) return next(new ApiError(401, 'User not authenticated'));
  if (isNaN(assetId)) return next(new ApiError(400, 'Invalid asset ID'));

  try {
    const success = await deleteAssetService(assetId, userId);
    if (!success) {
      return next(new ApiError(404, 'Asset not found or access denied for deletion'));
    }
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};