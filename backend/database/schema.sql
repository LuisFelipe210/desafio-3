\
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'maintenance_condition_enum') THEN
        CREATE TYPE maintenance_condition_enum AS ENUM (
            'Time-based',       -- Ex: A cada 3 meses
            'Usage-based',      -- Ex: A cada 100 horas de uso
            'Event-based'       -- Ex: Após um tipo específico de evento
        );
    END IF;
END$$;

-- Tabela de Usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Ativos
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    purchase_date DATE,
    warranty_expiration DATE,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Registros de Manutenção
CREATE TABLE maintenance_records (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    service_description VARCHAR(255) NOT NULL,
    date_performed DATE NOT NULL,
    notes TEXT,
    technician_name VARCHAR(255),
    cost NUMERIC(10, 2) CHECK (cost >= 0),
    next_maintenance_due_date DATE,
    next_maintenance_condition maintenance_condition_enum,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Função para atualizar o campo 'updated_at'
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualização de timestamp automático
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_assets
BEFORE UPDATE ON assets
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_maintenance_records
BEFORE UPDATE ON maintenance_records
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Índices adicionais (opcional mas melhora performance em joins e buscas)
CREATE INDEX idx_assets_user_id ON assets(user_id);
CREATE INDEX idx_maintenance_asset_id ON maintenance_records(asset_id);
CREATE INDEX idx_maintenance_due_date ON maintenance_records(next_maintenance_due_date);
