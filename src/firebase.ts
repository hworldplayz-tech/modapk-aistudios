import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { ApkItem, ReviewItem, SiteAdsConfig } from './types';
import { INITIAL_APKS } from './data/initialApks';
import { DEFAULT_ADS_CONFIG } from './data/defaultAds';

const firebaseConfig = {
  apiKey: "AIzaSyACFfVdeDDmvrSYrJ9FrLprYNOiVVBCjHY",
  authDomain: "modapk-4955b.firebaseapp.com",
  projectId: "modapk-4955b",
  storageBucket: "modapk-4955b.firebasestorage.app",
  messagingSenderId: "769625182563",
  appId: "1:769625182563:web:c9046ea18965a7f6ab8356",
  measurementId: "G-HXMVYXXRMR"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

const LOCAL_STORAGE_KEY = 'modapks_catalog_v2';
const APKS_COLLECTION = 'apks';

// Helper to get local cache
export function getLocalApks(): ApkItem[] {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed reading from local storage:', e);
  }
  return INITIAL_APKS;
}

// Helper to save to local cache
export function saveLocalApks(apks: ApkItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(apks));
  } catch (e) {
    console.warn('Failed saving to local storage:', e);
  }
}

// Fetch APKs from Firestore, falling back to local/initial data if empty or offline
export async function fetchApks(): Promise<{ apks: ApkItem[]; source: 'firestore' | 'local' }> {
  try {
    const apksRef = collection(db, APKS_COLLECTION);
    const q = query(apksRef);
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const items: ApkItem[] = [];
      querySnapshot.forEach((docSnap) => {
        items.push(docSnap.data() as ApkItem);
      });
      // Save to local cache
      saveLocalApks(items);
      return { apks: items, source: 'firestore' };
    } else {
      // If collection is empty, seed it with INITIAL_APKS so database gets populated
      const local = getLocalApks();
      // Try to seed in background
      seedInitialApksToFirestore(local).catch(() => {});
      return { apks: local, source: 'local' };
    }
  } catch (error) {
    console.warn('Firestore fetch failed (using local cache):', error);
    return { apks: getLocalApks(), source: 'local' };
  }
}

// Seed initial APKs to Firestore
export async function seedInitialApksToFirestore(apks: ApkItem[] = INITIAL_APKS): Promise<boolean> {
  try {
    for (const apk of apks) {
      const docRef = doc(db, APKS_COLLECTION, apk.id);
      await setDoc(docRef, apk, { merge: true });
    }
    saveLocalApks(apks);
    return true;
  } catch (error) {
    console.warn('Failed seeding Firestore:', error);
    return false;
  }
}

// Save or Update an APK (both Firestore and local cache)
export async function saveApk(apk: ApkItem): Promise<{ success: boolean; firestoreSynced: boolean; error?: string }> {
  // 1. Update local cache immediately for zero latency
  const current = getLocalApks();
  const index = current.findIndex(item => item.id === apk.id);
  let updatedList: ApkItem[];
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = apk;
  } else {
    updatedList = [apk, ...current];
  }
  saveLocalApks(updatedList);

  // 2. Sync with Firestore
  let firestoreSynced = false;
  try {
    const docRef = doc(db, APKS_COLLECTION, apk.id);
    await setDoc(docRef, apk, { merge: true });
    firestoreSynced = true;
  } catch (error: any) {
    console.warn('Firestore write failed (data saved locally):', error);
    return { success: true, firestoreSynced: false, error: error?.message };
  }

  return { success: true, firestoreSynced: true };
}

// Delete an APK
export async function deleteApk(apkId: string): Promise<{ success: boolean; firestoreSynced: boolean }> {
  // Update local cache
  const current = getLocalApks();
  const updatedList = current.filter(item => item.id !== apkId);
  saveLocalApks(updatedList);

  let firestoreSynced = false;
  try {
    const docRef = doc(db, APKS_COLLECTION, apkId);
    await deleteDoc(docRef);
    firestoreSynced = true;
  } catch (error) {
    console.warn('Firestore delete failed (deleted locally):', error);
  }

  return { success: true, firestoreSynced };
}

