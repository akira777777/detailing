import React from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { SectionHeader } from '../components/ui/Components';

const Home = () => {
  const [heroReady, setHeroReady] = React.useState(false);

  React.useLayoutEffect(() => {
    setHeroReady(true);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(5,5,5,1)), url('https://images.unsplash.com/photo-1603584173870-7f3ca9940280?q=80&w=2069&auto=format&fit=crop')" }}></div>
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className={`flex flex-col items-center mb-8 ${heroReady ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="w-32 h-0.5 bg-white/10 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/2 bg-primary animate-shimmer"></div>
            </div>
            <p className="text-white/60 font-bold tracking-[0.5em] uppercase text-[10px] mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Эталон качества с 2012 года</p>
          </div>
          <h1 className={`text-white text-7xl md:text-[110px] font-black leading-[0.9] tracking-tighter mb-10 uppercase ${heroReady ? 'animate-slide-in-left' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            Искусство<br/><span className="text-stroke text-glow">Совершенства</span>
          </h1>
          <p className={`text-white/40 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed ${heroReady ? 'animate-slide-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            Премиальный детейлинг для настоящих ценителей. Прецизионный уход за элитными автомобилями.
          </p>
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${heroReady ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
            <Link to="/gallery" className="min-w-[220px] bg-primary text-white flex items-center justify-center h-14 px-10 rounded font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-black transition-all hover:scale-105 hover:-translate-y-1">
                Наши услуги
            </Link>
            <Link to="/booking" className="min-w-[220px] border border-white/20 bg-white/5 backdrop-blur-md text-white flex items-center justify-center h-14 px-10 rounded font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-black transition-all hover:scale-105 hover:-translate-y-1">
                Записаться
            </Link>
          </div>
        </div>
        <div className="absolute bottom-12 left-12 flex flex-col gap-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Статус</div>
            <div className="flex items-center gap-3">
            <div className="w-40 h-[1px] bg-white/10 relative">
                <div className="absolute top-0 left-0 h-full w-2/3 bg-primary shadow-[0_0_8px_#0091FF] animate-glow"></div>
            </div>
            <span className="text-[10px] font-bold text-primary tracking-tighter animate-pulse-soft">01 / 04</span>
            </div>
        </div>
        <div className="absolute bottom-12 right-12">
            <span className="material-symbols-outlined text-white/30 text-2xl animate-bounce">south</span>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 px-6 lg:px-12 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
                <div className="max-w-2xl">
                    <SectionHeader
                        label="Основные услуги"
                        title={<>Прецизионные<br/>процедуры</>}
                        description="Наша студия использует передовые технологии и методы профессионального ухода, чтобы ваш автомобиль превзошёл заводские стандарты."
                        className="mb-0"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {/* Service 1 */}
            <div className="group relative overflow-hidden bg-white dark:bg-panel-dark border border-gray-200 dark:border-white/5 p-8 transition-all duration-500 hover:bg-gray-50 dark:hover:bg-white/5 h-[600px] flex flex-col hover:border-primary/50 hover-lift shadow-lg dark:shadow-none">
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-12 group-hover:animate-glow">01 / Protection</div>
                        <h4 className="text-3xl font-black uppercase tracking-tight mb-4 text-gray-900 dark:text-white group-hover:text-primary transition-colors">Ceramic Coating</h4>
                        <p className="text-gray-600 dark:text-white/40 text-sm leading-relaxed mb-12 group-hover:text-gray-900 dark:group-hover:text-white/60 transition-colors">Next-generation molecular surface protection offering permanent hydrophobic properties and deep gloss.</p>
                    </div>
                    <div className="flex items-center gap-4 text-gray-900 dark:text-white font-bold text-[10px] tracking-[0.2em] uppercase">
                        <span>Details</span>
                        <div className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-12 group-hover:animate-glow">01 / Защита</div>
                        <h4 className="text-3xl font-black uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">Керамическое покрытие</h4>
                        <p className="text-white/40 text-sm leading-relaxed mb-12 group-hover:text-white/60 transition-colors">Молекулярная защита нового поколения с постоянными гидрофобными свойствами и глубоким блеском.</p>
                    </div>
                    <div className="flex items-center gap-4 text-white font-bold text-[10px] tracking-[0.2em] uppercase">
                        <span>Подробнее</span>
                        <div className="w-0 group-hover:w-8 h-[1px] bg-primary transition-all duration-500"></div>
                        <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">trending_flat</span>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
                    <LazyImage alt="Детали услуги" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTMdvEMwlCD6wcRMOYy1Rii2vcGxzxfpHpzRFRAufSO7PQXZhsNKsOnbnJoa87IAp2Twef6tlc2WsBC3AHJVo4ZJlQuS52m94Kf-CUBT1l570BGkvnwBjobTcg40v11RNmRau0DpF5_GRO8dK6h8cwXnSOgl0ojvgY4URO5rN8YNSqJ1Gm-WxwPoF96Psd9oDGi26jnWbZ4-AeJHY8g2SIMp20p9JCaL9kmDvwmuJDcqmBuTRG-vSeNUL-Lv9H7C1vUh0s1LbB7u4"/>
                </div>
            </div>
            {/* Service 2 */}
            <div className="group relative overflow-hidden bg-white dark:bg-panel-dark border border-gray-200 dark:border-white/5 p-8 transition-all duration-500 hover:bg-gray-50 dark:hover:bg-white/5 h-[600px] flex flex-col hover:border-primary/50 hover-lift shadow-lg dark:shadow-none">
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-12 group-hover:animate-glow">02 / Интерьер</div>
                        <h4 className="text-3xl font-black uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">Детейлинг салона</h4>
                        <p className="text-white/40 text-sm leading-relaxed mb-12 group-hover:text-white/60 transition-colors">Глубокая очистка каждой поры и шва с использованием pH-нейтральных органических средств для кожи и карбона.</p>
                    </div>
                    <div className="flex items-center gap-4 text-white font-bold text-[10px] tracking-[0.2em] uppercase">
                        <span>Подробнее</span>
                        <div className="w-0 group-hover:w-8 h-[1px] bg-primary transition-all duration-500"></div>
                        <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">trending_flat</span>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
                    <LazyImage alt="Детали услуги" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXwI6jQd8TGolkaReFsVXHEY_hEsAJ4-iFgtQvUD9NcNbww40ZqhW3mNkq7OircX536i9yQKEIJ6GpUAUT-Yca0Opd2gbz3FxaRTivEAuq0jRvsOoYludq2AUOAlF9fAarC90w6M0A-Oj41aapcMCs_hm7ZIWHE0LyIdVV0DDU24uCGtqW49y6lM_BY2_RdzCG8u3tzQFkgcMmZT5f_9KV24M382qhS7YNhqu8LcxUi6AsANfxSjvXHs4FO4UNAxzSWdibX_oralM"/>
                </div>
            </div>
            {/* Service 3 */}
            <div className="group relative overflow-hidden bg-white dark:bg-panel-dark border border-gray-200 dark:border-white/5 p-8 transition-all duration-500 hover:bg-gray-50 dark:hover:bg-white/5 h-[600px] flex flex-col hover:border-primary/50 hover-lift shadow-lg dark:shadow-none">
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-12 group-hover:animate-glow">03 / Полировка</div>
                        <h4 className="text-3xl font-black uppercase tracking-tight mb-4 group-hover:text-primary transition-colors">Коррекция ЛКП</h4>
                        <p className="text-white/40 text-sm leading-relaxed mb-12 group-hover:text-white/60 transition-colors">Многоэтапная абразивная полировка для устранения дефектов, голограмм и микроцарапин до идеального блеска.</p>
                    </div>
                    <div className="flex items-center gap-4 text-white font-bold text-[10px] tracking-[0.2em] uppercase">
                        <span>Подробнее</span>
                        <div className="w-0 group-hover:w-8 h-[1px] bg-primary transition-all duration-500"></div>
                        <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">trending_flat</span>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
                    <LazyImage alt="Детали услуги" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXQ3kGrd3kAssLJz0rNegxZG2LgCouc_tW9bjOO6trLiF8KW6crtaa0fB1DUSYfhRpSKVJw8VIAS-6FaWFrGC-yoLuOSQ3HXqqUYqWvJvURp_NzgLvCZX2RHXkc3SJ1yx1PBKQa5z_Ik-62myXb0UxMSz6TbZ4recw9ISxWgj4fD-R_oHBFw6XzpZBVIegy0lt4Q9KgY1tdTvEH3y9phF9wVqu3HA6zzdnEO8zCtLsAVdXRT351b_vfwUWYEuEFrNHiz6wGXiqoAw"/>
                </div>
            </div>
            </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="py-32 px-6 lg:px-12 bg-[#080808] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-24">
            <h2 className="text-primary text-[11px] font-black tracking-[0.5em] uppercase mb-6 animate-glow">Luxe Клуб</h2>
            <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic">Членство</h3>
            <p className="text-white/40 max-w-xl mx-auto font-medium text-sm">Автоматизированные графики обслуживания и приоритетная запись для самых преданных автолюбителей.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-12 stagger-animation">
                <div className="space-y-4 hover-lift">
                <span className="material-symbols-outlined text-primary text-3xl animate-float">ac_unit</span>
                <h5 className="text-lg font-black uppercase tracking-tight">Климатическое хранение</h5>
                <p className="text-white/40 text-[13px] leading-relaxed">Специальные боксы с контролем влажности и круглосуточным мониторингом состояния вашего автомобиля.</p>
                </div>
                <div className="space-y-4 hover-lift">
                <span className="material-symbols-outlined text-primary text-3xl animate-float" style={{ animationDelay: '0.2s' }}>analytics</span>
                <h5 className="text-lg font-black uppercase tracking-tight">Цифровой журнал</h5>
                <p className="text-white/40 text-[13px] leading-relaxed">Верифицированная история обслуживания и HD-фотографии каждой процедуры.</p>
                </div>
                <div className="space-y-4 hover-lift">
                <span className="material-symbols-outlined text-primary text-3xl animate-float" style={{ animationDelay: '0.4s' }}>smart_toy</span>
                <h5 className="text-lg font-black uppercase tracking-tight">Точный мониторинг</h5>
                <p className="text-white/40 text-[13px] leading-relaxed">Регулярная подзарядка АКБ и ротация шин по автоматизированному графику.</p>
                </div>
                <div className="space-y-4 hover-lift">
                <span className="material-symbols-outlined text-primary text-3xl animate-float" style={{ animationDelay: '0.6s' }}>hub</span>
                <h5 className="text-lg font-black uppercase tracking-tight">Эксклюзивный клуб</h5>
                <p className="text-white/40 text-[13px] leading-relaxed">VIP-доступ к закрытым ралли, трек-дням и эксклюзивным предложениям по автомобилям.</p>
                </div>
            </div>
            <div className="lg:col-span-5">
                <div className="bg-panel-dark border border-primary/20 p-12 relative rounded-xl hover-lift">
                <div className="absolute top-0 right-0 p-4">
                    <span className="text-[10px] font-black text-primary tracking-widest uppercase border border-primary/30 px-3 py-1">Ограничено</span>
                </div>
                <div className="mb-10">
                    <h4 className="text-3xl font-black uppercase tracking-tight mb-2">Престиж</h4>
                    <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">₽49 900</span>
                    <span className="text-white/40 text-sm uppercase font-bold tracking-widest">/ месяц</span>
                    </div>
                </div>
                <div className="space-y-6 mb-12 stagger-animation">
                    <div className="flex items-center gap-4 group">
                    <div className="size-2 rounded-full bg-primary group-hover:scale-150 transition-transform"></div>
                    <span className="text-sm font-medium text-white/70">Обслуживание керамики 2 раза в месяц</span>
                    </div>
                    <div className="flex items-center gap-4 group">
                    <div className="size-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                    <span className="text-sm font-medium text-white/70">Ежемесячная химчистка салона</span>
                    </div>
                    <div className="flex items-center gap-4 group">
                    <div className="size-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                    <span className="text-sm font-medium text-white/70">Доставка автомобиля до двери</span>
                    </div>
                    <div className="flex items-center gap-4 group">
                    <div className="size-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></div>
                    <span className="text-sm font-medium text-white/70">Приоритетная запись без ожидания</span>
                    </div>
                </div>
                <button className="w-full bg-white text-black h-16 rounded font-black uppercase tracking-[0.2em] text-[11px] hover:bg-primary hover:text-white transition-all hover-lift">
                        Запросить приглашение
                </button>
                <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Осталось мест: 04</span>
                    <div className="flex gap-1">
                    <div className="size-1 bg-primary animate-pulse-soft"></div>
                    <div className="size-1 bg-primary animate-pulse-soft" style={{ animationDelay: '0.1s' }}></div>
                    <div className="size-1 bg-primary animate-pulse-soft" style={{ animationDelay: '0.2s' }}></div>
                    <div className="size-1 bg-primary animate-pulse-soft" style={{ animationDelay: '0.3s' }}></div>
                    <div className="size-1 bg-white/10"></div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
      </section>
    </>
  );
};

export default Home;
