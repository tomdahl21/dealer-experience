import { create } from 'zustand';
import { dealService } from '../services/dealService';

export const useDealStore = create((set, get) => ({
  deals: [],
  pendingDeals: [],
  isLoading: false,
  error: null,

  fetchDeals: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const deals = await dealService.getDealsByUser(userId);
      set({ deals, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPendingDeals: async () => {
    set({ isLoading: true, error: null });
    try {
      const pendingDeals = await dealService.getPendingDeals();
      set({ pendingDeals, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  submitDeal: async (dealData) => {
    set({ isLoading: true, error: null });
    try {
      const deal = await dealService.createDeal(dealData);
      const { deals } = get();
      set({ deals: [...deals, deal], isLoading: false });
      return { success: true, deal };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  approveDeal: async (dealId) => {
    set({ isLoading: true, error: null });
    try {
      await dealService.approveDeal(dealId);
      const { pendingDeals } = get();
      set({
        pendingDeals: pendingDeals.filter(d => d.id !== dealId),
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  rejectDeal: async (dealId, reason) => {
    set({ isLoading: true, error: null });
    try {
      await dealService.rejectDeal(dealId, reason);
      const { pendingDeals } = get();
      set({
        pendingDeals: pendingDeals.filter(d => d.id !== dealId),
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },
}));
