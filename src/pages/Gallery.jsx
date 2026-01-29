import React, { useState } from 'react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import AnimatedSection from '../components/AnimatedSection';
import LazyImage from '../components/LazyImage';

const Gallery = () => {
    const [filter, setFilter] = useState('All');

    const transformations = [
        {
            id: 1,
            title: "Porsche 911 Carrera S",
            category: "Luxury",
            services: ["Stage 2 Paint Correction", "Gold Ceramic Package", "Wheel Decontamination"],
            time: "18 Hours",
            before: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRUMtMysnBlgL_VKz55YRuUy5trgMbv1AuRqadZ7zvVfyU6nwjDSZeLh36ZessfGQ74ceXrkAHaEB6q1WQDkZueRAaNi-nwUXRqW1IToePd6ZEYNtqmA8HprFWDQEydRtZlKJR1t_yFOh2-zycQKKdVHat89iBboMRfzl7b7fYIqQG7ngcvuFNT-PlcNunE-sahCZT7tE7QCe97viGCdOXG0mR0P_WWT30ctMm0jQwoKTOxCvtVzeqdpoBQB7ERH8SRQDLyZR6W_I",
            after: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFCgomw-DjTCZV9OycWZOOTIUjoBJoJZCnHqOPKjDrRZCIwkF0XQTxM9ckLq2C9LJW8sh75qgpdHply7f02LB4WFSNqRTQ1rY2F1TcPiUBAyweBLS9rOLmo77ytOted0qmvfe6GV8R35Oul7U2mUq3o4Ex2SxeDpuMlsakz313PRHSsm-XbflSQgU9Qi-mPoeWWgVhdjxfYwlGdHrnzxZhGO4qiNbXrMpRITg42jrFTA7fNSOL8rIfNMPOAA32-r16gzXfxio_pxA"
        },
        {
            id: 2,
            title: "Land Rover Defender",
            category: "SUV",
            services: ["Iron Decontamination", "Trim Restoration", "Interior Deep Clean"],
            time: "12 Hours",
            before: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3xGW1KzbrA0UXcgkZr-b8nUFSBEe5uM_kTy5C4vEqCFYOG9V2E9KuKDc8_Vyxrs4faXEILlDdGj1z4qOyt60CqRgYLLcovZKKK0K9uAps6jlMGSwToEaX7sInH4v1T84bYJqd2hGc59hX84AE6FLyftfYJUJ6KWKHPSjP_TX9rMElxTt5wDKGT5jBR49Nu76dx1kMVDUmScOnDAM7QWGjGPz8KYqAsVyOk8a8Uc6FbyI3tlxxlsGUWqqAvOwS0Dzx8IXyoYBvn5w",
            after: "https://lh3.googleusercontent.com/aida-public/AB6AXuAePs0dEfcR_qyDiYkgjC_mF_rhUAnn_S7fpcSktbTzYV2jQafIPOD1xQ8oWQm8ZAjz5PZQvxWYdYdhyVP60NgLFC5bfKP8cpermYNJhTc0cz3KM0NQOhY5gyQARXiENd0vrM_d93H6eGMyr8eoXhb3Rh-JQ-Lg5XGYS9y7vYMDcgbIU7_4zpFdEFfey-IK34FmkMApJpS2zFo_vQbaEKgoHPiAK2Ht2ZCpyCoymnpgL3EmHHntdHQn6G3ILCzLDnkOAx8A1bxzC2s"
        }
    ];

    return (
        <div className="pt-32 pb-24 px-6 lg:px-12 bg-background-dark min-h-screen">
             <div className="max-w-[1440px] mx-auto">
                <AnimatedSection className="flex flex-col gap-4 mb-16">
                    <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs animate-glow">
                        <span className="h-px w-8 bg-primary animate-shimmer"></span>
                        The Results
                    </div>
                    <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em] uppercase animate-slide-in-left">Transformation<br/>Gallery</h1>
                    <p className="text-white/40 text-lg max-w-2xl animate-fade-in-up">
                        Witness the professional precision and showroom-quality results. Our gallery highlights the level of care we put into every vehicle that enters our studio.
                    </p>
                </AnimatedSection>

                <div className="flex flex-wrap gap-3 items-center mb-12 stagger-animation">
                    <span className="text-xs font-bold uppercase text-white/40 mr-2">Filter By:</span>
                    {['All', 'Luxury', 'SUV', 'Correction', 'Protection'].map(cat => (
                         <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`flex h-9 items-center justify-center gap-x-2 rounded-full border px-6 text-xs font-bold uppercase tracking-wider transition-all ${filter === cat ? 'bg-primary border-primary text-white scale-105 animate-glow' : 'border-white/10 text-white/60 hover:border-primary hover:text-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-12 stagger-animation">
                    {transformations.map((item, index) => (
                        <AnimatedSection key={item.id} delay={index * 100} className="hover-lift">
                          <div className="group bg-panel-dark rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all shadow-2xl hover:shadow-[0_0_40px_rgba(0,145,255,0.2)]">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="h-[400px] lg:h-[500px] relative overflow-hidden">
                                    <BeforeAfterSlider beforeImage={item.before} afterImage={item.after} alt={item.title} />
                                </div>
                                <div className="p-8 lg:p-12 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 animate-slide-in-right">
                                            <span className="px-3 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20 hover:border-primary/50 transition-all">{item.category}</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
                                        <div className="space-y-4 mb-8 stagger-animation">
                                            {item.services.map((service, i) => (
                                                <div key={i} className="flex items-start gap-3 group/item">
                                                    <span className="material-symbols-outlined text-primary mt-1 text-sm group-hover/item:scale-125 transition-transform">check_circle</span>
                                                    <p className="text-white/60 text-sm leading-relaxed group-hover/item:text-white transition-colors">{service}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-white/5 pt-8">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-white/40 mb-1">Total Time</span>
                                            <span className="text-white font-black text-lg animate-pulse-soft">{item.time}</span>
                                        </div>
                                        <button className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:text-white transition-all hover:gap-4 group/btn">
                                            Case Study <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </AnimatedSection>
                    ))}
                </div>
             </div>
        </div>
    );
};

export default Gallery;
