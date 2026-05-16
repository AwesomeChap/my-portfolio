import React, { useRef, useEffect } from 'react';
import { createDistortedPixelsSketch, heroLayoutForWidth } from './distortedPixelsSketch';

/**
 * Desktop home: full-viewport transparent WebGL over the liquid gradient — intro
 * title with mosaic reveal (see distortedPixelsSketch.js).
 */
export default function DistortedPixelsHero() {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;

    let sketch;
    let cancelled = false;

    const run = () => {
      if (cancelled) return;
      sketch = createDistortedPixelsSketch(el, {
        layoutForWidth: heroLayoutForWidth,
        mosaicMax: 112,
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
  }, []);

  return <div className="distorted-pixels-hero" ref={rootRef} aria-hidden="true" />;
}
