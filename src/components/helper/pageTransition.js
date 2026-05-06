/**
 * Call when SPA navigation is initiated (nav click). Syncs with ScrollToTop,
 * which clears `page-transitioning` shortly after the route commits.
 */
export function beginPageTransition() {
  if (typeof document !== 'undefined') {
    document.body.classList.add('page-transitioning');
  }
}
