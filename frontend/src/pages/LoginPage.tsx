import React from 'react';
import { 
  Typography, 
  Link as MuiLink, 
  Box,
  Container,
  Paper,
  useTheme,
  Fade,
  Divider,
  Avatar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Container 
      component="main" 
      maxWidth="xs" 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', 
        minHeight: 'calc(100vh - 64px)', 
        py: theme.spacing(2) 
      }}
    >
      <Fade in timeout={500}>
        <Paper 
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: theme.spacing(2.5, 3), 
            borderRadius: '12px',
            border: `1px solid ${theme.palette.divider}`,
            width: '100%', 
          }}
        >
          <Avatar sx={{ mt:1, mb: 1.5, bgcolor: 'secondary.main', width: 44, height: 44 }}>
            <LockOutlinedIcon fontSize="medium" />
          </Avatar>
          <Typography 
            component="h1" 
            variant="h5" 
            sx={{ mb: 0.5, fontWeight: 600 }}
          >
            Acessar sua Conta
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, textAlign: 'center' }}>
            Bem-vindo! Insira seus dados para continuar.
          </Typography>

          <LoginForm /> {/* O FORMULÁRIO ENTRA AQUI */}
          
          <Divider sx={{ width: '80%', my: 2.5, borderColor: theme.palette.divider }}>OU</Divider>

          <Box textAlign="center" width="100%">
            <Typography variant="body2" color="text.secondary">
              Não tem uma conta?{' '}
              <MuiLink 
                component={RouterLink} 
                to="/register" 
                variant="body2"
                sx={{ fontWeight: 600 }}
              >
                Crie uma aqui
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Fade>
       <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 4, color: 'text.secondary' }}>
        Alpha Assets © {new Date().getFullYear()}
      </Typography>
    </Container>
  );
};

export default LoginPage;