// Add a community Review
export async function addReview(apkId: string, review: ReviewItem): Promise<boolean> {
  const current = getLocalApks();
  const index = current.findIndex(item => item.id === apkId);
  if (index < 0) return false;

  const apk = { ...current[index] };
  const existingReviews = apk.reviews || [];
  apk.reviews = [review, ...existingReviews];
  
  // recalculate rating
  const totalStars = apk.reviews.reduce((acc, r) => acc + r.rating, 0);
  apk.rating = Number((totalStars / apk.reviews.length).toFixed(1));
  apk.ratingCount = (apk.ratingCount || 0) + 1;

  current[index] = apk;
  saveLocalApks(current);

  try {
    const docRef = doc(db, APKS_COLLECTION, apkId);
    await updateDoc(docRef, {
      reviews: apk.reviews,
      rating: apk.rating,
      ratingCount: apk.ratingCount
    });
    return true;
  } catch (e) {
    console.warn('Firestore review sync failed:', e);
    return true;
  }
}

// Increment downloads count
export async function recordDownload(apkId: string): Promise<void> {
  const current = getLocalApks();
  const index = current.findIndex(item => item.id === apkId);
  if (index >= 0) {
    current[index].downloadsCount = (current[index].downloadsCount || 0) + 1;
    saveLocalApks(current);
    try {
      const docRef = doc(db, APKS_COLLECTION, apkId);
      await updateDoc(docRef, {
        downloadsCount: current[index].downloadsCount
      });
    } catch (e) {
      // silent fallback
    }
  }
}

// ==========================================
// SMART ADS CONFIGURATION SYNC
// ==========================================
const ADS_STORAGE_KEY = 'modapks_ads_configuration_v2';
const SETTINGS_COLLECTION = 'settings';
const ADS_DOC_ID = 'ads_configuration';

export function getLocalAdsConfig(): SiteAdsConfig {
  try {
    const cached = localStorage.getItem(ADS_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...DEFAULT_ADS_CONFIG, ...parsed, demoMode: false };
    }
  } catch (e) {
    console.warn('Failed reading ads config from local storage:', e);
  }
  return DEFAULT_ADS_CONFIG;
}

export function saveLocalAdsConfig(config: SiteAdsConfig): void {
  try {
    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed saving ads config to local storage:', e);
  }
}

export async function fetchAdsConfig(): Promise<{ config: SiteAdsConfig; source: 'firestore' | 'local' }> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, ADS_DOC_ID);
    const querySnapshot = await getDocs(query(collection(db, SETTINGS_COLLECTION)));
    
    let firestoreData: SiteAdsConfig | null = null;
    querySnapshot.forEach((d) => {
      if (d.id === ADS_DOC_ID) {
        firestoreData = d.data() as SiteAdsConfig;
      }
    });

    if (firestoreData) {
      const merged = { ...DEFAULT_ADS_CONFIG, ...firestoreData };
      saveLocalAdsConfig(merged);
      return { config: merged, source: 'firestore' };
    } else {
      const local = getLocalAdsConfig();
      // Try to seed initial ads config to firestore doc
      setDoc(docRef, local, { merge: true }).catch(() => {});
      return { config: local, source: 'local' };
    }
  } catch (err) {
    console.warn('Firestore ads config fetch fallback:', err);
    return { config: getLocalAdsConfig(), source: 'local' };
  }
}

export async function saveAdsConfig(config: SiteAdsConfig): Promise<{ success: boolean; firestoreSynced: boolean }> {
  saveLocalAdsConfig(config);
  let firestoreSynced = false;
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, ADS_DOC_ID);
    await setDoc(docRef, config, { merge: true });
    firestoreSynced = true;
  } catch (error) {
    console.warn('Firestore ads config write failed (stored locally):', error);
  }
  return { success: true, firestoreSynced };
}

