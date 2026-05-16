import React, { useState, useEffect, useRef } from 'react';
import resume from '../../../resume-08-20.pdf';
/* Pulls in Tailwind utilities only (preflight off in tailwind.config.cjs). Use px/[bracket] sizes — :root font-size is 3px for DragonBall. */
import '../../styles/tailwind-share.css';
import { cx, resumeGlassButtonClasses } from './glassCtaButton';

/** Label exit timing — matches label transition max (~0.68s). */
const SHARE_LABEL_COLLAPSE_MS = 500;
const MORPH_DURATION_MS = 760;
const SHARE_ICON_STAGGER_MS = 60;
const SHARE_ICON_FADE_MS = 360;
const SHARE_ICON_COUNT = 4;
const SHARE_ICON_ENTER_DELAY_MS = 120;
const SHARE_ICON_LEAVE_DELAY_MS = 90;
const SHARE_ICON_TRANSLATE_PX = -16;
const SHARE_ICON_MOVE_MS = 320;
/** Wait after close before fading “SHARE WITH” back in (all breakpoints — same path as desktop for smooth width). */
const SHARE_LABEL_REOPEN_MS = 360;
const SHARE_LABEL_FADE_MS = 320;
const SHARE_LABEL_FADE_IN_DELAY_MS = 20;
const SHARE_ICONS_AFTER_LABEL_MS = SHARE_LABEL_FADE_MS + SHARE_LABEL_COLLAPSE_MS + 5;
const SHARE_ICON_EXIT_TOTAL_MS =
  SHARE_ICON_FADE_MS + SHARE_ICON_STAGGER_MS * (SHARE_ICON_COUNT - 1) + 50;
const NAV_EIO = 'cubic-bezier(0.77, 0, 0.175, 1)';

const LINKS_TRANSITION_EXPANDED = {
  transitionProperty: 'max-width, opacity',
  transitionDuration: '0.56s, 0.32s',
  transitionTimingFunction:
    `${NAV_EIO}, ${NAV_EIO}`,
};

const LINKS_TRANSITION_COLLAPSE_FAST = {
  transitionProperty: 'max-width, opacity',
  transitionDuration: '0.32s, 0.22s',
  transitionTimingFunction:
    `${NAV_EIO}, ${NAV_EIO}`,
};

const SHARE_SPEC_HEART_A = {
  m: [12, 18.35],
  c1: [8.85, 15.55, 5.15, 11.85, 4.65, 7.95],
  c2: [4.35, 5.05, 8.15, 3.25, 12, 7.05],
};
const SHARE_SPEC_HEART_B = {
  m: [12, 18.35],
  c1: [15.15, 15.55, 18.85, 11.85, 19.35, 7.95],
  c2: [19.65, 5.05, 15.85, 3.25, 12, 7.05],
};
const SHARE_SPEC_CROSS_A = {
  m: [5, 5],
  c1: [7.33, 7.33, 9.67, 9.67, 12, 12],
  c2: [14.33, 14.33, 16.67, 16.67, 19, 19],
};
const SHARE_SPEC_CROSS_B = {
  m: [19, 5],
  c1: [16.67, 7.33, 14.33, 9.67, 12, 12],
  c2: [9.67, 14.33, 7.33, 16.67, 5, 19],
};

const lerp = (a, b, t) => a + (b - a) * t;

const easeQuinticInOut = (t) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - (-2 * t + 2) ** 5 / 2;

const lerpShareSpec = (from, to, u) => ({
  m: [lerp(from.m[0], to.m[0], u), lerp(from.m[1], to.m[1], u)],
  c1: from.c1.map((v, i) => lerp(v, to.c1[i], u)),
  c2: from.c2.map((v, i) => lerp(v, to.c2[i], u)),
});

const sharePathD = (spec) => {
  const [x1, y1, x2, y2, x3, y3] = spec.c1;
  const [x4, y4, x5, y5, x6, y6] = spec.c2;
  return `M ${spec.m[0]} ${spec.m[1]} C ${x1} ${y1} ${x2} ${y2} ${x3} ${y3} C ${x4} ${y4} ${x5} ${y5} ${x6} ${y6}`;
};

