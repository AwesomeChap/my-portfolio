/** @typedef {(...parts: (string | false | undefined)[]) => string} Cx */

/** @type {Cx} */
export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

/**
 * Glass CTA — same tokens as ShareWithLove resume control.
 * Bracket px sizes required (:root font-size is 3px for DragonBall).
 */
export const GLASS_CTA_BUTTON_BASE =
  'relative ml-0 box-border inline-flex h-[48px] min-h-[48px] cursor-pointer items-center justify-center self-center rounded-[5px] border-none bg-[rgba(46,46,46,0.34)] [backdrop-filter:blur(16px)_saturate(140%)] [-webkit-backdrop-filter:blur(16px)_saturate(140%)] shadow-[0_10px_30px_rgba(0,0,0,0.24),0_2px_10px_rgba(0,0,0,0.2)] px-[20px] py-[10px] text-center text-[16px] tracking-[0.1em] text-white no-underline outline-none [font-family:Futura] [backface-visibility:hidden] max-[479px]:h-[42px] max-[479px]:min-h-[42px] max-[479px]:rounded-[5px]';

export const GLASS_CTA_BUTTON_ENTER = 'opacity-0 [transform:translate(0,-30%)]';

/** Resume-only: icon square on narrow mobile */
export const GLASS_CTA_BUTTON_RESUME_MOBILE =
  'max-[479px]:w-[42px] max-[479px]:min-w-[42px] max-[479px]:px-0 max-[479px]:tracking-normal';

/** Labeled CTA on narrow mobile (e.g. 404 back link) */
export const GLASS_CTA_BUTTON_LABELED_MOBILE =
  'max-[479px]:px-[18px] max-[479px]:text-[14px] max-[479px]:tracking-[0.08em]';

export function resumeGlassButtonClasses() {
  return cx(
    GLASS_CTA_BUTTON_BASE,
    GLASS_CTA_BUTTON_ENTER,
    GLASS_CTA_BUTTON_RESUME_MOBILE,
    'animate-resume-enter',
  );
}

export function labeledGlassButtonClasses(enterAnimation = 'animate-not-found-home-enter') {
  return cx(
    GLASS_CTA_BUTTON_BASE,
    GLASS_CTA_BUTTON_ENTER,
    GLASS_CTA_BUTTON_LABELED_MOBILE,
    enterAnimation,
  );
}
