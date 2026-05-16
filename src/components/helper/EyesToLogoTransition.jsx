import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/Eyes.scss";
import Vivus from "vivus";
import KUTE from "kute.js";
import LogoSvgOutline from "./LogoSvgOutline";
import EyesSvg from "./EyesSvg";
import DragonBall from "./DragonBall";

const MORPH_DELAY = 4700;
const DURATION = 1000;
const MORPH_INDEX = 75;
const COUNTDOWN_DURATION = 8000;
const COUNTDOWN_DURATION_REDUCED = 2000;

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
  const vivusRef = useRef(null);
  const timersRef = useRef([]);
  const tweensRef = useRef([]);

  const cleanupPlayback = useCallback(() => {
    clearTimers(timersRef.current);
    stopTweens(tweensRef.current);
    destroyVivus(vivusRef.current);
    vivusRef.current = null;
  }, []);

  const closeAnimation = useCallback(() => {
    clearTimers(timersRef.current);
    cleanupPlayback();
    setShow(false);
  }, [cleanupPlayback]);

  const openAnimation = useCallback(() => {
    cleanupPlayback();
    trackClickEvent?.("Button", "View dragon ball animation");
    setShow(true);
  }, [trackClickEvent, cleanupPlayback]);

  useEffect(() => {
    if (!show) return undefined;

    document.body.classList.add("eyes-active");
    return () => {
      document.body.classList.remove("eyes-active");
    };
  }, [show]);

  useEffect(() => {
    if (!show) return undefined;

    let cancelled = false;

    const rafId = window.requestAnimationFrame(() => {
      if (cancelled || !document.getElementById("my-svg")) return;
      vivusRef.current = new Vivus("my-svg", {
        type: "sync",
        duration: prefersReducedMotion() ? 20 : 50,
        start: "manual",
        animTimingFunction: Vivus.EASE,
      });
      vivusRef.current.play();
    });

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
    }, MORPH_DELAY);
    timersRef.current.push(morphTimer);

    const countdownMs = prefersReducedMotion()
      ? COUNTDOWN_DURATION_REDUCED
      : COUNTDOWN_DURATION;
    const closeTimer = window.setTimeout(closeAnimation, countdownMs + 250);
    timersRef.current.push(closeTimer);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      cleanupPlayback();
    };
  }, [show, cleanupPlayback, closeAnimation]);

  const countdownMs = prefersReducedMotion()
    ? COUNTDOWN_DURATION_REDUCED
    : COUNTDOWN_DURATION;

  return (
    <div className="eyes-wrapper">
      {!show && <DragonBall onClick={openAnimation} />}
      {show && (
        <div
          className={`eyes-container${prefersReducedMotion() ? " eyes-container--reduced" : ""}`}
        >
          <button
            type="button"
            onClick={closeAnimation}
            className="hide-eyes"
            aria-label="Close animation"
          >
            <div className="cross" />
            <svg>
              <circle r="18" cx="20" cy="20" />
            </svg>
            <svg
              className="countdown"
              style={{ "--countdown-duration": `${countdownMs}ms` }}
            >
              <circle r="18" cx="20" cy="20" />
            </svg>
          </button>
          <LogoSvgOutline />
          <EyesSvg />
        </div>
      )}
    </div>
  );
};
