import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useVehicleStore } from '../../store/vehicleStore';
import { useAuthStore } from '../../store/authStore';

const SAMPLE_VINS = [
  { vin: '1G1YY26E965105305', label: '2023 Chevrolet Tahoe' },
  { vin: '3GNAXKEV0PL123456', label: '2023 Chevrolet Silverado' },
];

export default function ScanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { findVehicleByVIN, error } = useVehicleStore();
  const { user } = useAuthStore();
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  // Determine the correct path based on current location
  const getVehiclePath = (vin) => {
    if (location.pathname.startsWith('/manager')) {
      return `/manager/vehicle/${vin}`;
    }
    return `/associate/vehicle/${vin}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!vin.trim()) {
      setLocalError('Please enter a VIN');
      return;
    }

    if (vin.length !== 17) {
      setLocalError('VIN must be 17 characters');
      return;
    }

    setLoading(true);
    try {
      const vehicle = await findVehicleByVIN(vin);
      if (vehicle) {
        navigate(getVehiclePath(vin));
      } else {
        setLocalError('Vehicle not found in inventory');
      }
    } catch (err) {
      setLocalError(err.message || 'Error looking up vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleVINClick = async (sampleVin) => {
    setVin(sampleVin);
    setLoading(true);
    setLocalError('');
    try {
      const vehicle = await findVehicleByVIN(sampleVin);
      if (vehicle) {
        navigate(getVehiclePath(sampleVin));
      } else {
        setLocalError('Vehicle not found in inventory');
      }
    } catch (err) {
      setLocalError(err.message || 'Error looking up vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h2" gutterBottom>
        Scan VIN
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Enter the vehicle VIN or select from sample inventory
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Camera Scanner
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Coming soon: Camera-based VIN scanning with OCR
          </Typography>
          <Button variant="outlined" fullWidth disabled>
            Enable Camera
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Manual Entry
          </Typography>

          {(localError || error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {localError || error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="VIN Number"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="1G1YY26E965105305"
                required
                disabled={loading}
                fullWidth
                inputProps={{ maxLength: 17 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Lookup Vehicle'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
              <strong>Sample VINs:</strong>
            </Typography>
            {SAMPLE_VINS.map((sample) => (
              <Button
                key={sample.vin}
                variant="text"
                size="small"
                fullWidth
                onClick={() => handleSampleVINClick(sample.vin)}
                disabled={loading}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  textTransform: 'none',
                }}
              >
                <Typography variant="caption">
                  {sample.label} ({sample.vin})
                </Typography>
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
