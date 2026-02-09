import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAuthStore } from '../../store/authStore';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import HistoryIcon from '@mui/icons-material/History';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isSalesView = user?.role === 'sales';
  const navItems = isSalesView
    ? [
        { path: '/', label: 'Home', icon: HomeIcon },
        { path: '/scan', label: 'Scan VIN', icon: CameraAltIcon },
        { path: '/my-deals', label: 'My Deals', icon: HistoryIcon },
      ]
    : [
        { path: '/manager', label: 'Dashboard', icon: HomeIcon },
        { path: '/manager/approvals', label: 'Approvals', icon: CameraAltIcon },
        { path: '/manager/inventory', label: 'Inventory', icon: HistoryIcon },
      ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Deal Guidance
            </Typography>
            {!isMobile && (
              <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
                {user?.dealership}
              </Typography>
            )}
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: isActive ? 'warning.main' : 'inherit',
                      textTransform: 'none',
                      display: 'flex',
                      gap: 0.5,
                      fontWeight: isActive ? 'bold' : 'normal',
                    }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={user?.photoUrl}
              alt={user?.name}
            />
            <IconButton
              color="inherit"
              onClick={handleMenuClick}
              size="small"
            >
              <LogoutIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>{user?.name}</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: { xs: 2, sm: 3 },
          minHeight: '100%',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
