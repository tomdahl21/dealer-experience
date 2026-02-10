import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  loginAsRole: async (role) => {
    set({ isLoading: true, error: null });
    try {
      // Mock user based on role
      const mockUsers = {
        sales: {
          email: 'sarah@dealership.com',
          password: 'demo123',
        },
        manager: {
          email: 'mike@dealership.com',
          password: 'demo123',
        },
      };

      const credentials = mockUsers[role];
      if (!credentials) {
        throw new Error('Invalid role');
      }

      const user = await authService.login(credentials.email, credentials.password);
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false, error: null });
  },

  checkAuth: () => {
    const user = authService.getCurrentUser();
    if (user) {
      set({ user, isAuthenticated: true });
    }
  },
}));

// Initialize auth state from localStorage
useAuthStore.getState().checkAuth();
