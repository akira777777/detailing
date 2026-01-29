import React from 'react';
import { Link } from 'react-router-dom';

const BookingConfirmation = () => {
  return (
    <div className="pt-32 pb-24 px-4 lg:px-12 bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center">
      <div className="max-w-[800px] w-full flex flex-col items-center gap-6">

        {/* Success Header */}
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/30">
                <span className="material-symbols-outlined text-primary text-5xl shadow-[0_0_15px_rgba(19,127,236,0.5)]">check_circle</span>
            </div>
            <h1 className="text-white tracking-tight text-4xl md:text-5xl font-extrabold leading-tight pb-3">Booking Confirmed!</h1>
            <p className="text-white/60 text-base md:text-lg font-normal leading-normal max-w-md">Your vehicle is in good hands. We've sent a detailed confirmation to your email address.</p>
        </div>

        {/* Order Summary Card */}
        <div className="w-full bg-panel-dark rounded-xl overflow-hidden shadow-xl border border-white/5 mt-4">
            {/* Vehicle Hero */}
            <div className="relative h-48 md:h-64 bg-center bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB-IWre4oh1LHb7FGs-uLuETJM77NRbDSYGTXPQ8dXOtePnz-CsFX_GfhRqu9iASxLFnhMkmyWE5woOCOT5MHmDxfQSSUIqi8iAd2CMtM5WAOdvqOG7nYCyt0t4f2uNP5clGUTdyxCFzCEYlzMNeYC4bBVUkkfgccPJzYixR5ayp0sLJQKC-Hl4jFXC9hjAfHI4R3I7QBnc0270_OL_LGC8HnzGn8-lCMKnixbX00pVwHWibEmnZ6k2eUjOWVQcVin8vj2-eNbFdvE')" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-panel-dark to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                    <h2 className="text-white text-2xl font-bold">Porsche 911 Carrera S</h2>
                    <p className="text-primary font-medium">Plate: P911-DETL</p>
                </div>
            </div>

            {/* Details Content */}
            <div className="p-6 md:p-8 flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
                            Appointment Details
                        </h3>
                        <div className="bg-background-dark/50 p-4 rounded-lg border border-white/5">
                            <p className="text-white text-lg font-bold">October 24, 2023</p>
                            <p className="text-white/60">10:00 AM — 04:00 PM</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">construction</span>
                            Selected Services
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-white/60">Ceramic Coating (Gold Package)</span>
                                <span className="text-white font-semibold">$850.00</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-white/60">Interior Deep Clean & Leather Care</span>
                                <span className="text-white font-semibold">$150.00</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-6 flex justify-between items-center">
                    <div>
                        <p className="text-white/40 text-xs uppercase font-bold tracking-widest">Total Investment</p>
                        <p className="text-3xl font-extrabold text-primary">$1,000.00</p>
                    </div>
                    <button className="h-10 px-4 flex items-center gap-2 rounded-lg bg-background-dark/50 text-white hover:bg-white/5 transition-all text-sm font-bold border border-white/5">
                        <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        Receipt
                    </button>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center mt-2">
            <button className="flex-1 max-w-[240px] h-12 flex items-center justify-center gap-2 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-all font-bold">
                <span className="material-symbols-outlined text-[20px]">calendar_add_on</span>
                Add to Calendar
            </button>
            <Link to="/" className="flex-1 max-w-[240px] h-12 flex items-center justify-center gap-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-[20px]">home</span>
                Return Home
            </Link>
        </div>

        {/* Location & Support */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
             <div className="bg-panel-dark p-6 rounded-xl border border-white/5 flex gap-4">
                <div className="flex-1">
                    <h3 className="text-white font-bold mb-2">Salon Location</h3>
                    <p className="text-white/60 text-sm mb-4">742 Detailing Blvd, <br/>Performance District, CA 90210</p>
                    <a href="#" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                        <span className="material-symbols-outlined text-[18px]">directions</span>
                        Get Directions
                    </a>
                </div>
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJIpKmQMt5Ulo-u14aYniZVaV6XgIImKujL8VkDWuUKwmspdeCy_CmiydKRnMCGwuDqFhzCrLb8N7t69u4pLBYtX9xZtU_o3e-PYX_1lMBZjLJRwuw1KvvI4H0bWmpuoMRIYAdci013e0dQRzABYLR3zj_HnWSx-YOWI_Ie-77E9laqrG-pEZ7XgJ0mUyfyzbKxsQTWHh7UhFMS_N85FP6eeELCaSGnag32Ta9lVfWo1tF95ebhm1NiUhFKhZL5ChP96_kACZF6FQ')" }}></div>
                </div>
             </div>

             <div className="bg-panel-dark p-6 rounded-xl border border-white/5 flex flex-col justify-between">
                <div>
                    <h3 className="text-white font-bold mb-2">Need Help?</h3>
                    <p className="text-white/60 text-sm">If you need to reschedule or have special instructions, contact our concierge.</p>
                </div>
                <div className="flex gap-4 mt-4">
                    <a href="tel:5551234567" className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg bg-background-dark/50 text-white border border-white/5 text-sm font-bold hover:bg-white/5">
                        <span className="material-symbols-outlined text-[18px]">call</span>
                        Call Us
                    </a>
                     <a href="mailto:support@prodetail.com" className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg bg-background-dark/50 text-white border border-white/5 text-sm font-bold hover:bg-white/5">
                        <span className="material-symbols-outlined text-[18px]">mail</span>
                        Email
                    </a>
                </div>
             </div>
        </div>

        <div className="mt-8 pb-12 text-center">
            <p className="text-white/30 text-xs">Confirmation ID: PRD-90124-B1 <br/>© 2024 Luxe Detail Salon Professional Services</p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
