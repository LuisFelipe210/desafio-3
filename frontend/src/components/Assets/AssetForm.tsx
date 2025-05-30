  import React, { useState, useEffect } from 'react';
  import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
  import { Asset, AssetFormData } from '../../types';

  interface AssetFormProps {
    onSubmit: (data: AssetFormData) => Promise<void>; // Função que lida com o envio do formulário
    initialData?: Asset | null; // Dados iniciais para preencher o formulário (para edição)
    isSubmitting: boolean; // Indica se o formulário está sendo enviado
    submitError?: string | null; // Mensagem de erro do envio
    submitButtonText?: string;
  }

  const AssetForm: React.FC<AssetFormProps> = ({
    onSubmit,
    initialData,
    isSubmitting,
    submitError,
    submitButtonText = "Salvar Ativo"
  }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
      if (initialData) {
        setName(initialData.name);
        setDescription(initialData.description || '');
      }
    }, [initialData]);

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      setFormError(null);

      if (!name.trim()) {
        setFormError('O nome do ativo é obrigatório.');
        return;
      }

      const formData: AssetFormData = {
        name,
        description: description.trim() || undefined, // Envia undefined se vazio para ser null no backend
      };
      await onSubmit(formData);
    };

    return (
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 600,
          mx: 'auto', // Centraliza o formulário
          p: 2, // Padding
        }}
      >
        {formError && <Alert severity="warning" sx={{ width: '100%', mb: 2 }}>{formError}</Alert>}
        {submitError && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{submitError}</Alert>}

        <TextField
          label="Nome do Ativo"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          disabled={isSubmitting}
        />
        <TextField
          label="Descrição (Opcional)"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          fullWidth
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : submitButtonText}
        </Button>
      </Box>
    );
  };

  export default AssetForm;