import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, NavLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  SxProps,
  Theme,
  useTheme
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../hooks/useAuth';
import { alpha } from '@mui/material/styles';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleOpenMobileMenu = (event: React.MouseEvent<HTMLElement>) => setMobileMenuAnchorEl(event.currentTarget);
  const handleCloseMobileMenu = () => setMobileMenuAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    handleCloseMobileMenu();
    navigate('/login');
  };

  const getAvatarLetters = (email: string | undefined | null): string => {
    if (!email) return '?';
    const parts = email.split('@')[0].split(/[.\-_ ]/);
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : email.substring(0, 2).toUpperCase();
  };
  
  // Função para verificar se uma rota está ativa
  const isRouteActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // Estilos base para os botões de navegação
  const getNavButtonSx = (path: string, isMobile = false): SxProps<Theme> => ({
    padding: theme.spacing(0.75, 1.5),
    borderRadius: theme.shape.borderRadius,
    fontWeight: isRouteActive(path) ? 700 : 500,
    color: isRouteActive(path) ? theme.palette.primary.main : theme.palette.text.primary,
    textDecoration: 'none',
    width: isMobile ? '100%' : 'auto',
    justifyContent: isMobile ? 'flex-start' : 'center',
    '&:hover': {
      backgroundColor: alpha(theme.palette.action.hover, 0.7),
    },
  });

  const renderNavLinks = (isMobile = false) => (
    <>
      <Button
        component={RouterLink}
        to="/dashboard"
        sx={getNavButtonSx('/dashboard', isMobile)}
        onClick={isMobile ? handleCloseMobileMenu : undefined}
      >
        <DashboardIcon sx={{ mr: isMobile ? 1 : 0.5, fontSize: isMobile ? '1.25rem' : '1rem' }} />
        Dashboard
      </Button>
      <Button
        component={RouterLink}
        to="/assets"
        sx={getNavButtonSx('/assets', isMobile)}
        onClick={isMobile ? handleCloseMobileMenu : undefined}
      >
        <ListAltIcon sx={{ mr: isMobile ? 1 : 0.5, fontSize: isMobile ? '1.25rem' : '1rem' }} />
        Meus Ativos
      </Button>
    </>
  );

  return (
    <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
            backgroundColor: theme.palette.background.paper, 
            borderBottom: `1px solid ${theme.palette.divider}` 
        }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: theme.palette.primary.main,
            fontWeight: 700,
          }}
        >
          Alpha Assets
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {isAuthenticated && renderNavLinks()}
        </Box>

        {isAuthenticated ? (
          <Box sx={{ ml: 2 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 36, height: 36, fontSize: '0.875rem' }}>
                {getAvatarLetters(user?.email)}
              </Avatar>
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Box sx={{ py:1, px: 2}}>
                <Typography variant="subtitle1" component="div" noWrap>{user?.email}</Typography>
                <Typography variant="caption" color="text.secondary" display="block" noWrap>Usuário Logado</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><ExitToAppIcon fontSize="small" /></ListItemIcon>
                Sair
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button 
              component={RouterLink} 
              to="/login" 
              sx={{
                padding: theme.spacing(0.75, 1.5),
                borderRadius: theme.shape.borderRadius,
                fontWeight: 500,
                color: theme.palette.text.primary,
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.action.hover, 0.7),
                },
              }}
            >
              Entrar
            </Button>
            <Button 
              component={RouterLink} 
              to="/register" 
              sx={{
                padding: theme.spacing(0.75, 1.5),
                borderRadius: theme.shape.borderRadius,
                fontWeight: 500,
                color: theme.palette.text.primary,
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.action.hover, 0.7),
                },
              }}
            >
              Registrar
            </Button>
          </Box>
        )}

        {/* Menu Mobile */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}>
          <IconButton
            size="large"
            onClick={handleOpenMobileMenu}
            sx={{color: theme.palette.text.primary}}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={mobileMenuAnchorEl}
            open={Boolean(mobileMenuAnchorEl)}
            onClose={handleCloseMobileMenu}
            sx={{ display: { xs: 'block', md: 'none' } }}
            MenuListProps={{ sx: { py: 0 } }}
          >
            {isAuthenticated ? (
              <Box>
                <MenuItem
                    component={RouterLink}
                    to="/dashboard"
                    onClick={handleCloseMobileMenu}
                    sx={getNavButtonSx('/dashboard', true)}
                >
                    <DashboardIcon sx={{ mr: 1, fontSize: '1.25rem' }} /> Dashboard
                </MenuItem>
                <MenuItem
                    component={RouterLink}
                    to="/assets"
                    onClick={handleCloseMobileMenu}
                    sx={getNavButtonSx('/assets', true)}
                >
                    <ListAltIcon sx={{ mr: 1, fontSize: '1.25rem' }} /> Meus Ativos
                </MenuItem>
              </Box>
            ) : (
              <Box>
                <MenuItem onClick={() => { navigate('/login'); handleCloseMobileMenu(); }}>Login</MenuItem>
                <MenuItem onClick={() => { navigate('/register'); handleCloseMobileMenu(); }}>Registrar</MenuItem>
              </Box>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;