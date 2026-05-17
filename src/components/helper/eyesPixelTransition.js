import {
  isPageTransitionActiveViewport,
  prefersReducedMotion,
} from './pageTransition';

const EYES_COVER_DONE = 'portfolio-pixel-eyes-cover-done';
const EYES_REVEAL_DONE = 'portfolio-pixel-eyes-reveal-done';

function waitForEvent(name) {
  return new Promise((resolve) => {
    const onDone = () => {
      window.removeEventListener(name, onDone);
      resolve();
    };
    window.addEventListener(name, onDone);
  });
}

export function canUseEyesPixelTransition() {
  return isPageTransitionActiveViewport() && !prefersReducedMotion();
}

/** Eyes overlay slide panel — mobile layout only (matches Eyes.scss breakpoint). */
export function isEyesMobileSlideOverlay() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 767;
}

/** Pixel cover before eyes overlay mounts (desktop). */
export async function runEyesPixelCover() {
  if (!canUseEyesPixelTransition()) return;

  document.body.classList.add('eyes-pixel-transition');
  const done = waitForEvent(EYES_COVER_DONE);
  window.dispatchEvent(new CustomEvent('portfolio-pixel-eyes-cover'));
  await done;
}

/** Pixel reveal after eyes overlay unmounts (desktop). */
export async function runEyesPixelReveal() {
  if (!canUseEyesPixelTransition()) return;

  const done = waitForEvent(EYES_REVEAL_DONE);
  window.dispatchEvent(new CustomEvent('portfolio-pixel-eyes-reveal'));
  await done;
  document.body.classList.remove('eyes-pixel-transition');
}
