import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  Alert,
  Divider,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { useVehicleStore } from '../../store/vehicleStore';
import { useAuthStore } from '../../store/authStore';

// Mock pending approvals data - would come from API in real app
const mockPendingApprovals = [
  {
    id: 1,
    salesPerson: 'Sarah Johnson',
    customer: 'Robert Martinez',
    vehicle: '2023 Chevrolet Tahoe',
    vin: '1G1YY26E965105305',
    msrp: 62995,
    proposedPrice: 59500,
    discount: 3495,
    margin: 2850,
    daysOnLot: 67,
    reason: 'Customer loyalty + competitive offer',
    timestamp: '8 min ago',
  },
  {
    id: 2,
    salesPerson: 'Mike Chen',
    customer: 'Lisa Thompson',
    vehicle: '2024 GMC Sierra 1500',
    vin: '3GNAXKEV0PL123456',
    msrp: 54500,
    proposedPrice: 52000,
    discount: 2500,
    margin: 3200,
    daysOnLot: 45,
    reason: 'Trade-in value adjustment',
    timestamp: '23 min ago',
  },
  {
    id: 3,
    salesPerson: 'Jessica Torres',
    customer: 'David Chen',
    vehicle: '2023 Cadillac XT5',
    vin: '1GYKNCRS5PZ123789',
    msrp: 48900,
    proposedPrice: 46200,
    discount: 2700,
    margin: 2100,
    daysOnLot: 89,
    reason: 'Aging inventory - high days on lot',
    timestamp: '1 hour ago',
  },
];

export default function VehicleDetailPage() {
  const { vin } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicle, loading, findVehicleByVIN } = useVehicleStore();
  const { user } = useAuthStore();
  const [dealScore] = useState(85); // Mock deal score - will implement calculator
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock vehicle images - would come from vehicle data in real app
  const vehicleImages = [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
  ];

  // Determine correct scan path based on role
  const scanPath = location.pathname.startsWith('/manager') ? '/manager/scan' : '/associate/scan';
  
  // Check if this vehicle has a pending approval
  const isManager = user?.role === 'manager';
  const pendingApproval = isManager ? mockPendingApprovals.find(a => a.vin === vin) : null;

  const handleApprove = () => {
    console.log('Approved:', pendingApproval?.id);
    // In real app, would call API to approve
    navigate('/manager');
  };

  const handleReject = () => {
    console.log('Rejected:', pendingApproval?.id);
    // In real app, would call API to reject
    navigate('/manager');
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length);
  };

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
        <Button onClick={() => navigate(scanPath)} sx={{ mt: 2 }}>
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
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      {/* Vehicle Header with Image Carousel */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          {/* Image Carousel */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%', // 16:9 aspect ratio
              bgcolor: '#f5f5f5',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={vehicleImages[currentImageIndex]}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            
            {/* Navigation Arrows */}
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { bgcolor: 'white' },
              }}
            >
              <ArrowBackIosNew />
            </IconButton>
            <IconButton
              onClick={handleNextImage}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { bgcolor: 'white' },
              }}
            >
              <ArrowForwardIos />
            </IconButton>

            {/* Image Indicators */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1,
              }}
            >
              {vehicleImages.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          {/* Vehicle Info */}
          <Box>
            <Typography variant="h2" gutterBottom>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Typography>
            <Typography variant="h4" color="text.secondary" gutterBottom>
              {vehicle.trim} · {vehicle.color}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  VIN
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {vehicle.vin}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Stock #
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {vehicle.stockNumber}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Mileage
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {vehicle.mileage.toLocaleString()} miles
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Days on Lot
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {vehicle.daysOnLot} days
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Pending Approval - Full Width Above Everything */}
        {pendingApproval && (
          <Grid item xs={12}>
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h4" fontWeight={700}>
                    Pricing Approval Request
                  </Typography>
                  <Chip
                    label={pendingApproval.timestamp}
                    variant="outlined"
                    size="small"
                  />
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Sales Person
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {pendingApproval.salesPerson}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Customer
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {pendingApproval.customer}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Proposed Price
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      ${pendingApproval.proposedPrice.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Expected Margin
                    </Typography>
                    <Typography 
                      variant="h5" 
                      sx={{ color: pendingApproval.margin >= 3000 ? '#4caf50' : '#ff9800' }}
                      fontWeight={700}
                    >
                      ${pendingApproval.margin.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Reason for Discount
                      </Typography>
                      <Typography variant="body1">
                        {pendingApproval.reason}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleReject}
                    sx={{
                      borderColor: '#bdbdbd',
                      color: '#616161',
                      '&:hover': {
                        borderColor: '#9e9e9e',
                        bgcolor: '#fafafa',
                      },
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircle />}
                    onClick={handleApprove}
                    sx={{
                      bgcolor: '#2e7d32',
                      '&:hover': { bgcolor: '#1b5e20' },
                    }}
                  >
                    Approve
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Left Column: Deal Score */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Deal Score
              </Typography>
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4,
                  background: `linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(244, 67, 54, 0.1) 100%)`,
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography variant="h1" color={`${getScoreColor(dealScore)}.main`} sx={{ fontSize: '4rem', fontWeight: 700 }}>
                  {dealScore}
                </Typography>
                <Chip
                  label={dealScore >= 71 ? 'High Flexibility' : dealScore >= 41 ? 'Medium Flexibility' : 'Low Flexibility'}
                  color={getScoreColor(dealScore)}
                  variant="filled"
                  sx={{ mt: 1 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                This score indicates pricing flexibility based on inventory age, market demand, and available incentives.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Pricing & Incentives */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* Pricing Guidance */}
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Pricing Guidance
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      MSRP
                    </Typography>
                    <Typography variant="h4">
                      ${vehicle.msrp.toLocaleString()}
                    </Typography>
                  </Grid>
                  {isManager && (
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Invoice
                      </Typography>
                      <Typography variant="h4">
                        ${vehicle.invoice.toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" display="block" sx={{ color: '#1565c0', fontWeight: 600 }}>
                      Target Price
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#1565c0', fontWeight: 700 }}>
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
                  {pendingApproval && (
                    <>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Proposed Price
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          ${pendingApproval.proposedPrice.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Discount
                        </Typography>
                        <Typography variant="h4" color="error">
                          -${pendingApproval.discount.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Expected Margin
                        </Typography>
                        <Typography 
                          variant="h4" 
                          sx={{ color: pendingApproval.margin >= 3000 ? '#4caf50' : '#ff9800' }}
                          fontWeight={600}
                        >
                          ${pendingApproval.margin.toLocaleString()}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Available Incentives */}
            {vehicle.incentiveDetails && vehicle.incentiveDetails.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    Available Incentives
                  </Typography>
                  <Grid container spacing={2}>
                    {vehicle.incentiveDetails.map((incentive, idx) => (
                      <Grid item xs={12} sm={6} key={idx}>
                        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <Typography variant="body1" fontWeight={600}>
                            {incentive.name}
                          </Typography>
                          <Typography variant="h5" color="success.main" fontWeight={700}>
                            ${incentive.amount.toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <Divider />
                      <Box sx={{ mt: 2, textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Total Available Incentives
                        </Typography>
                        <Typography variant="h4" color="success.main" fontWeight={700}>
                          ${vehicle.incentives.toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>

        {/* Safety Features - Full Width at Bottom */}
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
