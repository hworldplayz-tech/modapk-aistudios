import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Power, 
  Sparkles, 
  Radio, 
  Sliders, 
  Code, 
  Link2, 
  Save, 
  Eye, 
  ExternalLink, 
  Layers, 
  Zap, 
  CheckCircle, 
  Smartphone, 
  Monitor, 
  Clock, 
  FileCode,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SiteAdsConfig, AdSlotConfig } from '../types';
import { SmartAdSlot } from './SmartAdSlot';

export const AdminAdsManager: React.FC = () => {
  const { 
    adsConfig, 
    updateAdsConfig, 
    toggleGlobalKillSwitch, 
    showNotification 
  } = useApp();

  // Local draft state for editing before saving
  const [draftConfig, setDraftConfig] = useState<SiteAdsConfig>(adsConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [activeAdTab, setActiveAdTab] = useState<'banners' | 'download' | 'popunder' | 'smartlink' | 'preview'>('banners');

  const handleToggleKillSwitch = async () => {
    const nextState = !draftConfig.globalKillSwitch;
    setDraftConfig(prev => ({ ...prev, globalKillSwitch: nextState }));
    await toggleGlobalKillSwitch(nextState);
  };

  const handleSlotChange = (slotKey: keyof SiteAdsConfig, field: keyof AdSlotConfig, value: any) => {
    setDraftConfig(prev => {
      const currentSlot = prev[slotKey] as AdSlotConfig;
      return {
        ...prev,
        [slotKey]: {
          ...currentSlot,
          [field]: value
        }
      };
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await updateAdsConfig(draftConfig);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadAdsterraTemplates = () => {
    if (window.confirm('Populate ad slots with ready-to-use Adsterra script templates? (You can replace the sample keys with your live Adsterra account keys)')) {
      const updated: SiteAdsConfig = {
        ...draftConfig,
        headerBanner: {
          ...draftConfig.headerBanner,
          enabled: true,
          code: `<script type="text/javascript">
  atOptions = {
    'key' : 'sample_adsterra_728x90_key',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script type="text/javascript" src="//www.profitablecpmrate.com/sample_adsterra_728x90_key/invoke.js"></script>`
        },
        inContentBanner: {
          ...draftConfig.inContentBanner,
          enabled: true,
          code: `<script type="text/javascript">
  atOptions = {
    'key' : 'sample_adsterra_300x250_key',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script type="text/javascript" src="//www.profitablecpmrate.com/sample_adsterra_300x250_key/invoke.js"></script>`
        },
        floatingBottomBanner: {
          ...draftConfig.floatingBottomBanner,
          enabled: true,
          code: `<script type="text/javascript">
  atOptions = {
    'key' : 'sample_adsterra_320x50_key',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };
</script>
<script type="text/javascript" src="//www.profitablecpmrate.com/sample_adsterra_320x50_key/invoke.js"></script>`
        },
        sidebarBanner: {
          ...draftConfig.sidebarBanner,
          enabled: true,
          code: `<script type="text/javascript">
  atOptions = {
    'key' : 'sample_adsterra_160x600_key',
    'format' : 'iframe',
    'height' : 600,
    'width' : 160,
    'params' : {}
  };
</script>
<script type="text/javascript" src="//www.profitablecpmrate.com/sample_adsterra_160x600_key/invoke.js"></script>`
        },
        popunder: {
          ...draftConfig.popunder,
          enabled: false,
          code: `<script type="text/javascript" src="//pl12345678.profitablecpmrate.com/ab/cd/ef/abcdef123456.js"></script>`
        }
      };
      setDraftConfig(updated);
      showNotification('Adsterra script templates loaded! Click "Save Ad Settings" to apply.', 'info');
    }
  };

  const isKilled = draftConfig.globalKillSwitch;

  return (
    <div id="admin-ads-manager" className="space-y-6 animate-in fade-in duration-300">
      
      {/* ==================================================== */}
      {/* 1. MASTER KILL SWITCH & SYSTEM CONTROLLER */}
      {/* ==================================================== */}
      <div className={`p-6 rounded-3xl border transition-all shadow-md ${
        isKilled 
          ? 'bg-rose-950/40 border-rose-500/50 text-white' 
          : 'bg-gradient-to-r from-emerald-950/30 via-zinc-900 to-zinc-950 border-emerald-500/40 text-white'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
              isKilled 
                ? 'bg-rose-600/20 border-rose-500 text-rose-400' 
                : 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
            }`}>
              {isKilled ? <ShieldAlert className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-display">
                  {isKilled ? 'SYSTEM KILL SWITCH ACTIVE: ALL ADS MUTED' : 'SMART ADS ENGINE ONLINE & ACTIVE'}
                </h2>
                <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                  isKilled ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-zinc-950 animate-pulse'
                }`}>
                  {isKilled ? 'Muted Site-Wide' : 'Live Serving'}
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                {isKilled 
                  ? 'All Adsterra banners, popunders, smartlinks, and downloads-page ad slots are currently completely disabled across all visitors.'
                  : 'Ads are intelligently injected into header, in-feed, sidebar, mobile sticky footer, and download screens without interfering with user downloads.'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleKillSwitch}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition cursor-pointer ${
                isKilled
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
              }`}
            >
              <Power className="w-4 h-4 stroke-[3]" />
              <span>{isKilled ? 'Deactivate Kill Switch (Turn Ads ON)' : 'Emergency Kill Switch (Turn All OFF)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. AD MANAGEMENT TABS & ACTIONS */}
      {/* ==================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'banners', label: 'Display Banners (720/480/320/Sidebar)', icon: Sliders },
            { id: 'download', label: 'Download Page Smart Ads', icon: Clock },
            { id: 'popunder', label: 'Popunder Ads', icon: Radio },
            { id: 'smartlink', label: 'SmartLink & Buttons', icon: Link2 },
            { id: 'preview', label: 'Live Ad Slot Previews', icon: Eye }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeAdTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                  active 
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm' 
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleLoadAdsterraTemplates}
            className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Pre-fill sample Adsterra script templates"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Adsterra Templates</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Ad Settings'}</span>
          </button>
        </div>
      </div>

      {/* Global General Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800">
        <div>
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mb-1.5">
            <Link2 className="w-3.5 h-3.5 text-emerald-500" /> Default Adsterra SmartLink Direct URL
          </label>
          <input
            type="url"
            value={draftConfig.adsterraSmartLink}
            onChange={(e) => setDraftConfig(p => ({ ...p, adsterraSmartLink: e.target.value }))}
            placeholder="https://www.profitablecpmrate.com/your_key"
            className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-[11px] text-zinc-400 mt-1">
            Direct monetization SmartLink used for fast mirror download CTA buttons and fallback clicks.
          </p>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
              Demo Preview Mode
            </span>
            <p className="text-[11px] text-zinc-400">
              When enabled, empty ad slots display high-converting Adsterra partner preview banners.
            </p>
          </div>
          <button
            onClick={() => setDraftConfig(p => ({ ...p, demoMode: !p.demoMode }))}
            className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
              draftConfig.demoMode ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
              draftConfig.demoMode ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: DISPLAY BANNERS */}
      {/* ==================================================== */}
      {activeAdTab === 'banners' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          {/* Header 728x90 */}
          <AdSlotEditorCard
            title="Header Banner (728x90 / Responsive)"
            description="Displays at the top of Home, Games, Apps, and Detail pages directly underneath navigation."
            dimensions="728x90"
            slot={draftConfig.headerBanner}
            onChange={(field, val) => handleSlotChange('headerBanner', field, val)}
          />

          {/* In-Content 300x250 */}
          <AdSlotEditorCard
            title="In-Feed / Content Banner (300x250 or 468x60)"
            description="Intelligently positioned between catalog grids, APK description breakdown, and community reviews."
            dimensions="300x250"
            slot={draftConfig.inContentBanner}
            onChange={(field, val) => handleSlotChange('inContentBanner', field, val)}
          />

          {/* Sidebar 160x600 */}
          <AdSlotEditorCard
            title="Desktop Sidebar Banner (160x600 / 300x600 Skyscraper)"
            description="Sticky ad widget shown on large screens in APK detail and download sidebars."
            dimensions="160x600"
            slot={draftConfig.sidebarBanner}
            onChange={(field, val) => handleSlotChange('sidebarBanner', field, val)}
          />

          {/* Floating Mobile 320x50 */}
          <AdSlotEditorCard
            title="Sticky Floating Footer (320x50 Mobile / Desktop Bar)"
            description="Sticky bottom bar with dismiss [X] button. Highly optimized for mobile APK download visitors."
            dimensions="320x50"
            slot={draftConfig.floatingBottomBanner}
            onChange={(field, val) => handleSlotChange('floatingBottomBanner', field, val)}
          />

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: DOWNLOAD PAGE SMART ADS */}
      {/* ==================================================== */}
      {activeAdTab === 'download' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-300 text-xs">
            <strong>Smart & Non-Intrusive Download Ads:</strong> These ad units are placed right on the download hub page. They monetize the 5-second waiting duration without disrupting or covering up the real download links.
          </div>

          {/* Download Page Top */}
          <AdSlotEditorCard
            title="Download Page Top Header Ad (728x90)"
            description="Captures user attention at the very top of the dedicated download screen."
            dimensions="728x90"
            slot={draftConfig.downloadPageTop}
            onChange={(field, val) => handleSlotChange('downloadPageTop', field, val)}
          />

          {/* Download Page Under Timer */}
          <AdSlotEditorCard
            title="Countdown Timer Ad Slot (300x250 under 5s counter)"
            description="Positioned directly below the animated countdown timer before direct download buttons unlock."
            dimensions="300x250"
            slot={draftConfig.downloadPageTimer}
            onChange={(field, val) => handleSlotChange('downloadPageTimer', field, val)}
          />
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: POPUNDER ADS */}
      {/* ==================================================== */}
      {activeAdTab === 'popunder' && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Adsterra Popunder Script Integration
                </h3>
                <p className="text-xs text-zinc-500">
                  High-CPM popunder ad script executed in background on user interaction.
                </p>
              </div>
            </div>

            <button
              onClick={() => setDraftConfig(p => ({
                ...p,
                popunder: { ...p.popunder, enabled: !p.popunder.enabled }
              }))}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                draftConfig.popunder.enabled ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                draftConfig.popunder.enabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-emerald-500" /> Popunder JavaScript Code Snippet
            </label>
            <textarea
              rows={4}
              value={draftConfig.popunder.code}
              onChange={(e) => setDraftConfig(p => ({
                ...p,
                popunder: { ...p.popunder, code: e.target.value }
              }))}
              placeholder="<!-- Paste Adsterra popunder script here -->"
              className="w-full text-xs font-mono p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <div>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Trigger Once Per User Session
              </span>
              <p className="text-[11px] text-zinc-400">
                Recommended: Prevents overwhelming users with repeated popunders.
              </p>
            </div>
            <button
              onClick={() => setDraftConfig(p => ({
                ...p,
                popunder: { ...p.popunder, triggerOncePerSession: !p.popunder.triggerOncePerSession }
              }))}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                draftConfig.popunder.triggerOncePerSession ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                draftConfig.popunder.triggerOncePerSession ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: SMARTLINK BUTTONS */}
      {/* ==================================================== */}
      {activeAdTab === 'smartlink' && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Sponsored Fast Mirror CTA Buttons
                </h3>
                <p className="text-xs text-zinc-500">
                  SmartLink-powered download buttons that open your Adsterra direct monetization link.
                </p>
              </div>
            </div>

            <button
              onClick={() => setDraftConfig(p => ({
                ...p,
                smartLinkButtons: { ...p.smartLinkButtons, enabled: !p.smartLinkButtons.enabled }
              }))}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                draftConfig.smartLinkButtons.enabled ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                draftConfig.smartLinkButtons.enabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Button Display Label
              </label>
              <input
                type="text"
                value={draftConfig.smartLinkButtons.buttonLabel}
                onChange={(e) => setDraftConfig(p => ({
                  ...p,
                  smartLinkButtons: { ...p.smartLinkButtons, buttonLabel: e.target.value }
                }))}
                placeholder="⚡ Fast Mirror CDN (Sponsored)"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                SmartLink URL
              </label>
              <input
                type="url"
                value={draftConfig.smartLinkButtons.url}
                onChange={(e) => setDraftConfig(p => ({
                  ...p,
                  smartLinkButtons: { ...p.smartLinkButtons, url: e.target.value }
                }))}
                placeholder="https://www.profitablecpmrate.com/your_key"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: LIVE PREVIEWS */}
      {/* ==================================================== */}
      {activeAdTab === 'preview' && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Interactive Ad Previews
            </h3>
            <p className="text-xs text-zinc-500">
              Live representation of how ads render on the website for visitors.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                1. Header Banner Slot (728x90)
              </span>
              <SmartAdSlot slot={draftConfig.headerBanner} />
            </div>

            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                2. In-Content Slot (300x250)
              </span>
              <SmartAdSlot slot={draftConfig.inContentBanner} />
            </div>

            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                3. Download Page Timer Slot (300x250)
              </span>
              <SmartAdSlot slot={draftConfig.downloadPageTimer} />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Save Action Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 text-white border border-emerald-500/40 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Any updates are immediately synced to Firebase Firestore and active across all visitors.</span>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>{isSaving ? 'Saving to Database...' : 'Save All Ad Settings'}</span>
        </button>
      </div>

    </div>
  );
};

// Reusable Ad Slot Editor Card Component
interface AdSlotEditorCardProps {
  title: string;
  description: string;
  dimensions: string;
  slot: AdSlotConfig;
  onChange: (field: keyof AdSlotConfig, value: any) => void;
}

const AdSlotEditorCard: React.FC<AdSlotEditorCardProps> = ({
  title,
  description,
  dimensions,
  slot,
  onChange
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {title}
            </h4>
            <span className="text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded">
              {dimensions}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {description}
          </p>
        </div>

        <button
          onClick={() => onChange('enabled', !slot.enabled)}
          className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
            slot.enabled ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
          }`}
          title={slot.enabled ? 'Enabled' : 'Disabled'}
        >
          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
            slot.enabled ? 'translate-x-6' : 'translate-x-0'
          }`} />
        </button>
      </div>

      <div className="space-y-1.5 pt-1">
        <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Code className="w-3.5 h-3.5 text-emerald-500" /> HTML / JavaScript Ad Snippet (Adsterra / AdSense code)
          </span>
          <span className="text-[10px] text-zinc-400 font-normal">
            Leave blank to use smart demo banner
          </span>
        </label>
        <textarea
          rows={3}
          value={slot.code}
          onChange={(e) => onChange('code', e.target.value)}
          placeholder={`<!-- Paste Adsterra ${dimensions} script or iframe code here -->`}
          className="w-full text-xs font-mono p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="pt-1">
        <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block mb-1">
          Direct Fallback Link URL (Optional SmartLink override)
        </label>
        <input
          type="url"
          value={slot.directUrl || ''}
          onChange={(e) => onChange('directUrl', e.target.value)}
          placeholder="https://www.profitablecpmrate.com/your_key (leave blank to use default SmartLink)"
          className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
    </div>
  );
};
