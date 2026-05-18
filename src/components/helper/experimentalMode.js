const STORAGE_KEY = 'portfolio-experimental-mode';
export const EXPERIMENTAL_CHANGE = 'portfolio-experimental-change';

export function isExperimentalViewport() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 767;
}

export function readExperimentalEnabled() {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function isExperimentalModeActive() {
  return isExperimentalViewport() && readExperimentalEnabled();
}

export function syncExperimentalBodyClass() {
  if (typeof document === 'undefined') return;
  document.body.classList.toggle('experimental-mode', isExperimentalModeActive());
}

export function setExperimentalEnabled(enabled) {
  try {
    if (enabled) {
      localStorage.setItem(STORAGE_KEY, '1');
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* private mode */
  }
  syncExperimentalBodyClass();
  window.dispatchEvent(
    new CustomEvent(EXPERIMENTAL_CHANGE, {
      detail: { enabled: isExperimentalModeActive() },
    })
  );
}

export function toggleExperimentalMode() {
  const next = !readExperimentalEnabled();
  setExperimentalEnabled(next);
  return isExperimentalModeActive();
}

/** Desktop-sized viewport, or mobile with experimental mode on. */
export function isEnhancedEffectsViewport() {
  if (typeof window === 'undefined') return false;
  const isMobileView = window.innerWidth <= 479;
  const isMobileUa = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (!isMobileView && !isMobileUa) return true;
  return isExperimentalModeActive();
}

export function subscribeExperimentalMode(listener) {
  if (typeof window === 'undefined') return () => {};

  const notify = () => listener(isExperimentalModeActive());
  const onChange = () => notify();
  const onResize = () => {
    syncExperimentalBodyClass();
    notify();
  };

  window.addEventListener(EXPERIMENTAL_CHANGE, onChange);
  window.addEventListener('resize', onResize);
  notify();

  return () => {
    window.removeEventListener(EXPERIMENTAL_CHANGE, onChange);
    window.removeEventListener('resize', onResize);
  };
}
