import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material'; 
// Importação das Páginas
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import AssetsListPage from '../pages/AssetsListPage';
import AssetCreatePage from '../pages/AssetCreatePage';
import AssetEditPage from '../pages/AssetEditPage';
import AssetDetailPage from '../pages/AssetDetailPage';
import MaintenanceCreatePage from '../pages/MaintenanceCreatePage';
import MaintenanceEditPage from '../pages/MaintenanceEditPage'; 
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute'; // Componente para proteger rotas

const AppRouter: React.FC = () => {
  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rota Raiz e Rotas Protegidas */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          
          {/* Rotas de Ativos */}
          <Route path="assets" element={<AssetsListPage />} />
          <Route path="assets/new" element={<AssetCreatePage />} />
          <Route path="assets/:assetId" element={<AssetDetailPage />} />
          <Route path="assets/:assetId/edit" element={<AssetEditPage />} />
          
          {/* Rotas de Manutenção */}
          <Route path="assets/:assetId/maintenance/new" element={<MaintenanceCreatePage />} />
          <Route path="maintenance/:recordId/edit" element={<MaintenanceEditPage />} /> 
        </Route>

        {/* Rota "Não Encontrado" (404) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Container>
  );
};

export default AppRouter;