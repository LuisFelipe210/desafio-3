import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface Asset {
  id: number;
  user_id: number;
  name: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface MaintenanceRecord {
  id: number;
  asset_id: number;
  service_description: string;
  date_performed: string; // ou Date, mas string é mais fácil vindo do DB e request
  notes?: string | null;
  next_maintenance_due_date?: string | null; // ou Date
  next_maintenance_condition?: string | null;
  created_at: Date;
  updated_at: Date;
}

// Para adicionar o usuário autenticado ao objeto Request do Express
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

// Para payloads de criação/atualização
export type CreateAssetPayload = Omit<Asset, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type UpdateAssetPayload = Partial<CreateAssetPayload>;

export type CreateMaintenancePayload = Omit<MaintenanceRecord, 'id' | 'asset_id' | 'created_at' | 'updated_at'>;
export type UpdateMaintenancePayload = Partial<CreateMaintenancePayload>;

export interface DashboardUpcomingItem {
  asset_id: number;
  asset_name: string;
  asset_description?: string | null;
  last_service_description?: string | null;
  next_maintenance_due_date?: string | null;
  next_maintenance_condition?: string | null;
  maintenance_record_id?: number; // ID do registro de manutenção que gerou essa pendência
}