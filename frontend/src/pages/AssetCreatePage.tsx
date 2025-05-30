import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Alert, 
  Container,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
  IconButton,
  useTheme,
  Fade,
  Stack
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssetForm from '../components/Assets/AssetForm';
import { createAssetService } from '../services/assetService';
import { AssetFormData } from '../types';

const AssetCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: AssetFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await createAssetService(data);
      navigate('/assets'); 
    } catch (err: any) {
      const message = err.response?.data?.message || 'Falha ao criar o ativo. Verifique os dados e tente novamente.';
      setSubmitError(message);
      console.error("Create Asset Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/assets');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}> 
      <Fade in timeout={500}>
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
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
          </Stack>

          <Box sx={{ mb: 4 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
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
              <Typography color="text.primary" sx={{ fontWeight: 500 }}>Adicionar Novo</Typography>
            </Breadcrumbs>
            
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{mb:1}}>
              <AddCircleOutlineIcon 
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
                Adicionar Novo Ativo
              </Typography>
            </Stack>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mt: 0.5, maxWidth: 700 }} 
            >
              Preencha as informações abaixo para adicionar um novo ativo ao seu sistema. 
              Certifique-se de que todos os campos obrigatórios (*) estão corretos.
            </Typography>
          </Box>

          {/* Error Alert */}
          {submitError && (
            <Fade in>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: theme.shape.borderRadius, 
                  boxShadow: theme.shadows[2] 
                }}
                onClose={() => setSubmitError(null)} 
              >
                {submitError}
              </Alert>
            </Fade>
          )}

          {/* Form Section */}
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
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 0.5
                }}
              >
                Detalhes do Ativo
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
              >
                Forneça um nome e, opcionalmente, uma descrição detalhada.
              </Typography>
            </Box>

            <AssetForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitButtonText="Criar Ativo"
            />
          </Paper>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Após a criação, você será redirecionado para a lista de seus ativos.
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default AssetCreatePage;