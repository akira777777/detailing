/**
 * Pricing configuration for detailing services
 */

/**
 * Vehicle type identifier
 */
export type VehicleTypeId = 'sedan' | 'suv' | 'sport' | 'luxury';

/**
 * Condition level identifier
 */
export type ConditionLevelId = 'new' | 'used' | 'bad';

/**
 * Service module identifier
 */
export type ServiceModuleId = 'coating' | 'correction' | 'interior';

/**
 * Pricing configuration
 */
export const PRICING_CONFIG = {
  base: {
    sedan: 150,
    suv: 200,
    sport: 250,
    luxury: 300,
  } as const,
  modules: {
    coating: 250,
    correction: 180,
    interior: 120,
  } as const,
  conditionMultiplier: {
    new: 0,
    used: 0.2,
    bad: 0.5,
  } as const,
} as const;

/**
 * Vehicle type configurations
 */
export const VEHICLE_TYPES = [
  { id: 'sedan', label: 'Sedan', icon: 'directions_car' },
  { id: 'suv', label: 'SUV', icon: 'airport_shuttle' },
  { id: 'sport', label: 'Sport', icon: 'speed' },
  { id: 'luxury', label: 'Luxury', icon: 'diamond' },
] as const;

/**
 * Condition level configurations
 */
export const CONDITION_LEVELS = [
  { id: 'new', label: 'Pristine / New', desc: 'Delivery mileage, minimal contamination.', bar: 'w-1/4' },
  { id: 'used', label: 'Light Wear', desc: 'Swirl marks, minor oxidation, daily use.', bar: 'w-2/4' },
  { id: 'bad', label: 'Heavy Correction', desc: 'Deep scratches, etching, dull finish.', bar: 'w-full' },
] as const;

/**
 * Service module configurations
 */
export const SERVICE_MODULES = [
  {
    id: 'coating',
    title: 'Level 3 Ceramic Coating',
    desc: 'Multi-layer nano-technological protection. 5-year durability.',
    icon: 'layers',
    cost: 250,
  },
  {
    id: 'correction',
    title: 'Precision Paint Correction',
    desc: 'Optical refinement for a swirl-free mirror finish.',
    icon: 'auto_fix_high',
    cost: 180,
  },
  {
    id: 'interior',
    title: 'Interior Concours Detail',
    desc: 'Deep pore cleaning and leather preservation treatment.',
    icon: 'vacuum',
    cost: 120,
  },
] as const;

/**
 * Type exports for vehicle types
 */
export interface VehicleType {
  id: VehicleTypeId;
  label: string;
  icon: string;
}

/**
 * Type exports for condition levels
 */
export interface ConditionLevel {
  id: ConditionLevelId;
  label: string;
  desc: string;
  bar: string;
}

/**
 * Type exports for service modules
 */
export interface ServiceModule {
  id: ServiceModuleId;
  title: string;
  desc: string;
  icon: string;
  cost: number;
}
 * Pricing configuration for detailing services
 */

/**
 * Vehicle type identifier
 */
export type VehicleTypeId = 'sedan' | 'suv' | 'sport' | 'luxury';

/**
 * Condition level identifier
 */
export type ConditionLevelId = 'new' | 'used' | 'bad';

/**
 * Service module identifier
 */
export type ServiceModuleId = 'coating' | 'correction' | 'interior';

/**
 * Pricing configuration
 */
export const PRICING_CONFIG = {
  base: {
    sedan: 150,
    suv: 200,
    sport: 250,
    luxury: 300,
  } as const,
  modules: {
    coating: 250,
    correction: 180,
    interior: 120,
  } as const,
  conditionMultiplier: {
    new: 0,
    used: 0.2,
    bad: 0.5,
  } as const,
} as const;

/**
 * Vehicle type configurations
 */
export const VEHICLE_TYPES = [
  { id: 'sedan', label: 'Sedan', icon: 'directions_car' },
  { id: 'suv', label: 'SUV', icon: 'airport_shuttle' },
  { id: 'sport', label: 'Sport', icon: 'speed' },
  { id: 'luxury', label: 'Luxury', icon: 'diamond' },
] as const;

/**
 * Condition level configurations
 */
export const CONDITION_LEVELS = [
  { id: 'new', label: 'Pristine / New', desc: 'Delivery mileage, minimal contamination.', bar: 'w-1/4' },
  { id: 'used', label: 'Light Wear', desc: 'Swirl marks, minor oxidation, daily use.', bar: 'w-2/4' },
  { id: 'bad', label: 'Heavy Correction', desc: 'Deep scratches, etching, dull finish.', bar: 'w-full' },
] as const;

/**
 * Service module configurations
 */
export const SERVICE_MODULES = [
  {
    id: 'coating',
    title: 'Level 3 Ceramic Coating',
    desc: 'Multi-layer nano-technological protection. 5-year durability.',
    icon: 'layers',
    cost: 250,
  },
  {
    id: 'correction',
    title: 'Precision Paint Correction',
    desc: 'Optical refinement for a swirl-free mirror finish.',
    icon: 'auto_fix_high',
    cost: 180,
  },
  {
    id: 'interior',
    title: 'Interior Concours Detail',
    desc: 'Deep pore cleaning and leather preservation treatment.',
    icon: 'vacuum',
    cost: 120,
  },
] as const;

/**
 * Type exports for vehicle types
 */
export interface VehicleType {
  id: VehicleTypeId;
  label: string;
  icon: string;
}

/**
 * Type exports for condition levels
 */
export interface ConditionLevel {
  id: ConditionLevelId;
  label: string;
  desc: string;
  bar: string;
}

/**
 * Type exports for service modules
 */
export interface ServiceModule {
  id: ServiceModuleId;
  title: string;
  desc: string;
  icon: string;
  cost: number;
}