const SHARE_D_HEART_A = sharePathD(SHARE_SPEC_HEART_A);
const SHARE_D_HEART_B = sharePathD(SHARE_SPEC_HEART_B);

const linkBase =
  'share-link box-border shrink-0 self-center no-underline text-white rounded-full inline-flex justify-center items-center h-[34px] w-[34px] mx-[10px] text-[18px] [&_i]:ml-[3px]';

function iconLinkClass(shareIconsReady, shareOpen, shareClosingIcons, visibleBg) {
  return cx(
    linkBase,
    'focus-visible:outline-none focus-visible:[box-shadow:inset_0_0_0_2px_var(--theme-red-brand)]',
    (shareIconsReady || shareClosingIcons) && visibleBg,
  );
}

function clearTimer(timerRef) {
  if (timerRef.current) {
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }
}

const SHARE_LINKS = [
  {
    href: 'https://www.facebook.com/sharer/sharer.php?u=http://jatinkumar.tech',
    bg: 'bg-[rgb(0,62,196)]',
    label: 'Share on Facebook',
    icon: 'fab fa-facebook-f',
  },
  {
    href: 'https://www.linkedin.com/shareArticle?mini=true&amp;url=http%3A%2F%2Fjatinkumar.tech&amp;title=Jatin Kumar. FullStack (MERN) Web Dev, Web Designer.&amp;summary=Jatin Kumar, who likes to mix code and creativity, I basically Work across full javascript stack mainly MERN. I am currently in my 2nd Year which I am pursuing from USICT, GGSIPU.&amp;source=http%3A%2F%2Fjatinkumar.tech',
    bg: 'bg-[rgb(0,81,255)]',
    label: 'Share on LinkedIn',
    icon: 'fab fa-linkedin-in',
  },
  {
    href: 'https://twitter.com/intent/tweet/?text=http://www.jatinkumar.tech Web Portfolio of a FullStack (MERN) Web Developer, Web Designer @jatink99',
    bg: 'bg-[rgb(0,162,255)]',
    label: 'Share on Twitter',
    icon: 'fab fa-twitter',
  },
  {
    href: 'https://api.whatsapp.com/send?text=Portfolio - Jatin Kumar http://www.jatinkumar.tech',
    bg: 'bg-[rgb(0,196,52)]',
    label: 'Share on WhatsApp',
    icon: 'fab fa-whatsapp',
  },
];

