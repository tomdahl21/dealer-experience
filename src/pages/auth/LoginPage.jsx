import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from '@mui/material';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuthStore();
  const [email, setEmail] = useState('sarah@dealership.com');
  const [password, setPassword] = useState('demo123');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      const { user } = useAuthStore.getState();
      if (user?.role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/associate');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #D1AD57 0%, #9FA8A7 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="h1" align="center" sx={{ mb: 1 }}>
              Dealer Assistant
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
              GM Dealership Assistant
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  autoFocus
                  disabled={isLoading}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  fullWidth
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Stack>
            </form>

            <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                <strong>Demo Credentials:</strong>
              </Typography>
              <Typography variant="caption" display="block">
                <strong>Sales:</strong> sarah@dealership.com / demo123
              </Typography>
              <Typography variant="caption" display="block">
                <strong>Manager:</strong> mike@dealership.com / demo123
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
