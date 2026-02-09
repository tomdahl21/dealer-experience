import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import AppThemeProvider from './theme/ThemeProvider';
import { useAuthStore } from './store/authStore';

// Pages
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/sales/HomePage';
import ScanPage from './pages/sales/ScanPage';
import VehicleDetailPage from './pages/sales/VehicleDetailPage';
import MyDealsPage from './pages/sales/MyDealsPage';
import DashboardPage from './pages/manager/DashboardPage';
import ApprovalsPage from './pages/manager/ApprovalsPage';
import InventoryPage from './pages/manager/InventoryPage';

// Layout
import AppLayout from './components/layout/AppLayout';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Sales Person Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['sales']}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="scan" element={<ScanPage />} />
            <Route path="vehicle/:vin" element={<VehicleDetailPage />} />
            <Route path="my-deals" element={<MyDealsPage />} />
          </Route>

          {/* Manager Routes */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="approvals" element={<ApprovalsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppThemeProvider>
  );
}

export default App;
