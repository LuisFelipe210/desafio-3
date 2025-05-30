// Tipos que vêm da API
export interface User {
  id: number;
  email: string;
}

export interface Asset {
  id: number;
  user_id: number;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRecord {
  id: number;
  asset_id: number;
  service_description: string;
  date_performed: string;
  notes?: string | null;
  next_maintenance_due_date?: string | null;
  next_maintenance_condition?: string | null;
  created_at: string;
  updated_at: string;
}

// Para payloads de formulário
export interface AssetFormData {
  name: string;
  description?: string;
}

export interface MaintenanceFormData {
  service_description: string;
  date_performed: string;
  notes?: string;
  next_maintenance_due_date?: string;
  next_maintenance_condition?: string;
}

// Para o contexto de autenticação
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

// ESTA É A INTERFACE CHAVE PARA O AuthContext
export interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

export interface DashboardUpcomingItem {
  asset_id: number;
  asset_name: string;
  asset_description?: string | null;
  last_service_description?: string | null;
  next_maintenance_due_date?: string | null;
  next_maintenance_condition?: string | null;
  maintenance_record_id?: number;
}