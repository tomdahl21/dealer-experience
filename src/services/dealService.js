const STORAGE_KEY = 'bdg_deals';

const DEMO_DEALS = [
  {
    id: 'deal-demo-1',
    vin: '1G1YY26E965105305',
    vehicleName: '2023 Chevrolet Tahoe',
    make: 'Chevrolet',
    model: 'Tahoe',
    year: 2023,
    msrp: 62995,
    proposedPrice: 59500,
    margin: 2850,
    salespersonId: '1',
    salespersonName: 'Sarah Johnson',
    status: 'pending',
    timestamp: '2026-02-23T15:20:00.000Z',
  },
  {
    id: 'deal-demo-2',
    vin: '3GNAXKEV0PL123456',
    vehicleName: '2024 GMC Sierra 1500',
    make: 'GMC',
    model: 'Sierra 1500',
    year: 2024,
    msrp: 54500,
    proposedPrice: 52800,
    margin: 3400,
    salespersonId: '1',
    salespersonName: 'Sarah Johnson',
    status: 'approved',
    timestamp: '2026-02-22T19:10:00.000Z',
  },
  {
    id: 'deal-demo-3',
    vin: '1GYKNCRS5PZ123789',
    vehicleName: '2023 Cadillac XT5',
    make: 'Cadillac',
    model: 'XT5',
    year: 2023,
    msrp: 48900,
    proposedPrice: 45600,
    margin: 1900,
    salespersonId: '1',
    salespersonName: 'Sarah Johnson',
    status: 'rejected',
    rejectionReason: 'Margin below minimum threshold',
    timestamp: '2026-02-21T13:40:00.000Z',
  },
];

const getDealsFromStorage = () => {
  const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  if (!Array.isArray(parsed) || parsed.length === 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_DEALS));
    return [...DEMO_DEALS];
  }

  return parsed;
};

export const dealService = {
  resetDealsToDemo: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_DEALS));
        resolve([...DEMO_DEALS]);
      }, 250);
    });
  },

  createDeal: (dealData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = getDealsFromStorage();
        const newDeal = { id: `deal-${Date.now()}`, ...dealData, status: 'pending', timestamp: new Date().toISOString() };
        deals.push(newDeal);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
        resolve(newDeal);
      }, 500);
    });
  },

  getDealsByUser: (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = getDealsFromStorage();
        resolve(deals.filter(d => d.salespersonId === userId));
      }, 300);
    });
  },

  getPendingDeals: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = getDealsFromStorage();
        resolve(deals.filter(d => d.status === 'pending'));
      }, 300);
    });
  },

  getAllDeals: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = getDealsFromStorage();
        resolve(deals);
      }, 300);
    });
  },

  approveDeal: (dealId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = getDealsFromStorage();
        const updatedDeals = deals.map(d => d.id === dealId ? { ...d, status: 'approved' } : d);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDeals));
        resolve();
      }, 500);
    });
  },

  rejectDeal: (dealId, reason) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = getDealsFromStorage();
        const updatedDeals = deals.map(d => d.id === dealId ? { ...d, status: 'rejected', rejectionReason: reason } : d);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDeals));
        resolve();
      }, 500);
    });
  },
};
