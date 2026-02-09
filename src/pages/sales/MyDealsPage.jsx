import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

export default function MyDealsPage() {
  return (
    <Box>
      <Typography variant="h2" gutterBottom>
        My Deals
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your deal submissions and status
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                No deals yet. Scan a VIN to get started!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
