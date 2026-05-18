const STORAGE_KEY = 'portfolio-mobile-liquid-bg';
export const MOBILE_BG_CHANGE = 'portfolio-mobile-bg-change';

export function isMobileBackgroundViewport() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 767;
}

export function readMobileLiquidBgEnabled() {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function isMobileLiquidBgActive() {
  return isMobileBackgroundViewport() && readMobileLiquidBgEnabled();
}

export function syncMobileLiquidBgBodyClass() {
  if (typeof document === 'undefined') return;
  document.body.classList.toggle('mobile-liquid-bg', isMobileLiquidBgActive());
}

export function setMobileLiquidBgEnabled(enabled) {
  try {
    if (enabled) {
      localStorage.setItem(STORAGE_KEY, '1');
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* private mode */
  }
  syncMobileLiquidBgBodyClass();
  window.dispatchEvent(
    new CustomEvent(MOBILE_BG_CHANGE, {
      detail: { enabled: isMobileLiquidBgActive() },
    })
  );
}

export function subscribeMobileLiquidBg(listener) {
  if (typeof window === 'undefined') return () => {};

  const notify = () => listener(isMobileLiquidBgActive());
  const onChange = () => notify();
  const onResize = () => {
    syncMobileLiquidBgBodyClass();
    notify();
  };

  window.addEventListener(MOBILE_BG_CHANGE, onChange);
  window.addEventListener('resize', onResize);
  notify();

  return () => {
    window.removeEventListener(MOBILE_BG_CHANGE, onChange);
    window.removeEventListener('resize', onResize);
  };
}
