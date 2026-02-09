import { createTheme } from '@mui/material/styles';
import { brandThemes } from './brandThemes';

export const createAppTheme = (brand = 'chevrolet') => {
  const brandConfig = brandThemes[brand];

  return createTheme({
    palette: {
      mode: 'light',
      ...brandConfig.palette,
      background: {
        default: '#F5F5F5',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#1A1A1A',
        secondary: '#4A4A4A',
      },
      success: {
        main: '#2E7D32',
        light: '#4CAF50',
        dark: '#1B5E20',
      },
      warning: {
        main: '#F57C00',
        light: '#FF9800',
        dark: '#E65100',
      },
      error: {
        main: '#C62828',
        light: '#EF5350',
        dark: '#B71C1C',
      },
      info: {
        main: '#1976D2',
        light: '#2196F3',
        dark: '#0D47A1',
      },
      grey: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
      },
    },
    typography: {
      fontFamily: '"DIN Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontSize: '28px',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.01562em',
      },
      h2: {
        fontSize: '22px',
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.00833em',
      },
      h3: {
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: '0em',
      },
      h4: {
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: 1.5,
        letterSpacing: '0.00735em',
      },
      h5: {
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: 1.5,
        letterSpacing: '0em',
      },
      h6: {
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: 1.6,
        letterSpacing: '0.0075em',
      },
      body1: {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      body2: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
      },
      button: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        textTransform: 'none', // Don't uppercase buttons
      },
      caption: {
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: 1.66,
        letterSpacing: '0.03333em',
      },
      overline: {
        fontSize: '10px',
        fontWeight: 400,
        lineHeight: 2.66,
        letterSpacing: '0.08333em',
        textTransform: 'uppercase',
      },
    },
    spacing: 8, // Base unit: 8px
    shape: {
      borderRadius: 8,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 768,   // Tablet portrait (primary target)
        lg: 1024,  // Tablet landscape (primary target)
        xl: 1280,  // Desktop
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 600,
          },
          sizeLarge: {
            padding: '14px 28px',
            fontSize: '18px',
          },
          sizeSmall: {
            padding: '8px 16px',
            fontSize: '14px',
          },
        },
        defaultProps: {
          disableElevation: true,
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
        defaultProps: {
          variant: 'outlined',
          fullWidth: true,
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
  });
};
