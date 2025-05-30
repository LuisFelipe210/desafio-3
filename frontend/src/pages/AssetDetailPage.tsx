import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'; 
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  Paper, 
  Button, 
  Divider, 
  Container,
  Stack,
  Chip,
  Card,
  CardContent,
  IconButton,
  Breadcrumbs,
  Link as MuiLink, 
  useTheme,
  Fade,
  Skeleton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BuildIcon from '@mui/icons-material/Build';
import { getAssetByIdService } from '../services/assetService';
import { Asset, MaintenanceRecord } from '../types';
import { getMaintenanceForAssetService, deleteMaintenanceRecordService } from '../services/maintenanceService';
import MaintenanceCardList from '../components/Maintenance/MaintenanceCardList';

const AssetDetailPage: React.FC = () => {
  const { assetId: assetIdFromUrl } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [loadingAsset, setLoadingAsset] = useState<boolean>(true);
  const [errorAsset, setErrorAsset] = useState<string | null>(null);

  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);
  const [loadingMaintenances, setLoadingMaintenances] = useState<boolean>(true);
  const [errorMaintenances, setErrorMaintenances] = useState<string | null>(null);

  const fetchAssetAndMaintenances = useCallback(async (currentAssetId: string) => {
    setLoadingAsset(true);
    setErrorAsset(null);
    setLoadingMaintenances(true);
    setErrorMaintenances(null);
    setAsset(null); 
    setMaintenances([]);

    try {
      const assetData = await getAssetByIdService(currentAssetId);
      setAsset(assetData);

      const maintenanceData = await getMaintenanceForAssetService(currentAssetId);
      setMaintenances(maintenanceData);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Falha ao buscar dados.';
      console.error('[Page - fetchAssetAndMaintenances] Error:', err, 'URL:', err.config?.url);
      if (err.config?.url?.includes(`/assets/${currentAssetId}/maintenance`)) {
        setErrorMaintenances(errorMessage);
      } else {
        setErrorAsset(errorMessage);
      }
    } finally {
      setLoadingAsset(false);
      setLoadingMaintenances(false);
    }
  }, []);

  useEffect(() => {
    if (assetIdFromUrl) {
      fetchAssetAndMaintenances(assetIdFromUrl);
    } else {
      setErrorAsset("ID do ativo não fornecido na URL.");
      setLoadingAsset(false);
      setLoadingMaintenances(false);
    }
  }, [assetIdFromUrl, fetchAssetAndMaintenances]);

  const handleDeleteMaintenanceRecord = async (recordId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este registro de manutenção?")) return;

    try {
        await deleteMaintenanceRecordService(recordId);
        setMaintenances(prev => prev.filter(m => m.id !== recordId));
    } catch (error: any) {
        console.error("[Page - handleDeleteMaintenanceRecord] Failed to delete", error);
        const message = error.response?.data?.message || "Falha ao deletar registro de manutenção.";
        setErrorMaintenances(message);
    }
  };

  const handleGoBack = () => {
    navigate('/assets');
  };

  if (loadingAsset) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Skeleton variant="rectangular" animation="wave" height={60} sx={{ borderRadius: theme.shape.borderRadius }}/>
          <Skeleton variant="rectangular" animation="wave" height={200} sx={{ borderRadius: theme.shape.borderRadius }}/>
          <Skeleton variant="rectangular" animation="wave" height={300} sx={{ borderRadius: theme.shape.borderRadius }}/>
        </Stack>
      </Container>
    );
  }

  if (errorAsset) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: theme.shape.borderRadius, 
            '& .MuiAlert-message': { width: '100%' }
          }}
        >
          {errorAsset}
        </Alert>
      </Container>
    );
  }

  if (!asset) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: theme.shape.borderRadius,
            '& .MuiAlert-message': { width: '100%' }
          }}
        >
          Ativo não encontrado ou falha ao carregar.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={500}>
        <Box>
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <IconButton 
                onClick={handleGoBack}
                aria-label="Voltar para lista de ativos"
                sx={{ 
                  backgroundColor: theme.palette.action.hover,
                  '&:hover': {
                    backgroundColor: theme.palette.action.selected,
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              
              <Button
                variant="contained"
                size="medium" 
                startIcon={<EditIcon />}
                component={RouterLink}
                to={`/assets/${asset.id}/edit`}
                sx={{ 
                  height: 'fit-content',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: theme.shadows[3], 
                  '&:hover': {
                    boxShadow: theme.shadows[6],
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Editar Ativo
              </Button>
            </Stack>
             <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
                <MuiLink 
                  component={RouterLink}
                  to="/dashboard"
                  color="inherit" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline', color: theme.palette.primary.main }
                  }}
                >
                  <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  Dashboard
                </MuiLink>
                <MuiLink 
                  component={RouterLink}
                  to="/assets"
                  color="inherit" 
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline', color: theme.palette.primary.main }
                  }}
                >
                  Meus Ativos
                </MuiLink>
                <Typography color="text.primary" sx={{ fontWeight: 500 }}>{asset.name}</Typography>
              </Breadcrumbs>
          </Box>

          {/* Asset Details Card */}
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              mb: 4,
              borderRadius: 3, 
              border: `1px solid ${theme.palette.divider}`,
              background: `linear-gradient(135deg, ${(theme.palette.background.paper, 0.9)} 0%, ${(theme.palette.action.hover, 0.7)} 100%)`,
              transition: 'all 0.3s ease-in-out',
              backdropFilter: 'blur(5px)', 
              '&:hover': {
                boxShadow: theme.shadows[6], 
                
              }
            }}
          >
            <Stack direction="column" spacing={3}> 
              <Box>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 700,
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.2
                    }}
                  >
                    {asset.name}
                  </Typography>
                  <Chip 
                    label={`ID: ${asset.id}`}
                    size="small"
                    sx={{ 
                      backgroundColor: (theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.dark,
                      fontFamily: 'monospace',
                      fontWeight: 600
                    }}
                  />
                </Stack>
                {asset.description && (
                  <Card sx={{ mb: 2, backgroundColor: (theme.palette.background.default, 0.5), borderRadius: 2 }}>
                    <CardContent sx={{ '&:last-child': { pb: '16px !important' } }}> 
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <InfoOutlinedIcon 
                          sx={{ color: theme.palette.primary.main, mt: 0.5, fontSize: '1.3rem' }} 
                        />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: theme.palette.text.primary }}>
                            Descrição
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.65, color: theme.palette.text.secondary }}>
                            {asset.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Box>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }} sx={{pt:1}}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CalendarTodayIcon sx={{ color: theme.palette.text.secondary, fontSize: '1.1rem' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Cadastrado em
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {new Date(asset.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <EditIcon sx={{ color: theme.palette.text.secondary, fontSize: '1.1rem' }} /> {/* Reutilizando EditIcon */}
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Última atualização
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {new Date(asset.updated_at).toLocaleDateString('pt-BR', {
                           day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
            </Stack>
          </Paper>

          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <BuildIcon sx={{ color: theme.palette.primary.main, fontSize: '1.75rem' }} />
                <Typography 
                  variant="h4" 
                  component="h2" 
                  sx={{ fontWeight: 600 }}
                >
                  Histórico de Manutenção
                </Typography>
                <Chip 
                  label={`${maintenances.length} ${maintenances.length === 1 ? 'registro' : 'registros'}`}
                  size="medium" 
                  color="primary"
                  variant="filled" 
                  sx={{ fontWeight: 500}}
                />
              </Stack>
              
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                component={RouterLink}
                to={assetIdFromUrl ? `/assets/${assetIdFromUrl}/maintenance/new` : '#'}
                disabled={!assetIdFromUrl}
                sx={{ 
                  minWidth: { xs: '100%', sm: 200 }, 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: theme.shadows[3],
                  '&:hover': {
                    boxShadow: theme.shadows[6],
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Adicionar Manutenção
              </Button>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {loadingMaintenances && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Stack alignItems="center" spacing={2}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" color="text.secondary">
                    Carregando histórico de manutenções...
                  </Typography>
                </Stack>
              </Box>
            )}

            {errorMaintenances && !loadingMaintenances && (
              <Fade in timeout={300}>
                <Alert 
                  severity="error" 
                  sx={{ mb: 3, borderRadius: 2 }}
                  action={ 
                    <Button color="inherit" size="small" onClick={() => assetIdFromUrl && fetchAssetAndMaintenances(assetIdFromUrl)}>
                      TENTAR NOVAMENTE
                    </Button>
                  }
                >
                  {errorMaintenances}
                </Alert>
              </Fade>
            )}
            
            {!loadingMaintenances && !errorMaintenances && (
              <MaintenanceCardList 
                maintenances={maintenances} 
                onDeleteRecord={handleDeleteMaintenanceRecord}
              />
            )}
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default AssetDetailPage;