import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { registerUser } from '../../services/authService';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const response = await registerUser({ email, password });
      auth.login(response.token, response.user); // Loga o usuário automaticamente após o registro
      navigate('/dashboard'); // Redireciona para o dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha no registro. Tente novamente.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        mt: 4,
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        maxWidth: 400,
        mx: 'auto',
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Registrar
      </Typography>
      {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
      <TextField
        label="Email"
        type="email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Senha"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        helperText="A senha deve ter pelo menos 6 caracteres."
      />
      <TextField
        label="Confirmar Senha"
        type="password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
        {isLoading ? 'Registrando...' : 'Registrar'}
      </Button>
    </Box>
  );
};

export default RegisterForm;