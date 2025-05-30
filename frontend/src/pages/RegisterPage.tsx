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
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'; 
import RegisterForm from '../components/Auth/RegisterForm'; 

const RegisterPage: React.FC = () => {
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
            padding: theme.spacing(3, 3), 
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 48, height: 48 }}> 
            <PersonAddAlt1Icon fontSize="medium" />
          </Avatar>
          <Typography 
            component="h1" 
            variant="h5" 
            sx={{ 
                mb: 1, 
                fontWeight: 600,
            }}
          >
            Criar Nova Conta
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, textAlign: 'center' }}>
            É rápido e fácil. Preencha os campos abaixo.
          </Typography>

          <RegisterForm /> 
          
          <Divider sx={{ width: '80%', my: 2.5, borderColor: theme.palette.divider }}>OU</Divider>

          <Box textAlign="center" width="100%">
            <Typography variant="body2" color="text.secondary">
              Já possui uma conta?{' '}
              <MuiLink 
                component={RouterLink} 
                to="/login" 
                variant="body2"
                sx={{ fontWeight: 600 }}
              >
                Acesse aqui
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

export default RegisterPage;