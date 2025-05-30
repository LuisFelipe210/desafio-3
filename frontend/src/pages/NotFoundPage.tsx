import React from 'react';
import { 
  Typography, 
  Box, 
  Button,
  Container,
  Paper,
  useTheme,
  Fade
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'; 
import HomeIcon from '@mui/icons-material/Home';

const NotFoundPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Container 
        component="main" 
        maxWidth="sm" 
        sx={{ 
            py: {xs: 6, md: 10}, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 64px - 64px)' 
        }}
    >
      <Fade in timeout={500}>
        <Paper
          elevation={0}
          sx={{
            p: {xs: 3, sm: 5}, 
            textAlign: 'center',
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            width: '100%'
          }}
        >
          <ReportProblemOutlinedIcon 
            sx={{ 
              fontSize: {xs: 70, sm: 90},
              color: theme.palette.warning.main, 
              mb: 2 
            }} 
          />
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ fontWeight: 700, color: theme.palette.text.primary }}
          >
            Oops! Página Não Encontrada
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ mb: 4, fontWeight: 400 }}
          >
            Não conseguimos encontrar a página que você está procurando (Erro 404).
          </Typography>
          <Button 
            component={RouterLink} 
            to="/dashboard" 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<HomeIcon />}
            sx={{ 
              fontWeight: 600, 
              borderRadius: 2,
              px: 4, 
              py: 1.5,
              textTransform: 'none'
            }}
          >
            Ir para o Painel Principal
          </Button>
        </Paper>
      </Fade>
      <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 5, color: 'text.secondary' }}>
          Se você acha que isso é um erro, por favor, contate o suporte.
      </Typography>
    </Container>
  );
};

export default NotFoundPage;