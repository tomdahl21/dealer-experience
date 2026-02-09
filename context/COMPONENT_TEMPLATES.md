# Component Templates

This file contains starter templates for all major components.
Copy these into their respective files as you build out the application.

## Pages

### src/pages/auth/LoginPage.jsx

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Card, CardContent, TextField, Button, Typography, Alert, Stack } from '@mui/material';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      const user = useAuthStore.getState().user;
      navigate(user.role === 'manager' ? '/manager' : '/');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h1" align="center">Best Deal Guidance</Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>GM Dealership Assistant</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Stack>
            </form>
            <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" display="block"><strong>Demo:</strong> sarah@dealership.com / demo123</Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
```

### src/pages/sales/HomePage.jsx

```jsx
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ListAltIcon from '@mui/icons-material/ListAlt';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom>Sales Dashboard</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Scan a VIN to get started with deal guidance
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/scan')}>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <CameraAltIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h3" gutterBottom>Scan VIN</Typography>
              <Typography variant="body2" color="text.secondary">
                Use camera or enter manually
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/my-deals')}>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <ListAltIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h3" gutterBottom>My Deals</Typography>
              <Typography variant="body2" color="text.secondary">
                View your deal history
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
```

### src/pages/sales/ScanPage.jsx

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Card, CardContent, Stack } from '@mui/material';
import { useVehicleStore } from '../../store/vehicleStore';

export default function ScanPage() {
  const navigate = useNavigate();
  const { fetchVehicleByVIN } = useVehicleStore();
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await fetchVehicleByVIN(vin);
    if (result.success) {
      navigate(`/vehicle/${vin}`);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h2" gutterBottom>Scan VIN</Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>Camera Scanner</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Camera scanning will be implemented here
          </Typography>
          <Button variant="outlined" fullWidth disabled>
            Enable Camera
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>Manual Entry</Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="VIN Number"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="1G1YY26E965105305"
                required
                inputProps={{ maxLength: 17 }}
              />
              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? 'Looking up...' : 'Lookup Vehicle'}
              </Button>
            </Stack>
          </form>
          
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" display="block"><strong>Sample VINs:</strong></Typography>
            <Typography variant="caption" display="block">1G1YY26E965105305 (Tahoe)</Typography>
            <Typography variant="caption" display="block">3GNAXKEV0PL123456 (Silverado)</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
```

### src/pages/sales/VehicleDetailPage.jsx

```jsx
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { useVehicleStore } from '../../store/vehicleStore';

export default function VehicleDetailPage() {
  const { vin } = useParams();
  const { currentVehicle, fetchVehicleByVIN } = useVehicleStore();

  useEffect(() => {
    if (vin) {
      fetchVehicleByVIN(vin);
    }
  }, [vin]);

  if (!currentVehicle) {
    return <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom>
        {currentVehicle.year} {currentVehicle.make} {currentVehicle.model}
      </Typography>
      <Typography variant="h4" color="text.secondary" gutterBottom>
        {currentVehicle.trim}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom>Vehicle Details</Typography>
              <Typography><strong>VIN:</strong> {currentVehicle.vin}</Typography>
              <Typography><strong>Stock #:</strong> {currentVehicle.stockNumber}</Typography>
              <Typography><strong>Color:</strong> {currentVehicle.color}</Typography>
              <Typography><strong>Mileage:</strong> {currentVehicle.mileage.toLocaleString()} miles</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom>Deal Score</Typography>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h1" color="success.main">85</Typography>
                <Chip label="High Flexibility" color="success" />
              </Box>
              <Typography variant="body2">
                <strong>Days on Lot:</strong> {currentVehicle.daysOnLot}
              </Typography>
              <Typography variant="body2">
                <strong>Incentives:</strong> ${currentVehicle.incentives.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom>Pricing Guidance</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption">MSRP</Typography>
                  <Typography variant="h4">${currentVehicle.msrp.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption">Invoice</Typography>
                  <Typography variant="h4">${currentVehicle.invoice.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="primary">Target Price</Typography>
                  <Typography variant="h4" color="primary.main">${currentVehicle.targetPrice.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption">Minimum</Typography>
                  <Typography variant="h4">${currentVehicle.minimumPrice.toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
```

### src/pages/sales/MyDealsPage.jsx

