import React, { useRef, useEffect } from 'react';
import {
  createDistortedPixelsSketch,
  heroLayoutForWidth,
  notFoundLayoutForWidth,
} from './distortedPixelsSketch';
import '../../styles/distorted-pixels-text.scss';

const LAYOUTS = {
  hero: heroLayoutForWidth,
  notFound: notFoundLayoutForWidth,
};

/**
 * Contained distorted pixel text (404 page). Desktop / tablet landscape uses WebGL;
 * pass `fallback` for mobile CSS intro animation.
 */
export default function DistortedPixelsText({
  variant = 'notFound',
  className = '',
  mosaicMax = 112,
  revealDelayMs = 280,
  revealDurationMs = 1100,
}) {
  const rootRef = useRef(null);
  const layoutForWidth = LAYOUTS[variant] || notFoundLayoutForWidth;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;

    let sketch;
    let cancelled = false;

    const run = () => {
      if (cancelled) return;
      sketch = createDistortedPixelsSketch(el, {
        layoutForWidth,
        mosaicMax,
        revealDelayMs,
        revealDurationMs,
      });
    };

    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(run).catch(run);
    } else {
      run();
    }

    return () => {
      cancelled = true;
      if (sketch) sketch.destroy();
    };
  }, [layoutForWidth, mosaicMax, revealDelayMs, revealDurationMs]);

  return (
    <div
      className={`distorted-pixels-text ${className}`.trim()}
      ref={rootRef}
      aria-hidden="true"
    />
  );
}
