import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginUser } from '../../services/authService';
import { 
  TextField, 
  Button, 
  Box, 
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  useTheme
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await loginUser({ email, password });
      auth.login(response.token, response.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1.5), 
      }}
    >
      {error && (
        <Alert 
            severity="error" 
            sx={{ 
                width: '100%', 
                borderRadius: '8px', 
                // mb: 0.5 
            }}
            onClose={() => setError(null)}
        >
            {error}
        </Alert>
      )}
      
      <TextField
        label="Email"
        type="email"
        variant="outlined"
        size="small"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        autoComplete="email"
        disabled={isLoading}
        InputProps={{ sx: { borderRadius: '8px', fontSize: '0.9rem' } }} 
        InputLabelProps={{ sx: { fontSize: '0.9rem' } }}
      />
      <TextField
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        size="small"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        autoComplete="current-password"
        disabled={isLoading}
        InputProps={{
          sx: { borderRadius: '8px', fontSize: '0.9rem' }, 
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="small"
              >
                {showPassword ? <VisibilityOff fontSize="inherit"/> : <Visibility fontSize="inherit"/>} 
              </IconButton>
            </InputAdornment>
          ),
        }}
        InputLabelProps={{ sx: { fontSize: '0.9rem' } }}
      />
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        fullWidth 
        disabled={isLoading}
        sx={{ 
          mt: theme.spacing(1),
          py: theme.spacing(1),
          fontWeight: 600,
          fontSize: '0.875rem',
          borderRadius: '8px', 
          boxShadow: theme.shadows[2], 
          '&:hover': {
            boxShadow: theme.shadows[4],
          }
        }}
      >
        {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Entrar'}
      </Button>
    </Box>
  );
};

export default LoginForm;