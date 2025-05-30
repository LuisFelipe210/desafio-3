import React from 'react';
import { 
    Paper, Typography, Button, Box, Chip, Stack,
    useTheme, alpha, PaletteColor 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventNoteIcon from '@mui/icons-material/EventNote';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { DashboardUpcomingItem } from '../../types';
import { isValid, parseISO, format, isBefore, isToday, differenceInDays } from 'date-fns';

interface UpcomingMaintenanceItemProps {
  item: DashboardUpcomingItem;
}

interface StatusConfigType {
  colorPalette: PaletteColor;
  icon: React.ReactElement;
  text: string;
  variant: 'outlined' | 'filled';
}

const UpcomingMaintenanceItem: React.FC<UpcomingMaintenanceItemProps> = ({ item }) => {
  const theme = useTheme();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const defaultGreyPaletteColor: PaletteColor = { 
      main: theme.palette.grey[600], 
      light: theme.palette.grey[400],
      dark: theme.palette.grey[700],
      contrastText: theme.palette.getContrastText(theme.palette.grey[600])
  };

  let statusConfig: StatusConfigType = { /* ... (lógica de status como antes, já deve estar OK) ... */ 
    colorPalette: defaultGreyPaletteColor,
    icon: <HelpOutlineIcon fontSize="small" />,
    text: 'Sem Previsão',
    variant: 'outlined'
  };
  let formattedDueDate: string | null = null;

  if (item.next_maintenance_due_date) {
    const dueDate = parseISO(item.next_maintenance_due_date);
    if (isValid(dueDate)) {
      formattedDueDate = format(dueDate, 'dd/MM/yyyy');
      const dueDateStartOfDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

      if (isBefore(dueDateStartOfDay, today)) {
        statusConfig = { colorPalette: theme.palette.error, icon: <EventBusyIcon sx={{fontSize: '1.1rem'}}/>, text: 'VENCIDA', variant: 'filled' };
      } else if (isToday(dueDateStartOfDay)) {
        statusConfig = { colorPalette: theme.palette.warning, icon: <EventAvailableIcon sx={{fontSize: '1.1rem'}}/>, text: 'VENCE HOJE', variant: 'filled' };
      } else {
        const diffDays = differenceInDays(dueDateStartOfDay, today);
        if (diffDays <= 7 && diffDays > 0) {
          statusConfig = { colorPalette: theme.palette.warning, icon: <EventAvailableIcon sx={{fontSize: '1.1rem'}}/>, text: `Em ${diffDays} dia(s)`, variant: 'outlined' };
        } else if (diffDays > 0) {
          statusConfig = { colorPalette: theme.palette.info, icon: <EventNoteIcon sx={{fontSize: '1.1rem'}}/>, text: `Em ${formattedDueDate}`, variant: 'outlined' };
        }
      }
    } else {
      formattedDueDate = 'Data da API Inválida';
      statusConfig = { colorPalette: theme.palette.error, icon: <EventBusyIcon sx={{fontSize: '1.1rem'}}/>, text: 'DATA INVÁLIDA', variant: 'filled' };
    }
  } else if (item.next_maintenance_condition) {
    statusConfig = { colorPalette: theme.palette.info, icon: <SettingsIcon sx={{fontSize: '1.1rem'}}/>, text: `Por Condição`, variant: 'outlined' };
  }

  return (
    <Paper 
      elevation={1}
      sx={{ 
        p: theme.spacing(2), 
        borderRadius: '12px', // Consistente com outros borderRadius
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'row',
        height: '100%', // <<< PARA QUE O GRID/FLEXBOX CONTROLE A ALTURA IGUALMENTE
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[5], // Sombra mais pronunciada no hover
          borderColor: statusConfig.colorPalette.main,
          // transform: 'translateY(-2px)' // Removido pois com height:100% pode ser estranho
        }
      }}
    >
      <Box 
        sx={{ 
          width: '5px', 
          backgroundColor: statusConfig.colorPalette.main, 
          mr: 2, 
          my: -2, 
          borderTopLeftRadius: '10px', // Ajustado para corresponder ao borderRadius do Paper
          borderBottomLeftRadius: '10px',
        }} 
      />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            <Typography 
                variant="h6"
                component="h3" 
                noWrap
                title={item.asset_name}
                sx={{ fontWeight: 600, lineHeight: 1.3 }} // Cor herdada (text.primary)
            >
                {item.asset_name}
            </Typography>
            <Chip 
                icon={statusConfig.icon} 
                label={statusConfig.text} 
                size="small"
                sx={{ 
                    color: statusConfig.variant === 'filled' ? statusConfig.colorPalette.contrastText : statusConfig.colorPalette.dark,
                    backgroundColor: statusConfig.variant === 'filled' ? statusConfig.colorPalette.main : alpha(statusConfig.colorPalette.main, 0.12),
                    fontWeight: 500,
                    '.MuiChip-icon': { 
                        color: statusConfig.variant === 'filled' ? statusConfig.colorPalette.contrastText : statusConfig.colorPalette.dark,
                        marginLeft: '6px', 
                        marginRight: '-4px',
                        fontSize: '1rem' // Ícones do chip menores
                     },
                    height: '24px', // Altura do chip
                    lineHeight: '24px',
                }}
            />
            </Stack>
            {item.last_service_description && (
            <Typography variant="caption" color="text.secondary" noWrap title={item.last_service_description} sx={{ display: 'block', lineHeight: 1.2 }}>
                Ref: {item.last_service_description}
            </Typography>
            )}
        </Stack>
        
        <Stack spacing={0.25} sx={{ my: 1.5 }}> {/* my aumentado para mais espaço */}
            {formattedDueDate && ( // Só mostra se a data formatada existir e for válida
                <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                    Próxima Data: <Box component="span" sx={{ color: statusConfig.colorPalette.dark, fontWeight: 600 }}>{formattedDueDate}</Box>
                </Typography>
            )}
            {item.next_maintenance_condition && (
                <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}> 
                {/* Usando body2 para consistência */}
                    Condição: <Box component="span" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>{item.next_maintenance_condition}</Box>
                </Typography>
            )}
        </Stack>

        <Button
          variant="outlined"
          size="small"
          component={RouterLink}
          to={`/assets/${item.asset_id}`}
        //   fullWidth // Removido para não ocupar largura total dentro do card
          sx={{ 
            mt: 'auto', // Alinha ao final do card
            alignSelf: 'flex-end', // Alinha à direita
            fontWeight: 500,
            // Outros estilos do botão como antes
          }}
          endIcon={<ArrowForwardIcon sx={{fontSize: '1rem'}} />} // Ícone do botão menor
        >
          Detalhes / Registrar
        </Button>
      </Box>
    </Paper>
  );
};

export default UpcomingMaintenanceItem;