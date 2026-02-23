import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { useDealStore } from '../../store/dealStore';

const statusColorMap = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function DealsPage() {
  const navigate = useNavigate();
  const {
    allDeals,
    isLoading,
    error,
    fetchAllDeals,
    approveDeal,
    rejectDeal,
    resetDealsToDemo,
  } = useDealStore();

  useEffect(() => {
    fetchAllDeals();
  }, [fetchAllDeals]);

  const counts = useMemo(() => {
    return allDeals.reduce(
      (accumulator, deal) => {
        const status = (deal.status || 'pending').toLowerCase();
        accumulator.total += 1;
        if (status === 'pending') accumulator.pending += 1;
        if (status === 'approved') accumulator.approved += 1;
        if (status === 'rejected') accumulator.rejected += 1;
        return accumulator;
      },
      { total: 0, pending: 0, approved: 0, rejected: 0 }
    );
  }, [allDeals]);

  const sortedDeals = useMemo(() => {
    return [...allDeals].sort((left, right) => {
      const leftTimestamp = new Date(left.timestamp || 0).getTime();
      const rightTimestamp = new Date(right.timestamp || 0).getTime();
      return rightTimestamp - leftTimestamp;
    });
  }, [allDeals]);

  const handleApprove = async (dealId) => {
    await approveDeal(dealId);
    fetchAllDeals();
  };

  const handleReject = async (dealId) => {
    await rejectDeal(dealId, 'Rejected by manager');
    fetchAllDeals();
  };

  const handleViewVehicle = (vin) => {
    if (!vin) return;
    navigate(`/manager/vehicle/${vin}`);
  };

  const handleResetDemoDeals = async () => {
    await resetDealsToDemo();
    fetchAllDeals();
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        sx={{ mb: 3 }}
        spacing={1.5}
      >
        <Box>
          <Typography variant="h2" gutterBottom>
            Deals
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review and manage submitted deals across your team
          </Typography>
        </Box>
        <Button variant="outlined" onClick={handleResetDemoDeals} disabled={isLoading}>
          Reset Demo Deals
        </Button>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Total</Typography>
              <Typography variant="h4" fontWeight={700}>{counts.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Pending</Typography>
              <Typography variant="h4" fontWeight={700} color="warning.main">{counts.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Approved</Typography>
              <Typography variant="h4" fontWeight={700} color="success.main">{counts.approved}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">Rejected</Typography>
              <Typography variant="h4" fontWeight={700} color="error.main">{counts.rejected}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && sortedDeals.length === 0 && (
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              No deals submitted yet.
            </Typography>
          </CardContent>
        </Card>
      )}

      {!isLoading && sortedDeals.length > 0 && (
        <Stack spacing={2}>
          {sortedDeals.map((deal) => {
            const status = (deal.status || 'pending').toLowerCase();
            const displayTimestamp = deal.timestamp
              ? new Date(deal.timestamp).toLocaleString()
              : 'Unknown time';

            return (
              <Card key={deal.id} variant="outlined">
                <CardContent>
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap' }}>
                        <Typography variant="h6" fontWeight={700}>
                          {deal.vehicleName || `${deal.year || ''} ${deal.make || ''} ${deal.model || ''}`.trim() || 'Vehicle'}
                        </Typography>
                        <Chip
                          label={status.charAt(0).toUpperCase() + status.slice(1)}
                          color={statusColorMap[status] || 'default'}
                          size="small"
                        />
                      </Stack>

                      <Grid container spacing={1} sx={{ mb: 1 }}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary" display="block">VIN</Typography>
                          <Typography variant="body2">{deal.vin || '—'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary" display="block">Salesperson</Typography>
                          <Typography variant="body2">{deal.salespersonName || deal.salespersonId || '—'}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary" display="block">MSRP</Typography>
                          <Typography variant="body2">{typeof deal.msrp === 'number' ? currencyFormatter.format(deal.msrp) : '—'}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary" display="block">Proposed</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {typeof deal.proposedPrice === 'number' ? currencyFormatter.format(deal.proposedPrice) : '—'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary" display="block">Margin</Typography>
                          <Typography variant="body2" color="primary.main">
                            {typeof deal.margin === 'number' ? currencyFormatter.format(deal.margin) : '—'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary" display="block">Submitted</Typography>
                          <Typography variant="body2">{displayTimestamp}</Typography>
                        </Grid>
                      </Grid>

                      {deal.rejectionReason && (
                        <>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="caption" color="text.secondary" display="block">Rejection Reason</Typography>
                          <Typography variant="body2">{deal.rejectionReason}</Typography>
                        </>
                      )}
                    </Box>

                    <Stack direction={{ xs: 'row', md: 'column' }} spacing={1}>
                      {deal.vin && (
                        <Button variant="outlined" onClick={() => handleViewVehicle(deal.vin)}>
                          View Vehicle
                        </Button>
                      )}
                      {status === 'pending' && (
                        <>
                          <Button variant="contained" color="success" onClick={() => handleApprove(deal.id)}>
                            Approve
                          </Button>
                          <Button variant="outlined" color="error" onClick={() => handleReject(deal.id)}>
                            Reject
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
