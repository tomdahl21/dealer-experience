import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useVehicleStore } from '../../store/vehicleStore';

export default function VehicleDetailPage() {
  const { vin } = useParams();
  const navigate = useNavigate();
  const { vehicle, loading, findVehicleByVIN } = useVehicleStore();
  const [dealScore] = useState(85); // Mock deal score - will implement calculator

  useEffect(() => {
    if (vin) {
      findVehicleByVIN(vin);
    }
  }, [vin]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!vehicle) {
    return (
      <Box>
        <Typography variant="h3" color="error">
          Vehicle not found
        </Typography>
        <Button onClick={() => navigate('/scan')} sx={{ mt: 2 }}>
          <ArrowBackIcon sx={{ mr: 1 }} />
          Back to Scan
        </Button>
      </Box>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 71) return 'success';
    if (score >= 41) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Button
        onClick={() => navigate('/scan')}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Scan
      </Button>

      <Typography variant="h2" gutterBottom>
        {vehicle.year} {vehicle.make} {vehicle.model}
      </Typography>
      <Typography variant="h4" color="text.secondary" gutterBottom>
        {vehicle.trim} · {vehicle.color}
      </Typography>

      <Grid container spacing={3}>
        {/* Vehicle Info */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                Vehicle Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="VIN"
                    secondary={vehicle.vin}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Stock #"
                    secondary={vehicle.stockNumber}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Mileage"
                    secondary={`${vehicle.mileage.toLocaleString()} miles`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Days on Lot"
                    secondary={vehicle.daysOnLot}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Deal Score */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                Deal Score
              </Typography>
              <Box
                sx={{
                  textAlign: 'center',
                  py: 3,
                  background: `linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(244, 67, 54, 0.1) 100%)`,
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography variant="h1" color={`${getScoreColor(dealScore)}.main`}>
                  {dealScore}
                </Typography>
                <Chip
                  label={dealScore >= 71 ? 'High Flexibility' : dealScore >= 41 ? 'Medium Flexibility' : 'Low Flexibility'}
                  color={getScoreColor(dealScore)}
                  variant="filled"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Incentives:</strong> ${vehicle.incentives.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Pricing Guidance */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                Pricing Guidance
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    MSRP
                  </Typography>
                  <Typography variant="h4">
                    ${vehicle.msrp.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Invoice
                  </Typography>
                  <Typography variant="h4">
                    ${vehicle.invoice.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="primary" display="block">
                    <strong>Target Price</strong>
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    ${vehicle.targetPrice.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Minimum
                  </Typography>
                  <Typography variant="h4">
                    ${vehicle.minimumPrice.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Incentives */}
        {vehicle.incentiveDetails && vehicle.incentiveDetails.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h3" gutterBottom>
                  Available Incentives
                </Typography>
                <List>
                  {vehicle.incentiveDetails.map((incentive, idx) => (
                    <ListItem key={idx}>
                      <ListItemText
                        primary={incentive.name}
                        secondary={`$${incentive.amount.toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Safety Features */}
        {vehicle.safetyFeatures && vehicle.safetyFeatures.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h3" gutterBottom>
                  Safety Features
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {vehicle.safetyFeatures.map((feature, idx) => (
                    <Chip key={idx} label={feature} variant="outlined" />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
