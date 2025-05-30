import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ApiError, handleError } from '@/utils/errorHandler';

import authRoutes from '@/modules/auth/auth.routes';
import assetRoutes from '@/modules/assets/assets.routes';
import maintenanceRoutes from '@/modules/maintenance/maintenance.routes'; // Importa as rotas de manutenção
import dashboardRoutes from '@/modules/dashboard/dashboard.routes';


const app: Application = express();

// Middlewares
app.use(cors()); // Configurar CORS conforme necessário para produção
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'Backend is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api', maintenanceRoutes); // Monta as rotas de manutenção na raiz /api
                                   // (já que elas têm /assets/:assetId/maintenance ou /maintenance/:recordId)
app.use('/api/dashboard', dashboardRoutes);


// Rota não encontrada (404)
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Resource not found on this server'));
});

// Middleware de tratamento de erros global (deve ser o último)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error | ApiError, req: Request, res: Response, _next: NextFunction) => {
  handleError(err, res);
});

export default app;