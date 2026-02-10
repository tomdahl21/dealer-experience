import { Box, Typography, Grid, Card, CardContent, Avatar, Chip, LinearProgress, Stack, Divider, Select, MenuItem, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Alert } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  People,
  AttachMoney,
  CheckCircle,
  PendingActions,
  DirectionsCar,
  Speed,
  Check,
  Close,
  Warning,
  Visibility,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data generator based on date range
const getMockDataForRange = (range) => {
  const baseMultipliers = {
    '7days': { deals: 1, revenue: 1, days: 7 },
    '30days': { deals: 4, revenue: 4, days: 30 },
    'month': { deals: 3.5, revenue: 3.5, days: 28 },
    'lastmonth': { deals: 4, revenue: 4, days: 30 },
    'quarter': { deals: 12, revenue: 12, days: 90 },
    'lastquarter': { deals: 12, revenue: 12, days: 90 },
    'ytd': { deals: 16, revenue: 16, days: 120 },
    'year': { deals: 52, revenue: 52, days: 365 },
  };

  const multiplier = baseMultipliers[range] || baseMultipliers['7days'];

  // Generate sales by day/week/month based on range
  const getSalesTrend = () => {
    if (range === '7days') {
      return [
        { day: 'Mon', deals: 8, revenue: 42000 },
        { day: 'Tue', deals: 12, revenue: 58000 },
        { day: 'Wed', deals: 10, revenue: 48000 },
        { day: 'Thu', deals: 15, revenue: 72000 },
        { day: 'Fri', deals: 18, revenue: 89000 },
        { day: 'Sat', deals: 22, revenue: 105000 },
        { day: 'Sun', deals: 14, revenue: 68000 },
      ];
    } else if (range === '30days' || range === 'month' || range === 'lastmonth') {
      return [
        { day: 'Week 1', deals: 45, revenue: 225000 },
        { day: 'Week 2', deals: 52, revenue: 268000 },
        { day: 'Week 3', deals: 48, revenue: 240000 },
        { day: 'Week 4', deals: 55, revenue: 287000 },
      ];
    } else if (range === 'quarter' || range === 'lastquarter') {
      return [
        { day: 'Month 1', deals: 185, revenue: 925000 },
        { day: 'Month 2', deals: 198, revenue: 1020000 },
        { day: 'Month 3', deals: 205, revenue: 1105000 },
      ];
    } else {
      return [
        { day: 'Q1', deals: 588, revenue: 3050000 },
        { day: 'Q2', deals: 612, revenue: 3180000 },
        { day: 'Q3', deals: 595, revenue: 3090000 },
        { day: 'Q4', deals: 605, revenue: 3140000 },
      ];
    }
  };

  return {
    kpis: {
      dealsToday: range === '7days' ? 12 : Math.round(12 * multiplier.deals / 7),
      dealsTodayChange: 8.5,
      pendingApprovals: 3,
      monthlyRevenue: Math.round(487500 * multiplier.revenue),
      monthlyRevenueChange: 12.3,
      avgMargin: range.includes('year') ? 4100 : range.includes('quarter') ? 3950 : 3850,
      avgMarginChange: -2.1,
      teamSize: 8,
      activeDeals: 15,
    },
    teamPerformance: [
      { 
        name: 'Sarah Johnson', 
        deals: Math.round(45 * multiplier.deals / 4), 
        revenue: Math.round(186750 * multiplier.revenue / 4), 
        avgMargin: 4150, 
        conversion: 68, 
        image: '/profile-sarah.png' 
      },
      { 
        name: 'Mike Chen', 
        deals: Math.round(38 * multiplier.deals / 4), 
        revenue: Math.round(152000 * multiplier.revenue / 4), 
        avgMargin: 4000, 
        conversion: 62, 
        image: null 
      },
      { 
        name: 'Jessica Torres', 
        deals: Math.round(42 * multiplier.deals / 4), 
        revenue: Math.round(178500 * multiplier.revenue / 4), 
        avgMargin: 4250, 
        conversion: 71, 
        image: null 
      },
      { 
        name: 'David Kim', 
        deals: Math.round(35 * multiplier.deals / 4), 
        revenue: Math.round(140000 * multiplier.revenue / 4), 
        avgMargin: 4000, 
        conversion: 58, 
        image: null 
      },
      { 
        name: 'Emily Rodriguez', 
        deals: Math.round(40 * multiplier.deals / 4), 
        revenue: Math.round(168000 * multiplier.revenue / 4), 
        avgMargin: 4200, 
        conversion: 65, 
        image: null 
      },
    ],
    salesByDay: getSalesTrend(),
    inventoryByBrand: [
      { brand: 'Chevrolet', count: 45, value: '#D1AD57' },
      { brand: 'GMC', count: 28, value: '#C41230' },
      { brand: 'Cadillac', count: 12, value: '#000000' },
      { brand: 'Buick', count: 15, value: '#0066CC' },
    ],
    dealStatus: [
      { status: 'Closed', count: Math.round(156 * multiplier.deals / 4), color: '#4caf50' },
      { status: 'Pending', count: 15, color: '#ff9800' },
      { status: 'In Progress', count: 23, color: '#1565c0' },
    ],
    pendingApprovals: [
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
    ],
  };
};

