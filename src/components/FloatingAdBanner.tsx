import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Zap, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingAdBanner: React.FC = () => {
  const { adsConfig } = useApp();
  const [closed, setClosed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const slot = adsConfig.floatingBottomBanner;
  const isKilled = adsConfig.globalKillSwitch;

  const hasCustomCode = Boolean(slot.code && slot.code.trim().length > 0);
  const targetLink = slot.directUrl || adsConfig.adsterraSmartLink || 'https://linksshare.online';

  useEffect(() => {
    if (!hasCustomCode || !containerRef.current || !slot.enabled || isKilled) return;

    const container = containerRef.current;
    container.innerHTML = '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = slot.code;

    const scripts = tempDiv.getElementsByTagName('script');
    const scriptList: HTMLScriptElement[] = Array.from(scripts);

    while (tempDiv.firstChild) {
      if (tempDiv.firstChild.nodeName !== 'SCRIPT') {
        container.appendChild(tempDiv.firstChild);
      } else {
        tempDiv.removeChild(tempDiv.firstChild);
      }
    }

    scriptList.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      newScript.async = true;
      container.appendChild(newScript);
    });

  }, [slot.code, hasCustomCode, slot.enabled, isKilled]);

  if (isKilled || !slot.enabled || closed) {
    return null;
  }

  return (
    <div 
      id="floating-sticky-ad-banner"
      className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-emerald-500/30 p-2 shadow-2xl animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 relative">
        
        {/* Close Button */}
        <button
          onClick={() => setClosed(true)}
          className="absolute -top-3.5 right-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white p-1 rounded-full text-xs shadow-md border border-zinc-700 flex items-center justify-center cursor-pointer transition z-50"
          title="Close Ad"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {hasCustomCode ? (
          <div className="w-full flex items-center justify-center overflow-hidden py-0.5">
            <div ref={containerRef} className="max-w-full overflow-hidden" />
          </div>
        ) : adsConfig.demoMode ? (
          <a
            href={targetLink}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-emerald-500/30 text-white hover:border-emerald-400 transition cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-100 truncate">
                  ⚡ Download MODs with Ultra High Speed VIP CDN
                </p>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <span>Sponsored (Adsterra 320x50 Sticky)</span>
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-zinc-950 text-[11px] font-extrabold flex items-center gap-1 shrink-0">
              <span>Open</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </a>
        ) : null}

      </div>
    </div>
  );
};
