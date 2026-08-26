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
