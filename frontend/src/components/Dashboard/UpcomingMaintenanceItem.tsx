import React from 'react';
import { 
    Paper, 
    Typography, 
    Button, 
    Box, 
    Chip, 
    Stack, 
    useTheme,
    alpha 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SettingsIcon from '@mui/icons-material/Settings'; 
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { DashboardUpcomingItem } from '../../types';
import { isValid, parseISO, format, isBefore, isToday, differenceInDays } from 'date-fns';

interface UpcomingMaintenanceItemProps {
  item: DashboardUpcomingItem;
}

const UpcomingMaintenanceItem: React.FC<UpcomingMaintenanceItemProps> = ({ item }) => {
  const theme = useTheme();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let statusKey: 'overdue' | 'due_today' | 'due_soon' | 'condition' | 'upcoming' = 'upcoming';
  let statusConfig = {
    color: theme.palette.info, // Cor MUI completa
    icon: <EventNoteIcon />,
    text: 'Próxima Manutenção',
    variant: 'outlined' as 'outlined' | 'filled'
  };

  let formattedDueDate: string | null = null;
  let dateToSortBy: Date | null = null;

  if (item.next_maintenance_due_date) {
    const dueDate = parseISO(item.next_maintenance_due_date);
    if (isValid(dueDate)) {
      dateToSortBy = dueDate;
      formattedDueDate = format(dueDate, 'dd/MM/yyyy');
      const dueDateStartOfDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

      if (isBefore(dueDateStartOfDay, today)) {
        statusKey = 'overdue';
        statusConfig = { color: theme.palette.error, icon: <EventBusyIcon />, text: 'VENCIDA', variant: 'filled' };
      } else if (isToday(dueDateStartOfDay)) {
        statusKey = 'due_today';
        statusConfig = { color: theme.palette.warning, icon: <EventAvailableIcon />, text: 'VENCE HOJE', variant: 'filled' };
      } else {
        const diffDays = differenceInDays(dueDateStartOfDay, today);
        if (diffDays <= 7 && diffDays > 0) {
          statusKey = 'due_soon';
          statusConfig = { color: theme.palette.warning, icon: <EventAvailableIcon />, text: `Vence em ${diffDays} dia(s)`, variant: 'outlined' };
        } else if (diffDays > 0) {
          statusKey = 'upcoming';
          statusConfig = { color: theme.palette.info, icon: <EventNoteIcon />, text: `Em ${formattedDueDate}`, variant: 'outlined' };
        }
      }
    } else {
      formattedDueDate = 'Data Inválida';
      statusConfig = { color: theme.palette.error, icon: <EventBusyIcon />, text: 'Data Inválida', variant: 'filled' };
    }
  } else if (item.next_maintenance_condition) {
    statusKey = 'condition';
    statusConfig = { color: theme.palette.info, icon: <SettingsIcon />, text: `Por Condição`, variant: 'outlined' };
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: theme.spacing(2.5), 
        mb: theme.spacing(2.5),
        borderRadius: 3, 
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper, 
        display: 'flex',
        flexDirection: 'row',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[4],
          borderColor: statusConfig.color.main,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Box 
        sx={{ 
          width: '6px', 
          backgroundColor: statusConfig.color.main, 
          mr: 2.5, 
          borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`
        }} 
      />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box sx={{flexGrow:1, overflow:'hidden'}}>
            <Typography 
              variant="h6" 
              component="h3" 
              noWrap 
              title={item.asset_name}
              sx={{ fontWeight: 600, color: theme.palette.text.primary }}
            >
              {item.asset_name}
            </Typography>
            {item.last_service_description && (
              <Typography variant="caption" color="text.secondary" noWrap title={item.last_service_description} display="block">
                Ref: {item.last_service_description}
              </Typography>
            )}
          </Box>
          <Chip 
            icon={statusConfig.icon} 
            label={statusConfig.text} 
            sx={{ 
                backgroundColor: alpha(statusConfig.color.main, statusConfig.variant === 'filled' ? 0.16 : 0.08), // Fundo mais sutil
                color: statusConfig.color.dark, 
                fontWeight: 500,
                '.MuiChip-icon': { color: statusConfig.color.main }
            }} 
            size="small"
           />
        </Stack>
      
        <Box sx={{ my: 1.5 }}> 
            {formattedDueDate && (
                <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                    Data Prevista: <Box component="span" sx={{ color: statusConfig.color.dark, fontWeight: 600 }}>{formattedDueDate}</Box>
                </Typography>
            )}
            {item.next_maintenance_condition && (
                <Typography variant="body2" color="text.secondary">
                    Condição: <Box component="span" sx={{ color: theme.palette.text.primary, fontStyle: 'italic' }}>{item.next_maintenance_condition}</Box>
                </Typography>
            )}
        </Box>

        <Button
          variant="outlined"
          size="small"
          component={RouterLink}
          to={`/assets/${item.asset_id}`}
          fullWidth 
          sx={{ 
            mt: 'auto',
            fontWeight: 500,
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.main,
            '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.08)
            },
          }}
          endIcon={<ArrowForwardIcon />}
        >
          Detalhes do Ativo & Manutenções
        </Button>
      </Box>
    </Paper>
  );
};

export default UpcomingMaintenanceItem;