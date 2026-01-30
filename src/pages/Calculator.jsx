import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/ui/Components';
import { pricingConfig } from '../data/mockData';

const Calculator = () => {
  const { addToast } = useToast();
  const [vehicle, setVehicle] = useState('sedan');
  const [condition, setCondition] = useState('new');
  const [modules, setModules] = useState({
    coating: true,
    correction: false,
    interior: false
  });

  const total = useMemo(() => {
    let subtotal = 0;

    // Add module costs
    if (modules.coating) subtotal += pricingConfig.modules.coating;
    if (modules.correction) subtotal += pricingConfig.modules.correction;
    if (modules.interior) subtotal += pricingConfig.modules.interior;

    subtotal += pricingConfig.base[vehicle];

    // Condition affects labor heavy tasks like correction
    if (modules.correction) {
        subtotal += (pricingConfig.modules.correction * pricingConfig.conditionMultiplier[condition]) - pricingConfig.modules.correction;
    }

    return subtotal;
  }, [vehicle, condition, modules]);

  const toggleModule = (key) => {
    setModules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto">
        <PageHeader
            label="Configuration Studio"
            title={<>Service Cost<br/>Calculator</>}
            description="Configure your bespoke detailing package. Our pricing algorithm calculates precision estimates based on vehicle geometry and surface requirements."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-12">
            {/* Step 1: Vehicle */}
            <section>
              <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-white/5 pb-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white">01. Select Vehicle Geometry</h2>
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Required</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['sedan', 'suv', 'sport', 'luxury'].map((type) => (
                    <label key={type} className="group relative cursor-pointer">
                        <input
                            type="radio"
                            name="vehicle"
                            className="peer sr-only"
                            checked={vehicle === type}
                            onChange={() => setVehicle(type)}
                        />
                        <div className="bg-white dark:bg-panel-dark border border-gray-200 dark:border-white/10 p-6 flex flex-col items-center gap-4 transition-all duration-300 peer-checked:border-primary peer-checked:bg-primary/5 group-hover:border-gray-400 dark:group-hover:border-white/30 rounded-xl shadow-sm dark:shadow-none">
                            <span className={`material-symbols-outlined text-4xl transition-colors ${vehicle === type ? 'text-primary' : 'text-gray-400 dark:text-white/20 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                {type === 'sedan' ? 'directions_car' : type === 'suv' ? 'airport_shuttle' : type === 'sport' ? 'speed' : 'diamond'}
                            </span>
                            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-900 dark:text-white">{type}</span>
                            <div className={`absolute top-2 right-2 transition-opacity ${vehicle === type ? 'opacity-100' : 'opacity-0'}`}>
                                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                            </div>
                        </div>
                    </label>
                ))}
              </div>
            </section>

            {/* Step 2: Condition */}
            <section>
              <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-white/5 pb-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white">02. Paint Surface Assessment</h2>
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Condition</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { id: 'new', label: 'Pristine / New', desc: 'Delivery mileage, minimal contamination.', bar: 'w-1/4' },
                    { id: 'used', label: 'Light Wear', desc: 'Swirl marks, minor oxidation, daily use.', bar: 'w-2/4' },
                    { id: 'bad', label: 'Heavy Correction', desc: 'Deep scratches, etching, dull finish.', bar: 'w-full' }
                ].map((item) => (
                    <label key={item.id} className="cursor-pointer">
                        <input
                            type="radio"
                            name="condition"
                            className="peer sr-only"
                            checked={condition === item.id}
                            onChange={() => setCondition(item.id)}
                        />
                        <div className="bg-white dark:bg-panel-dark border border-gray-200 dark:border-white/5 p-8 transition-all duration-300 peer-checked:border-primary/40 peer-checked:bg-primary/5 rounded-xl h-full flex flex-col justify-between shadow-sm dark:shadow-none">
                            <div>
                                <h4 className="text-lg font-black uppercase tracking-tight mb-2 text-gray-900 dark:text-white">{item.label}</h4>
                                <p className="text-gray-600 dark:text-white/30 text-[11px] leading-relaxed mb-6">{item.desc}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-[2px] w-full bg-gray-200 dark:bg-white/10 overflow-hidden rounded-full">
                                    <div className={`h-full bg-primary ${item.bar}`}></div>
                                </div>
                            </div>
                        </div>
                    </label>
                ))}
              </div>
            </section>

            {/* Step 3: Modules */}
            <section>
              <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-white/5 pb-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white">03. Core Service Modules</h2>
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Multi-Select</span>
              </div>
              <div className="space-y-4">
                 {[
                    { id: 'coating', title: 'Level 3 Ceramic Coating', desc: 'Multi-layer nano-technological protection. 5-year durability.', icon: 'layers', cost: pricingConfig.modules.coating },
                    { id: 'correction', title: 'Precision Paint Correction', desc: 'Optical refinement for a swirl-free mirror finish.', icon: 'auto_fix_high', cost: pricingConfig.modules.correction },
                    { id: 'interior', title: 'Interior Concours Detail', desc: 'Deep pore cleaning and leather preservation treatment.', icon: 'vacuum', cost: pricingConfig.modules.interior }
                 ].map((mod) => (
                    <div key={mod.id} className={`bg-white dark:bg-panel-dark border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all rounded-xl shadow-sm dark:shadow-none ${modules[mod.id] ? 'border-primary/30 bg-primary/5' : 'border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20'}`}>
                        <div className="flex gap-6 items-start md:items-center">
                            <div className="size-12 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0 rounded-lg">
                                <span className={`material-symbols-outlined ${modules[mod.id] ? 'text-primary' : 'text-gray-500 dark:text-white'}`}>{mod.icon}</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white">{mod.title}</h4>
                                <p className="text-gray-500 dark:text-white/40 text-[11px] font-medium tracking-wide">{mod.desc}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-8">
                            <div className="text-right">
                                <span className="text-gray-400 dark:text-white/40 text-[10px] uppercase font-bold tracking-widest block">Est. Cost</span>
                                <span className="text-xl font-black text-gray-900 dark:text-white">${mod.cost}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={modules[mod.id]} onChange={() => toggleModule(mod.id)} />
                                <div className="w-14 h-7 bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                 ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="glass-panel p-8 border border-white/10 relative overflow-hidden rounded-xl bg-gray-900/95 dark:bg-panel-dark/95 backdrop-blur-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10"></div>
                <div className="mb-8">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-2">Configuration Summary</h3>
                    <div className="h-[1px] w-full bg-gradient-to-r from-primary to-transparent"></div>
                </div>
                <div className="space-y-6 mb-12">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Vehicle</p>
                            <p className="text-sm font-bold capitalize text-white">{vehicle}</p>
                        </div>
                        <span className="text-xs font-bold text-white">+${pricingConfig.base[vehicle]}</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Surface Condition</p>
                            <p className="text-sm font-bold capitalize text-white">{condition}</p>
                        </div>
                        <span className="text-xs font-bold text-white">x{pricingConfig.conditionMultiplier[condition]} (Correction)</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Active Modules</p>
                            <p className="text-sm font-bold text-white">{Object.keys(modules).filter(k => modules[k]).length} Selected</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-8 mb-10">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60">Estimated Total</span>
                        <span className="text-[11px] text-primary font-black tracking-widest uppercase">Inc. Tax</span>
                    </div>
                    <div className="text-5xl font-black text-white tracking-tighter">
                        ${Math.floor(total)}<span className="text-lg text-white/30 ml-2 font-medium tracking-normal">.00</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <Link
                        to="/booking"
                        onClick={() => addToast('Configuration applied to booking!', 'success')}
                        className="w-full flex items-center justify-center bg-primary text-white h-16 rounded font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(0,145,255,0.3)]"
                    >
                        Book This Configuration
                    </Link>
                    <button
                        onClick={() => addToast('Configuration saved to your profile.', 'info')}
                        className="w-full border border-white/10 text-white/60 h-14 rounded font-black uppercase tracking-[0.2em] text-[11px] hover:border-white hover:text-white transition-all"
                    >
                        Save for later
                    </button>
                </div>
                <div className="mt-8 flex items-center gap-3 text-white/40">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <p className="text-[10px] font-bold uppercase tracking-widest">Guaranteed Studio Slots available within 7 days</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
