import React from 'react';
import { 
  ShieldCheck, 
  Heart, 
  ExternalLink, 
  Lock, 
  Send, 
  Smartphone, 
  Gamepad2, 
  Zap,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActivePage, setFilterType, setSelectedCategory } = useApp();

  return (
    <footer id="main-footer" className="bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-black font-display tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                MODAPKs
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              The premier portal for 100% verified, virus-free modded Android games and apps. Enjoy extreme download speeds, ad-free experience, and VIP unlocked features.
            </p>

            {/* Official Powered By Linksshare Badge */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-500/30 shadow-xs flex items-center justify-between gap-3 max-w-sm">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-emerald-500" />
                <div>
                  <div className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider">Official Network</div>
                  <a
                    href="https://linksshare.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Powered by linksshare.online</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded">
                Verified
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-display">
              Mod Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <button
                  onClick={() => { setFilterType('games'); setSelectedCategory('Action'); setActivePage('home'); }}
                  className="hover:text-emerald-500 transition"
                >
                  Action Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setFilterType('games'); setSelectedCategory('Arcade'); setActivePage('home'); }}
                  className="hover:text-emerald-500 transition"
                >
                  Arcade & Casual
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setFilterType('games'); setSelectedCategory('Racing'); setActivePage('home'); }}
                  className="hover:text-emerald-500 transition"
                >
                  Racing Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setFilterType('apps'); setSelectedCategory('Music & Audio'); setActivePage('home'); }}
                  className="hover:text-emerald-500 transition"
                >
                  Music & Audio
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setFilterType('apps'); setSelectedCategory('Photo & Video'); setActivePage('home'); }}
                  className="hover:text-emerald-500 transition"
                >
                  Photo & Video Editors
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setFilterType('apps'); setSelectedCategory('Tools'); setActivePage('home'); }}
                  className="hover:text-emerald-500 transition"
                >
                  Tools & Utilities
                </button>
              </li>
            </ul>
          </div>

          {/* Useful Navigation Pages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-display">
              Information & Support
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <button onClick={() => setActivePage('about')} className="hover:text-emerald-500 transition">
                  About MODAPKs
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('contact')} className="hover:text-emerald-500 transition">
                  Contact & Mod Request
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('privacy')} className="hover:text-emerald-500 transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('dmca')} className="hover:text-emerald-500 transition">
                  DMCA / Copyright Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('favorites')} className="hover:text-emerald-500 transition">
                  My Favorites List
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Admin Entry */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-display">
              Stay Connected
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Join our Telegram channel to receive instant mod update notifications directly on Android.
            </p>
            <a
              href="https://t.me/linksshare_modapks"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-bold hover:bg-cyan-500 hover:text-zinc-950 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Join Telegram Channel</span>
            </a>

            {/* Secret / Direct Admin route link for the owner */}
            <div className="pt-2">
              <button
                onClick={() => setActivePage('admin')}
                className="text-[11px] text-zinc-400 hover:text-emerald-500 flex items-center gap-1 transition"
                title="Admin Control (Requires login)"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Login (mysite.com/admin)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Powered By bar */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div>
            © {new Date().getFullYear()} <strong className="text-zinc-800 dark:text-zinc-200">MODAPKs</strong>. All rights reserved. Powered by{' '}
            <a
              href="https://linksshare.online"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              linksshare.online
            </a>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Fast CDN Mirrors</span>
            <span>•</span>
            <span>100% Tested APKs</span>
            <span>•</span>
            <span>No Root Required</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
