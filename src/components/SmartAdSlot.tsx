import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AdSlotConfig } from '../types';

interface SmartAdSlotProps {
  slot: AdSlotConfig;
  className?: string;
  label?: string;
}

export const SmartAdSlot: React.FC<SmartAdSlotProps> = ({ 
  slot, 
  className = ''
}) => {
  const { adsConfig } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastRenderedCodeRef = useRef<string>('');

  // If global kill switch is ON, or slot is disabled, or no slot passed: render nothing
  if (adsConfig.globalKillSwitch || !slot || !slot.enabled) {
    return null;
  }

  const hasCustomCode = Boolean(slot.code && slot.code.trim().length > 0);

  // ONLY show direct ad banner if added in admin panel. If not, do NOT show anything else.
  if (!hasCustomCode) {
    return null;
  }

  // Inject and execute script safely only when code changes
  useEffect(() => {
    if (!containerRef.current) return;
    if (lastRenderedCodeRef.current === slot.code) return; // Skip re-executing unchanged ad scripts!

    lastRenderedCodeRef.current = slot.code;
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

  }, [slot.code]);

  return (
    <div className={`my-2 w-full flex items-center justify-center overflow-hidden max-w-full contain-content ${className}`}>
      <div 
        ref={containerRef} 
        className="w-full max-w-full flex items-center justify-center overflow-hidden min-h-[50px]"
      />
    </div>
  );
};
