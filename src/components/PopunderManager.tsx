import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const PopunderManager: React.FC = () => {
  const { adsConfig } = useApp();
  const injectedRef = useRef(false);

  useEffect(() => {
    const pop = adsConfig.popunder;
    if (adsConfig.globalKillSwitch || !pop.enabled || !pop.code.trim()) {
      return;
    }

    // Check if session trigger already happened
    if (pop.triggerOncePerSession) {
      if (sessionStorage.getItem('modapks_popunder_fired') === 'true') {
        return;
      }
    }

    if (injectedRef.current) return;

    try {
      const rawCode = pop.code.trim();

      // If user pasted just a direct URL (e.g., //pl1234567.profitablecpmrate.com/... or https://...)
      if ((rawCode.startsWith('http://') || rawCode.startsWith('https://') || rawCode.startsWith('//')) && !rawCode.includes('<script')) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = rawCode;
        script.async = true;
        document.body.appendChild(script);
        injectedRef.current = true;
        if (pop.triggerOncePerSession) {
          sessionStorage.setItem('modapks_popunder_fired', 'true');
        }
        return;
      }

      // Standard HTML script tag parsing
      const container = document.createElement('div');
      container.style.display = 'none';
      container.id = 'popunder-adsterra-container';
      container.innerHTML = rawCode;

      const scripts = container.getElementsByTagName('script');
      const scriptList = Array.from(scripts);

      if (scriptList.length === 0 && rawCode.includes('src=')) {
        // Extract src attribute if present
        const match = rawCode.match(/src=["'](.*?)["']/);
        if (match && match[1]) {
          const newScript = document.createElement('script');
          newScript.type = 'text/javascript';
          newScript.src = match[1];
          newScript.async = true;
          document.body.appendChild(newScript);
        }
      } else {
        scriptList.forEach((oldScript) => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.textContent = oldScript.textContent;
          document.body.appendChild(newScript);
        });
      }

      injectedRef.current = true;
      if (pop.triggerOncePerSession) {
        sessionStorage.setItem('modapks_popunder_fired', 'true');
      }
    } catch (e) {
      console.warn('Popunder execution failed:', e);
    }
  }, [adsConfig.popunder, adsConfig.globalKillSwitch]);

  return null;
};
