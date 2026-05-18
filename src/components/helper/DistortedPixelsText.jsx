import React, { useRef, useEffect } from 'react';
import {
  createDistortedPixelsSketch,
  notFoundLayoutForWidth,
} from './distortedPixelsSketch';
import '../../styles/distorted-pixels-text.scss';

/**
 * Contained distorted pixel text (desktop 404).
 */
export default function DistortedPixelsText({
  variant = 'notFound',
  className = '',
  mosaicMax = 112,
  revealDelayMs = 280,
  revealDurationMs = 1100,
}) {
  const rootRef = useRef(null);
  const layoutForWidth = notFoundLayoutForWidth;

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
  }, [variant, layoutForWidth, mosaicMax, revealDelayMs, revealDurationMs]);

  return (
    <div
      className={`distorted-pixels-text ${className}`.trim()}
      ref={rootRef}
      aria-hidden="true"
    />
  );
}
