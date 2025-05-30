import { Router } from 'express';
import { protect } from '@/middlewares/authMiddleware';
import { createAsset, getAssets, getAssetById, updateAsset, deleteAsset } from './assets.controller';

const router = Router();

router.use(protect); // Proteger todas as rotas de ativos

router.route('/')
  .post(createAsset)
  .get(getAssets);

router.route('/:assetId')
  .get(getAssetById)
  .put(updateAsset)
  .delete(deleteAsset);

export default router;