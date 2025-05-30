import React from 'react';
import { 
    Paper,
    Typography, 
    Button, 
    IconButton, 
    Box, 
    Stack,
    useTheme,
    alpha,
    Chip,
    Avatar 
} from '@mui/material';
import { BoxProps } from '@mui/material/Box'; 
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';
import { Asset } from '../../types';

interface AssetCardProps {
  asset: Asset;
  onDelete: (assetId: number) => void;
  sx?: BoxProps['sx']; 
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onDelete, sx }) => {
  const theme = useTheme();

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o ativo "${asset.name}"? Esta ação não pode ser desfeita e excluirá todas as manutenções associadas.`)) {
      onDelete(asset.id);
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: theme.spacing(2.5),
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
          borderColor: theme.palette.primary.main
        },
        ...sx 
      }}
    >
      <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5,  overflow: 'hidden' }}>
                <Avatar 
                    sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.15), 
                        color: theme.palette.primary.main,
                        width: 40, height: 40
                    }}
                >
                    <DevicesOtherIcon />
                </Avatar>
                <Box sx={{overflow: 'hidden'}}>
                    <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                        noWrap
                        title={asset.name}
                    >
                        {asset.name}
                    </Typography>
                    <Chip 
                        label={`ID: ${asset.id}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontFamily: 'monospace', mt: 0.5, borderColor: theme.palette.divider }}
                    />
                </Box>
            </Box>
             <Stack direction="row" spacing={0.5}>
                <IconButton
                    component={RouterLink}
                    to={`/assets/${asset.id}/edit`}
                    aria-label="edit asset"
                    size="small"
                    sx={{color: theme.palette.text.secondary, '&:hover': {color: theme.palette.primary.main, backgroundColor: theme.palette.action.hover}}}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                    onClick={handleDelete} 
                    aria-label="delete asset" 
                    size="small"
                    sx={{color: theme.palette.text.secondary, '&:hover': {color: theme.palette.error.main, backgroundColor: theme.palette.action.hover}}}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Stack>
        </Stack>

        {asset.description && (
          <Typography variant="body2" color="text.secondary" sx={{ 
              mt: 1, 
              display: '-webkit-box',
              '-webkit-line-clamp': 3,
              '-webkit-box-orient': 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '3.6em' 
            }}
            title={asset.description}
          >
            {asset.description}
          </Typography>
        )}
      </Stack>
      
      <Button
        variant="outlined"
        fullWidth
        size="medium"
        component={RouterLink}
        to={`/assets/${asset.id}`}
        startIcon={<VisibilityIcon />}
        endIcon={<ArrowForwardIcon />}
        sx={{ 
            mt: 2, 
            fontWeight: 500,
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.main,
             '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.08)
            },
        }}
      >
        Ver Detalhes e Manutenções
      </Button>
    </Paper>
  );
};

export default AssetCard;