import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import HistoryIcon from '@mui/icons-material/History';
import { useAuthStore } from '../../store/authStore';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const isManager = user?.role === 'manager';
  const scanPath = isManager ? '/manager/scan' : '/associate/scan';
  const dealsPath = isManager ? '/manager/approvals' : '/associate/my-deals';

  return (
    <Box>
      <Typography variant="h2" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {isManager 
          ? 'Manage team performance and inventory strategy'
          : 'Scan a vehicle VIN to get intelligent deal guidance'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '100%' }}>
            <CardActionArea
              onClick={() => navigate(scanPath)}
              sx={{ height: '100%' }}
            >
              <CardContent
                sx={{
                  textAlign: 'center',
                  py: { xs: 4, sm: 6 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CameraAltIcon
                  sx={{
                    fontSize: { xs: 60, sm: 80 },
                    color: 'primary.main',
                    mb: 2,
                  }}
                />
                <Typography variant="h3" gutterBottom>
                  Scan VIN
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isManager 
                    ? 'Scan vehicles for team insights' 
                    : 'Use camera to scan or enter manually'}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '100%' }}>
            <CardActionArea
              onClick={() => navigate(dealsPath)}
              sx={{ height: '100%' }}
            >
              <CardContent
                sx={{
                  textAlign: 'center',
                  py: { xs: 4, sm: 6 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HistoryIcon
                  sx={{
                    fontSize: { xs: 60, sm: 80 },
                    color: 'primary.main',
                    mb: 2,
                  }}
                />
                <Typography variant="h3" gutterBottom>
                  {isManager ? 'Approvals' : 'My Deals'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isManager 
                    ? 'Review and approve team deals' 
                    : 'View your deal history'}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
