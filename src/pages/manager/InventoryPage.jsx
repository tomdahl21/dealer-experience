import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Button,
  Stack,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Search,
  GridView,
  TableRows,
  DirectionsCar,
  TrendingUp,
  Inventory2,
  Timer,
} from '@mui/icons-material';
import vehiclesRaw from '../../data/vehicles_lean.json';

// ── Mock enrichment ─────────────────────────────────────────────────────────
// Deterministically derive extra fields from the VIN so the data looks realistic
// without a real backend.
const msrpRanges = {
  Tahoe:      [52000, 72000],
  Suburban:   [57000, 80000],
  Silverado:  [36000, 66000],
  Equinox:    [30000, 46000],
  Traverse:   [36000, 55000],
  Colorado:   [28000, 44000],
  Blazer:     [34000, 52000],
  Trax:       [22000, 32000],
  Sierra:     [38000, 70000],
  Yukon:      [56000, 82000],
  Canyon:     [30000, 48000],
  Terrain:    [32000, 50000],
  Acadia:     [36000, 58000],
  XT4:        [40000, 58000],
  XT5:        [48000, 65000],
  XT6:        [54000, 72000],
  Escalade:   [82000, 110000],
  CT4:        [40000, 58000],
  CT5:        [46000, 72000],
  Encore:     [26000, 38000],
  Envision:   [36000, 52000],
  Enclave:    [42000, 60000],
  Envista:    [24000, 34000],
};

const colors = ['Summit White', 'Black', 'Sterling Gray', 'Red Hot', 'Deep Ocean Blue', 'Iridescent Pearl', 'Silver Ice', 'Cayenne Orange'];

function hashVin(vin) {
  let h = 0;
  for (let i = 0; i < vin.length; i++) {
    h = (h * 31 + vin.charCodeAt(i)) >>> 0;
  }
  return h;
}

const vehicles = vehiclesRaw.map((v) => {
  const h = hashVin(v.vin);
  const [lo, hi] = msrpRanges[v.model] || [30000, 55000];
  const msrp = lo + Math.round(((h % 1000) / 1000) * (hi - lo));
  const daysOnLot = 1 + (h % 120);
  const color = colors[h % colors.length];
  const mileage = 5 + (h % 50);
  return { ...v, msrp, daysOnLot, color, mileage };
});

// ── KPI helpers ──────────────────────────────────────────────────────────────
const brandColors = {
  Chevrolet: '#1976D2',
  Gmc: '#C41230',
  Cadillac: '#000000',
  Buick: '#0066CC',
};

const brandDisplayName = {
  Chevrolet: 'Chevrolet',
  Gmc: 'GMC',
  Cadillac: 'Cadillac',
  Buick: 'Buick',
};

