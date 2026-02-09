import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createAppTheme } from './muiTheme';
import { useAuthStore } from '../store/authStore';

export default function AppThemeProvider({ children }) {
  const { user } = useAuthStore();
  const brand = user?.brand || 'chevrolet';
  const theme = createAppTheme(brand);

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
