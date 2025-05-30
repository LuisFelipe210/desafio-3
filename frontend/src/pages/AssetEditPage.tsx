import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Container,
  Paper,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
  IconButton,
  useTheme,
  Fade,
  Skeleton,
  Button
} from '@mui/material';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import EditNoteIcon from '@mui/icons-material/EditNote'; 
import AssetForm from '../components/Assets/AssetForm';
import { getAssetByIdService, updateAssetService } from '../services/assetService';
import { Asset, AssetFormData } from '../types';

const AssetEditPage: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!assetId) {
      setPageError("ID do ativo inválido ou não fornecido na URL.");
      setLoading(false);
      return;
    }

    const fetchAsset = async () => {
      setLoading(true);
      setPageError(null);
      setAsset(null); 
      try {
        const data = await getAssetByIdService(assetId);
        setAsset(data);
      } catch (err: any) {
        setPageError(err.response?.data?.message || 'Falha ao buscar dados do ativo para edição.');
        console.error("Fetch Asset Error for Edit:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [assetId]);

  const handleSubmit = async (formData: AssetFormData) => {
    if (!assetId) {
      setSubmitError("ID do ativo não identificado para atualização.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateAssetService(assetId, formData);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Falha ao atualizar o ativo. Verifique os dados e tente novamente.';
      setSubmitError(message);
      console.error("Update Asset Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
   
    if (assetId) {
        navigate(`/assets/${assetId}`);
    } else {
        navigate('/assets');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}> 
        <Stack spacing={3}>
          <Skeleton variant="rectangular" animation="wave" height={60} sx={{ borderRadius: theme.shape.borderRadius }}/>
          <Skeleton variant="text" animation="wave" width="40%" height={40} />
          <Skeleton variant="rectangular" animation="wave" height={300} sx={{ borderRadius: theme.shape.borderRadius }}/>
        </Stack>
      </Container>
    );
  }

  if (pageError) {
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

  if (!asset) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert 
            severity="warning" 
            sx={{ borderRadius: theme.shape.borderRadius, '& .MuiAlert-message': { width: '100%' } }}
        >
            Ativo não encontrado. Não é possível editar.
        </Alert>
         <Button onClick={() => navigate('/assets')} startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
            Ir para Lista de Ativos
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}> 
      <Fade in timeout={500}>
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <IconButton 
              onClick={handleGoBack}
              aria-label="Voltar para detalhes do ativo"
              sx={{ 
                backgroundColor: theme.palette.action.hover,
                '&:hover': {
                  backgroundColor: theme.palette.action.selected,
                }
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
              <MuiLink 
                component={RouterLink}
                to={`/assets/${asset.id}`}
                color="inherit" 
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline', color: theme.palette.primary.main } }}
              >
                {asset.name}
              </MuiLink>
              <Typography color="text.primary" sx={{ fontWeight: 500 }}>Editar</Typography>
            </Breadcrumbs>
            
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{mb:1}}>
              <EditNoteIcon
                sx={{ 
                  color: theme.palette.primary.main,
                  fontSize: {xs: '1.8rem', md: '2.2rem'}
                }} 
              />
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
                Editar Ativo
              </Typography>
            </Stack>
            
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, maxWidth: 700 }}>
              Modifique as informações do ativo "{asset.name}" abaixo. 
              Clique em "Salvar Alterações" para aplicar as mudanças.
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
                Informações do Ativo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Atualize os campos desejados.
              </Typography>
            </Box>

            <AssetForm
              onSubmit={handleSubmit}
              initialData={asset}
              isSubmitting={isSubmitting}
              submitButtonText="Salvar Alterações"
            />
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default AssetEditPage;