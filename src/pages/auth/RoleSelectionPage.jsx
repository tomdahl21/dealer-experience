import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import {
  PersonOutline,
  ManageAccounts,
  TrendingUp,
  QrCodeScanner,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { loginAsRole } = useAuthStore();

  const handleRoleSelection = async (role) => {
    const result = await loginAsRole(role);
    if (result.success) {
      // Navigate based on role
      if (role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/associate');
      }
    }
  };

  const roles = [
    {
      id: 'sales',
      title: 'Sales Associate',
      description: 'Access VIN scanning, deal guidance, and customer conversation tools',
      icon: PersonOutline,
      features: [
        'Scan VINs instantly',
        'Get deal scoring & pricing guidance',
        'Access conversation playbooks',
        'Track your deals',
      ],
      color: '#000000',
      path: '/',
    },
    {
      id: 'manager',
      title: 'Sales Manager',
      description: 'View team performance, approve deals, and manage inventory strategy',
      icon: ManageAccounts,
      features: [
        'Team performance metrics',
        'Deal approvals & oversight',
        'Inventory aging analytics',
        'Strategic pricing tools',
      ],
      color: '#1976d2',
      path: '/manager',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h1"
            sx={{
              color: '#2c3e50',
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
            }}
          >
            GM Dealer Experience
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#546e7a',
              fontWeight: 300,
            }}
          >
            Select your role to continue
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Grid item xs={12} md={6} key={role.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => handleRoleSelection(role.id)}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          bgcolor: `${role.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <IconComponent
                          sx={{
                            fontSize: 36,
                            color: role.color,
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                          {role.title}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      {role.description}
                    </Typography>

                    <Stack spacing={1.5} sx={{ mb: 4 }}>
                      {role.features.map((feature, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: role.color,
                              mr: 2,
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      sx={{
                        bgcolor: role.color,
                        '&:hover': {
                          bgcolor: role.color,
                          opacity: 0.9,
                        },
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoleSelection(role.id);
                      }}
                    >
                      Continue as {role.title}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: '#78909c' }}>
            Demo Version 1.0.0 • Powered by GM Best Deal Guidance
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
