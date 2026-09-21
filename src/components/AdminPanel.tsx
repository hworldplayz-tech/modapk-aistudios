import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Key, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Save, 
  X, 
  Database, 
  ShieldCheck, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowLeft, 
  ExternalLink,
  Layers,
  Search,
  HardDrive,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Flame,
  Star,
  Radio,
  Power,
  DownloadCloud,
  Zap,
  Play,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApkItem, DownloadLink } from '../types';
import { CATEGORIES_LIST, INITIAL_APKS } from '../data/initialApks';
import { seedInitialApksToFirestore } from '../firebase';
import { AdminAdsManager } from './AdminAdsManager';
import { scrapePlayStoreMetadata, extractPackageId } from '../services/playStoreService';

export const AdminPanel: React.FC = () => {
  const { 
    isAdminLoggedIn, 
    adminLogin, 
    adminLogout, 
    apks, 
    saveApkItem, 
    deleteApkItem, 
    setActivePage, 
    navigateToApk,
    showNotification,
    dbSource,
    refreshCatalog,
    adsConfig
  } = useApp();

  // Active Admin Section
  const [adminView, setAdminView] = useState<'catalog' | 'ads' | 'database'>('catalog');

  // Login Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Search in Admin
  const [adminSearch, setAdminSearch] = useState('');

  // Form Modal state (for Add or Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApkId, setEditingApkId] = useState<string | null>(null);
  const [copiedRules, setCopiedRules] = useState(false);
  const [seedingLoading, setSeedingLoading] = useState(false);

  // Form inputs state
  const [playStoreInput, setPlayStoreInput] = useState('');
  const [isFetchingPlayStore, setIsFetchingPlayStore] = useState(false);
  const [playStoreFetchStatus, setPlayStoreFetchStatus] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formPackageName, setFormPackageName] = useState('');
  const [formVersion, setFormVersion] = useState('');
  const [formSize, setFormSize] = useState('');
  const [formDeveloper, setFormDeveloper] = useState('');
  const [formCategory, setFormCategory] = useState('Action');
  const [formCategoryType, setFormCategoryType] = useState<'games' | 'apps'>('games');
  const [formModFeatureInput, setFormModFeatureInput] = useState('');
  const [formModFeatures, setFormModFeatures] = useState<string[]>([]);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formWhatsNew, setFormWhatsNew] = useState('');
  const [formIconUrl, setFormIconUrl] = useState('');
  const [formBannerUrl, setFormBannerUrl] = useState('');
  const [formScreenshotInput, setFormScreenshotInput] = useState('');
  const [formScreenshots, setFormScreenshots] = useState<string[]>([]);
  const [formDownloadLinks, setFormDownloadLinks] = useState<DownloadLink[]>([]);
  const [formTelegramLink, setFormTelegramLink] = useState('');
  const [formMinAndroid, setFormMinAndroid] = useState('Android 6.0+');
  const [formRating, setFormRating] = useState<number>(4.8);
  const [formRatingCount, setFormRatingCount] = useState<number>(12500);
  const [formDownloadsCount, setFormDownloadsCount] = useState<number>(500000);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsTrending, setFormIsTrending] = useState(true);
  const [formIsEditorChoice, setFormIsEditorChoice] = useState(false);

  // Helper to open Add modal
  const handleOpenAdd = () => {
    setEditingApkId(null);
    setFormTitle('');
    setFormSlug('');
    setFormPackageName('');
    setFormVersion('v1.0.0');
    setFormSize('75.0 MB');
    setFormDeveloper('');
    setFormCategory('Action');
    setFormCategoryType('games');
    setFormModFeatures(['Unlimited Money', 'VIP Unlocked', 'No Ads']);
    setFormShortDesc('');
    setFormDesc('');
    setFormWhatsNew('- Initial Release MOD');
    setFormIconUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80');
    setFormBannerUrl('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80');
    setFormScreenshots(['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80']);
    setFormDownloadLinks([
      {
        id: 'dl-1',
        name: 'MODAPKs High Speed CDN',
        url: 'https://linksshare.online/dl/app.apk',
        size: '75.0 MB',
        isFastServer: true,
        serverType: 'direct'
      }
    ]);
    setFormTelegramLink('https://t.me/linksshare_modapks');
    setFormMinAndroid('Android 6.0+');
    setFormRating(4.8);
    setFormRatingCount(12500);
    setFormDownloadsCount(500000);
    setPlayStoreInput('');
    setPlayStoreFetchStatus(null);
    setFormIsFeatured(false);
    setFormIsTrending(true);
    setFormIsEditorChoice(false);
    setIsFormOpen(true);
  };

  // Helper to open Edit modal
  const handleOpenEdit = (apk: ApkItem) => {
    setEditingApkId(apk.id);
    setPlayStoreInput(apk.packageName || '');
    setPlayStoreFetchStatus(null);
    setFormTitle(apk.title);
    setFormSlug(apk.slug);
    setFormPackageName(apk.packageName);
    setFormVersion(apk.version);
    setFormSize(apk.size);
    setFormDeveloper(apk.developer);
    setFormCategory(apk.category);
    setFormCategoryType(apk.categoryType);
    setFormModFeatures(apk.modFeatures || []);
    setFormShortDesc(apk.shortDescription || '');
    setFormDesc(apk.description || '');
    setFormWhatsNew(apk.whatsNew || '');
    setFormIconUrl(apk.iconUrl || '');
    setFormBannerUrl(apk.bannerUrl || '');
    setFormScreenshots(apk.screenshots || []);
    setFormDownloadLinks(apk.downloadLinks?.length ? apk.downloadLinks : [
      {
        id: 'dl-1',
        name: 'MODAPKs Direct Server',
        url: `https://linksshare.online/dl/${apk.slug}.apk`,
        size: apk.size,
        isFastServer: true,
        serverType: 'direct'
      }
    ]);
    setFormTelegramLink(apk.telegramLink || 'https://t.me/linksshare_modapks');
    setFormMinAndroid(apk.minAndroid || 'Android 6.0+');
    setFormRating(apk.rating || 4.8);
    setFormRatingCount(apk.ratingCount || 12500);
    setFormDownloadsCount(apk.downloadsCount || 500000);
    setFormIsFeatured(apk.isFeatured || false);
    setFormIsTrending(apk.isTrending || false);
    setFormIsEditorChoice(apk.isEditorChoice || false);
    setIsFormOpen(true);
  };

  // Auto-Fill from Play Store handler
  const handleAutoFetchPlayStore = async () => {
    const cleanId = extractPackageId(playStoreInput);
    if (!cleanId) {
      showNotification('Please enter a valid Play Store Package ID or URL.', 'error');
      return;
    }

    setIsFetchingPlayStore(true);
    setPlayStoreFetchStatus('Fetching details from Google Play Store...');

    try {
      const data = await scrapePlayStoreMetadata(cleanId);
      
      // Auto-fill form fields
      setFormTitle(data.title);
      setFormPackageName(data.packageId);
      
      const generatedSlug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-mod';
      setFormSlug(generatedSlug);

      setFormDeveloper(data.developer);
      setFormCategory(data.category);
      setFormCategoryType(data.categoryType);
      setFormVersion(data.version);
      setFormSize(data.size);
      setFormMinAndroid(data.minAndroid);
      setFormRating(data.rating);
      setFormRatingCount(data.ratingCount);
      setFormDownloadsCount(data.downloadsCount);
      setFormShortDesc(data.shortDescription);
      setFormDesc(data.description);
      setFormWhatsNew(data.whatsNew);
      
      if (data.iconUrl) {
        setFormIconUrl(data.iconUrl);
      }
      if (data.bannerUrl) {
        setFormBannerUrl(data.bannerUrl);
      }
      if (data.screenshots && data.screenshots.length > 0) {
        setFormScreenshots(data.screenshots);
      }

      // Pre-fill a download link name matching the app
      setFormDownloadLinks([
        {
          id: 'dl-1',
          name: `${data.title} VIP Mod (Fast Server)`,
          url: `https://linksshare.online/dl/${generatedSlug}.apk`,
          size: data.size,
          isFastServer: true,
          serverType: 'direct'
        }
      ]);

      setPlayStoreFetchStatus(`Successfully fetched: ${data.title}`);
      showNotification(`Auto-filled metadata for "${data.title}" from Play Store!`, 'success');
    } catch (err: any) {
      console.error(err);
      setPlayStoreFetchStatus(null);
      showNotification(err?.message || 'Failed to fetch from Play Store. Please check ID.', 'error');
    } finally {
      setIsFetchingPlayStore(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminLogin(username.trim(), password.trim());
  };

  const handleAddModTag = () => {
    if (formModFeatureInput.trim()) {
      setFormModFeatures([...formModFeatures, formModFeatureInput.trim()]);
      setFormModFeatureInput('');
    }
  };

  const handleRemoveModTag = (index: number) => {
    setFormModFeatures(formModFeatures.filter((_, i) => i !== index));
  };

  const handleAddScreenshot = () => {
    if (formScreenshotInput.trim()) {
      setFormScreenshots([...formScreenshots, formScreenshotInput.trim()]);
      setFormScreenshotInput('');
    }
  };

  const handleRemoveScreenshot = (index: number) => {
    setFormScreenshots(formScreenshots.filter((_, i) => i !== index));
  };

  const handleAddDownloadLink = () => {
    setFormDownloadLinks([
      ...formDownloadLinks,
      {
        id: `dl-${Date.now()}`,
        name: 'Mirror Server',
        url: 'https://linksshare.online/dl/',
        size: formSize,
        isFastServer: false,
        serverType: 'direct'
      }
    ]);
  };

  const handleUpdateDownloadLink = (index: number, field: keyof DownloadLink, value: any) => {
    const updated = [...formDownloadLinks];
    updated[index] = { ...updated[index], [field]: value };
    setFormDownloadLinks(updated);
  };

  const handleRemoveDownloadLink = (index: number) => {
    setFormDownloadLinks(formDownloadLinks.filter((_, i) => i !== index));
  };

  const handleSaveApk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showNotification('App Title is required.', 'error');
      return;
    }

    const calculatedSlug = formSlug.trim() 
      || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-mod';
    
    const calculatedId = editingApkId || calculatedSlug + '-apk';

    const existingApk = apks.find(a => a.id === calculatedId);

    const apkData: ApkItem = {
      id: calculatedId,
      title: formTitle.trim(),
      slug: calculatedSlug,
      packageName: formPackageName.trim() || `com.mod.${calculatedSlug.replace(/-/g, '.')}`,
      version: formVersion.trim() || 'v1.0.0',
      size: formSize.trim() || '50 MB',
      developer: formDeveloper.trim() || 'MODAPKs Studio',
      category: formCategory,
      categoryType: formCategoryType,
      modFeatures: formModFeatures.length > 0 ? formModFeatures : ['Premium Unlocked', 'No Ads'],
      shortDescription: formShortDesc.trim() || `${formTitle} modded APK with unlocked premium features.`,
      description: formDesc.trim() || `${formTitle} is now available in MOD APK version with all VIP/Pro perks unlocked for Android.`,
      whatsNew: formWhatsNew.trim() || '- Latest Version Updated\n- Bug fixes and stability improvements',
      iconUrl: formIconUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      bannerUrl: formBannerUrl.trim() || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      screenshots: formScreenshots.length > 0 ? formScreenshots : ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'],
      downloadLinks: formDownloadLinks.length > 0 ? formDownloadLinks : [
        {
          id: 'dl-1',
          name: 'MODAPKs Fast CDN',
          url: `https://linksshare.online/dl/${calculatedSlug}.apk`,
          size: formSize,
          isFastServer: true,
          serverType: 'direct'
        }
      ],
      telegramLink: formTelegramLink.trim() || 'https://t.me/linksshare_modapks',
      rating: formRating || existingApk?.rating || 4.8,
      ratingCount: formRatingCount || existingApk?.ratingCount || 150,
      downloadsCount: formDownloadsCount || existingApk?.downloadsCount || 1200,
      isFeatured: formIsFeatured,
      isTrending: formIsTrending,
      isEditorChoice: formIsEditorChoice,
      updatedAt: new Date().toISOString().split('T')[0],
      createdAt: existingApk?.createdAt || new Date().toISOString().split('T')[0],
      minAndroid: formMinAndroid.trim() || 'Android 6.0+',
      virusTotalSafe: true,
      reviews: existingApk?.reviews || []
    };

    await saveApkItem(apkData);
    setIsFormOpen(false);
  };

  const handleSeedDatabase = async () => {
    if (window.confirm('Seed all default APKs to your Firebase Firestore project (modapk-4955b)?')) {
      setSeedingLoading(true);
      const res = await seedInitialApksToFirestore(INITIAL_APKS);
      setSeedingLoading(false);
      if (res) {
        showNotification('Database seeded successfully to Firebase!', 'success');
        refreshCatalog();
      } else {
        showNotification('Failed to seed Firebase (check security rules below).', 'error');
      }
    }
  };

  const firestoreRulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read and write for MODAPKs catalog
    match /apks/{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const handleCopyRules = () => {
    navigator.clipboard.writeText(firestoreRulesText);
    setCopiedRules(true);
    showNotification('Firestore security rules copied to clipboard!', 'success');
    setTimeout(() => setCopiedRules(false), 3000);
  };

  // If not logged in, display the Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto mb-2">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black font-display text-zinc-900 dark:text-zinc-100">
              MODAPKs Admin Portal
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Enter your credentials to manage modded APKs, download mirrors, and catalog.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-500" /> Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="hworldplayz"
                required
                className="w-full text-sm px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-500" /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full text-sm px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <Lock className="w-4 h-4 stroke-[2.5]" />
              <span>Login to Dashboard</span>
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <button
              onClick={() => setActivePage('home')}
              className="text-xs font-semibold text-zinc-500 hover:text-emerald-500 flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered APKs in admin
  const filteredApks = apks.filter(a => 
    a.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
    a.developer.toLowerCase().includes(adminSearch.toLowerCase()) ||
    a.category.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div id="admin-panel-dashboard" className="space-y-8 animate-in fade-in duration-300 pb-20">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500 text-emerald-500 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display text-zinc-900 dark:text-zinc-100">
              Admin Control Center
            </h1>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span>Logged in as: <strong className="text-emerald-500">hworldplayz</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Database className="w-3.5 h-3.5" /> Firebase: modapk-4955b
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Add APK (Play Store Auto-Fill)</span>
          </button>

          <button
            onClick={() => setActivePage('home')}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition"
          >
            <Eye className="w-4 h-4" />
            <span>View Site</span>
          </button>

          <button
            onClick={adminLogout}
            className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs sm:text-sm font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
        <button
          onClick={() => setAdminView('catalog')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            adminView === 'catalog'
              ? 'bg-emerald-500 text-zinc-950 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Catalog Manager ({apks.length})</span>
        </button>

        <button
          onClick={() => setAdminView('ads')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            adminView === 'ads'
              ? 'bg-emerald-500 text-zinc-950 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Smart Ads & Adsterra Manager</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
            adsConfig.globalKillSwitch 
              ? 'bg-rose-500 text-white' 
              : 'bg-emerald-950/30 text-emerald-600 dark:text-emerald-300'
          }`}>
            {adsConfig.globalKillSwitch ? 'MUTED' : 'LIVE'}
          </span>
        </button>

        <button
          onClick={() => setAdminView('database')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            adminView === 'database'
              ? 'bg-emerald-500 text-zinc-950 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Firebase Database & Rules</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. SMART ADS & ADSTERRA MANAGER VIEW */}
      {/* ========================================================= */}
      {adminView === 'ads' && <AdminAdsManager />}

      {/* ========================================================= */}
      {/* 2. DATABASE & FIREBASE RULES VIEW */}
      {/* ========================================================= */}
      {adminView === 'database' && (
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 text-white p-6 rounded-3xl border border-zinc-800 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Firebase Firestore Configuration Helper (modapk-4955b)</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleSeedDatabase}
                disabled={seedingLoading}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${seedingLoading ? 'animate-spin' : ''}`} />
                <span>{seedingLoading ? 'Seeding...' : 'Seed Catalog to Firestore'}</span>
              </button>

              <button
                onClick={handleCopyRules}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRules ? 'Copied!' : 'Copy Firestore Rules'}</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            To ensure all users can read and your admin panel can write to your Firebase database without permission errors, open your 
            <strong className="text-emerald-400"> Firebase Console &gt; Firestore Database &gt; Rules tab</strong> and paste the rules below:
          </p>

          <pre className="p-3 bg-black/60 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto border border-white/10">
            {firestoreRulesText}
          </pre>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. APKs CATALOG MANAGEMENT TABLE VIEW */}
      {/* ========================================================= */}
      {adminView === 'catalog' && (
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden space-y-4 p-6">
        
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold font-display text-zinc-900 dark:text-zinc-100">
              Published APKs ({apks.length})
            </h3>
            <p className="text-xs text-zinc-500">
              All added apps and games immediately appear in your website catalog.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Search published APKs..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-400 uppercase text-[11px] font-bold tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-3">App / Mod</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Version</th>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Badges</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filteredApks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-zinc-400 text-xs">
                    No APKs found matching your search.
                  </td>
                </tr>
              ) : (
                filteredApks.map((apk) => (
                  <tr key={apk.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={apk.iconUrl}
                          alt={apk.title}
                          className="w-10 h-10 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
                            {apk.title}
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                            {apk.developer}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold">
                        {apk.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                      {apk.version}
                    </td>

                    <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400 font-medium">
                      {apk.size}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        {apk.isFeatured && (
                          <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 rounded">
                            Hero
                          </span>
                        )}
                        {apk.isTrending && (
                          <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 rounded">
                            Trending
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateToApk(apk, 'detail')}
                          className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-600 dark:text-zinc-300 transition"
                          title="View on site"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={() => handleOpenEdit(apk)}
                          className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-600 dark:text-zinc-300 transition"
                          title="Edit Mod APK"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${apk.title}"?`)) {
                              deleteApkItem(apk.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold">
                  {editingApkId ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-zinc-100">
                    {editingApkId ? 'Edit Mod APK' : 'Add New Mod APK'}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Data will be saved directly to Firebase database & local cache.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveApk} className="space-y-5">
              
              {/* Play Store 1-Click Auto-Fill Bar */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-500/30 dark:border-emerald-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                    <Zap className="w-4 h-4 fill-current animate-pulse text-amber-500" />
                    <span>Auto-Fill from Google Play Store (0 API Keys Required)</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    Instant Scraper
                  </span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Enter any Play Store package name (e.g. <code className="text-emerald-600 dark:text-emerald-300 font-mono font-bold">com.spotify.music</code> or <code className="text-emerald-600 dark:text-emerald-300 font-mono font-bold">com.dts.freefireth</code>) or full Play Store URL. We will extract all official titles, HD icons, screenshots, ratings, developer, and descriptions automatically.
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. com.spotify.music OR https://play.google.com/store/apps/details?id=..."
                      value={playStoreInput}
                      onChange={(e) => setPlayStoreInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAutoFetchPlayStore();
                        }
                      }}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoFetchPlayStore}
                    disabled={isFetchingPlayStore || !playStoreInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-500/20 active:scale-95 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {isFetchingPlayStore ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Fetching...</span>
                      </>
                    ) : (
                      <>
                        <DownloadCloud className="w-4 h-4 stroke-[2.5]" />
                        <span>Fetch & Auto-Fill Form</span>
                      </>
                    )}
                  </button>
                </div>

                {playStoreFetchStatus && (
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{playStoreFetchStatus}</span>
                  </div>
                )}
              </div>

              {/* Title & Developer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">App / Game Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spotify: Music and Podcasts"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Developer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Spotify AB / Mojang Studios"
                    value={formDeveloper}
                    onChange={(e) => setFormDeveloper(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Version, Size, Android */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Version</label>
                  <input
                    type="text"
                    placeholder="v8.9.74"
                    value={formVersion}
                    onChange={(e) => setFormVersion(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">File Size</label>
                  <input
                    type="text"
                    placeholder="64.2 MB"
                    value={formSize}
                    onChange={(e) => setFormSize(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Min Android Requirement</label>
                  <input
                    type="text"
                    placeholder="Android 6.0+"
                    value={formMinAndroid}
                    onChange={(e) => setFormMinAndroid(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category and Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    {CATEGORIES_LIST.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Category Type</label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                      <input
                        type="radio"
                        name="catType"
                        checked={formCategoryType === 'games'}
                        onChange={() => setFormCategoryType('games')}
                        className="text-emerald-500"
                      />
                      Mod Games
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                      <input
                        type="radio"
                        name="catType"
                        checked={formCategoryType === 'apps'}
                        onChange={() => setFormCategoryType('apps')}
                        className="text-emerald-500"
                      />
                      Mod Apps
                    </label>
                  </div>
                </div>
              </div>

              {/* MOD Features Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  MOD Features (e.g. Unlimited Money, VIP Unlocked, No Ads)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a mod feature and click Add..."
                    value={formModFeatureInput}
                    onChange={(e) => setFormModFeatureInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddModTag(); }}}
                    className="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddModTag}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formModFeatures.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-emerald-400/30"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveModTag(idx)}
                        className="text-emerald-700 hover:text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Icon URL and Banner URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">App Icon Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formIconUrl}
                    onChange={(e) => setFormIconUrl(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Banner / Artwork Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formBannerUrl}
                    onChange={(e) => setFormBannerUrl(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Short Description & Full Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Short Description</label>
                <input
                  type="text"
                  placeholder="One sentence summary for cards"
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Full Description / Overview</label>
                <textarea
                  rows={4}
                  placeholder="Detailed description of features, gameplay, and instructions..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Screenshots Gallery Section */}
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                    <span>App Screenshots ({formScreenshots.length})</span>
                  </label>
                  <span className="text-[11px] text-zinc-400">
                    Auto-filled from Play Store or add custom
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...) and click Add..."
                    value={formScreenshotInput}
                    onChange={(e) => setFormScreenshotInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddScreenshot(); }}}
                    className="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddScreenshot}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl"
                  >
                    Add Image
                  </button>
                </div>

                {formScreenshots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {formScreenshots.map((url, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-video bg-black/40">
                        <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow-md"
                          title="Remove Screenshot"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No screenshots yet. They will auto-populate when fetching from Play Store.</p>
                )}
              </div>

              {/* What's New / Changelog */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">What's New in this Mod Version</label>
                <textarea
                  rows={2}
                  placeholder="- Latest Version Updated&#10;- Unlocked all premium features"
                  value={formWhatsNew}
                  onChange={(e) => setFormWhatsNew(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Live Rating & Downloads Stats (Auto-filled & Editable) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Star Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formRating}
                    onChange={(e) => setFormRating(parseFloat(e.target.value) || 4.8)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Rating Count</label>
                  <input
                    type="number"
                    value={formRatingCount}
                    onChange={(e) => setFormRatingCount(parseInt(e.target.value, 10) || 1000)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Total Downloads</label>
                  <input
                    type="number"
                    value={formDownloadsCount}
                    onChange={(e) => setFormDownloadsCount(parseInt(e.target.value, 10) || 10000)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Download Mirrors Builder */}
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    APK Download Links & Mirrors ({formDownloadLinks.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddDownloadLink}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Mirror Link
                  </button>
                </div>

                {formDownloadLinks.map((link, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Server #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDownloadLink(idx)}
                        className="text-rose-500 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Server Name (e.g. MODAPKs High Speed CDN)"
                        value={link.name}
                        onChange={(e) => handleUpdateDownloadLink(idx, 'name', e.target.value)}
                        className="text-xs px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                      />
                      <input
                        type="url"
                        placeholder="Download URL (e.g. https://linksshare.online/dl/...)"
                        value={link.url}
                        onChange={(e) => handleUpdateDownloadLink(idx, 'url', e.target.value)}
                        className="text-xs px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Featured / Trending Flags */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded text-emerald-500"
                  />
                  Featured in Hero Slider
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsTrending}
                    onChange={(e) => setFormIsTrending(e.target.checked)}
                    className="rounded text-emerald-500"
                  />
                  Trending Hot
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingApkId ? 'Update Mod APK' : 'Publish Mod APK'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
