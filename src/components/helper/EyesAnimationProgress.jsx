import React, { useEffect, useState } from "react";

const DESKTOP_PIXEL_COUNT = 6;
const MOBILE_PIXEL_COUNT = 14;
const DESKTOP_MQ = "(min-width: 768px)";

function useProgressPixelCount() {
  const [pixelCount, setPixelCount] = useState(DESKTOP_PIXEL_COUNT);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const sync = () => {
      setPixelCount(mq.matches ? DESKTOP_PIXEL_COUNT : MOBILE_PIXEL_COUNT);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return pixelCount;
}

export default function EyesAnimationProgress({
  active = false,
  sequenceDelayMs = 700,
  fillDurationMs = 8000,
  forceFull = false,
  className = "",
}) {
  const pixelCount = useProgressPixelCount();
  const [filledCount, setFilledCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setFilledCount(0);
      return undefined;
    }

    if (forceFull) {
      setFilledCount(pixelCount);
      return undefined;
    }

    const startedAt = performance.now();
    let rafId = 0;

    const tick = (now) => {
      const elapsed = now - startedAt;

      if (elapsed < sequenceDelayMs) {
        setFilledCount(0);
      } else {
        const fillElapsed = elapsed - sequenceDelayMs;
        const progress = Math.min(1, fillElapsed / fillDurationMs);
        setFilledCount(
          progress >= 1
            ? pixelCount
            : Math.min(pixelCount, Math.ceil(progress * pixelCount))
        );
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [active, sequenceDelayMs, fillDurationMs, forceFull, pixelCount]);

  return (
    <div
      className={`eyes-progress ${className}`.trim()}
      role="progressbar"
      aria-label="Animation progress"
      aria-valuemin={0}
      aria-valuemax={pixelCount}
      aria-valuenow={filledCount}
    >
      {Array.from({ length: pixelCount }, (_, index) => (
        <span
          key={index}
          className={`eyes-progress__pixel${index < filledCount ? " is-filled" : ""}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
