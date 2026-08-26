import { SiteAdsConfig } from '../types';

export const DEFAULT_ADS_CONFIG: SiteAdsConfig = {
  globalKillSwitch: false, // Default: False (Ads are enabled by default, can be killed with 1 click)
  demoMode: true, // In demo mode, if custom script code is empty, shows a clean Adsterra styled banner with dimension badge
  adsterraSmartLink: 'https://www.profitablecpmrate.com/example_smartlink', // Default Adsterra SmartLink
  headerBanner: {
    id: 'header-728x90',
    name: 'Top Header Banner',
    description: 'Displays directly below navigation on Desktop and Tablet (728x90 responsive).',
    dimensions: '728x90',
    enabled: true,
    code: '',
    directUrl: ''
  },
  inContentBanner: {
    id: 'in-content-300x250',
    name: 'In-Feed / Content Banner',
    description: 'Displays between catalog sections, MOD overview details, and reviews (300x250 or 468x60).',
    dimensions: '300x250',
    enabled: true,
    code: '',
    directUrl: ''
  },
  sidebarBanner: {
    id: 'sidebar-160x600',
    name: 'Desktop Sidebar Banner',
    description: 'Sticky skyscraper banner on right or left sidebar on large screens (160x600 or 300x600).',
    dimensions: '160x600',
    enabled: true,
    code: '',
    directUrl: ''
  },
  floatingBottomBanner: {
    id: 'floating-320x50',
    name: 'Sticky Floating Mobile Footer',
    description: 'Sticky bottom banner on mobile screens (320x50 or 300x50) with user dismiss [x] button.',
    dimensions: '320x50',
    enabled: true,
    code: '',
    directUrl: ''
  },
  downloadPageTop: {
    id: 'download-top-728x90',
    name: 'Download Page Header Ad',
    description: 'Placed at top of the download hub to capture high user intent (728x90).',
    dimensions: '728x90',
    enabled: true,
    code: '',
    directUrl: ''
  },
  downloadPageTimer: {
    id: 'download-timer-300x250',
    name: 'Download Timer Ad (Under Countdown)',
    description: 'Strategically positioned below the 5-second countdown timer. Non-intrusive and never blocks actual download link.',
    dimensions: '300x250',
    enabled: true,
    code: '',
    directUrl: ''
  },
  nativeGridBanner: {
    id: 'native-grid-banner',
    name: 'Native Recommended Mod Ads',
    description: 'Adsterra 4-slot Native Banner widget matching catalog app cards.',
    dimensions: 'Native Grid',
    enabled: true,
    code: '',
    directUrl: ''
  },
  popunder: {
    enabled: false, // Default popunder disabled until webmaster enables it
    code: '<!-- Adsterra Popunder Script -->\n<script type="text/javascript" src="//pl12345678.profitablecpmrate.com/ab/cd/ef/abcdef123456.js"></script>',
    triggerOncePerSession: true
  },
  smartLinkButtons: {
    enabled: true,
    buttonLabel: '⚡ Fast Mirror CDN (Sponsored)',
    url: 'https://www.profitablecpmrate.com/example_smartlink'
  },
  updatedAt: new Date().toISOString().split('T')[0]
};
