import React from 'react';
import { Card, CardContent, Typography, CardActions, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink } from 'react-router-dom'; 
import { MaintenanceRecord } from '../../types';

interface MaintenanceCardProps {
  record: MaintenanceRecord;
  onDelete: (recordId: number) => void;
}

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({ record, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir este registro de manutenção ("${record.service_description}") realizado em ${new Date(record.date_performed).toLocaleDateString()}?`)) {
      onDelete(record.id);
    }
  };

  return (
    <Card sx={{ mb: 2 }} variant="outlined">
      <CardContent>
        {/* ... (conteúdo como antes) ... */}
        <Typography variant="h6" component="div">
          {record.service_description}
        </Typography>
        <Typography sx={{ mb: 1 }} color="text.secondary">
          Realizado em: {new Date(record.date_performed).toLocaleDateString()}
        </Typography>
        {record.notes && (
          <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
            <strong>Notas:</strong> {record.notes}
          </Typography>
        )}
        {(record.next_maintenance_due_date || record.next_maintenance_condition) && (
            <Box sx={{mt:1, p: 1, backgroundColor: 'action.hover', borderRadius: 1}}>
                <Typography variant="subtitle2" component="div">Próxima Manutenção:</Typography>
                {record.next_maintenance_due_date && (
                <Typography variant="body2" component="div">
                    Data Prevista: {new Date(record.next_maintenance_due_date.split('T')[0] + 'T00:00:00').toLocaleDateString()}
                </Typography>
                )}
                {record.next_maintenance_condition && (
                <Typography variant="body2" component="div">
                    Condição: {record.next_maintenance_condition}
                </Typography>
                )}
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <IconButton 
            aria-label="edit" 
            color="primary" 
            component={RouterLink} 
            to={`/maintenance/${record.id}/edit`} 
        >
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleDelete} aria-label="delete" color="error">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default MaintenanceCard;