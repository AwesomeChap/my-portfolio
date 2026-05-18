/** Desktop-only enhanced effects (liquid bg scroll fade, pixel route transitions). */
export function isEnhancedEffectsViewport() {
  if (typeof window === 'undefined') return false;
  const isMobileView = window.innerWidth <= 479;
  const isMobileUa = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return !isMobileView && !isMobileUa;
}
