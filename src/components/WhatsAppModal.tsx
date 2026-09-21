import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Check, Bell, ShieldCheck, Sparkles } from 'lucide-react';

const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VamSzhm9MF8wWp06TG2f';
const STORAGE_KEY = 'modapks_whatsapp_popup_dismissed_until';

export const WhatsAppModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShow24h, setDontShow24h] = useState(true);

  useEffect(() => {
    try {
      const dismissedUntil = localStorage.getItem(STORAGE_KEY);
      if (dismissedUntil) {
        const timestamp = parseInt(dismissedUntil, 10);
        if (Date.now() < timestamp) {
          return; // Still within 24h suppression period
        }
      }

      // Show popup after a slight organic delay of 1.2s when user lands on site
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);

      return () => clearTimeout(timer);
    } catch {
      setIsOpen(true);
    }
  }, []);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (dontShow24h) {
      try {
        const next24h = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, next24h.toString());
      } catch {}
    }
    setIsOpen(false);
  };

  const handleJoinClick = () => {
    // Save 24 hour preference if toggled
    if (dontShow24h) {
      try {
        const next24h = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, next24h.toString());
      } catch {}
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        id="whatsapp-join-popup"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-emerald-500/30 dark:border-emerald-500/20 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden text-zinc-900 dark:text-zinc-100"
      >
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close "X" Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Logo + WhatsApp Badge */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="relative">
            <img
              src="/logo.png"
              alt="MODAPKs"
              className="w-13 h-13 rounded-2xl object-contain drop-shadow-md border border-zinc-200 dark:border-zinc-800 p-1 bg-zinc-50 dark:bg-zinc-950"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-md border-2 border-white dark:border-zinc-900">
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-3 h-3" /> Official Community
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold font-display leading-tight text-zinc-900 dark:text-zinc-100">
              Join Our WhatsApp Channel!
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-5">
          Get notified instantly when new VIP modded games, unlocked apps, and high-speed updates drop—free, direct, and virus-free.
        </p>

        {/* Value Chips */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 text-xs">
            <Bell className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">Daily Updates</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">Direct & Safe</span>
          </div>
        </div>

        {/* 24 Hours Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 mb-5">
          <label htmlFor="dont-show-24h" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
            Don't show this for 24 hours
          </label>
          <button
            type="button"
            id="dont-show-24h"
            role="switch"
            aria-checked={dontShow24h}
            onClick={() => setDontShow24h(!dontShow24h)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              dontShow24h ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                dontShow24h ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleJoinClick}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Join WhatsApp Channel</span>
          </a>

          <button
            type="button"
            onClick={handleClose}
            className="w-full py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition text-center cursor-pointer"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};