export default function ShareWithLove({ trackClickEvent }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [shareIconsReady, setShareIconsReady] = useState(false);
  const [shareClosingIcons, setShareClosingIcons] = useState(false);
  const [shareLabelVisible, setShareLabelVisible] = useState(true);
  const [shareLabelCollapsed, setShareLabelCollapsed] = useState(false);
  const iconsRevealTimerRef = useRef(null);
  const iconsCloseTimerRef = useRef(null);
  const labelRevealTimerRef = useRef(null);
  const labelCollapseTimerRef = useRef(null);
  const labelFadeInTimerRef = useRef(null);
  const shareMorphPathARef = useRef(null);
  const shareMorphPathBRef = useRef(null);
  const shareMorphRafRef = useRef(null);
  const shareMorphProgressRef = useRef(0);
  const shareCrossMorphStartedRef = useRef(false);

  const cancelShareMorphAnim = () => {
    if (shareMorphRafRef.current != null) {
      window.cancelAnimationFrame(shareMorphRafRef.current);
      shareMorphRafRef.current = null;
    }
  };

  const applyShareMorphT = (tClamped) => {
    const t = Math.min(1, Math.max(0, tClamped));
    const specA = lerpShareSpec(SHARE_SPEC_HEART_A, SHARE_SPEC_CROSS_A, t);
    const specB = lerpShareSpec(SHARE_SPEC_HEART_B, SHARE_SPEC_CROSS_B, t);
    shareMorphPathARef.current?.setAttribute('d', sharePathD(specA));
    shareMorphPathBRef.current?.setAttribute('d', sharePathD(specB));
  };

  const animateShareMorphTo = (targetT, onDone) => {
    cancelShareMorphAnim();
    const startT = shareMorphProgressRef.current;
    if (Math.abs(startT - targetT) < 1e-4) {
      shareMorphProgressRef.current = targetT;
      applyShareMorphT(targetT);
      if (targetT < 0.5) shareCrossMorphStartedRef.current = false;
      if (onDone) onDone();
      return;
    }
    if (targetT === 1) shareCrossMorphStartedRef.current = true;

    const t0 = performance.now();
    const dur = MORPH_DURATION_MS;

    const frame = (now) => {
      const raw = Math.min(1, (now - t0) / dur);
      const e = easeQuinticInOut(raw);
      const t = startT + (targetT - startT) * e;
      shareMorphProgressRef.current = t;
      applyShareMorphT(t);
      if (raw < 1) {
        shareMorphRafRef.current = window.requestAnimationFrame(frame);
      } else {
        shareMorphRafRef.current = null;
        shareMorphProgressRef.current = targetT;
        applyShareMorphT(targetT);
        if (targetT < 0.5) shareCrossMorphStartedRef.current = false;
        if (onDone) onDone();
      }
    };
    shareMorphRafRef.current = window.requestAnimationFrame(frame);
  };

  useEffect(() => {
    clearTimer(iconsCloseTimerRef);
    clearTimer(iconsRevealTimerRef);
    if (!shareOpen) {
      setShareIconsReady(false);
      return undefined;
    }
    setShareIconsReady(false);
    iconsRevealTimerRef.current = window.setTimeout(() => {
      setShareIconsReady(true);
      iconsRevealTimerRef.current = null;
    }, SHARE_ICONS_AFTER_LABEL_MS);
    return () => {
      clearTimer(iconsRevealTimerRef);
    };
  }, [shareOpen]);

  const openShare = () => {
    clearTimer(iconsRevealTimerRef);
    clearTimer(iconsCloseTimerRef);
    clearTimer(labelRevealTimerRef);
    clearTimer(labelCollapseTimerRef);
    clearTimer(labelFadeInTimerRef);
    setShareLabelVisible(false);
    setShareLabelCollapsed(false);
    labelCollapseTimerRef.current = window.setTimeout(() => {
      setShareLabelCollapsed(true);
      labelCollapseTimerRef.current = null;
    }, SHARE_LABEL_FADE_MS);
    setShareClosingIcons(false);
    setShareOpen(true);
  };

  const closeShare = () => {
    if (!shareOpen || shareClosingIcons) return;
    clearTimer(iconsRevealTimerRef);
    const finishClose = () => {
      clearTimer(iconsCloseTimerRef);
      setShareClosingIcons(false);
      setShareIconsReady(false);
      setShareOpen(false);
      clearTimer(labelRevealTimerRef);
      clearTimer(labelCollapseTimerRef);
      clearTimer(labelFadeInTimerRef);

      setShareLabelCollapsed(false);
      labelRevealTimerRef.current = window.setTimeout(() => {
        labelFadeInTimerRef.current = window.setTimeout(() => {
          setShareLabelVisible(true);
          labelFadeInTimerRef.current = null;
        }, SHARE_LABEL_FADE_IN_DELAY_MS);
        labelRevealTimerRef.current = null;
      }, SHARE_LABEL_REOPEN_MS);
    };
    const startIconExit = () => {
      if (!shareIconsReady) {
        finishClose();
        return;
      }
      setShareClosingIcons(true);
      setShareIconsReady(false);
      iconsCloseTimerRef.current = window.setTimeout(
        finishClose,
        SHARE_ICON_EXIT_TOTAL_MS,
      );
    };
    if (!shareCrossMorphStartedRef.current) {
      startIconExit();
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(failSafe);
      startIconExit();
    };
    const failSafe = window.setTimeout(finish, MORPH_DURATION_MS + 400);
    animateShareMorphTo(0, finish);
  };

  useEffect(() => {
    if (!shareOpen) {
      shareCrossMorphStartedRef.current = false;
      cancelShareMorphAnim();
      shareMorphProgressRef.current = 0;
      const reset = window.requestAnimationFrame(() => applyShareMorphT(0));
      return () => window.cancelAnimationFrame(reset);
    }
    shareCrossMorphStartedRef.current = false;
    const id = window.requestAnimationFrame(() => {
      animateShareMorphTo(1, null);
    });
    return () => {
      window.cancelAnimationFrame(id);
      cancelShareMorphAnim();
      shareCrossMorphStartedRef.current = false;
    };
  }, [shareOpen]);

  useEffect(() => {
    return () => {
      cancelShareMorphAnim();
      clearTimer(iconsRevealTimerRef);
      clearTimer(iconsCloseTimerRef);
      clearTimer(labelRevealTimerRef);
      clearTimer(labelCollapseTimerRef);
      clearTimer(labelFadeInTimerRef);
    };
  }, []);

  const shareIconsMounted = shareIconsReady || shareClosingIcons;
  const iconLinkStyle = (index) => {
    const transitionBase = `transform ${SHARE_ICON_MOVE_MS}ms ${NAV_EIO}, opacity ${SHARE_ICON_MOVE_MS}ms ${NAV_EIO}`;
    if (shareIconsReady) {
      return {
        transitionDelay: `${SHARE_ICON_ENTER_DELAY_MS + index * SHARE_ICON_STAGGER_MS}ms`,
        transition: transitionBase,
        opacity: 1,
        transform: 'translate3d(0,0,0)',
      };
    }
    if (shareClosingIcons) {
      return {
        transitionDelay: `${SHARE_ICON_LEAVE_DELAY_MS + (SHARE_ICON_COUNT - 1 - index) * SHARE_ICON_STAGGER_MS}ms`,
        transition: transitionBase,
        opacity: 0,
        transform: `translate3d(${SHARE_ICON_TRANSLATE_PX}px,0,0)`,
      };
    }
    return {
      transitionDelay: '0ms',
      transition: transitionBase,
      opacity: 0,
      transform: `translate3d(${SHARE_ICON_TRANSLATE_PX}px,0,0)`,
    };
  };

  const linksTransitionStyle =
    shareIconsMounted || !shareOpen
      ? LINKS_TRANSITION_EXPANDED
      : LINKS_TRANSITION_COLLAPSE_FAST;

  const shareBarMaxW = cx(
    !shareOpen && 'max-w-[248px]',
    shareOpen && !shareIconsReady && !shareLabelCollapsed && 'max-w-[248px]',
    shareOpen && !shareIconsReady && shareLabelCollapsed && 'max-w-[82px]',
    shareOpen && shareIconsMounted && 'max-w-[420px]',
  );

  return (
    <div
      className={cx(
        'share-with-love absolute bottom-0 z-10 ml-[10px] max-[767px]:ml-0 box-border inline-flex flex-row items-center justify-start gap-[10px] self-start',
      )}
    >
      <a
        className={resumeGlassButtonClasses()}
        aria-label="View resumé"
        onClick={() => trackClickEvent('Anchor', 'View resumé')}
        href={resume}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="max-[479px]:hidden">RESUME</span>
        <i
          className="fas fa-file-alt hidden text-[20px] leading-none max-[479px]:inline-block"
          aria-hidden
        />
      </a>
      <div
        className={cx(
          'animate-share-enter relative box-border inline-flex h-[48px] min-h-[48px] flex-row items-center overflow-hidden rounded-[5px] border-none bg-[rgba(46,46,46,0.34)] [backdrop-filter:blur(16px)_saturate(140%)] [-webkit-backdrop-filter:blur(16px)_saturate(140%)] shadow-[0_10px_30px_rgba(0,0,0,0.24),0_2px_10px_rgba(0,0,0,0.2)] pl-[18px] pr-[56px] opacity-0 outline-none [font-family:Futura] [backface-visibility:hidden] [transform:translate(0,-30%)] [transition:max-width_0.56s_cubic-bezier(0.77,0,0.175,1)] max-[479px]:rounded-[5px] max-[479px]:hidden',
          shareBarMaxW,
        )}
      >
        <button
          type="button"
          className={cx(
            'absolute inset-0 z-[20] border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--theme-red-brand)] focus-visible:outline-offset-[-2px]',
            shareOpen && 'pointer-events-none',
          )}
          aria-label="Open share options"
          tabIndex={shareOpen ? -1 : 0}
          onClick={() => !shareOpen && openShare()}
        />
        <div
          className={cx(
            'box-border flex min-h-0 min-w-0 shrink-0 flex-row items-center justify-center gap-[10px] overflow-hidden border-0 bg-transparent p-0 text-[16px] text-white outline-none select-none [font-family:Futura] [transition:max-width_0.5s_cubic-bezier(0.77,0,0.175,1),width_0.5s_cubic-bezier(0.77,0,0.175,1),margin_0.5s_cubic-bezier(0.77,0,0.175,1),padding_0.5s_cubic-bezier(0.77,0,0.175,1)]',
            shareLabelCollapsed || shareIconsReady
              ? 'max-w-0'
              : 'max-w-[220px]',
            shareOpen && 'pointer-events-none',
            (!shareLabelVisible || shareIconsReady) && 'pointer-events-none m-0 p-0',
          )}
        >
          <span
            className={cx(
              'pl-[5.5px] max-w-[200px] whitespace-nowrap text-[16px] leading-none tracking-[0.1em] [font-family:Futura] [transition:opacity_0.25s_cubic-bezier(0.77,0,0.175,1),transform_0.25s_cubic-bezier(0.77,0,0.175,1)]',
              shareLabelVisible
                ? 'translate-x-0 opacity-100'
                : 'pointer-events-none translate-x-[12px] opacity-0',
            )}
          >
            SHARE WITH
          </span>
        </div>
        <div
          className={cx(
            'box-border m-0 flex max-w-0 shrink-0 flex-row items-center self-center overflow-hidden p-0 opacity-0 pointer-events-none',
            shareIconsMounted && 'max-w-[300px] opacity-100',
            shareIconsReady && 'pointer-events-auto',
          )}
          style={linksTransitionStyle}
          onClick={(e) => e.stopPropagation()}
        >
          {SHARE_LINKS.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={shareIconsReady ? 0 : -1}
              className={iconLinkClass(
                shareIconsReady,
                shareOpen,
                shareClosingIcons,
                link.bg,
              )}
              style={iconLinkStyle(index)}
              aria-label={link.label}
            >
              <i className={link.icon} />
            </a>
          ))}
        </div>
        <button
          type="button"
          className="absolute inset-y-0 right-[8px] z-[25] box-border inline-flex h-[40px] w-[40px] min-w-[40px] cursor-pointer items-center justify-center self-center border-0 bg-transparent p-0 text-[var(--theme-red-brand)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--theme-red-brand)] focus-visible:outline-offset-[2px] [-webkit-tap-highlight-color:transparent]"
          aria-label={shareOpen ? 'Close share options' : 'Open share options'}
          tabIndex={shareOpen ? 0 : -1}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            if (shareOpen) closeShare();
            else openShare();
          }}
        >
          <svg
            className="block h-[29px] w-[29px] shrink-0 overflow-visible"
            viewBox="0 0 24 24"
            focusable="false"
            aria-hidden
          >
            <path
              ref={shareMorphPathARef}
              d={SHARE_D_HEART_A}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.55"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              ref={shareMorphPathBRef}
              d={SHARE_D_HEART_B}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.55"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
