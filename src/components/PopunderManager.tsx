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
      const container = document.createElement('div');
      container.style.display = 'none';
      container.id = 'popunder-adsterra-container';
      container.innerHTML = pop.code;

      const scripts = container.getElementsByTagName('script');
      const scriptList = Array.from(scripts);

      scriptList.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = oldScript.textContent;
        document.body.appendChild(newScript);
      });

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
