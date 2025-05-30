import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Alert, 
  Button, 
  CircularProgress,
  Container,
  Paper,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
  IconButton,
  useTheme,
  Fade,
  Skeleton
} from '@mui/material';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import AddTaskIcon from '@mui/icons-material/AddTask';
import MaintenanceForm from '../components/Maintenance/MaintenanceForm';
import { createMaintenanceRecordService } from '../services/maintenanceService';
import { getAssetByIdService } from '../services/assetService';
import { MaintenanceFormData } from '../types'; 

const MaintenanceCreatePage: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const [assetName, setAssetName] = useState<string>('');
  const [loadingAssetInfo, setLoadingAssetInfo] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    if (!assetId) {
        setPageError("ID do ativo inválido ou não fornecido.");
        setLoadingAssetInfo(false);
        return;
    }
    const fetchAssetName = async () => {
        setLoadingAssetInfo(true);
        setPageError(null);
        try {
            const assetData = await getAssetByIdService(assetId);
            setAssetName(assetData.name);
        } catch (err) {
            console.error("Failed to fetch asset name for maintenance page:", err);
            setPageError("Não foi possível carregar informações do ativo associado.");
        } finally {
            setLoadingAssetInfo(false);
        }
    };
    fetchAssetName();
  }, [assetId]);


  const handleSubmit = async (data: MaintenanceFormData) => {
    if (!assetId) {
      setSubmitError("ID do ativo não está definido para criar a manutenção.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createMaintenanceRecordService(assetId, data);
     
      navigate(`/assets/${assetId}`); // Redireciona para a página de detalhes do ativo
    } catch (err: any) {
      const message = err.response?.data?.message || 'Falha ao registrar a manutenção. Verifique os dados e tente novamente.';
      setSubmitError(message);
      console.error("Create Maintenance Record Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    if (assetId) {
      navigate(`/assets/${assetId}`);
    } else {
      navigate('/assets'); // Fallback se assetId não estiver disponível
    }
  };

  if (loadingAssetInfo) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Skeleton variant="rectangular" animation="wave" height={60} sx={{ borderRadius: theme.shape.borderRadius }}/>
          <Skeleton variant="text" animation="wave" width="50%" height={40} />
          <Skeleton variant="rectangular" animation="wave" height={400} sx={{ borderRadius: theme.shape.borderRadius }}/>
        </Stack>
      </Container>
    );
  }

  if (pageError && !loadingAssetInfo) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ borderRadius: theme.shape.borderRadius, '& .MuiAlert-message': { width: '100%' } }}
        >
          {pageError}
        </Alert>
        <Button onClick={handleGoBack} startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
            Voltar
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in timeout={500}>
        <Box>
          {/* Header Section */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <IconButton 
              onClick={handleGoBack}
              aria-label="Voltar para detalhes do ativo"
              sx={{ 
                backgroundColor: theme.palette.action.hover,
                '&:hover': { backgroundColor: theme.palette.action.selected }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Stack>

          <Box sx={{ mb: 4 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <MuiLink
                component={RouterLink}
                to="/dashboard"
                color="inherit" 
                sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: theme.palette.primary.main } }}
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Dashboard
              </MuiLink>
              <MuiLink 
                component={RouterLink}
                to="/assets"
                color="inherit" 
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: theme.palette.primary.main } }}
              >
                Meus Ativos
              </MuiLink>
              {assetName && assetId && (
                <MuiLink 
                    component={RouterLink}
                    to={`/assets/${assetId}`}
                    color="inherit" 
                    sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: theme.palette.primary.main } }}
                >
                    {assetName}
                </MuiLink>
              )}
              <Typography color="text.primary" sx={{ fontWeight: 500 }}>Nova Manutenção</Typography>
            </Breadcrumbs>
            
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{mb:1}}>
              <AddTaskIcon
                sx={{ 
                  color: theme.palette.secondary.main,
                  fontSize: {xs: '1.8rem', md: '2.2rem'}
                }} 
              />
              <Typography 
                variant="h3"
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.secondary.dark}, ${theme.palette.primary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2
                }}
              >
                Registrar Nova Manutenção
              </Typography>
            </Stack>
            {assetName && (
                <Typography variant="subtitle1" color="text.primary" sx={{fontWeight:500, mb:0.5}}>
                    Para o ativo: <Box component="span" sx={{color: theme.palette.primary.main}}>{assetName}</Box>
                </Typography>
            )}
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, maxWidth: 700 }}>
              Detalhe o serviço de manutenção realizado, a data e, opcionalmente, informações sobre a próxima manutenção prevista.
            </Typography>
          </Box>

          {submitError && (
            <Fade in>
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[2] }}
                onClose={() => setSubmitError(null)}
              >
                {submitError}
              </Alert>
            </Fade>
          )}

          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h5"
                component="h2" 
                sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}
              >
                Detalhes da Manutenção
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preencha os campos abaixo com as informações do serviço.
              </Typography>
            </Box>

            {!loadingAssetInfo && assetId && (
                <MaintenanceForm
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submitButtonText="Registrar Manutenção"
                />
            )}
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default MaintenanceCreatePage;