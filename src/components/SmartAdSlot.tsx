import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ExternalLink, ShieldCheck, X, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdSlotConfig } from '../types';

interface SmartAdSlotProps {
  slot: AdSlotConfig;
  className?: string;
  label?: string;
}

export const SmartAdSlot: React.FC<SmartAdSlotProps> = ({ 
  slot, 
  className = '',
  label = 'Sponsored'
}) => {
  const { adsConfig } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  // If global kill switch is ON (all ads killed) or this slot is disabled or user dismissed it
  if (adsConfig.globalKillSwitch || !slot.enabled || isDismissed) {
    return null;
  }

  const hasCustomCode = Boolean(slot.code && slot.code.trim().length > 0);
  const targetLink = slot.directUrl || adsConfig.adsterraSmartLink || 'https://linksshare.online';

  // Inject and execute script safely if raw HTML/JS snippet was provided in Admin
  useEffect(() => {
    if (!hasCustomCode || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = ''; // Clear previous

    // Parse HTML string to extract scripts and elements
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = slot.code;

    const scripts = tempDiv.getElementsByTagName('script');
    const scriptList: HTMLScriptElement[] = Array.from(scripts);

    // Append non-script nodes
    while (tempDiv.firstChild) {
      if (tempDiv.firstChild.nodeName !== 'SCRIPT') {
        container.appendChild(tempDiv.firstChild);
      } else {
        tempDiv.removeChild(tempDiv.firstChild);
      }
    }

    // Execute each script tag dynamically so external ad networks like Adsterra load
    scriptList.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      newScript.async = true;
      container.appendChild(newScript);
    });

  }, [slot.code, hasCustomCode]);

  // If custom snippet exists, render container
  if (hasCustomCode) {
    return (
      <div className={`my-4 flex flex-col items-center justify-center overflow-hidden ${className}`}>
        <div className="w-full max-w-full flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mb-1 px-1">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>{label}</span>
          </span>
          <span>{slot.dimensions}</span>
        </div>
        <div 
          ref={containerRef} 
          className="w-full flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 p-1"
        />
      </div>
    );
  }

  // If demo mode is active and no script is added yet, display sleek preview ad banner
  if (adsConfig.demoMode) {
    return (
      <div className={`my-4 w-full flex flex-col items-center justify-center animate-in fade-in duration-200 ${className}`}>
        <div className="w-full max-w-4xl flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mb-1 px-1">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <Zap className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>{label} • {slot.name}</span>
          </span>
          <span className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[9px] text-zinc-600 dark:text-zinc-400 font-mono">
            {slot.dimensions}
          </span>
        </div>

        <a
          href={targetLink}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="group w-full max-w-4xl block relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/30 hover:border-emerald-500/60 p-4 sm:p-5 text-white transition-all shadow-md hover:shadow-emerald-500/10 cursor-pointer"
        >
          {/* Subtle animated background glow */}
          <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-extrabold text-zinc-100 group-hover:text-emerald-400 transition">
                    Sponsored High Speed Mirror CDN
                  </h4>
                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                    Adsterra Partner
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-tight">
                  Download VIP Unlocked APKs at up to 1000 Mbps with zero waiting time.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black flex items-center gap-1 shadow-sm transition">
                <span>Fast Access</span>
                <ExternalLink className="w-3 h-3 stroke-[2.5]" />
              </span>
            </div>
          </div>
        </a>
      </div>
    );
  }

  return null;
};
