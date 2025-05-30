import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { MaintenanceRecord, MaintenanceFormData } from '../../types'; 

interface MaintenanceFormProps {
  onSubmit: (data: MaintenanceFormData) => Promise<void>;
  initialData?: Partial<MaintenanceRecord> | null; // Para edição futura
  isSubmitting: boolean;
  submitError?: string | null;
  submitButtonText?: string;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  onSubmit,
  initialData,
  isSubmitting,
  submitError,
  submitButtonText = "Salvar Manutenção"
}) => {
  const [serviceDescription, setServiceDescription] = useState('');
  const [datePerformed, setDatePerformed] = useState('');
  const [notes, setNotes] = useState('');
  const [nextMaintenanceDueDate, setNextMaintenanceDueDate] = useState('');
  const [nextMaintenanceCondition, setNextMaintenanceCondition] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setServiceDescription(initialData.service_description || '');
      setDatePerformed(initialData.date_performed ? initialData.date_performed.split('T')[0] : ''); 
      setNotes(initialData.notes || '');
      setNextMaintenanceDueDate(initialData.next_maintenance_due_date ? initialData.next_maintenance_due_date.split('T')[0] : '');
      setNextMaintenanceCondition(initialData.next_maintenance_condition || '');
    }
  }, [initialData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!serviceDescription.trim() || !datePerformed.trim()) {
      setFormError('A descrição do serviço e a data de realização são obrigatórias.');
      return;
    }
    if (isNaN(new Date(datePerformed).getTime())) {
        setFormError('Formato da data de realização inválido. Use AAAA-MM-DD.');
        return;
    }
    if (nextMaintenanceDueDate && isNaN(new Date(nextMaintenanceDueDate).getTime())) {
        setFormError('Formato da data da próxima manutenção inválido. Use AAAA-MM-DD.');
        return;
    }


    const formData: MaintenanceFormData = {
      service_description: serviceDescription,
      date_performed: datePerformed,
      notes: notes.trim() || undefined,
      next_maintenance_due_date: nextMaintenanceDueDate.trim() || undefined,
      next_maintenance_condition: nextMaintenanceCondition.trim() || undefined,
    };
    await onSubmit(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, mx: 'auto', p: 2 }}
    >
      {formError && <Alert severity="warning" sx={{ width: '100%', mb: 2 }}>{formError}</Alert>}
      {submitError && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{submitError}</Alert>}

      <TextField
        label="Descrição do Serviço"
        variant="outlined"
        value={serviceDescription}
        onChange={(e) => setServiceDescription(e.target.value)}
        required
        fullWidth
        disabled={isSubmitting}
      />
      <TextField
        label="Data de Realização"
        type="date" 
        InputLabelProps={{ shrink: true }} 
        variant="outlined"
        value={datePerformed}
        onChange={(e) => setDatePerformed(e.target.value)}
        required
        fullWidth
        disabled={isSubmitting}
      />
      <TextField
        label="Notas (Opcional)"
        variant="outlined"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        multiline
        rows={3}
        fullWidth
        disabled={isSubmitting}
      />
      <Typography variant="subtitle1" sx={{mt: 1, mb: -1}}>Próxima Manutenção (Opcional)</Typography>
      <TextField
        label="Data Prevista (Próxima)"
        type="date"
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        value={nextMaintenanceDueDate}
        onChange={(e) => setNextMaintenanceDueDate(e.target.value)}
        fullWidth
        disabled={isSubmitting}
      />
      <TextField
        label="Condição (Ex: 10.000 km)"
        variant="outlined"
        value={nextMaintenanceCondition}
        onChange={(e) => setNextMaintenanceCondition(e.target.value)}
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

export default MaintenanceForm;