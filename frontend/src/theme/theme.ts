import { createTheme, alpha } from '@mui/material/styles';


const PRIMARY_MAIN = '#007BFF'; 
const PRIMARY_LIGHT = alpha(PRIMARY_MAIN, 0.8);
const PRIMARY_DARK = alpha(PRIMARY_MAIN, 0.9);

const SECONDARY_MAIN = '#48C9B0'; 
const SECONDARY_LIGHT = alpha(SECONDARY_MAIN, 0.8);
const SECONDARY_DARK = alpha(SECONDARY_MAIN, 0.9);

const BACKGROUND_DEFAULT = '#F4F6F8'; 
const BACKGROUND_PAPER = '#FFFFFF';   

const TEXT_PRIMARY = '#212B36';   
const TEXT_SECONDARY = '#637381'; 
const TEXT_DISABLED = '#919EAB';  

const BORDER_RADIUS_BASE = 8; 

// Criação do tema
const theme = createTheme({
  palette: {
    mode: 'light', 
    primary: {
      main: PRIMARY_MAIN,
      light: PRIMARY_LIGHT,
      dark: PRIMARY_DARK,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: SECONDARY_MAIN,
      light: SECONDARY_LIGHT,
      dark: SECONDARY_DARK,
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF5630', 
    },
    warning: {
      main: '#FFAB00', 
    },
    info: {
      main: '#00B8D9', 
    },
    success: {
      main: '#36B37E', 
    },
    background: {
      default: BACKGROUND_DEFAULT,
      paper: BACKGROUND_PAPER,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
      disabled: TEXT_DISABLED,
    },
    divider: alpha(TEXT_PRIMARY, 0.12), 
    action: { 
      active: alpha(TEXT_PRIMARY, 0.54),
      hover: alpha(PRIMARY_MAIN, 0.08),
      selected: alpha(PRIMARY_MAIN, 0.16),
      disabled: alpha(TEXT_PRIMARY, 0.26),
      disabledBackground: alpha(TEXT_PRIMARY, 0.12),
      focus: alpha(PRIMARY_MAIN, 0.12),
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontSize: '2.5rem', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.5px' },
    h2: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.25px' },
    h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.3, letterSpacing: '0px' },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.33, letterSpacing: '0.15px' },
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.35, letterSpacing: '0.15px' },
    h6: { fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.15px' },
    subtitle1: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.5, letterSpacing: '0.15px' },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.57, letterSpacing: '0.1px' },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5, letterSpacing: '0.15px' },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.57, letterSpacing: '0.1px' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.4px' },
    caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.66, letterSpacing: '0.4px', color: TEXT_SECONDARY },
    overline: { fontSize: '0.75rem', fontWeight: 600, lineHeight: 2.66, letterSpacing: '1px', textTransform: 'uppercase' },
  },
  shape: {
    borderRadius: BORDER_RADIUS_BASE,
  },
  components: {
    // AppBar
    MuiAppBar: {
      defaultProps: {
        elevation: 0, 
        color: 'inherit', 
      },
      styleOverrides: {
        root: {
          backgroundColor: BACKGROUND_PAPER, 
          borderBottom: `1px solid ${alpha(TEXT_PRIMARY, 0.08)}`, 
        },
        colorInherit: { 
            color: TEXT_PRIMARY,
        }
      },
    },
    // Button
    MuiButton: {
      defaultProps: {
        disableElevation: true, 
      },
      styleOverrides: {
        root: {
          padding: '8px 20px', 
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: PRIMARY_DARK,
          },
        },
        outlinedPrimary: {
          borderColor: alpha(PRIMARY_MAIN, 0.5),
          '&:hover': {
            borderColor: PRIMARY_MAIN,
            backgroundColor: alpha(PRIMARY_MAIN, 0.04),
          },
        },
      },
    },
    // Card
    MuiCard: {
      defaultProps: {
        elevation: 0, 
      },
      styleOverrides: {
        root: {
          border: `1px solid ${alpha(TEXT_PRIMARY, 0.08)}`,
         
          '&:hover': {
          boxShadow: `0 4px 12px ${alpha(TEXT_PRIMARY, 0.08)}`,
         },
        },
      },
    },
    // TextField & Input
    MuiOutlinedInput: {
      styleOverrides: {
        root: {

          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(TEXT_PRIMARY, 0.4),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: PRIMARY_MAIN,
            borderWidth: '1px', 
          },
        },
        notchedOutline: { 
          borderColor: alpha(TEXT_PRIMARY, 0.23),
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          
          '&.Mui-focused': { 
            color: PRIMARY_MAIN,
          },
        },
      },
    },
   
    MuiPaper: {
      defaultProps: {
       
      },
      styleOverrides: {
        rounded: {
          borderRadius: BORDER_RADIUS_BASE,
        }
      }
    },
    // Link
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
      styleOverrides: {
        root: {
          color: PRIMARY_MAIN,
          fontWeight: 500,
          '&:hover': {
          },
        },
      },
    },
    // Chip
    MuiChip: {
        styleOverrides: {
            root: {
                fontWeight: 500,
            }
        }
    }
  },
});

export default theme;