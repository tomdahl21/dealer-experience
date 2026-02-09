const STORAGE_KEY = 'bdg_deals';

export const dealService = {
  createDeal: (dealData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
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
        const deals = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        resolve(deals.filter(d => d.salespersonId === userId));
      }, 300);
    });
  },

  getPendingDeals: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        resolve(deals.filter(d => d.status === 'pending'));
      }, 300);
    });
  },

  approveDeal: (dealId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const updatedDeals = deals.map(d => d.id === dealId ? { ...d, status: 'approved' } : d);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDeals));
        resolve();
      }, 500);
    });
  },

  rejectDeal: (dealId, reason) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const deals = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const updatedDeals = deals.map(d => d.id === dealId ? { ...d, status: 'rejected', rejectionReason: reason } : d);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDeals));
        resolve();
      }, 500);
    });
  },
};
