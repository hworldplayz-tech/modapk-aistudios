import React, { useState } from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Gamepad2, 
  Smartphone, 
  Flame, 
  Heart, 
  Menu, 
  X, 
  ShieldCheck, 
  Lock,
  Layers,
  Info,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    favorites, 
    searchQuery, 
    setSearchQuery, 
    filterType, 
    setFilterType, 
    setSelectedCategory,
    setIsSearchModalOpen,
    isAdminLoggedIn
  } = useApp();
  
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: 'home' | 'games' | 'apps' | 'trending' | 'favorites') => {
    if (page === 'home') {
      setFilterType('all');
      setSelectedCategory('all');
      setActivePage('home');
      try {
        if (window.location.hash || window.location.pathname !== '/') {
          window.history.pushState(null, '', '/');
        }
      } catch {}
    } else if (page === 'games') {
      setFilterType('games');
      setSelectedCategory('all');
      setActivePage('home');
      try {
        window.location.hash = '#games';
      } catch {}
    } else if (page === 'apps') {
      setFilterType('apps');
      setSelectedCategory('all');
      setActivePage('home');
      try {
        window.location.hash = '#apps';
      } catch {}
    } else if (page === 'trending') {
      setFilterType('trending');
      setSelectedCategory('all');
      setActivePage('home');
      try {
        window.location.hash = '#trending';
      } catch {}
    } else if (page === 'favorites') {
      setActivePage('favorites');
      try {
        // If current path is /admin, updating hash to #favorites should also be pushed cleanly
        if (window.location.pathname.startsWith('/admin')) {
          window.history.pushState(null, '', '/#favorites');
        } else {
          window.location.hash = '#favorites';
        }
      } catch {}
    }
    setMobileMenuOpen(false);
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-zinc-950/60 border-b border-zinc-200/50 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
              title="Return to Home Page"
            >
              <img
                src="/logo.png"
                alt="MODAPKs Logo"
                className="w-10 h-10 rounded-xl object-contain drop-shadow-md group-hover:scale-105 group-hover:rotate-6 transition-all duration-300"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight font-display bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                    MODAPKs
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span>by</span>
                  <a
                    href="https://linksshare.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    linksshare
                  </a>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-home"
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activePage === 'home' && filterType === 'all'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              Home
            </button>
            <button
              id="nav-games"
              onClick={() => handleNavClick('games')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activePage === 'home' && filterType === 'games'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-emerald-500" />
              Games
            </button>
            <button
              id="nav-apps"
              onClick={() => handleNavClick('apps')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activePage === 'home' && filterType === 'apps'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              <Smartphone className="w-4 h-4 text-teal-500" />
              Apps
            </button>
            <button
              id="nav-trending"
              onClick={() => handleNavClick('trending')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activePage === 'home' && filterType === 'trending'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500" />
              Trending
            </button>
            <button
              id="nav-favorites"
              onClick={() => handleNavClick('favorites')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 relative ${
                activePage === 'favorites'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-zinc-400'}`} />
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                  {favorites.length}
                </span>
              )}
            </button>
          </nav>

          {/* Search Trigger and Actions */}
          <div className="flex items-center gap-2">
            
            {/* Quick Search Button */}
            <button
              id="header-search-btn"
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer max-w-[130px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-xs shrink-0"
              title="Search mod APKs (Cmd+K)"
            >
              <Search className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="truncate hidden sm:inline text-zinc-600 dark:text-zinc-300">Search APKs...</span>
              <span className="sm:hidden text-zinc-600 dark:text-zinc-300">Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-zinc-800 text-zinc-500 rounded border border-zinc-200 dark:border-zinc-700 ml-auto shrink-0">
                ⌘K
              </kbd>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-zinc-600" />
              )}
            </button>

            {/* Admin Badge if logged in */}
            {isAdminLoggedIn && (
              <button
                id="admin-indicator-btn"
                onClick={() => setActivePage('admin')}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-lg flex items-center gap-1 hover:bg-emerald-700 transition"
              >
                <Lock className="w-3 h-3" />
                <span className="hidden sm:inline">Admin Mode</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              activePage === 'home' && filterType === 'all'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-500" />
            Home
          </button>
          <button
            onClick={() => handleNavClick('games')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              activePage === 'home' && filterType === 'games'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-emerald-500" />
            Mod Games
          </button>
          <button
            onClick={() => handleNavClick('apps')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              activePage === 'home' && filterType === 'apps'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <Smartphone className="w-4 h-4 text-teal-500" />
            Mod Apps
          </button>
          <button
            onClick={() => handleNavClick('trending')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              activePage === 'home' && filterType === 'trending'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            Trending Hot
          </button>
          <button
            onClick={() => handleNavClick('favorites')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
              activePage === 'favorites'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>My Favorites</span>
            </div>
            {favorites.length > 0 && (
              <span className="px-2 py-0.5 text-xs bg-rose-500 text-white rounded-full font-bold">
                {favorites.length}
              </span>
            )}
          </button>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <button
              onClick={() => { setActivePage('about'); setMobileMenuOpen(false); }}
              className="py-1.5 text-left hover:text-emerald-500"
            >
              About Us
            </button>
            <button
              onClick={() => { setActivePage('contact'); setMobileMenuOpen(false); }}
              className="py-1.5 text-left hover:text-emerald-500"
            >
              Contact Support
            </button>
            <button
              onClick={() => { setActivePage('privacy'); setMobileMenuOpen(false); }}
              className="py-1.5 text-left hover:text-emerald-500"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => { setActivePage('dmca'); setMobileMenuOpen(false); }}
              className="py-1.5 text-left hover:text-emerald-500"
            >
              DMCA Disclaimer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
