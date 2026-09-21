import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Download, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Layers, 
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApkItem } from '../types';

export const HeroSlider: React.FC = () => {
  const { apks, navigateToApk } = useApp();
  const featuredApks = apks.filter(a => a.isFeatured || a.isEditorChoice).slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);

  const activeApk: ApkItem | undefined = featuredApks[currentIndex] || featuredApks[0];

  useEffect(() => {
    if (featuredApks.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredApks.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [featuredApks.length, isPaused]);

  if (!activeApk) return null;

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % featuredApks.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + featuredApks.length) % featuredApks.length);
  };

  return (
    <section 
      id="hero-slider-section"
      className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-10 shadow-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-900 text-white w-full max-w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Banner with dynamic dark gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={activeApk.bannerUrl || activeApk.screenshots[0] || activeApk.iconUrl}
          alt={activeApk.title}
          className="w-full h-full object-cover object-center scale-105 filter brightness-75 transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/85 via-zinc-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-black/20" />
      </div>

      {/* Decorative Emerald Glow Orb */}
      <div className="absolute top-10 left-1/3 w-80 h-80 bg-emerald-500/20 rounded-full filter blur-3xl pointer-events-none animate-pulse" />

      {/* Main Content Area */}
      <div className="relative z-10 p-4 sm:p-8 lg:p-12 flex flex-col justify-between min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] w-full max-w-full">
        
        {/* Top Badges & Switcher buttons */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
            <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/30">
              <Zap className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-current" />
              HOT MOD FEATURED
            </span>
            <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/15 text-white">
              <ShieldCheck className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-400" />
              Safe & Verified
            </span>
            <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-white/10 backdrop-blur-md text-emerald-300">
              {activeApk.version}
            </span>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handlePrev}
              className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/15 text-white transition cursor-pointer"
              aria-label="Previous Featured Mod"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/15 text-white transition cursor-pointer"
              aria-label="Next Featured Mod"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Center Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center my-4 sm:my-6 w-full">
          <div className="lg:col-span-8 space-y-3 sm:space-y-4 min-w-0 w-full">
            
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
              <img
                src={activeApk.iconUrl}
                alt={activeApk.title}
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-xl border-2 border-white/20 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-white drop-shadow-md break-words">
                  {activeApk.title}
                </h2>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-300 mt-1 flex-wrap">
                  <span className="font-medium text-emerald-400">{activeApk.developer}</span>
                  <span>•</span>
                  <span>{activeApk.category}</span>
                  <span>•</span>
                  <span>{activeApk.size}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                    {activeApk.rating} ({activeApk.ratingCount.toLocaleString()})
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-base text-zinc-300 line-clamp-2 max-w-2xl">
              {activeApk.shortDescription || activeApk.description}
            </p>

            {/* Mod features highlights */}
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 backdrop-blur-md max-w-2xl">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> MOD Features Unlocked:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {activeApk.modFeatures.slice(0, 4).map((mod, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-zinc-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{mod}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2 w-full sm:w-auto">
              <button
                id="hero-download-btn"
                onClick={() => navigateToApk(activeApk, 'detail')}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>Fast Download ({activeApk.size})</span>
              </button>

              <button
                id="hero-details-btn"
                onClick={() => navigateToApk(activeApk, 'detail')}
                className="w-full sm:w-auto px-4 sm:px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Full Details & Screenshots</span>
              </button>
            </div>
          </div>

          {/* Right Preview Card / Thumbnails on large screens */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Top Featured Selection
            </div>
            {featuredApks.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition border ${
                  idx === currentIndex
                    ? 'bg-emerald-950/60 border-emerald-500/80 shadow-md shadow-emerald-900/50'
                    : 'bg-zinc-900/60 border-white/5 hover:bg-white/10'
                }`}
              >
                <img
                  src={item.iconUrl}
                  alt={item.title}
                  className="w-11 h-11 rounded-lg object-cover border border-white/10"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{item.version}</span>
                  </div>
                </div>
                {idx === currentIndex && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Slide Dots & Progress Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            {featuredApks.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <span>Powered by</span>
            <a 
              href="https://linksshare.online" 
              target="_blank" 
              rel="noreferrer" 
              className="text-emerald-400 font-bold hover:underline"
            >
              linksshare.online
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
