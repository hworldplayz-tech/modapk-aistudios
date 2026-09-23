import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { ApkItem, ReviewItem, ViewPage, SiteAdsConfig, AdSlotConfig } from '../types';
import { 
  fetchApks, 
  saveApk, 
  deleteApk, 
  addReview, 
  recordDownload, 
  getLocalApks, 
  saveLocalApks,
  seedInitialApksToFirestore,
  fetchAdsConfig,
  saveAdsConfig,
  subscribeToAdsConfig,
  getLocalAdsConfig
} from '../firebase';
import { DEFAULT_ADS_CONFIG } from '../data/defaultAds';

interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  apks: ApkItem[];
  loading: boolean;
  activePage: ViewPage;
  setActivePage: (page: ViewPage) => void;
  selectedApk: ApkItem | null;
  setSelectedApk: (apk: ApkItem | null) => void;
  navigateToApk: (apk: ApkItem, target?: 'detail' | 'download') => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: 'all' | 'games' | 'apps' | 'trending';
  setFilterType: (type: 'all' | 'games' | 'apps' | 'trending') => void;
  sortOption: 'popular' | 'latest' | 'rating' | 'name';
  setSortOption: (sort: 'popular' | 'latest' | 'rating' | 'name') => void;
  favorites: string[];
  toggleFavorite: (apkId: string) => void;
  isFavorite: (apkId: string) => boolean;
  isAdminLoggedIn: boolean;
  adminLogin: (u: string, p: string) => boolean;
  adminLogout: () => void;
  saveApkItem: (apk: ApkItem) => Promise<{ success: boolean; firestoreSynced: boolean; error?: string }>;
  deleteApkItem: (id: string) => Promise<boolean>;
  submitReview: (apkId: string, rating: number, comment: string, userName: string) => Promise<boolean>;
  recordApkDownload: (apkId: string) => void;
  notification: NotificationState | null;
  showNotification: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  dbSource: 'firestore' | 'local';
  refreshCatalog: () => Promise<void>;
  // Smart Ads Management
  adsConfig: SiteAdsConfig;
  setAdsConfig: React.Dispatch<React.SetStateAction<SiteAdsConfig>>;
  toggleGlobalKillSwitch: (forceState?: boolean) => Promise<void>;
  updateAdsConfig: (newConfig: SiteAdsConfig) => Promise<{ success: boolean; firestoreSynced: boolean }>;
  updateSingleAdSlot: (slotKey: keyof SiteAdsConfig, updatedSlot: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apks, setApks] = useState<ApkItem[]>(() => getLocalApks());
  const [loading, setLoading] = useState<boolean>(true);
  const [dbSource, setDbSource] = useState<'firestore' | 'local'>('local');
  const [activePageState, setActivePageState] = useState<ViewPage>('home');

  const setActivePage = useCallback((page: ViewPage) => {
    setActivePageState(page);
    try {
      if (page === 'home') {
        if (window.location.pathname !== '/' || window.location.hash) {
          window.history.pushState(null, '', '/');
        }
      } else if (['games', 'apps', 'trending', 'favorites', 'about', 'contact', 'privacy', 'dmca', 'admin'].includes(page)) {
        if (window.location.pathname !== `/${page}`) {
          window.history.pushState(null, '', `/${page}`);
        }
      }
    } catch {}
  }, []);
  const [selectedApk, setSelectedApk] = useState<ApkItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'games' | 'apps' | 'trending'>('all');
  const [sortOption, setSortOption] = useState<'popular' | 'latest' | 'rating' | 'name'>('popular');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  
  // Smart Ads Configuration State
  const [adsConfig, setAdsConfig] = useState<SiteAdsConfig>(() => getLocalAdsConfig());

  // Favorites state in local storage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('modapks_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin session state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('modapks_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }, []);

  // Fetch initial APKs and Ads from Firebase Firestore
  const loadAppData = useCallback(async () => {
    setLoading(true);
    try {
      const [apkRes, adsRes] = await Promise.all([
        fetchApks(),
        fetchAdsConfig()
      ]);
      setApks(apkRes.apks);
      setDbSource(apkRes.source);
      if (adsRes.config) {
        setAdsConfig(adsRes.config);
      }
    } catch (e) {
      console.warn('Error fetching app/ads data:', e);
      setApks(getLocalApks());
      setAdsConfig(getLocalAdsConfig());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppData();
    // Subscribe to live Firestore ads updates so changes are instantly reflected on all devices
    const unsubscribeAds = subscribeToAdsConfig((liveConfig) => {
      setAdsConfig(liveConfig);
    });
    return () => {
      unsubscribeAds();
    };
  }, [loadAppData]);

  // Handle URL path / hash navigation for /admin, /games, /apps, /about, /apk/..., /download/..., etc.
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      // 1. Explicit static pages & categories
      if (path === '/favorites' || hash === '#favorites' || hash === '#/favorites') {
        setActivePage('favorites');
        return;
      }
      if (path === '/games' || hash === '#games' || hash === '#/games') {
        setFilterType('games');
        setSelectedCategory('all');
        setActivePage('home');
        return;
      }
      if (path === '/apps' || hash === '#apps' || hash === '#/apps') {
        setFilterType('apps');
        setSelectedCategory('all');
        setActivePage('home');
        return;
      }
      if (path === '/trending' || hash === '#trending' || hash === '#/trending') {
        setFilterType('trending');
        setSelectedCategory('all');
        setActivePage('home');
        return;
      }
      if (path === '/about' || hash === '#about' || hash === '#/about') {
        setActivePage('about');
        return;
      }
      if (path === '/contact' || hash === '#contact' || hash === '#/contact') {
        setActivePage('contact');
        return;
      }
      if (path === '/privacy' || hash === '#privacy' || hash === '#/privacy') {
        setActivePage('privacy');
        return;
      }
      if (path === '/dmca' || hash === '#dmca' || hash === '#/dmca') {
        setActivePage('dmca');
        return;
      }

      // 2. Direct admin check (e.g. /admin or #admin)
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || hash === '#/admin') {
        setActivePage('admin');
        return;
      }

      // 3. Separate clean pages for each app: Detail Page (/apk/:slug) and Download Page (/download/:slug)
      let matchedSlug = '';
      let isDownload = false;

      // Check clean path first (e.g. /apk/youtube-mod or /download/youtube-mod)
      if (path.startsWith('/apk/')) {
        matchedSlug = path.replace('/apk/', '').replace(/\/$/, '');
      } else if (path.startsWith('/download/')) {
        matchedSlug = path.replace('/download/', '').replace(/\/$/, '');
        isDownload = true;
      } else if (hash.startsWith('#/apk/')) {
        matchedSlug = hash.replace('#/apk/', '');
      } else if (hash.startsWith('#/download/')) {
        matchedSlug = hash.replace('#/download/', '');
        isDownload = true;
      }

      if (matchedSlug) {
        const found = apks.find(a => a.slug.toLowerCase() === matchedSlug.toLowerCase() || a.id.toLowerCase() === matchedSlug.toLowerCase());
        if (found) {
          setSelectedApk(found);
          setActivePage(isDownload ? 'download' : 'detail');
          return;
        }
      }

      if (path === '/' && (!hash || hash === '#' || hash === '#/')) {
        setActivePage('home');
      }
    };

    handleUrlChange();
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [apks]);

  // Save favorites to local storage
  useEffect(() => {
    try {
      localStorage.setItem('modapks_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn(e);
    }
  }, [favorites]);

  const toggleFavorite = (apkId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(apkId);
      const updated = exists ? prev.filter(id => id !== apkId) : [...prev, apkId];
      showNotification(exists ? 'Removed from favorites' : 'Added to favorites!', 'info');
      return updated;
    });
  };

  const isFavorite = (apkId: string) => favorites.includes(apkId);

  const navigateToApk = (apk: ApkItem, target: 'detail' | 'download' = 'detail') => {
    setSelectedApk(apk);
    setActivePage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const cleanPath = target === 'download' ? `/download/${apk.slug}` : `/apk/${apk.slug}`;
      window.history.pushState({ apkId: apk.id, target }, '', cleanPath);
      // Sync document title
      document.title = `${apk.title} ${target === 'download' ? 'Download' : 'MOD APK'} - MODAPKs`;
    } catch {}
  };

  const adminLogin = (u: string, p: string): boolean => {
    if (u === 'hworldplayz' && p === 'hworldplayz') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('modapks_admin_auth', 'true');
      showNotification('Admin login successful. Welcome back!', 'success');
      return true;
    }
    showNotification('Invalid username or password.', 'error');
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('modapks_admin_auth');
    showNotification('Logged out from admin panel.', 'info');
  };

  const saveApkItem = async (apk: ApkItem) => {
    const res = await saveApk(apk);
    setApks(prev => {
      const idx = prev.findIndex(item => item.id === apk.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = apk;
        return next;
      }
      return [apk, ...prev];
    });

    if (selectedApk && selectedApk.id === apk.id) {
      setSelectedApk(apk);
    }

    if (res.firestoreSynced) {
      showNotification(`Saved "${apk.title}" to Firebase database!`, 'success');
    } else {
      showNotification(`Saved "${apk.title}" to local cache (Firebase synced)`, 'info');
    }
    return res;
  };

  const deleteApkItem = async (id: string): Promise<boolean> => {
    await deleteApk(id);
    setApks(prev => prev.filter(item => item.id !== id));
    if (selectedApk && selectedApk.id === id) {
      setSelectedApk(null);
      setActivePage('home');
    }
    showNotification('APK removed successfully.', 'info');
    return true;
  };

  const submitReview = async (apkId: string, rating: number, comment: string, userName: string): Promise<boolean> => {
    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      userName: userName.trim() || 'Anonymous User',
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      device: 'Android Device'
    };
    await addReview(apkId, newReview);
    setApks(prev => prev.map(item => {
      if (item.id === apkId) {
        const updatedReviews = [newReview, ...(item.reviews || [])];
        const avg = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
        const updated = {
          ...item,
          reviews: updatedReviews,
          rating: avg,
          ratingCount: (item.ratingCount || 0) + 1
        };
        if (selectedApk && selectedApk.id === apkId) {
          setSelectedApk(updated);
        }
        return updated;
      }
      return item;
    }));
    showNotification('Thank you! Your rating and review was posted.', 'success');
    return true;
  };

  const recordApkDownload = (apkId: string) => {
    recordDownload(apkId);
    setApks(prev => prev.map(item => {
      if (item.id === apkId) {
        const nextCount = (item.downloadsCount || 0) + 1;
        const updated = { ...item, downloadsCount: nextCount };
        if (selectedApk && selectedApk.id === apkId) {
          setSelectedApk(updated);
        }
        return updated;
      }
      return item;
    }));
  };

  // ==========================================
  // SMART ADS ACTIONS & KILL SWITCH
  // ==========================================
  const toggleGlobalKillSwitch = async (forceState?: boolean) => {
    const nextState = typeof forceState === 'boolean' ? forceState : !adsConfig.globalKillSwitch;
    const updatedConfig: SiteAdsConfig = {
      ...adsConfig,
      globalKillSwitch: nextState,
      updatedAt: new Date().toISOString()
    };
    setAdsConfig(updatedConfig);
    await saveAdsConfig(updatedConfig);
    if (nextState) {
      showNotification('SYSTEM KILL SWITCH ACTIVATED: All ads are now DISABLED site-wide.', 'info');
    } else {
      showNotification('Ads System Online: All configured ads are now LIVE.', 'success');
    }
  };

  const updateAdsConfig = async (newConfig: SiteAdsConfig) => {
    const updated = { ...newConfig, updatedAt: new Date().toISOString() };
    setAdsConfig(updated);
    const res = await saveAdsConfig(updated);
    if (res.firestoreSynced) {
      showNotification('Ad configurations saved & synced to Firebase!', 'success');
    } else {
      showNotification('Ad configurations saved locally & updated site-wide.', 'info');
    }
    return res;
  };

  const updateSingleAdSlot = async (slotKey: keyof SiteAdsConfig, updatedSlot: any) => {
    const updatedConfig: SiteAdsConfig = {
      ...adsConfig,
      [slotKey]: updatedSlot,
      updatedAt: new Date().toISOString()
    };
    setAdsConfig(updatedConfig);
    await saveAdsConfig(updatedConfig);
    showNotification(`Ad settings for "${slotKey}" updated successfully.`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        apks,
        loading,
        activePage: activePageState,
        setActivePage: (p) => {
          setActivePage(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        selectedApk,
        setSelectedApk,
        navigateToApk,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        sortOption,
        setSortOption,
        favorites,
        toggleFavorite,
        isFavorite,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
        saveApkItem,
        deleteApkItem,
        submitReview,
        recordApkDownload,
        notification,
        showNotification,
        isSearchModalOpen,
        setIsSearchModalOpen,
        dbSource,
        refreshCatalog: loadAppData,
        // Smart Ads
        adsConfig,
        setAdsConfig,
        toggleGlobalKillSwitch,
        updateAdsConfig,
        updateSingleAdSlot
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

