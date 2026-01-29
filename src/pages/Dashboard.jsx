import React from 'react';
import { useToast } from '../context/ToastContext';
import { userData, dashboardMenu, activeService, serviceHistory } from '../data/mockData';

const Dashboard = () => {
  const { addToast } = useToast();

  return (
    <div className="flex min-h-screen pt-20 bg-background-light dark:bg-background-dark">
      {/* Sidebar Navigation */}
      <aside className="w-72 border-r border-white/10 bg-[#111418] hidden lg:flex flex-col justify-between p-6 fixed h-[calc(100vh-80px)] top-20 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-8">
            {/* User Profile */}
            <div className="flex items-center gap-3">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 ring-2 ring-primary/50" style={{ backgroundImage: `url('${userData.avatar}')` }}></div>
                <div className="flex flex-col">
                    <h1 className="text-white text-base font-bold leading-tight">{userData.name}</h1>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-primary filled">stars</span>
                        <p className="text-white/60 text-xs font-medium uppercase tracking-wider">{userData.membership}</p>
                    </div>
                </div>
            </div>
            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">
                {dashboardMenu.map((item, i) => (
                    <div key={item.name} className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${i === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/60 hover:bg-white/5'}`}>
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <p className="text-sm font-semibold">{item.name}</p>
                    </div>
                ))}
            </nav>
        </div>
        {/* Sidebar Footer */}
        <div className="flex flex-col gap-4">
            <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-primary uppercase">Loyalty Points</p>
                    <span className="text-white font-bold text-sm">{userData.loyaltyPoints.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(userData.loyaltyPoints / userData.nextReward) * 100}%` }}></div>
                </div>
                <p className="text-[10px] text-white/60 mt-2 italic">{userData.nextReward - userData.loyaltyPoints} pts to next reward</p>
            </div>
            <button
                onClick={() => addToast('Redirecting to booking studio...', 'info')}
                className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                Book New Service
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 px-6 lg:px-10 py-8 lg:ml-72">
        {/* Header Section */}
        <header className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div className="flex flex-col gap-1">
                <h2 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-tight">Customer Dashboard</h2>
                <p className="text-gray-600 dark:text-white/60 text-base font-normal">Manage your premium detailing services and loyalty rewards.</p>
            </div>
            <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-panel-dark hover:bg-white/10 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 border border-white/5">
                    <span className="material-symbols-outlined text-sm">card_membership</span>
                    View Membership Perks
                </button>
            </div>
        </header>

        {/* Active Status Section */}
        <section className="mb-10">
            <div className="flex items-center gap-2 mb-4 px-1">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <h3 className="text-gray-900 dark:text-white text-xl font-bold tracking-tight">Current Status</h3>
            </div>
            <div className="bg-white dark:bg-panel-dark rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col lg:flex-row shadow-2xl transition-colors">
                <div className="w-full lg:w-1/3 min-h-[240px] bg-center bg-no-repeat bg-cover relative" style={{ backgroundImage: `url('${activeService.image}')` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-panel-dark/20 to-transparent"></div>
                </div>
                <div className="flex-1 p-8 flex flex-col justify-between">
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Active Detailing</p>
                                <p className="text-gray-900 dark:text-white text-2xl font-extrabold tracking-tight">{activeService.status}</p>
                                <p className="text-gray-600 dark:text-white/60 text-base mt-2">Vehicle: <span className="text-gray-900 dark:text-white font-medium">{activeService.vehicle}</span></p>
                            </div>
                            <button
                                onClick={() => addToast('Connecting to live feed... (Demo)', 'warning')}
                                className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary text-sm font-bold rounded-lg transition-colors flex items-center gap-2 border border-primary/20"
                            >
                                <span className="material-symbols-outlined text-sm">videocam</span>
                                Live Camera
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-end">
                                <p className="text-gray-900 dark:text-white text-sm font-semibold">{activeService.stage}</p>
                                <p className="text-primary text-lg font-bold">{activeService.progress}%</p>
                            </div>
                            <div className="h-3 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden border border-gray-300 dark:border-white/5">
                                <div className="h-full bg-primary shadow-[0_0_15px_rgba(19,127,236,0.6)]" style={{ width: `${activeService.progress}%` }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-4 text-sm text-gray-600 dark:text-white/60">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            Estimated Completion: <span className="text-gray-900 dark:text-white">{activeService.completion}</span>
                        </div>
                        <div className="h-1 w-1 bg-gray-400 dark:bg-white/20 rounded-full"></div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">person</span>
                            Master Detailer: <span className="text-gray-900 dark:text-white">{activeService.master}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Service History Table Section */}
        <section>
            <div className="flex justify-between items-center mb-6 px-1">
                <h3 className="text-gray-900 dark:text-white text-xl font-bold tracking-tight">Service History</h3>
                <div className="flex gap-2">
                    <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-gray-500 dark:text-white/60">search</span>
                        <input className="bg-white dark:bg-panel-dark border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary w-64 border outline-none" placeholder="Search history..." type="text"/>
                    </div>
                    <button className="p-2 bg-white dark:bg-panel-dark border-gray-200 dark:border-white/10 border text-gray-500 dark:text-white/60 rounded-lg hover:text-gray-900 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">filter_list</span>
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-panel-dark rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/60 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Vehicle</th>
                                <th className="px-6 py-4">Cost</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {serviceHistory.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-5 text-sm font-medium text-gray-900 dark:text-white">{row.date}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 dark:text-white text-sm font-bold">{row.title}</span>
                                            <span className="text-gray-500 dark:text-white/60 text-xs">{row.sub}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-gray-600 dark:text-white/60 text-sm">{row.vehicle}</td>
                                    <td className="px-6 py-5 text-gray-900 dark:text-white text-sm font-bold">{row.cost}</td>
                                    <td className="px-6 py-5">
                                        <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase rounded">{row.status}</span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 text-sm font-bold">
                                            <span className="material-symbols-outlined text-sm">download</span>
                                            PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 bg-white/5 flex justify-between items-center text-white/60 text-xs">
                    <p>Showing 4 of 12 service entries</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white/10 rounded disabled:opacity-50 hover:bg-white/20">Previous</button>
                        <button className="px-3 py-1 bg-primary text-white rounded">1</button>
                        <button className="px-3 py-1 bg-white/10 rounded hover:bg-white/20">2</button>
                        <button className="px-3 py-1 bg-white/10 rounded hover:bg-white/20">Next</button>
                    </div>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
