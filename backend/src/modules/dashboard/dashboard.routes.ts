import { Router } from 'express';
import { protect } from '@/middlewares/authMiddleware';
import { getUpcomingMaintenance } from './dashboard.controller';

const router = Router();

router.use(protect);

router.get('/upcoming', getUpcomingMaintenance);

export default router;