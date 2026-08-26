import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, Download, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApkItem } from '../types';

export const SearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, apks, navigateToApk } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      } else if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const results = trimmed.length === 0
    ? apks.slice(0, 6) // Show top recommendations when empty
    : apks.filter(apk => {
        return (
          apk.title.toLowerCase().includes(trimmed) ||
          apk.developer.toLowerCase().includes(trimmed) ||
          apk.category.toLowerCase().includes(trimmed) ||
          apk.packageName.toLowerCase().includes(trimmed) ||
          apk.modFeatures.some(m => m.toLowerCase().includes(trimmed))
        );
      });

  const handleSelect = (apk: ApkItem) => {
    setIsSearchModalOpen(false);
    navigateToApk(apk, 'detail');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="search-modal-container"
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800 gap-3">
          <Search className="w-5 h-5 text-emerald-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modded games, apps, features (e.g. Spotify, Unlimited Coins, Pro)..."
            className="w-full bg-transparent text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="px-2 py-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Quick tags */}
        <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-zinc-400 font-medium shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" /> Hot:
          </span>
          {['Minecraft', 'Spotify', 'Subway Surfers', 'CapCut', 'VIP Unlocked', 'Action'].map(tag => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 shrink-0 transition"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results list */}
        <div className="overflow-y-auto p-3 space-y-2 flex-1">
          <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 px-2 uppercase tracking-wider">
            {trimmed.length === 0 ? 'Trending & Popular Mods' : `Search Results (${results.length})`}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p className="text-base font-semibold">No Mod APKs found for "{query}"</p>
              <p className="text-xs text-zinc-400 mt-1">Try searching for keywords like "money", "pro", "game", or "editor".</p>
            </div>
          ) : (
            results.map(apk => (
              <div
                key={apk.id}
                onClick={() => handleSelect(apk)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/70 cursor-pointer transition group border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={apk.iconUrl}
                    alt={apk.title}
                    className="w-12 h-12 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800 shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-emerald-500 transition">
                        {apk.title}
                      </h4>
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 rounded">
                        {apk.version}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      <span>{apk.category}</span>
                      <span>•</span>
                      <span>{apk.size}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                        <Star className="w-3 h-3 fill-amber-500" /> {apk.rating}
                      </span>
                    </div>
                    {apk.modFeatures.length > 0 && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate mt-0.5">
                        MOD: {apk.modFeatures[0]}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition">
                    <Download className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 flex items-center justify-between">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Tested & VirusTotal Verified
          </div>
          <span>Powered by <strong className="text-zinc-700 dark:text-zinc-300">linksshare</strong></span>
        </div>
      </div>
    </div>
  );
};
