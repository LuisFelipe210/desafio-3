import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Container,
  Paper,
  Stack,
  useTheme,
  Fade,
  Skeleton,
  Button,
  Chip
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { getUpcomingMaintenanceService } from '../services/dashboardService';
import { DashboardUpcomingItem as UpcomingItemType } from '../types';
import UpcomingMaintenanceItem from '../components/Dashboard/UpcomingMaintenanceItem';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RefreshIcon from '@mui/icons-material/Refresh';
import { alpha } from '@mui/material/styles';


const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [upcomingItems, setUpcomingItems] = useState<UpcomingItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUpcomingMaintenanceService();
      setUpcomingItems(data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Falha ao carregar dados do dashboard.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);


  const NoItemsContent = () => (
    <Paper 
        elevation={0} 
        sx={{ 
            textAlign: 'center', 
            p: {xs: 3, md: 5}, 
            border: `2px dashed ${theme.palette.divider}`, 
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.success.main, 0.05)
        }}
    >
      <NotificationsActiveIcon sx={{ fontSize: 60, color: theme.palette.success.main, mb: 2, opacity: 0.7 }} />
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 500, color: theme.palette.success.dark }}>
        Tudo em Dia!
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Nenhuma manutenção próxima ou pendente encontrada no momento. Continue assim!
      </Typography>
    </Paper>
  );

  if (loading) {
    
    const skeletonCount = 4; 
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Skeleton variant="text" width="60%" height={60} animation="wave" />
            <Skeleton variant="rectangular" width={120} height={40} animation="wave" sx={{borderRadius: 2}}/>
          </Stack>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing(2.5) }}>
            {Array.from(new Array(skeletonCount)).map((_, index) => (
              <Box 
                key={index}
                sx={{ 
                  flexGrow: 1, 
                  flexBasis: {
                      xs: '100%',
                      sm: `calc(50% - ${theme.spacing(1.25)})`, 
                      md: `calc(33.333% - ${theme.spacing(1.66)})`,
                      lg: `calc(25% - ${theme.spacing(1.875)})` 
                  },
                  minWidth: {sm: 280} 
                }}
              >
                <Skeleton variant="rectangular" height={180} animation="wave" sx={{borderRadius: 3}} />
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
            <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between"  >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <NotificationsActiveIcon sx={{  }} />
                <Typography variant="h3"  > Painel de Alertas </Typography>
                <Chip label={`${upcomingItems.length} ${upcomingItems.length === 1 ? 'alerta' : 'alertas'}`}  />
              </Stack>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchDashboardData}  > Atualizar </Button>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              Olá, <Box component="span" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>{user?.email || 'Usuário'}</Box>! 
              Aqui estão as manutenções que requerem sua atenção.
            </Typography>
          </Box>

          {error && ( 
            <Fade in>
              <Alert  > {error} </Alert>
            </Fade>
          )}
          
          {!loading && !error && upcomingItems.length === 0 && <NoItemsContent />}

          {upcomingItems.length > 0 && !error && (
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: cardSpacing,
                }}
            >
              {upcomingItems.map((item) => (
                <Box 
                  key={`${item.asset_id}-${item.maintenance_record_id || item.next_maintenance_condition || 'item'}`}
                  sx={{
                    flexGrow: 1,
                    flexShrink: 0, 
                    flexBasis: {
                        xs: '100%',
                        sm: `calc(50% - ${cardSpacing})`, 
                        md: `calc(33.333% - ${cardSpacing})`,
                        lg: `calc(25% - ${cardSpacing})`,
                    },
                   
                    minWidth: { xs: 'none', sm: '280px' }, 
                  }}
                >
                  <UpcomingMaintenanceItem 
                    item={item} 
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

export default DashboardPage;