// Base multipliers constant needed in component
const baseMultipliers = {
  '7days': { deals: 1, revenue: 1, days: 7 },
  '30days': { deals: 4, revenue: 4, days: 30 },
  'month': { deals: 3.5, revenue: 3.5, days: 28 },
  'lastmonth': { deals: 4, revenue: 4, days: 30 },
  'quarter': { deals: 12, revenue: 12, days: 90 },
  'lastquarter': { deals: 12, revenue: 12, days: 90 },
  'ytd': { deals: 16, revenue: 16, days: 120 },
  'year': { deals: 52, revenue: 52, days: 365 },
};

// KPI Card Component
function KPICard({ title, value, change, icon: Icon, prefix = '', suffix = '' }) {
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: '#e3f2fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 28, color: '#1565c0' }} />
          </Box>
        </Box>
        {change !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TrendIcon
              sx={{
                fontSize: 18,
                color: isPositive ? 'success.main' : 'error.main',
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: isPositive ? 'success.main' : 'error.main',
                fontWeight: 600,
              }}
            >
              {isPositive ? '+' : ''}{change}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              vs last week
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState('7days');
  const navigate = useNavigate();
  const mockData = getMockDataForRange(dateRange);
  const { kpis, teamPerformance, salesByDay, inventoryByBrand, dealStatus, pendingApprovals } = mockData;

  const handleApprove = (approvalId) => {
    console.log('Approved:', approvalId);
    // In real app, would call API to approve
  };

  const handleReject = (approvalId) => {
    console.log('Rejected:', approvalId);
    // In real app, would call API to reject
  };

  const handleViewDeal = (vin) => {
    navigate(`/manager/vehicle/${vin}`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h2" gutterBottom>
            Manager Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Team performance and sales overview
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 180 }}>
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            size="small"
            sx={{
              bgcolor: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1565c0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1565c0',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1565c0',
              },
            }}
          >
            <MenuItem value="7days">Last 7 Days</MenuItem>
            <MenuItem value="30days">Last 30 Days</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="lastmonth">Last Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
            <MenuItem value="lastquarter">Last Quarter</MenuItem>
            <MenuItem value="ytd">Year to Date</MenuItem>
            <MenuItem value="year">Last 12 Months</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title={dateRange === '7days' ? 'Deals Today' : 'Total Deals'}
            value={kpis.dealsToday}
            change={kpis.dealsTodayChange}
            icon={CheckCircle}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title={dateRange.includes('year') ? 'Annual Revenue' : dateRange.includes('quarter') ? 'Quarterly Revenue' : 'Period Revenue'}
            value={kpis.monthlyRevenue}
            change={kpis.monthlyRevenueChange}
            icon={AttachMoney}
            prefix="$"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Margin"
            value={kpis.avgMargin}
            change={kpis.avgMarginChange}
            icon={TrendingUp}
            prefix="$"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Pending Approvals"
            value={kpis.pendingApprovals}
            icon={PendingActions}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Pending Approvals */}
        {pendingApprovals && pendingApprovals.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PendingActions sx={{ color: '#1565c0', fontSize: 28 }} />
                    <Typography variant="h4" fontWeight={700}>
                      Pending Approvals
                    </Typography>
                  </Box>
                  <Chip
                    label={`${pendingApprovals.length} pending`}
                    sx={{ bgcolor: '#1565c0', color: 'white', fontWeight: 600 }}
                  />
                </Box>
                
                <Stack spacing={2}>
                  {pendingApprovals.map((approval) => (
                    <Card
                      key={approval.id}
                      variant="outlined"
                      sx={{
                        '&:hover': {
                          boxShadow: 2,
                          borderColor: '#1565c0',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          {/* Left: Basic Info */}
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                {approval.timestamp}
                              </Typography>
                            </Box>
                            <Typography variant="h6" fontWeight={600}>
                              {approval.vehicle}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {approval.salesPerson} • {approval.customer}
                            </Typography>
                          </Grid>

                          {/* Middle: Price Info */}
                          <Grid item xs={12} sm={4}>
                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                  Proposed
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                  ${approval.proposedPrice.toLocaleString()}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                  Margin
                                </Typography>
                                <Typography
                                  variant="h6"
                                  sx={{ color: approval.margin >= 3000 ? '#4caf50' : '#ff9800' }}
                                  fontWeight={600}
                                >
                                  ${approval.margin.toLocaleString()}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Chip
                              label={`${approval.daysOnLot} days on lot`}
                              size="small"
                              variant="outlined"
                              sx={{ mt: 1 }}
                            />
                          </Grid>

                          {/* Right: Actions */}
                          <Grid item xs={12} sm={2}>
                            <Button
                              variant="contained"
                              fullWidth
                              startIcon={<Visibility />}
                              onClick={() => handleViewDeal(approval.vin)}
                              sx={{
                                bgcolor: '#1565c0',
                                '&:hover': { bgcolor: '#0d47a1' },
                              }}
                            >
                              Review
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Grid container spacing={3}>
        {/* Sales Trend Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {dateRange === '7days' ? 'Weekly' : dateRange.includes('quarter') || dateRange.includes('year') ? 'Quarterly' : 'Monthly'} Sales Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="deals"
                    stroke="#1565c0"
                    strokeWidth={2}
                    name="Deals Closed"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4caf50"
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory by Brand */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Inventory by Brand
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={inventoryByBrand}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ brand, count }) => `${brand} (${count})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {inventoryByBrand.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Performance */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Team Performance
              </Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Team Member</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Deals</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Revenue</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Avg Margin</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Conversion</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Goal Progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamPerformance.map((member, index) => {
                      const goalTarget = Math.round(50 * (baseMultipliers[dateRange]?.deals || 1));
                      const progressPercent = (member.deals / goalTarget) * 100;
                      return (
                        <TableRow
                          key={index}
                          sx={{
                            '&:hover': { bgcolor: '#fafafa' },
                            '& td': { py: 2 },
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                sx={{ width: 40, height: 40, bgcolor: '#1565c0' }}
                                src={member.image}
                              >
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </Avatar>
                              <Typography variant="body1" fontWeight={500}>
                                {member.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="h6" fontWeight={600}>
                              {member.deals}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" fontWeight={500} color="success.main">
                              ${member.revenue.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" fontWeight={500} sx={{ color: '#1565c0' }}>
                              ${member.avgMargin.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${member.conversion}%`}
                              size="small"
                              sx={{
                                bgcolor: member.conversion >= 65 ? '#e8f5e9' : '#fff3e0',
                                color: member.conversion >= 65 ? '#2e7d32' : '#e65100',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ minWidth: 200 }}>
                            <Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {member.deals}/{goalTarget}
                                </Typography>
                                <Typography variant="caption" fontWeight={600} sx={{ color: '#1565c0' }}>
                                  {progressPercent.toFixed(0)}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(progressPercent, 100)}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: '#e3f2fd',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: progressPercent >= 100 ? '#4caf50' : '#1565c0',
                                  },
                                }}
                              />
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Deal Status Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Deal Status
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dealStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8">
                    {dealStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Quick Stats
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <People sx={{ color: '#1565c0' }} />
                    <Typography variant="body1">Active Team Members</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={600}>{kpis.teamSize}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsCar sx={{ color: '#1565c0' }} />
                    <Typography variant="body1">Total Inventory</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={600}>
                    {inventoryByBrand.reduce((sum, item) => sum + item.count, 0)}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Speed sx={{ color: '#1565c0' }} />
                    <Typography variant="body1">Avg Days to Sale</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={600}>18</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle color="success" />
                    <Typography variant="body1">Close Rate</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={600} color="success.main">65%</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
