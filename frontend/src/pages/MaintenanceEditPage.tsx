// frontend/src/pages/MaintenanceEditPage.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MaintenanceForm from '../components/Maintenance/MaintenanceForm';
import { getMaintenanceRecordByIdService, updateMaintenanceRecordService } from '../services/maintenanceService';
import { MaintenanceRecord, MaintenanceFormData } from '../types';

const MaintenanceEditPage: React.FC = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const navigate = useNavigate();

  const [maintenanceRecord, setMaintenanceRecord] = useState<MaintenanceRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // ... (outros estados como antes) ...
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (!recordId) {
      setPageError("ID do registro de manutenção não encontrado na URL.");
      setLoading(false);
      return;
    }

    const fetchMaintenanceRecord = async () => {
      setLoading(true);
      setPageError(null);
      try {
        const data = await getMaintenanceRecordByIdService(recordId);
        setMaintenanceRecord(data);
      } catch (err: any) {
        setPageError(err.response?.data?.message || 'Falha ao buscar dados do registro de manutenção.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceRecord();
  }, [recordId]);

  const handleSubmit = async (formData: MaintenanceFormData) => {
    if (!recordId) {
      setSubmitError("Não foi possível identificar o registro para atualização.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateMaintenanceRecordService(recordId, formData);
      if (maintenanceRecord?.asset_id) {
        navigate(`/assets/${maintenanceRecord.asset_id}`); // Navega para string
      } else {
        // Se asset_id não estiver disponível, navega para uma rota string de fallback
        navigate('/assets'); // Por exemplo, para a lista de ativos
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Falha ao atualizar o registro de manutenção.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    // ... (spinner) ...
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (pageError) {
    // ... (alert pageError) ...
    return <Alert severity="error" sx={{ mt: 2 }}>{pageError}</Alert>;
  }

  if (!maintenanceRecord) {
    // ... (alert maintenanceRecord not found) ...
    return <Alert severity="warning" sx={{ mt: 2 }}>Registro de manutenção não encontrado.</Alert>;
  }

  const handleGoBack = () => {
    if (maintenanceRecord?.asset_id) {
      navigate(`/assets/${maintenanceRecord.asset_id}`); // Navega para string
    } else {
      navigate(-1); 
    }
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack} 
        sx={{ mb: 2 }}
      >
        Voltar
      </Button>
      <Typography variant="h4" component="h1" gutterBottom>
        Editar Registro de Manutenção
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Serviço: {maintenanceRecord.service_description} (ID: {maintenanceRecord.id})
      </Typography>

      <MaintenanceForm
        onSubmit={handleSubmit}
        initialData={maintenanceRecord}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitButtonText="Salvar Alterações"
      />
    </Box>
  );
};

export default MaintenanceEditPage;