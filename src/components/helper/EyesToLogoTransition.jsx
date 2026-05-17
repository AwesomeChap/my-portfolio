import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/Eyes.scss";
import Vivus from "vivus";
import KUTE from "kute.js";
import LogoSvgOutline from "./LogoSvgOutline";
import EyesSvg from "./EyesSvg";
import DragonBall from "./DragonBall";
import EyesAnimationProgress from "./EyesAnimationProgress";
import {
  canUseEyesPixelTransition,
  isEyesMobileSlideOverlay,
  runEyesPixelCover,
  runEyesPixelReveal,
} from "./eyesPixelTransition";

const MORPH_DELAY = 4700;
const DURATION = 1000;
const MORPH_INDEX = 75;
const COUNTDOWN_DURATION = 8000;
const COUNTDOWN_DURATION_REDUCED = 2000;
const EYES_OVERLAY_MS = 420;
/** Aligned with NavMobile #menu-wrapper close-menu (0.4s) + fadeOut-menu-item (0.3s + 0.1s). */
const EYES_MOBILE_CONTENT_HIDE_MS = 400;
/** Aligned with NavMobile open-menu / close-menu transform duration. */
const EYES_MOBILE_SLIDE_MS = 300;
const EYES_SEQUENCE_PAUSE_MS = 280;
const EYES_SEQUENCE_START_MS = EYES_OVERLAY_MS + EYES_SEQUENCE_PAUSE_MS;
const EYES_SEQUENCE_START_MS_REDUCED = 280;

