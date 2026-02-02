import { create } from 'zustand';

const useBookingStore = create((set) => ({
  vehicle: 'sedan',
  condition: 'new',
  modules: {
    coating: true,
    correction: false,
    interior: false
  },
  totalPrice: 1250,
  carModel: 'Tesla Model 3', // Default or user specified later
  bookingDate: null,
  bookingTime: null,

  setVehicle: (vehicle) => set({ vehicle }),
  setCondition: (condition) => set({ condition }),
  toggleModule: (moduleKey) => set((state) => ({
    modules: {
      ...state.modules,
      [moduleKey]: !state.modules[moduleKey]
    }
  })),
  setTotalPrice: (totalPrice) => set({ totalPrice }),
  setCarModel: (carModel) => set({ carModel }),
  setBookingDetails: (date, time) => set({ bookingDate: date, bookingTime: time }),

  // Helper to set multiple fields from calculator
  setConfiguration: (config) => set((state) => ({
    ...state,
    ...config
  }))
}));

export default useBookingStore;
