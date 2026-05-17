/**
 * Route transition timing (aligned with `.black-screen` in nav.scss
 * and GSAP cover/reveal in PixelTransitionOverlay).
 */

/** GSAP pixel grid — shared by nav transitions and eyes overlay */
export const PIXEL_COVER_CELL_S = 0.15;
export const PIXEL_COVER_STAGGER_S = 0.32;
export const PIXEL_REVEAL_CELL_S = 0.14;
export const PIXEL_REVEAL_STAGGER_S = 0.3;

/** Total wall-clock time ≈ cell duration + stagger amount */
export function getPixelCoverDurationMs() {
  return Math.round((PIXEL_COVER_CELL_S + PIXEL_COVER_STAGGER_S) * 1000);
}

export function getPixelRevealDurationMs() {
  return Math.round((PIXEL_REVEAL_CELL_S + PIXEL_REVEAL_STAGGER_S) * 1000);
}

/** Delay before route commit — matches pixel cover on desktop */
export const BLACK_SCREEN_MS = getPixelCoverDurationMs();

/**
 * How long `body.page-transitioning` stays after the route commits
 * (cover tail + staggered reveal).
 */
export const PAGE_TRANSITION_CLEAR_MS = getPixelRevealDurationMs() + 200;

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
  window.dispatchEvent(new Event('portfolio-pixel-nav-start'));
}