const daysOnLotColor = (days) => {
  if (days < 30) return 'success';
  if (days < 60) return 'warning';
  return 'error';
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({ title, value, sub, icon: Icon, iconBg = '#e3f2fd', iconColor = '#1565c0' }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
            {sub && (
              <Typography variant="caption" color="text.secondary">
                {sub}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 28, color: iconColor }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ── Brand Badge ───────────────────────────────────────────────────────────────
function BrandBadge({ brand }) {
  return (
    <Chip
      label={brandDisplayName[brand] || brand}
      size="small"
      sx={{
        bgcolor: brandColors[brand] || '#666',
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.65rem',
      }}
    />
  );
}

// ── Vehicle Grid Card ─────────────────────────────────────────────────────────
function VehicleCard({ vehicle, onView }) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 6 },
      }}
    >
      <CardActionArea onClick={() => onView(vehicle.vin)} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="160"
          image={vehicle.image}
          alt={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
          sx={{ objectFit: 'cover', bgcolor: '#f5f5f5' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <BrandBadge brand={vehicle.brand} />
            <Chip
              label={`${vehicle.daysOnLot}d on lot`}
              size="small"
              color={daysOnLotColor(vehicle.daysOnLot)}
              variant="outlined"
            />
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
            {vehicle.year} {brandDisplayName[vehicle.brand] || vehicle.brand} {vehicle.model}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {vehicle.color} &bull; {vehicle.mileage.toLocaleString()} mi
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                MSRP
              </Typography>
              <Typography variant="body1" fontWeight={700} color="primary.main">
                {currencyFormatter.format(vehicle.msrp)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Stock #
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {vehicle.stockNumber}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const SORT_FIELDS = ['year', 'brand', 'model', 'msrp', 'daysOnLot'];

export default function InventoryPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [sortField, setSortField] = useState('daysOnLot');
  const [sortDir, setSortDir] = useState('desc');

  const brands = useMemo(() => {
    const unique = [...new Set(vehicles.map((v) => v.brand))];
    return unique.sort();
  }, []);

  const filtered = useMemo(() => {
    let result = vehicles;

    if (brandFilter !== 'all') {
      result = result.filter((v) => v.brand === brandFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (v) =>
          v.model.toLowerCase().includes(q) ||
          v.brand.toLowerCase().includes(q) ||
          v.stockNumber.toLowerCase().includes(q) ||
          v.vin.toLowerCase().includes(q) ||
          String(v.year).includes(q)
      );
    }

    return [...result].sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [search, brandFilter, sortField, sortDir]);

  const kpis = useMemo(() => {
    const total = vehicles.length;
    const avgDays = Math.round(vehicles.reduce((s, v) => s + v.daysOnLot, 0) / total);
    const aging = vehicles.filter((v) => v.daysOnLot >= 60).length;
    const totalValue = vehicles.reduce((s, v) => s + v.msrp, 0);
    return { total, avgDays, aging, totalValue };
  }, []);

  const brandCounts = useMemo(() => {
    return brands.map((b) => ({
      brand: b,
      count: vehicles.filter((v) => v.brand === b).length,
    }));
  }, [brands]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleView = (vin) => {
    navigate(`/manager/vehicle/${vin}`);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h2" gutterBottom>
            Inventory
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {vehicles.length} vehicles across {brands.length} brands
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, v) => v && setViewMode(v)}
          size="small"
        >
          <ToggleButton value="grid">
            <GridView />
          </ToggleButton>
          <ToggleButton value="table">
            <TableRows />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Vehicles"
            value={kpis.total}
            icon={DirectionsCar}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Inventory Value"
            value={currencyFormatter.format(kpis.totalValue)}
            icon={TrendingUp}
            iconBg="#e8f5e9"
            iconColor="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Days on Lot"
            value={kpis.avgDays}
            sub="days"
            icon={Timer}
            iconBg="#fff3e0"
            iconColor="#e65100"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Aging (60+ Days)"
            value={kpis.aging}
            sub={`${Math.round((kpis.aging / kpis.total) * 100)}% of inventory`}
            icon={Inventory2}
            iconBg="#fce4ec"
            iconColor="#c62828"
          />
        </Grid>
      </Grid>

      {/* Brand Breakdown */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            By Brand
          </Typography>
          <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
            {brandCounts.map(({ brand, count }) => (
              <Box
                key={brand}
                onClick={() => setBrandFilter(brandFilter === brand ? 'all' : brand)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  p: 1.5,
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: brandFilter === brand ? brandColors[brand] || '#1565c0' : 'transparent',
                  bgcolor: brandFilter === brand ? '#f5f5f5' : 'transparent',
                  transition: 'all 0.15s',
                  '&:hover': { bgcolor: '#f5f5f5' },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: brandColors[brand] || '#666',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {(brandDisplayName[brand] || brand).slice(0, 2).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={700}>
                    {brandDisplayName[brand] || brand}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {count} vehicles
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by model, VIN, stock #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, minWidth: 240 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={brandFilter}
            label="Brand"
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <MenuItem value="all">All Brands</MenuItem>
            {brands.map((b) => (
              <MenuItem key={b} value={b}>
                {brandDisplayName[b] || b}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {(search || brandFilter !== 'all') && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => { setSearch(''); setBrandFilter('all'); }}
          >
            Clear Filters
          </Button>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', ml: 'auto' }}>
          {filtered.length} {filtered.length === 1 ? 'vehicle' : 'vehicles'}
        </Typography>
      </Box>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <Grid container spacing={3}>
          {filtered.map((vehicle) => (
            <Grid item key={vehicle.vin} xs={12} sm={6} md={4} lg={3}>
              <VehicleCard vehicle={vehicle} onView={handleView} />
            </Grid>
          ))}
          {filtered.length === 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <DirectionsCar sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">
                    No vehicles match your filters.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card>
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Vehicle</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    <TableSortLabel
                      active={sortField === 'brand'}
                      direction={sortField === 'brand' ? sortDir : 'asc'}
                      onClick={() => handleSort('brand')}
                    >
                      Brand
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    <TableSortLabel
                      active={sortField === 'year'}
                      direction={sortField === 'year' ? sortDir : 'asc'}
                      onClick={() => handleSort('year')}
                    >
                      Year
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Stock #</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Color</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    <TableSortLabel
                      active={sortField === 'msrp'}
                      direction={sortField === 'msrp' ? sortDir : 'asc'}
                      onClick={() => handleSort('msrp')}
                    >
                      MSRP
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    <TableSortLabel
                      active={sortField === 'daysOnLot'}
                      direction={sortField === 'daysOnLot' ? sortDir : 'asc'}
                      onClick={() => handleSort('daysOnLot')}
                    >
                      Days on Lot
                    </TableSortLabel>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      No vehicles match your filters.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((vehicle) => (
                  <TableRow
                    key={vehicle.vin}
                    sx={{
                      '&:hover': { bgcolor: '#fafafa', cursor: 'pointer' },
                      '& td': { py: 1.5 },
                    }}
                    onClick={() => handleView(vehicle.vin)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src={vehicle.image}
                          alt={vehicle.model}
                          sx={{
                            width: 72,
                            height: 48,
                            objectFit: 'cover',
                            borderRadius: 1,
                            bgcolor: '#f5f5f5',
                          }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <Typography variant="body2" fontWeight={600}>
                          {vehicle.year} {brandDisplayName[vehicle.brand] || vehicle.brand} {vehicle.model}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <BrandBadge brand={vehicle.brand} />
                    </TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {vehicle.stockNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{vehicle.color}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {currencyFormatter.format(vehicle.msrp)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${vehicle.daysOnLot}d`}
                        size="small"
                        color={daysOnLotColor(vehicle.daysOnLot)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => { e.stopPropagation(); handleView(vehicle.vin); }}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
}
