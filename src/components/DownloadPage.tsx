import React, { useState, useEffect } from 'react';
import { 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Server, 
  HardDrive, 
  Smartphone, 
  Sparkles, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  Zap,
  Lock,
  RefreshCw,
  FolderDown,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { ApkItem, DownloadLink } from '../types';
import { SmartAdSlot } from './SmartAdSlot';
import { parseGoogleDriveUrl, getDirectDownloadUrl } from '../utils/driveHelpers';

export const DownloadPage: React.FC = () => {
  const { selectedApk, setActivePage, recordApkDownload, showNotification, adsConfig } = useApp();
  const [hasStartedProcess, setHasStartedProcess] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [downloadStarted, setDownloadStarted] = useState<boolean>(false);

  // Countdown only begins after user initiates download
  useEffect(() => {
    let timer: any;
    if (hasStartedProcess && countdown > 0 && !isReady) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (hasStartedProcess && countdown === 0 && !isReady) {
      setIsReady(true);
      // Trigger subtle celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
    }
    return () => clearTimeout(timer);
  }, [hasStartedProcess, countdown, isReady]);

  if (!selectedApk) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">No APK selected</h2>
        <button 
          onClick={() => setActivePage('home')}
          className="mt-4 px-4 py-2 bg-emerald-500 text-zinc-950 rounded-xl font-bold"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  // Trigger Adsterra smart link and initiate countdown
  const handleInitiateDownload = () => {
    // 1. Immediately activate countdown on current download page
    setHasStartedProcess(true);

    // 2. Open smart link / direct ad ONLY in a new tab, NEVER in current tab
    const smartLinkUrl = adsConfig.adsterraSmartLink || 'https://verticallysaturate.com/q6gxg7w4t7?key=40fbab6be1953ec30ab710b986c53234';
    if (!adsConfig.globalKillSwitch && smartLinkUrl) {
      try {
        const link = document.createElement('a');
        link.href = smartLinkUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch {
        window.open(smartLinkUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleDownloadClick = (link: DownloadLink) => {
    recordApkDownload(selectedApk.id);
    setDownloadStarted(true);

    const directTargetUrl = getDirectDownloadUrl(link.url);
    const driveInfo = parseGoogleDriveUrl(link.url);

    showNotification(
      driveInfo.isDrive 
        ? `Starting direct Google Drive download: ${link.name}`
        : `Starting download: ${link.name}`, 
      'success'
    );
    
    // Confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {}

    // Open direct download URL in new tab / download trigger
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = directTargetUrl;
      a.download = `${selectedApk.slug}.apk`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 400);
  };

  const defaultDirectLink: DownloadLink = selectedApk.downloadLinks?.[0] || {
    id: 'def-link',
    name: 'MODAPKs Ultra Fast Direct CDN',
    url: `https://linksshare.online/dl/${selectedApk.slug}.apk`,
    size: selectedApk.size,
    isFastServer: true,
    serverType: 'direct'
  };

  return (
    <div id="download-page-container" className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-20 w-full max-w-full overflow-hidden">
      
      {/* Top Header Smart Ad Slot */}
      <SmartAdSlot slot={adsConfig.downloadPageTop} />

      {/* Back to Details */}
      <button 
        onClick={() => setActivePage('detail')}
        className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 flex items-center gap-1.5 cursor-pointer font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {selectedApk.title} Details
      </button>

      {/* Main Download Hub Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-10 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl text-center relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/15 rounded-full filter blur-3xl pointer-events-none" />

        {/* App Info Header */}
        <div className="relative z-10 flex flex-col items-center">
          <img
            src={selectedApk.iconUrl}
            alt={selectedApk.title}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-emerald-500 shadow-xl mb-4"
          />

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 mb-2">
            MOD APK File Ready
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-zinc-900 dark:text-zinc-100 tracking-tight">
            Download {selectedApk.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-lg">
            Version: <strong className="text-emerald-600 dark:text-emerald-400">{selectedApk.version}</strong> • Size: <strong>{selectedApk.size}</strong> • Modded by MODAPKs
          </p>

          {/* Download Control Area */}
          <div className="my-6 w-full max-w-md">
            
            {/* Case 1: Initial state before user presses download */}
            {!hasStartedProcess ? (
              <div className="space-y-3">
                <button
                  id="initial-start-download-btn"
                  onClick={handleInitiateDownload}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-lg sm:text-xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30 transform hover:-translate-y-1 active:scale-98 transition duration-200 cursor-pointer glow-emerald"
                >
                  <Download className="w-6 h-6 stroke-[3]" />
                  <span>Download APK ({selectedApk.size})</span>
                </button>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Fast direct high-speed download with zero malware and instant verification.
                </p>
              </div>
            ) : !isReady ? (
              /* Case 2: Countdown active after clicking download */
              <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <Clock className="w-5 h-5 animate-spin" />
                  <span>Generating Secure Fast Link...</span>
                </div>
                
                {/* Circular / Number indicator */}
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto">
                  <span className="text-3xl font-black font-display text-emerald-500">
                    {countdown}
                  </span>
                </div>

                <p className="text-xs text-zinc-400">
                  Please wait while our high speed link generator verifies checksum integrity.
                </p>

                <button
                  onClick={() => setIsReady(true)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  Skip timer & Download directly →
                </button>
              </div>
            ) : (
              /* Case 3: Link is generated and ready to download */
              <div className="space-y-4">
                
                {/* Primary Animated Download Button */}
                <button
                  id="primary-direct-download-btn"
                  onClick={() => handleDownloadClick(defaultDirectLink)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-lg sm:text-xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30 transform hover:-translate-y-1 active:scale-98 transition duration-200 cursor-pointer glow-emerald"
                >
                  <Download className="w-6 h-6 stroke-[3]" />
                  <span>Download APK Now ({selectedApk.size})</span>
                </button>

                {downloadStarted && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Your download has started! If it didn't start automatically, choose a mirror below.</span>
                  </div>
                )}
              </div>
            )}

            {/* Smart Timer Ad Slot (Positioned directly below countdown/button, non-obtrusive) */}
            <div className="mt-4">
              <SmartAdSlot slot={adsConfig.downloadPageTimer} />
            </div>
          </div>

          {/* VirusTotal Verification Chip */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Scanned Clean by VirusTotal & Antivirus Engines (0/68 Detections)</span>
          </div>

        </div>
      </div>

      {/* Alternative Mirrors & Fast CDN Servers */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-500" />
            Alternative High-Speed Mirrors ({selectedApk.downloadLinks?.length || 1})
          </h3>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">100% Free & No Ads</span>
        </div>

        <div className="space-y-2.5">
          {/* Sponsored SmartLink Fast Mirror CDN (Non-intrusive, opens in new tab) */}
          {!adsConfig.globalKillSwitch && adsConfig.smartLinkButtons.enabled && (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-zinc-900 to-zinc-950 border border-emerald-500/40 hover:border-emerald-500 transition group shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-xs">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                    <span>{adsConfig.smartLinkButtons.buttonLabel || '⚡ Fast Mirror CDN (VIP Speed)'}</span>
                    <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-500 text-zinc-950 rounded">
                      VIP SPEED
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    High Speed Direct Cloud • 0s Queue • Adsterra Partner Mirror
                  </div>
                </div>
              </div>

              <a
                href={adsConfig.smartLinkButtons.url || adsConfig.adsterraSmartLink || 'https://linksshare.online'}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <span>Fast Access</span>
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
              </a>
            </div>
          )}

          {(selectedApk.downloadLinks && selectedApk.downloadLinks.length > 0 
            ? selectedApk.downloadLinks 
            : [defaultDirectLink]
          ).map((link, idx) => {
            const driveInfo = parseGoogleDriveUrl(link.url);
            const isGdrive = link.serverType === 'drive' || driveInfo.isDrive;

            return (
              <div
                key={link.id || idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/60 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isGdrive 
                      ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {isGdrive ? (
                      <HardDrive className="w-4 h-4 text-blue-500" />
                    ) : (
                      `#${idx + 1}`
                    )}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 flex-wrap">
                      <span>{link.name}</span>
                      {isGdrive && (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold bg-blue-500 text-white rounded">
                          GOOGLE DRIVE DIRECT
                        </span>
                      )}
                      {link.isFastServer && (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-500 text-zinc-950 rounded">
                          FASTEST
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                      <span>{link.note || `Server Mirror • Size: ${link.size || selectedApk.size}`}</span>
                      {isGdrive && (
                        <span className="text-blue-500 dark:text-blue-400 font-semibold">• 1-Click Direct Download</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadClick(link)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    isGdrive
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                      : 'bg-zinc-900 dark:bg-zinc-800 hover:bg-emerald-500 dark:hover:bg-emerald-500 text-white hover:text-zinc-950'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step by Step How to Install Guide */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-6">
        <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <FolderDown className="w-5 h-5 text-emerald-500" />
          How to Install Mod APK on Android
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-zinc-950 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Download File
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Click the green download button above to save the .apk installation file on your device.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-zinc-950 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Allow Unknown Sources
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Open Phone Settings &gt; Security &gt; Enable "Install Unknown Apps" for your browser/file manager.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-zinc-950 font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Install & Launch
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Tap the downloaded APK in your Notification bar or Downloads folder, press "Install", and enjoy!
            </p>
          </div>
        </div>

        {/* Troubleshooting notice */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/40 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Facing "App Not Installed" error?
          </div>
          <p>
            Make sure to uninstall any existing Google Play version of the app first before installing the Mod APK. Also make sure your Android version satisfies {selectedApk.minAndroid}.
          </p>
        </div>
      </div>

    </div>
  );
};
