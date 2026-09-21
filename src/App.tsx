import React, { useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SearchModal } from './components/SearchModal';
import { HeroSlider } from './components/HeroSlider';
import { CategoryFilter } from './components/CategoryFilter';
import { ApkCard } from './components/ApkCard';
import { ApkDetail } from './components/ApkDetail';
import { DownloadPage } from './components/DownloadPage';
import { AdminPanel } from './components/AdminPanel';
import { AboutPage, ContactPage, PrivacyPage, DmcaPage, FavoritesPage } from './components/StaticPages';
import { Footer } from './components/Footer';
import { SmartAdSlot } from './components/SmartAdSlot';
import { FloatingAdBanner } from './components/FloatingAdBanner';
import { PopunderManager } from './components/PopunderManager';
import { 
  Sparkles, 
  Gamepad2, 
  Smartphone, 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Zap
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    activePage, 
    apks, 
    loading, 
    selectedCategory, 
    filterType, 
    sortOption, 
    notification,
    searchQuery,
    adsConfig
  } = useApp();

  // Filter and Sort the catalog items
  const filteredAndSortedApks = useMemo(() => {
    let result = [...apks];

    // Filter by type (games vs apps vs trending)
    if (filterType === 'games') {
      result = result.filter(a => a.categoryType === 'games');
    } else if (filterType === 'apps') {
      result = result.filter(a => a.categoryType === 'apps');
    } else if (filterType === 'trending') {
      result = result.filter(a => a.isTrending || a.isFeatured);
    }

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(a => a.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by search query if any
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(q) ||
        a.developer.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.modFeatures.some(m => m.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortOption === 'popular') {
      result.sort((a, b) => b.downloadsCount - a.downloadsCount);
    } else if (sortOption === 'latest') {
      result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [apks, filterType, selectedCategory, searchQuery, sortOption]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 w-full max-w-full overflow-x-hidden">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold border ${
            notification.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
              : notification.type === 'info'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-700'
              : 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-emerald-500/20'
          }`}>
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Navbar />

      {/* Background Popunder Manager */}
      <PopunderManager />

      {/* Sticky Mobile/Desktop Bottom Ad Banner */}
      <FloatingAdBanner />

      {/* Instant Search Modal (Cmd+K) */}
      <SearchModal />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-16 overflow-x-hidden">
        
        {/* Global Top Header Banner (728x90) */}
        {activePage !== 'admin' && (
          <div className="mb-2">
            <SmartAdSlot slot={adsConfig.headerBanner} />
          </div>
        )}

        {activePage === 'home' && (
          <div>
            {/* Fancy Hero Slider for Featured Apps */}
            <HeroSlider />

            {/* Category & Filter Tabs */}
            <CategoryFilter />

            {/* In-Feed Ad Banner (300x250 or 468x60) */}
            <div className="my-2">
              <SmartAdSlot slot={adsConfig.inContentBanner} />
            </div>

            {/* Catalog Grid Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-zinc-900 dark:text-zinc-100">
                  {selectedCategory === 'all' 
                    ? (filterType === 'games' ? 'Latest Mod Games' : filterType === 'apps' ? 'Latest Mod Apps' : filterType === 'trending' ? 'Trending Hot Mods' : 'All Modded Games & Apps')
                    : `${selectedCategory} Mods`}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40">
                  {filteredAndSortedApks.length} Available
                </span>
              </div>
            </div>

            {/* Catalog Grid */}
            {filteredAndSortedApks.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800 space-y-3">
                <Sparkles className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                  No Mod APKs found in this category
                </h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Try switching to another category, or open the Admin panel to add new games and applications.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredAndSortedApks.map((apk) => (
                  <ApkCard key={apk.id} apk={apk} />
                ))}
              </div>
            )}
          </div>
        )}

        {activePage === 'detail' && <ApkDetail />}
        {activePage === 'download' && <DownloadPage />}
        {activePage === 'admin' && <AdminPanel />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'privacy' && <PrivacyPage />}
        {activePage === 'dmca' && <DmcaPage />}
        {activePage === 'favorites' && <FavoritesPage />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ThemeProvider>
  );
}
