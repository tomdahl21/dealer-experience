import { create } from 'zustand';
import { vinService } from '../services/vinService';

export const useVehicleStore = create((set, get) => ({
  vehicle: null,
  currentVehicle: null,
  loading: false,
  isLoading: false,
  error: null,

  findVehicleByVIN: async (vin) => {
    set({ loading: true, isLoading: true, error: null });
    try {
      const vehicle = await vinService.decodeVIN(vin);
      set({ vehicle, currentVehicle: vehicle, loading: false, isLoading: false });
      return vehicle;
    } catch (error) {
      set({ error: error.message, loading: false, isLoading: false });
      throw error;
    }
  },

  fetchVehicleByVIN: async (vin) => {
    set({ loading: true, isLoading: true, error: null });
    try {
      const vehicle = await vinService.decodeVIN(vin);
      set({ vehicle, currentVehicle: vehicle, loading: false, isLoading: false });
      return { success: true, vehicle };
    } catch (error) {
      set({ error: error.message, loading: false, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  clearCurrentVehicle: () => {
    set({ vehicle: null, currentVehicle: null, error: null });
  },
}));
