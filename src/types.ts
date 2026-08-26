export interface DownloadLink {
  id: string;
  name: string;
  url: string;
  size?: string;
  isFastServer?: boolean;
  serverType?: 'direct' | 'drive' | 'mediafire' | 'mega' | 'telegram' | 'mirror';
  note?: string;
}

export interface ReviewItem {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  device?: string;
  likes?: number;
}

export interface ApkItem {
  id: string;
  title: string;
  slug: string;
  packageName: string;
  version: string;
  size: string;
  developer: string;
  category: string;
  categoryType: 'games' | 'apps';
  modFeatures: string[];
  description: string;
  shortDescription: string;
  whatsNew?: string;
  iconUrl: string;
  bannerUrl: string;
  screenshots: string[];
  downloadLinks: DownloadLink[];
  telegramLink?: string;
  rating: number;
  ratingCount: number;
  downloadsCount: number;
  isFeatured: boolean;
  isTrending: boolean;
  isEditorChoice: boolean;
  updatedAt: string;
  createdAt: string;
  minAndroid: string;
  sha256?: string;
  virusTotalSafe?: boolean;
  reviews?: ReviewItem[];
}

export type ViewPage = 
  | 'home'
  | 'games'
  | 'apps'
  | 'trending'
  | 'favorites'
  | 'detail'
  | 'download'
  | 'admin'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'dmca'
  | 'terms';

export interface CategoryMeta {
  id: string;
  name: string;
  icon: string;
  type: 'games' | 'apps' | 'all';
  count?: number;
}

export interface AdSlotConfig {
  id: string;
  name: string;
  description: string;
  dimensions: string; // e.g. '728x90', '300x250', '320x50', '160x600'
  enabled: boolean;
  code: string; // Custom HTML/JS script snippet from Adsterra, AdSense, etc.
  directUrl?: string; // Optional direct smartlink url for fallback clicks
}

export interface SiteAdsConfig {
  globalKillSwitch: boolean; // TRUE = ALL ADS OFF (Kill switch active), FALSE = ADS ENABLED
  demoMode: boolean; // Displays stylish preview placeholders if ad snippet code is empty
  adsterraSmartLink: string; // Global Smartlink URL for Adsterra
  headerBanner: AdSlotConfig; // 728x90 (Desktop / Tablet) or responsive
  inContentBanner: AdSlotConfig; // 300x250 / 468x60 (In-feed & content)
  sidebarBanner: AdSlotConfig; // 160x600 / 300x600 (Desktop sidebar)
  floatingBottomBanner: AdSlotConfig; // 320x50 / 300x250 (Sticky footer on mobile & web)
  downloadPageTop: AdSlotConfig; // Download page top banner
  downloadPageTimer: AdSlotConfig; // Download page under countdown timer banner
  nativeGridBanner: AdSlotConfig; // Native recommendation widget
  popunder: {
    enabled: boolean;
    code: string;
    triggerOncePerSession: boolean;
  };
  smartLinkButtons: {
    enabled: boolean;
    buttonLabel: string;
    url: string;
  };
  updatedAt?: string;
}

