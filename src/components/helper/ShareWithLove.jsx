import React, { useState, useEffect, useRef } from 'react';
import resume from '../../../resume-08-20.pdf';
import '../../styles/ShareWithLove.scss';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

/** Label exit timing — keep in sync with `.share-with-love__label-text` transitions. */
const SHARE_ICONS_AFTER_LABEL_MS = 700;
const MORPH_DURATION_MS = 900;

/** Heart geometry shifted up in Y; cross symmetric around (12,12). */
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

function iconLinkClass(shareIconsReady, shareOpen, network) {
  return cx(
    'share-with-love__icon-link',
    `share-with-love__icon-link--${network}`,
    shareIconsReady && 'share-with-love__icon-link--visible',
    !shareIconsReady && shareOpen && 'share-with-love__icon-link--reveal-fast',
  );
}

export default function ShareWithLove({ trackClickEvent }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [shareIconsReady, setShareIconsReady] = useState(false);
  const iconsRevealTimerRef = useRef(null);
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
    if (iconsRevealTimerRef.current) {
      window.clearTimeout(iconsRevealTimerRef.current);
      iconsRevealTimerRef.current = null;
    }
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
      if (iconsRevealTimerRef.current) {
        window.clearTimeout(iconsRevealTimerRef.current);
        iconsRevealTimerRef.current = null;
      }
    };
  }, [shareOpen]);

  const openShare = () => {
    if (iconsRevealTimerRef.current) {
      window.clearTimeout(iconsRevealTimerRef.current);
      iconsRevealTimerRef.current = null;
    }
    setShareOpen(true);
  };

  const closeShare = () => {
    if (!shareOpen) return;
    if (iconsRevealTimerRef.current) {
      window.clearTimeout(iconsRevealTimerRef.current);
      iconsRevealTimerRef.current = null;
    }
    setShareIconsReady(false);
    if (!shareCrossMorphStartedRef.current) {
      setShareOpen(false);
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(failSafe);
      setShareOpen(false);
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
      if (iconsRevealTimerRef.current) {
        window.clearTimeout(iconsRevealTimerRef.current);
        iconsRevealTimerRef.current = null;
      }
    };
  }, []);

  const linksTransitionStyle =
    shareIconsReady
      ? {
          transitionProperty: 'max-width, opacity',
          transitionDuration: '0.72s, 0.55s',
          transitionTimingFunction:
            'cubic-bezier(0.19, 1, 0.22, 1), cubic-bezier(0.77, 0, 0.175, 1)',
        }
      : shareOpen
        ? {
            transitionProperty: 'max-width, opacity',
            transitionDuration: '0.2s, 0.14s',
            transitionTimingFunction:
              'cubic-bezier(0.19, 1, 0.22, 1), cubic-bezier(0.77, 0, 0.175, 1)',
          }
        : {
            transitionProperty: 'max-width, opacity',
            transitionDuration: '0.72s, 0.55s',
            transitionTimingFunction:
              'cubic-bezier(0.19, 1, 0.22, 1), cubic-bezier(0.77, 0, 0.175, 1)',
          };

  const shareBarWidthMod = !shareOpen
    ? 'share-with-love__bar--narrow'
    : !shareIconsReady
      ? 'share-with-love__bar--mid'
      : 'share-with-love__bar--wide';

  return (
    <div className="share-with-love">
      <a
        className="share-with-love__resume"
        onClick={() => trackClickEvent('Anchor', 'View resumé')}
        href={resume}
        target="_blank"
        rel="noopener noreferrer"
      >
        RESUME
      </a>
      <div
        className={cx('share-with-love__bar', shareBarWidthMod)}
        aria-expanded={shareOpen}
      >
        <div
          className={cx(
            'share-with-love__label-row',
            shareOpen && 'share-with-love__label-row--share-open',
            shareIconsReady && 'share-with-love__label-row--icons-ready',
          )}
          tabIndex={!shareOpen ? 0 : -1}
          onClick={() => !shareOpen && openShare()}
          onKeyDown={(e) => {
            if (!shareOpen && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              openShare();
            }
          }}
        >
          <span
            className={cx(
              'share-with-love__label-text',
              shareOpen && 'share-with-love__label-text--hidden',
            )}
          >
            SHARE WITH
          </span>
        </div>
        <div
          className={cx(
            'share-with-love__links',
            shareIconsReady && 'share-with-love__links--visible',
          )}
          style={linksTransitionStyle}
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href="https://www.facebook.com/sharer/sharer.php?u=http://jatinkumar.tech"
            target="_blank"
            rel="noopener noreferrer"
            className={iconLinkClass(shareIconsReady, shareOpen, 'facebook')}
            aria-label="Share on Facebook"
          >
            <i className="fab fa-facebook-f" />
          </a>
          <a
            href="https://www.linkedin.com/shareArticle?mini=true&amp;url=http%3A%2F%2Fjatinkumar.tech&amp;title=Jatin Kumar. FullStack (MERN) Web Dev, Web Designer.&amp;summary=Jatin Kumar, who likes to mix code and creativity, I basically Work across full javascript stack mainly MERN. I am currently in my 2nd Year which I am pursuing from USICT, GGSIPU.&amp;source=http%3A%2F%2Fjatinkumar.tech"
            target="_blank"
            rel="noopener noreferrer"
            className={iconLinkClass(shareIconsReady, shareOpen, 'linkedin')}
            aria-label="Share on LinkedIn"
          >
            <i className="fab fa-linkedin-in" />
          </a>
          <a
            href="https://twitter.com/intent/tweet/?text=http://www.jatinkumar.tech Web Portfolio of a FullStack (MERN) Web Developer, Web Designer @jatink99"
            target="_blank"
            rel="noopener noreferrer"
            className={iconLinkClass(shareIconsReady, shareOpen, 'twitter')}
            aria-label="Share on Twitter"
          >
            <i className="fab fa-twitter" />
          </a>
          <a
            href="https://api.whatsapp.com/send?text=Portfolio - Jatin Kumar http://www.jatinkumar.tech"
            target="_blank"
            rel="noopener noreferrer"
            className={iconLinkClass(shareIconsReady, shareOpen, 'whatsapp')}
            aria-label="Share on WhatsApp"
          >
            <i className="fab fa-whatsapp" />
          </a>
        </div>
        <button
          type="button"
          className="share-with-love__morph"
          aria-label={shareOpen ? 'Close share options' : 'Open share options'}
          tabIndex={shareOpen ? 0 : -1}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            if (shareOpen) closeShare();
            else openShare();
          }}
        >
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden>
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
