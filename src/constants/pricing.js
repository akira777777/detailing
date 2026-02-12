/**
 * Pricing configuration for detailing services
 */
export const PRICING_CONFIG = {
    base: {
        sedan: 150,
        suv: 200,
        sport: 250,
        luxury: 300
    },
    modules: {
        coating: 250,
        correction: 180,
        interior: 120
    },
    conditionMultiplier: {
        new: 0,
        used: 0.2,
        bad: 0.5
    }
};

/**
 * Vehicle type configurations
 */
export const VEHICLE_TYPES = [
    { id: 'sedan', label: 'Sedan', icon: 'directions_car' },
    { id: 'suv', label: 'SUV', icon: 'airport_shuttle' },
    { id: 'sport', label: 'Sport', icon: 'speed' },
    { id: 'luxury', label: 'Luxury', icon: 'diamond' }
];

/**
 * Condition level configurations
 */
export const CONDITION_LEVELS = [
    { id: 'new', label: 'Pristine / New', desc: 'Delivery mileage, minimal contamination.', bar: 'w-1/4' },
    { id: 'used', label: 'Light Wear', desc: 'Swirl marks, minor oxidation, daily use.', bar: 'w-2/4' },
    { id: 'bad', label: 'Heavy Correction', desc: 'Deep scratches, etching, dull finish.', bar: 'w-full' }
];

/**
 * Service module configurations  
 */
export const SERVICE_MODULES = [
    {
        id: 'coating',
        title: 'Level 3 Ceramic Coating',
        desc: 'Multi-layer nano-technological protection. 5-year durability.',
        icon: 'layers',
        cost: 250
    },
    {
        id: 'correction',
        title: 'Precision Paint Correction',
        desc: 'Optical refinement for a swirl-free mirror finish.',
        icon: 'auto_fix_high',
        cost: 180
    },
    {
        id: 'interior',
        title: 'Interior Concours Detail',
        desc: 'Deep pore cleaning and leather preservation treatment.',
        icon: 'vacuum',
        cost: 120
    }
];