const MORPH_PAIRS = [
  ["#left-eye-brow-copy", "#j1"],
  ["#left-eye-open-copy", "#j2"],
  ["#left-eye-open-clone-copy", "#j3"],
  ["#right-eye-brow-copy", "#k1"],
  ["#right-eye-open-copy", "#k2"],
  ["#right-eye-open-clone-copy", "#k3"],
];

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function waitMs(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** Wait after overlay shell is up (and pixel reveal done) before showing eyes UI. */
function enterSequenceDelayMs(usePixel) {
  if (prefersReducedMotion()) {
    return EYES_SEQUENCE_START_MS_REDUCED;
  }
  if (usePixel) {
    return EYES_SEQUENCE_PAUSE_MS;
  }
  return EYES_SEQUENCE_START_MS;
}

/** Delay before Vivus / morph / countdown once eyes UI is visible (enter delay already applied). */
function playbackSequenceDelayMs() {
  return 0;
}

function clearTimers(timers) {
  timers.forEach((id) => window.clearTimeout(id));
  timers.length = 0;
}

function stopTweens(tweens) {
  tweens.forEach((tween) => {
    try {
      tween.stop?.();
    } catch {
      /* tween may already be complete */
    }
  });
  tweens.length = 0;
}

function destroyVivus(instance) {
  if (!instance) return;
  try {
    instance.stop?.();
  } catch {
    /* empty */
  }
  try {
    instance.reset?.();
  } catch {
    /* empty */
  }
  try {
    instance.destroy?.();
  } catch {
    /* empty */
  }
}

export default ({ trackClickEvent }) => {
  const [show, setShow] = useState(false);
  const [sequenceReady, setSequenceReady] = useState(false);
  const [sequenceArmed, setSequenceArmed] = useState(false);
  const [sketchStarted, setSketchStarted] = useState(false);
  const [contentHidden, setContentHidden] = useState(false);
  const [exiting, setExiting] = useState(false);
  const sessionRef = useRef(0);
  const containerRef = useRef(null);
  const [dragonHidden, setDragonHidden] = useState(false);
  const [dragonEnter, setDragonEnter] = useState(true);
  const vivusRef = useRef(null);
  const timersRef = useRef([]);
  const exitTimerRef = useRef(null);
  const tweensRef = useRef([]);
  const closeAnimationRef = useRef(() => {});

  const cleanupPlayback = useCallback(() => {
    clearTimers(timersRef.current);
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    stopTweens(tweensRef.current);
    destroyVivus(vivusRef.current);
    vivusRef.current = null;
  }, []);

  const releaseUiLock = useCallback(() => {
    document.body.classList.remove("eyes-active");
  }, []);

  const finishClose = useCallback(() => {
    clearTimers(timersRef.current);
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    stopTweens(tweensRef.current);
    destroyVivus(vivusRef.current);
    vivusRef.current = null;
    releaseUiLock();
    setExiting(false);
    setContentHidden(false);
    setSequenceArmed(false);
    setSketchStarted(false);
    setSequenceReady(false);
    setShow(false);
    containerRef.current?.classList.remove("eyes-container--sketching");
  }, [releaseUiLock]);

  const closeWithPixelTransition = useCallback(async () => {
    exitTimerRef.current = -1;
    try {
      await runEyesPixelCover();
      finishClose();
      await runEyesPixelReveal();
    } finally {
      exitTimerRef.current = null;
    }
  }, [finishClose]);

  const closeAnimation = useCallback(
    async (options = {}) => {
      const { immediate = false } = options;

      if (exitTimerRef.current !== null) return;

      clearTimers(timersRef.current);
      stopTweens(tweensRef.current);
      destroyVivus(vivusRef.current);
      vivusRef.current = null;
      releaseUiLock();

      if (canUseEyesPixelTransition()) {
        setExiting(true);
        await closeWithPixelTransition();
        return;
      }

      if (isEyesMobileSlideOverlay()) {
        exitTimerRef.current = -1;
        setSequenceArmed(false);
        setSketchStarted(false);
        containerRef.current?.classList.remove("eyes-container--sketching");
        setContentHidden(true);

        const contentMs = immediate ? 0 : EYES_MOBILE_CONTENT_HIDE_MS;
        const slideMs = immediate ? 0 : EYES_MOBILE_SLIDE_MS;
        await waitMs(contentMs);

        if (slideMs === 0) {
          finishClose();
          return;
        }

        setExiting(true);
        exitTimerRef.current = window.setTimeout(() => {
          finishClose();
        }, slideMs);
        return;
      }

      setExiting(true);

      if (immediate) {
        finishClose();
        return;
      }

      exitTimerRef.current = window.setTimeout(finishClose, playbackSequenceDelayMs());
    },
    [finishClose, releaseUiLock, closeWithPixelTransition]
  );

  closeAnimationRef.current = closeAnimation;

  const openAnimation = useCallback(async () => {
    cleanupPlayback();
    setExiting(false);
    setContentHidden(false);
    setSequenceArmed(false);
    setSketchStarted(false);
    setSequenceReady(false);
    containerRef.current?.classList.remove("eyes-container--sketching");
    sessionRef.current += 1;
    setDragonHidden(true);
    setDragonEnter(false);
    trackClickEvent?.("Button", "View dragon ball animation");

    const usePixel = canUseEyesPixelTransition();

    if (usePixel) {
      await runEyesPixelCover();
    }

    setShow(true);

    if (usePixel) {
      await runEyesPixelReveal();
    }

    await waitMs(enterSequenceDelayMs(usePixel));
    setSequenceReady(true);
  }, [trackClickEvent, cleanupPlayback]);

  useEffect(() => {
    if (!show) {
      releaseUiLock();
      return undefined;
    }

    document.body.classList.add("eyes-active");
    return () => {
      releaseUiLock();
    };
  }, [show, releaseUiLock]);

  useEffect(() => {
    if (show) {
      setDragonHidden(true);
      setDragonEnter(false);
      return undefined;
    }

    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        setDragonHidden(false);
        setDragonEnter(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [show]);

  useEffect(() => {
    if (!show) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeAnimation({ immediate: true });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [show, closeAnimation]);

  useEffect(() => {
    if (!show || !sequenceReady) return undefined;

    let cancelled = false;
    const sequenceDelay = playbackSequenceDelayMs();

    const armTimer = window.setTimeout(() => {
      if (!cancelled) setSequenceArmed(true);
    }, sequenceDelay);
    timersRef.current.push(armTimer);

    const morphTimer = window.setTimeout(() => {
      if (cancelled) return;
      MORPH_PAIRS.forEach(([from, to]) => {
        if (!document.querySelector(from)) return;
        const tween = KUTE.fromTo(
          from,
          { path: from },
          { path: to },
          {
            easing: "easingQuinticInOut",
            duration: DURATION,
            morphIndex: MORPH_INDEX,
          }
        );
        tweensRef.current.push(tween);
        tween.start();
      });
    }, MORPH_DELAY + sequenceDelay);
    timersRef.current.push(morphTimer);

    const countdownMs = prefersReducedMotion()
      ? COUNTDOWN_DURATION_REDUCED
      : COUNTDOWN_DURATION;
    const closeTimer = window.setTimeout(
      () => closeAnimationRef.current(),
      sequenceDelay + countdownMs
    );
    timersRef.current.push(closeTimer);

    return () => {
      cancelled = true;
      setSequenceArmed(false);
      setSketchStarted(false);
      containerRef.current?.classList.remove("eyes-container--sketching");
      clearTimers(timersRef.current);
      stopTweens(tweensRef.current);
    };
  }, [show, sequenceReady]);

  useEffect(() => {
    if (!show || !sequenceReady || !sequenceArmed) return undefined;

    let cancelled = false;
    let frame2 = 0;

    const frame1 = window.requestAnimationFrame(() => {
      frame2 = window.requestAnimationFrame(() => {
        if (cancelled || !document.getElementById("my-svg")) return;

        vivusRef.current = new Vivus("my-svg", {
          type: "sync",
          duration: prefersReducedMotion() ? 20 : 50,
          start: "manual",
          animTimingFunction: Vivus.EASE,
        });
        vivusRef.current.play();

        containerRef.current?.classList.add("eyes-container--sketching");
        setSketchStarted(true);
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame1);
      if (frame2) window.cancelAnimationFrame(frame2);
      setSketchStarted(false);
      containerRef.current?.classList.remove("eyes-container--sketching");
      destroyVivus(vivusRef.current);
      vivusRef.current = null;
    };
  }, [show, sequenceReady, sequenceArmed]);

  const countdownMs = prefersReducedMotion()
    ? COUNTDOWN_DURATION_REDUCED
    : COUNTDOWN_DURATION;
  const sequenceDelay = playbackSequenceDelayMs();
  const eyesPixelTransition = canUseEyesPixelTransition();
  const showStage = sequenceReady;
  const sessionKey = sessionRef.current;

  return (
    <div className="eyes-wrapper">
      <DragonBall
        onClick={openAnimation}
        hidden={dragonHidden}
        enter={dragonEnter}
      />
      {show && (
        <div
          ref={containerRef}
          className={`eyes-container${prefersReducedMotion() ? " eyes-container--reduced" : ""}${eyesPixelTransition ? " eyes-container--pixel" : ""}${sequenceReady ? " eyes-container--ready" : ""}${sequenceArmed ? " eyes-container--armed" : ""}${sketchStarted ? " eyes-container--sketching" : ""}${contentHidden ? " eyes-container--content-hidden" : ""}${show && eyesPixelTransition && !sequenceReady ? " eyes-container--arming" : ""}${exiting && !eyesPixelTransition ? " eyes-container--exiting" : ""}`}
          style={sketchStarted ? { "--eyes-seq-delay": "0ms" } : undefined}
        >
          {showStage && (
            <>
          <div className="eyes-top-chrome">
            <div className="eyes-close-controls">
            <button
              type="button"
              onClick={() => closeAnimation({ immediate: true })}
              className="hide-eyes"
              aria-label="Close animation"
            >
              <span className="hide-eyes__cross" aria-hidden="true">
                <span className="line line1" />
                <span className="line line2" />
                <span className="line line3" />
              </span>
            </button>
            </div>
            <EyesAnimationProgress
              active={sequenceReady}
              sequenceDelayMs={sequenceDelay}
              fillDurationMs={countdownMs}
              forceFull={exiting}
              className="eyes-progress--chrome"
            />
          </div>
          <div className="eyes-stage" key={sessionKey}>
            <LogoSvgOutline />
            <EyesSvg />
          </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
