import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
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
  Chip,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ViewListIcon from '@mui/icons-material/ViewList';
import { getAssetsService, deleteAssetService } from '../services/assetService';
import { Asset } from '../types';
import AssetCard from '../components/Assets/AssetCard'; 
import { alpha } from '@mui/material/styles'; 

const AssetsListPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAssetsService();
      setAssets(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Falha ao buscar seus ativos.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDeleteAsset = async (assetId: number) => {
    try {
      await deleteAssetService(assetId);
      setAssets(prevAssets => prevAssets.filter(asset => asset.id !== assetId));
    } catch (err: any) {
      const message = err.response?.data?.message || `Falha ao deletar o ativo.`;
      setError(message);
    }
  };

  const NoAssetsContent = () => (
    <Paper 
        elevation={0} 
        sx={{ 
            textAlign: 'center', 
            p: 4, 
            border: `2px dashed ${theme.palette.divider}`, 
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.action.hover, 0.5)
        }}
    >
      <ViewListIcon sx={{ fontSize: 60, color: theme.palette.text.disabled, mb: 2 }} />
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
        Nenhum ativo cadastrado ainda
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Comece adicionando seu primeiro equipamento ou veículo para gerenciamento.
      </Typography>
      <Button 
        component={RouterLink} to="/assets/new" variant="contained" color="primary"
        startIcon={<AddCircleOutlineIcon />} size="large" sx={{ fontWeight: 600, borderRadius: 2 }}
      > Adicionar Novo Ativo </Button>
    </Paper>
  );


  if (loading) {
    
    const skeletonCount = 3; 
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Skeleton variant="text" width={200} height={60} animation="wave" />
                <Skeleton variant="rectangular" width={180} height={40} animation="wave" sx={{borderRadius: 2}} />
            </Stack>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing(3) }}>
                {Array.from(new Array(skeletonCount)).map((_, index) => (
                    <Box 
                        key={index}
                        sx={{ 
                            flexGrow: 1, 
                            flexBasis: { 
                                xs: '100%', 
                                sm: `calc(50% - ${theme.spacing(1.5)})`, 
                                md: `calc(33.333% - ${theme.spacing(2)})`,
                                lg: `calc(25% - ${theme.spacing(2.25)})`
                                },
                            
                        }}
                    >
                        <Skeleton variant="rectangular" height={150} animation="wave" sx={{borderRadius: 3}} />
                    </Box>
                ))}
            </Box>
        </Stack>
      </Container>
    );
  }

  const cardSpacing = theme.spacing(2.5); 

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={500}>
        <Box>
          
           <Box sx={{ mb: 4 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <MuiLink component={RouterLink} to="/dashboard"  >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Dashboard
              </MuiLink>
              <Typography color="text.primary" sx={{ fontWeight: 500 }}>Meus Ativos</Typography>
            </Breadcrumbs>
            <Stack direction={{xs: 'column', sm: 'row'}}  >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <ViewListIcon sx={{  }} />
                <Typography variant="h3"  > Meus Ativos </Typography>
                <Chip label={`${assets.length} ${assets.length === 1 ? 'ativo' : 'ativos'}`}  />
              </Stack>
              <Button component={RouterLink} to="/assets/new"  > Adicionar Novo Ativo </Button>
            </Stack>
          </Box>

          {error && ( 
             <Fade in>
                <Alert  > {error} </Alert>
            </Fade>
          )}
          
          {!loading && assets.length === 0 && !error && <NoAssetsContent />}

          {assets.length > 0 && !error && (
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: cardSpacing, 
                
              }}
            >
              {assets.map((asset) => (
                <Box 
                  key={asset.id}
                  sx={{
                    flexGrow: 0, 
                    flexShrink: 0,
                    flexBasis: {
                        xs: '100%',                                         // 1 card por linha
                        sm: `calc(50% - (${cardSpacing} / 2))`,             // 2 cards por linha
                        md: `calc(33.333% - (${cardSpacing} * 2 / 3))`,     // 3 cards por linha
                        lg: `calc(25% - (${cardSpacing} * 3 / 4))`,         // 4 cards por linha
                    },
                    
                  }}
                >
                  <AssetCard 
                    asset={asset} 
                    onDelete={handleDeleteAsset} 
                    />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Fade>
    </Container>
  );
};

export default AssetsListPage;