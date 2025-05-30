import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/interfaces';
import { getUpcomingMaintenanceService } from './dashboard.service';
import { ApiError } from '@/utils/errorHandler';

export const getUpcomingMaintenance = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) return next(new ApiError(401, 'User not authenticated'));

  try {
    const upcomingItems = await getUpcomingMaintenanceService(userId);
    res.status(200).json(upcomingItems);
  } catch (error) {
    next(error);
  }
};