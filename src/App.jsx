import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import AppThemeProvider from './theme/ThemeProvider';
import { useAuthStore } from './store/authStore';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RoleSelectionPage from './pages/auth/RoleSelectionPage';
import HomePage from './pages/sales/HomePage';
import ScanPage from './pages/sales/ScanPage';
import VehicleDetailPage from './pages/sales/VehicleDetailPage';
import MyDealsPage from './pages/sales/MyDealsPage';
import DashboardPage from './pages/manager/DashboardPage';
import ApprovalsPage from './pages/manager/ApprovalsPage';
import InventoryPage from './pages/manager/InventoryPage';
import DealsPage from './pages/manager/DealsPage';

// Layout
import AppLayout from './components/layout/AppLayout';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to correct role's home page
    if (user?.role === 'manager') {
      return <Navigate to="/manager" replace />;
    }
    return <Navigate to="/associate" replace />;
  }

  return children;
}

function App() {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Role Selection - Landing Page */}
          <Route path="/" element={<RoleSelectionPage />} />
          
          {/* Optional: Keep traditional login */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Sales Associate Routes */}
          <Route
            path="/associate"
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
            <Route path="deals" element={<DealsPage />} />
            <Route path="approvals" element={<ApprovalsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="scan" element={<ScanPage />} />
            <Route path="vehicle/:vin" element={<VehicleDetailPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppThemeProvider>
  );
}

export default App;
