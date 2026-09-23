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
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApkItem } from '../types';

export const HeroSlider: React.FC = () => {
  const { apks, navigateToApk } = useApp();
  const featuredApks = apks.filter(a => a.isFeatured || a.isEditorChoice).slice(0, 6);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);

  const activeApk: ApkItem | undefined = featuredApks[currentIndex] || featuredApks[0];

  useEffect(() => {
    if (featuredApks.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredApks.length);
    }, 6000);

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
    <div className="w-full mb-6 sm:mb-8">
      
      {/* ======================================================== */}
      {/* 1. MOBILE PHONE VIEW: LiteAPKs-style horizontal cards    */}
      {/* ======================================================== */}
      <div className="block md:hidden">
        {/* Section title like screenshot: "🔥 Indispensable on your phone" */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 text-lg">🔥</span>
            <h2 className="text-base font-extrabold font-display tracking-tight text-zinc-900 dark:text-zinc-100">
              Indispensable on your phone
            </h2>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            Featured
          </span>
        </div>

        {/* Horizontal Card Carousel (LiteAPKs style from screenshot) */}
        <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory -mx-3 px-3">
          {featuredApks.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => navigateToApk(item, 'detail')}
              className="snap-start shrink-0 w-[84vw] max-w-[320px] rounded-3xl overflow-hidden relative shadow-lg bg-zinc-900 text-white cursor-pointer active:scale-98 transition-transform border border-zinc-200/40 dark:border-zinc-800"
              style={{ minHeight: '180px' }}
            >
              {/* Banner Background Image */}
              <img
                src={item.bannerUrl || item.screenshots?.[0] || item.iconUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />

              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

              {/* Card Content (LiteAPKs Layout: Floating Logo & Title on bottom) */}
              <div className="relative z-10 p-4 h-full flex flex-col justify-between min-h-[180px]">
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-zinc-950 uppercase tracking-wide">
                    MOD VIP
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-emerald-300">
                    ★ {item.rating}
                  </span>
                </div>

                {/* Bottom App Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.iconUrl}
                    alt={item.title}
                    className="w-13 h-13 rounded-2xl object-cover border-2 border-white/80 shadow-md shrink-0 bg-zinc-800"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white truncate drop-shadow-md">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-emerald-400 font-medium truncate">
                      {item.category} • {item.size}
                    </p>
                    <p className="text-[10px] text-zinc-300 truncate">
                      {item.modFeatures?.[0] || 'Premium Unlocked'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. DESKTOP & TABLET VIEW: Full-Width Cinematic Banner   */}
      {/* Extends smoothly behind transparent header with high fps */}
      {/* ======================================================== */}
      <section 
        id="hero-slider-section"
        className="hidden md:block relative -mt-4 lg:-mt-6 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/50 dark:border-zinc-800/80 bg-zinc-950 text-white w-full max-w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Banner with transparent gradient that extends upwards */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeApk.bannerUrl || activeApk.screenshots?.[0] || activeApk.iconUrl}
            alt={activeApk.title}
            className="w-full h-full object-cover object-center filter brightness-90 transition-opacity duration-500"
            loading="eager"
          />
          {/* Subtle multi-directional gradients that keep the banner vibrant while text remains crystal-clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/20 to-black/30" />
        </div>

        {/* Ambient Emerald Accent Light */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/15 rounded-full filter blur-3xl pointer-events-none" />

        {/* Main Content Area */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-[400px] lg:min-h-[440px] w-full max-w-full">
          
          {/* Top Badges & Slide Navigation */}
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/30">
                <Zap className="w-3.5 h-3.5 fill-current" />
                HOT MOD FEATURED
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md border border-white/20 text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Safe & Verified
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-emerald-300">
                {activeApk.version}
              </span>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/15 text-white transition cursor-pointer"
                aria-label="Previous Featured Mod"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/15 text-white transition cursor-pointer"
                aria-label="Next Featured Mod"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-4 w-full">
            <div className="lg:col-span-8 space-y-4 min-w-0 w-full">
              
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={activeApk.iconUrl}
                  alt={activeApk.title}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-2xl border-2 border-white/30 shrink-0 bg-zinc-800"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-white drop-shadow-md break-words">
                    {activeApk.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300 mt-1 flex-wrap">
                    <span className="font-semibold text-emerald-400">{activeApk.developer}</span>
                    <span>•</span>
                    <span>{activeApk.category}</span>
                    <span>•</span>
                    <span>{activeApk.size}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      {activeApk.rating} ({activeApk.ratingCount.toLocaleString()})
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 max-w-2xl leading-relaxed">
                {activeApk.shortDescription || activeApk.description}
              </p>

              {/* Mod features highlights */}
              <div className="bg-emerald-950/30 border border-emerald-500/25 rounded-2xl p-3 backdrop-blur-md max-w-2xl">
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
              <div className="flex flex-row items-center gap-3 pt-1">
                <button
                  id="hero-download-btn"
                  onClick={() => navigateToApk(activeApk, 'detail')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                >
                  <Download className="w-5 h-5 stroke-[2.5]" />
                  <span>Fast Download ({activeApk.size})</span>
                </button>

                <button
                  id="hero-details-btn"
                  onClick={() => navigateToApk(activeApk, 'detail')}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Full Details</span>
                </button>
              </div>
            </div>

            {/* Right Featured Cards List (Quick Switcher) */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-0.5 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Featured MOD Highlights
              </div>
              {featuredApks.slice(0, 4).map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition border ${
                    idx === currentIndex
                      ? 'bg-emerald-950/60 border-emerald-500/80 shadow-md shadow-emerald-900/50'
                      : 'bg-zinc-900/60 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <img
                    src={item.iconUrl}
                    alt={item.title}
                    className="w-10 h-10 rounded-lg object-cover border border-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{item.version}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Slide Dots */}
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
    </div>
  );
};
