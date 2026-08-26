import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { ApkItem, ReviewItem, ViewPage } from '../types';
import { 
  fetchApks, 
  saveApk, 
  deleteApk, 
  addReview, 
  recordDownload, 
  getLocalApks, 
  saveLocalApks,
  seedInitialApksToFirestore
} from '../firebase';

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apks, setApks] = useState<ApkItem[]>(() => getLocalApks());
  const [loading, setLoading] = useState<boolean>(true);
  const [dbSource, setDbSource] = useState<'firestore' | 'local'>('local');
  const [activePage, setActivePage] = useState<ViewPage>('home');
  const [selectedApk, setSelectedApk] = useState<ApkItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'games' | 'apps' | 'trending'>('all');
  const [sortOption, setSortOption] = useState<'popular' | 'latest' | 'rating' | 'name'>('popular');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);

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

  // Fetch initial APKs from Firebase Firestore
  const loadApks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchApks();
      setApks(res.apks);
      setDbSource(res.source);
    } catch (e) {
      console.warn('Error fetching APKs:', e);
      setApks(getLocalApks());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApks();
  }, [loadApks]);

  // Handle URL path / hash navigation for /admin, #admin, etc.
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.includes('/admin') || hash === '#admin' || hash === '#/admin') {
        setActivePage('admin');
      } else if (hash.startsWith('#/apk/')) {
        const slug = hash.replace('#/apk/', '');
        const found = apks.find(a => a.slug === slug || a.id === slug);
        if (found) {
          setSelectedApk(found);
          setActivePage('detail');
        }
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
      window.location.hash = `#/apk/${apk.slug}`;
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
    // update local react state
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
      showNotification(`Saved "${apk.title}" to local cache (Firebase permission notice)`, 'info');
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
    // Update local state
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

  return (
    <AppContext.Provider
      value={{
        apks,
        loading,
        activePage,
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
        refreshCatalog: loadApks
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
