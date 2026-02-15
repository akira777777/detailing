import { create } from 'zustand';

// Define types for the store
export const VEHICLE_TYPES = ['sedan', 'suv', 'sport', 'luxury'];
export const CONDITION_LEVELS = ['new', 'used', 'dirty'];

export const DEFAULT_STATE = {
  vehicle: 'sedan',
  condition: 'new',
  modules: {
    coating: true,
    correction: false,
    interior: false
  },
  totalPrice: 1250,
  carModel: 'Tesla Model 3'
};

const useBookingStore = create((set) => ({
  ...DEFAULT_STATE,

  setVehicle: (vehicle) => {
    if (!VEHICLE_TYPES.includes(vehicle)) {
      console.warn(`Invalid vehicle type: ${vehicle}`);
      return;
    }
    set({ vehicle });
  },

  setCondition: (condition) => {
    if (!CONDITION_LEVELS.includes(condition)) {
      console.warn(`Invalid condition level: ${condition}`);
      return;
    }
    set({ condition });
  },

  toggleModule: (moduleKey) => set((state) => ({
    modules: {
      ...state.modules,
      [moduleKey]: !state.modules[moduleKey]
    }
  })),

  setTotalPrice: (totalPrice) => {
    const price = Number(totalPrice);
    if (isNaN(price) || price < 0) {
      console.warn(`Invalid price: ${totalPrice}`);
      return;
    }
    set({ totalPrice: price });
  },

  setCarModel: (carModel) => {
    if (typeof carModel !== 'string' || carModel.trim().length === 0) {
      console.warn(`Invalid car model: ${carModel}`);
      return;
    }
    set({ carModel: carModel.trim() });
  },

  // Helper to set multiple fields from calculator
  setConfiguration: (config) => set((state) => {
    const validConfig = { ...state };

    if (config.vehicle && VEHICLE_TYPES.includes(config.vehicle)) {
      validConfig.vehicle = config.vehicle;
    }

    if (config.condition && CONDITION_LEVELS.includes(config.condition)) {
      validConfig.condition = config.condition;
    }

    if (config.modules && typeof config.modules === 'object' && config.modules !== null) {
      validConfig.modules = {
        ...state.modules,
        ...config.modules
      };
    }

    if (typeof config.totalPrice === 'number' && config.totalPrice >= 0) {
      validConfig.totalPrice = config.totalPrice;
    }

    if (typeof config.carModel === 'string' && config.carModel.trim().length > 0) {
      validConfig.carModel = config.carModel.trim();
    }

    return validConfig;
  }),

  // Reset to default state
  reset: () => set({ ...DEFAULT_STATE }),

  // Getters for derived state
  getSelectedModules: (state) => Object.keys(state.modules).filter(key => state.modules[key]),
  isModuleSelected: (state, moduleKey) => !!state.modules[moduleKey]
}));

export default useBookingStore;
