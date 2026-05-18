import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/Eyes.scss";
import Vivus from "vivus";
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
import {
  createEyesSequenceTimeline,
  killEyesSequenceTimeline,
  disposeEyesSequence,
} from "./eyesSequenceTimeline";

const COUNTDOWN_MS = 8000;
const COUNTDOWN_MS_REDUCED = 2000;
const EYES_OVERLAY_MS = 420;
/** Match NavMobile `close-menu` delay before panel transform (0.4s). */
const EYES_MOBILE_CONTENT_HIDE_MS = 400;
const EYES_MOBILE_CONTENT_HIDE_MS_REDUCED = 200;
const EYES_MOBILE_SLIDE_MS = 300;
const EYES_SEQUENCE_PAUSE_MS = 280;
const EYES_SEQUENCE_START_MS = EYES_OVERLAY_MS + EYES_SEQUENCE_PAUSE_MS;
const EYES_SEQUENCE_START_MS_REDUCED = 280;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function waitMs(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function enterSequenceDelayMs(usePixel) {
  if (prefersReducedMotion()) return EYES_SEQUENCE_START_MS_REDUCED;
  if (usePixel) return EYES_SEQUENCE_PAUSE_MS;
  return EYES_SEQUENCE_START_MS;
}

function clearTimers(ids) {
  ids.forEach((id) => window.clearTimeout(id));
  ids.length = 0;
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

function resetSketchMode(container) {
  container?.classList.remove("eyes-container--sketching", "eyes-container--unified-timeline");
  container?.style.removeProperty("--eyes-seq-delay");
}

export default function EyesToLogoTransition({ trackClickEvent }) {
  const [show, setShow] = useState(false);
  const [sequenceReady, setSequenceReady] = useState(false);
  const [sequenceArmed, setSequenceArmed] = useState(false);
  const [sketchStarted, setSketchStarted] = useState(false);
  const [contentHidden, setContentHidden] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [dragonHidden, setDragonHidden] = useState(false);
  const [dragonEnter, setDragonEnter] = useState(true);

  const sessionRef = useRef(0);
  const containerRef = useRef(null);
  const vivusRef = useRef(null);
  const timelineRef = useRef(null);
  const timersRef = useRef([]);
  const exitTimerRef = useRef(null);
  const closeRef = useRef(() => {});

  const stopPlayback = useCallback(() => {
    clearTimers(timersRef.current);
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    killEyesSequenceTimeline(timelineRef.current, containerRef.current);
    timelineRef.current = null;
    destroyVivus(vivusRef.current);
    vivusRef.current = null;
    disposeEyesSequence(containerRef.current);
    resetSketchMode(containerRef.current);
  }, []);

  /** Pause timeline/Vivus but keep sketch + logo visible for mobile slide-out. */
  const pausePlaybackForExit = useCallback(() => {
    clearTimers(timersRef.current);
    killEyesSequenceTimeline(timelineRef.current, containerRef.current);
    timelineRef.current = null;
    destroyVivus(vivusRef.current);
    vivusRef.current = null;
  }, []);

  const releaseUiLock = useCallback(() => {
    document.body.classList.remove("eyes-active");
  }, []);

  const finishClose = useCallback(() => {
    stopPlayback();
    releaseUiLock();
    setExiting(false);
    setContentHidden(false);
    setSequenceArmed(false);
    setSketchStarted(false);
    setSequenceReady(false);
    setShow(false);
  }, [stopPlayback, releaseUiLock]);

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
    async ({ immediate = false } = {}) => {
      if (exitTimerRef.current !== null) return;

      if (canUseEyesPixelTransition()) {
        stopPlayback();
        releaseUiLock();
        setExiting(true);
        await closeWithPixelTransition();
        return;
      }

      if (isEyesMobileSlideOverlay()) {
        exitTimerRef.current = -1;
        pausePlaybackForExit();
        setContentHidden(true);

        const hideMs = immediate
          ? 0
          : prefersReducedMotion()
            ? EYES_MOBILE_CONTENT_HIDE_MS_REDUCED
            : EYES_MOBILE_CONTENT_HIDE_MS;
        const slideMs = immediate ? 0 : EYES_MOBILE_SLIDE_MS;

        if (hideMs === 0 && slideMs === 0) {
          finishClose();
          return;
        }

        await waitMs(hideMs);

        if (slideMs === 0) {
          finishClose();
          return;
        }

        setExiting(true);
        exitTimerRef.current = window.setTimeout(finishClose, slideMs);
        return;
      }

      stopPlayback();
      releaseUiLock();
      setExiting(true);
      if (immediate) {
        finishClose();
        return;
      }

      exitTimerRef.current = window.setTimeout(finishClose, EYES_OVERLAY_MS);
    },
    [
      finishClose,
      releaseUiLock,
      closeWithPixelTransition,
      stopPlayback,
      pausePlaybackForExit,
    ]
  );

  closeRef.current = closeAnimation;

  const openAnimation = useCallback(async () => {
    stopPlayback();
    setExiting(false);
    setContentHidden(false);
    setSequenceArmed(false);
    setSketchStarted(false);
    setSequenceReady(false);
    sessionRef.current += 1;
    setDragonHidden(true);
    setDragonEnter(false);
    trackClickEvent?.("Button", "View dragon ball animation");

    const usePixel = canUseEyesPixelTransition();
    if (usePixel) await runEyesPixelCover();

    setShow(true);
    if (usePixel) await runEyesPixelReveal();

    await waitMs(enterSequenceDelayMs(usePixel));
    setSequenceReady(true);
  }, [trackClickEvent, stopPlayback]);

  useEffect(() => {
    if (!show) {
      releaseUiLock();
      return undefined;
    }
    document.body.classList.add("eyes-active");
    return () => releaseUiLock();
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

    const armTimer = window.setTimeout(() => {
      if (!cancelled) setSequenceArmed(true);
    }, 0);
    timersRef.current.push(armTimer);

    const countdownMs = prefersReducedMotion() ? COUNTDOWN_MS_REDUCED : COUNTDOWN_MS;
    const closeTimer = window.setTimeout(() => closeRef.current(), countdownMs);
    timersRef.current.push(closeTimer);

    return () => {
      cancelled = true;
      setSequenceArmed(false);
      setSketchStarted(false);
      clearTimers(timersRef.current);
      killEyesSequenceTimeline(timelineRef.current, containerRef.current);
      timelineRef.current = null;
      disposeEyesSequence(containerRef.current);
      resetSketchMode(containerRef.current);
    };
  }, [show, sequenceReady]);

  useEffect(() => {
    if (!show || !sequenceReady || !sequenceArmed) return undefined;

    let cancelled = false;
    let frame2 = 0;

    const frame1 = window.requestAnimationFrame(() => {
      frame2 = window.requestAnimationFrame(() => {
        if (cancelled || !document.getElementById("my-svg")) return;

        const container = containerRef.current;
        const reduced = prefersReducedMotion();

        vivusRef.current = new Vivus("my-svg", {
          type: "sync",
          duration: reduced ? 20 : 50,
          start: "manual",
          animTimingFunction: Vivus.EASE,
        });
        vivusRef.current.play();

        container?.classList.add("eyes-container--sketching", "eyes-container--unified-timeline");
        container?.style.setProperty("--eyes-seq-delay", "0ms");

        killEyesSequenceTimeline(timelineRef.current, container);
        timelineRef.current = createEyesSequenceTimeline(container, { reduced });
        if (!reduced) timelineRef.current?.play();

        setSketchStarted(true);
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame1);
      if (frame2) window.cancelAnimationFrame(frame2);
      setSketchStarted(false);
      killEyesSequenceTimeline(timelineRef.current, containerRef.current);
      timelineRef.current = null;
      destroyVivus(vivusRef.current);
      vivusRef.current = null;
      disposeEyesSequence(containerRef.current);
      resetSketchMode(containerRef.current);
    };
  }, [show, sequenceReady, sequenceArmed]);

  const countdownMs = prefersReducedMotion() ? COUNTDOWN_MS_REDUCED : COUNTDOWN_MS;
  const eyesPixelTransition = canUseEyesPixelTransition();
  const sessionKey = sessionRef.current;

  const containerClass = [
    "eyes-container",
    prefersReducedMotion() && "eyes-container--reduced",
    eyesPixelTransition && "eyes-container--pixel",
    sequenceReady && "eyes-container--ready",
    sequenceArmed && "eyes-container--armed",
    sketchStarted && "eyes-container--sketching",
    contentHidden && "eyes-container--content-hidden",
    show && eyesPixelTransition && !sequenceReady && "eyes-container--arming",
    exiting && !eyesPixelTransition && "eyes-container--exiting",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="eyes-wrapper">
      <DragonBall onClick={openAnimation} hidden={dragonHidden} enter={dragonEnter} />
      {show && (
        <div
          ref={containerRef}
          className={containerClass}
          style={sketchStarted ? { "--eyes-seq-delay": "0ms" } : undefined}
        >
          {sequenceReady && (
            <>
              <div className="eyes-top-chrome">
                <div className="eyes-close-controls">
                  <button
                    type="button"
                    onClick={() => closeAnimation()}
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
                  sequenceDelayMs={0}
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
}
