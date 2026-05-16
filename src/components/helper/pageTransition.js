/**
 * Route transition timing (aligned with `.black-screen` in nav.scss
 * and GSAP cover/reveal in PixelTransitionOverlay).
 */

/** Delay before route commit — matches black-screen duration on desktop */
export const BLACK_SCREEN_MS = 460;

/**
 * How long `body.page-transitioning` stays after the route commits
 * (cover tail + staggered reveal).
 */
export const PAGE_TRANSITION_CLEAR_MS = 640;

export const PAGE_TRANSITION_CLEAR_REDUCED_MS = 120;

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

/**
 * Call when SPA navigation is initiated (nav click). Syncs with ScrollToTop,
 * which clears `page-transitioning` shortly after the route commits.
 */
export function beginPageTransition() {
  if (typeof document === 'undefined') return;
  if (!isPageTransitionActiveViewport()) return;
  document.body.classList.add('page-transitioning');
  if (prefersReducedMotion()) return;
  document.body.classList.add('page-transition--pixel');
  window.dispatchEvent(new CustomEvent('portfolio-pixel-nav-start'));
}
