/**
 * Single source of truth for route transition timing (aligned with `.black-screen`
 * in nav.scss and GSAP cover/reveal in PixelTransitionOverlay).
 */

/** Delay before route commit — matches black-screen duration on desktop */
export const BLACK_SCREEN_MS = 460;

/**
 * How long `body.page-transitioning` stays after the route commits
 * (cover tail + staggered reveal).
 */
export const PAGE_TRANSITION_CLEAR_MS = 640;

export const PAGE_TRANSITION_CLEAR_REDUCED_MS = 120;

/** Stored value `'0'` turns the pixel overlay off; unset / other = on (default). */
const STORAGE_PIXEL = 'portfolio_pixel_transition';

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Same rule as App.jsx `isBiggerScreenDevice` — no transitions on phone / narrow view. */
export function isPageTransitionActiveViewport() {
  if (typeof window === 'undefined') return false;
  const isMobileView = window.innerWidth <= 479;
  const isMobileUa = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return !isMobileView && !isMobileUa;
}

/** Delay before `history.push` so the wipe can cover the swap (0 on mobile / reduced motion). */
export function getNavPushDelay() {
  if (!isPageTransitionActiveViewport()) return 0;
  return prefersReducedMotion() ? 0 : BLACK_SCREEN_MS;
}

export function getPageTransitionClearMs() {
  if (!isPageTransitionActiveViewport()) return 0;
  return prefersReducedMotion() ? PAGE_TRANSITION_CLEAR_REDUCED_MS : PAGE_TRANSITION_CLEAR_MS;
}

export function isPixelTransitionEnabled() {
  try {
    if (typeof sessionStorage === 'undefined') return true;
    return sessionStorage.getItem(STORAGE_PIXEL) !== '0';
  } catch {
    return true;
  }
}

export function setPixelTransitionEnabled(enabled) {
  try {
    if (typeof sessionStorage === 'undefined') return;
    if (enabled) sessionStorage.removeItem(STORAGE_PIXEL);
    else sessionStorage.setItem(STORAGE_PIXEL, '0');
  } catch {
    /* storage may be unavailable */
  }
}

/**
 * Call when SPA navigation is initiated (nav click). Syncs with ScrollToTop,
 * which clears `page-transitioning` shortly after the route commits.
 */
export function beginPageTransition() {
  if (typeof document === 'undefined') return;
  if (!isPageTransitionActiveViewport()) return;
  document.body.classList.add('page-transitioning');
  if (!isPixelTransitionEnabled() || prefersReducedMotion()) return;
  document.body.classList.add('page-transition--pixel');
  window.dispatchEvent(new CustomEvent('portfolio-pixel-nav-start'));
}

/**
 * Play the GSAP pixel curtain without changing routes (demo / preview).
 * Returns a cleanup function that cancels the fallback timer.
 */
export function previewPixelTransition(durationMs = BLACK_SCREEN_MS) {
  if (typeof document === 'undefined') return () => {};
  if (!isPageTransitionActiveViewport()) return () => {};
  const ms = prefersReducedMotion() ? PAGE_TRANSITION_CLEAR_REDUCED_MS : durationMs;
  if (prefersReducedMotion()) {
    document.body.classList.add('page-transitioning');
    const id = window.setTimeout(() => {
      document.body.classList.remove('page-transitioning', 'page-transition--pixel');
    }, ms);
    return () => {
      window.clearTimeout(id);
      document.body.classList.remove('page-transitioning', 'page-transition--pixel');
    };
  }
  window.dispatchEvent(new CustomEvent('portfolio-pixel-preview', { detail: { durationMs: ms } }));
  const fallbackId = window.setTimeout(() => {
    document.body.classList.remove('page-transitioning', 'page-transition--pixel');
  }, ms + 1200);
  return () => {
    window.clearTimeout(fallbackId);
    document.body.classList.remove('page-transitioning', 'page-transition--pixel');
  };
}
