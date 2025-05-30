import { Router } from 'express';
import { protect } from '@/middlewares/authMiddleware';
import {
  createMaintenanceRecord,
  getMaintenanceRecordsForAsset,
  getMaintenanceRecordById,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
} from './maintenance.controller'; // Importa dos CONTROLADORES

const router = Router();

// Aplica o middleware de proteção JWT a todas as rotas de manutenção definidas neste arquivo
router.use(protect);

// Rotas para manutenções relacionadas a um ATIVO específico
// Ex: POST /api/assets/123/maintenance
// Ex: GET  /api/assets/123/maintenance
router.post('/assets/:assetId/maintenance', createMaintenanceRecord);
router.get('/assets/:assetId/maintenance', getMaintenanceRecordsForAsset);

// Rotas para gerenciar um REGISTRO DE MANUTENÇÃO específico pelo seu ID
// Ex: GET    /api/maintenance/456
// Ex: PUT    /api/maintenance/456
// Ex: DELETE /api/maintenance/456
router.get('/maintenance/:recordId', getMaintenanceRecordById);
router.put('/maintenance/:recordId', updateMaintenanceRecord);
router.delete('/maintenance/:recordId', deleteMaintenanceRecord);

export default router;