```jsx
import { Box, Typography, Card, CardContent } from '@mui/material';

export default function MyDealsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom>My Deals</Typography>
      <Card>
        <CardContent>
          <Typography color="text.secondary">No deals yet. Scan a VIN to get started!</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
```

### src/pages/manager/DashboardPage.jsx

```jsx
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

export default function DashboardPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom>Manager Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Pending Approvals</Typography>
              <Typography variant="h2">0</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Deals Today</Typography>
              <Typography variant="h2">0</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Avg Margin</Typography>
              <Typography variant="h2">$0</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
```

### src/pages/manager/ApprovalsPage.jsx

```jsx
import { Box, Typography, Card, CardContent } from '@mui/material';

export default function ApprovalsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom>Pending Approvals</Typography>
      <Card>
        <CardContent>
          <Typography color="text.secondary">No pending approvals</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
```

### src/pages/manager/InventoryPage.jsx

```jsx
import { Box, Typography, Card, CardContent } from '@mui/material';

export default function InventoryPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom>Inventory Management</Typography>
      <Card>
        <CardContent>
          <Typography color="text.secondary">Inventory list will appear here</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
```

### src/components/layout/AppLayout.jsx

```jsx
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Best Deal Guidance - {user?.dealership}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 32, height: 32 }} src={user?.photoUrl} />
            <Typography>{user?.name}</Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
```

## Services

### src/services/vinService.js

```javascript
import vehicles from '../data/vehicles.json';

export const vinService = {
  decodeVIN: (vin) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const vehicle = vehicles.find(v => v.vin === vin);
        if (vehicle) {
          resolve(vehicle);
        } else {
          reject(new Error('Vehicle not found'));
        }
      }, 800);
    });
  },

  getAllVehicles: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(vehicles);
      }, 500);
    });
  },
};
```

### src/services/dealService.js

```javascript
const STORAGE_KEY = 'bdg_deals';

export const dealService = {
  createDeal: (dealData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const newDeal = {
          id: `deal-${Date.now()}`,
          ...dealData,
          status: 'pending',
          timestamp: new Date().toISOString(),
        };
        deals.push(newDeal);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
        resolve(newDeal);
      }, 500);
    });
  },

  getDealsByUser: (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        resolve(deals.filter(d => d.salespersonId === userId));
      }, 300);
    });
  },

  getPendingDeals: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        resolve(deals.filter(d => d.status === 'pending'));
      }, 300);
    });
  },

  approveDeal: (dealId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const updatedDeals = deals.map(d =>
          d.id === dealId ? { ...d, status: 'approved' } : d
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDeals));
        resolve();
      }, 500);
    });
  },

  rejectDeal: (dealId, reason) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const updatedDeals = deals.map(d =>
          d.id === dealId ? { ...d, status: 'rejected', rejectionReason: reason } : d
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDeals));
        resolve();
      }, 500);
    });
  },
};
```

## Utils

### src/utils/dealCalculator.js

```javascript
export const calculateDealScore = (vehicle) => {
  let score = 50;
  
  // Days on lot (0-30 points)
  if (vehicle.daysOnLot > 60) score += 30;
  else if (vehicle.daysOnLot > 30) score += 15;
  
  // Inventory depth (0-20 points)
  if (vehicle.similarInInventory > 5) score += 20;
  else if (vehicle.similarInInventory > 2) score += 10;
  
  // Incentives (0-20 points)
  if (vehicle.incentives > 2000) score += 20;
  else if (vehicle.incentives > 1000) score += 10;
  
  // Market position (0-30 points)
  if (vehicle.marketPosition < -5) score += 30;
  else if (vehicle.marketPosition < 0) score += 15;
  
  return Math.min(score, 100);
};

export const getDealFlexibility = (score) => {
  if (score >= 71) return { level: 'high', color: 'success' };
  if (score >= 41) return { level: 'medium', color: 'warning' };
  return { level: 'low', color: 'error' };
};
```

### src/utils/validators.js

```javascript
export const isValidVIN = (vin) => {
  if (!vin || vin.length !== 17) return false;
  
  // VINs don't use I, O, or Q to avoid confusion with 1 and 0
  const invalidChars = /[IOQ]/i;
  if (invalidChars.test(vin)) return false;
  
  // Must be alphanumeric
  const validChars = /^[A-HJ-NPR-Z0-9]{17}$/i;
  return validChars.test(vin);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};
```

---

Copy these templates into your project files to get started quickly!
