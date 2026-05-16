import React, { useRef, useEffect, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import gsap from 'gsap';
import {
  isPageTransitionActiveViewport,
  prefersReducedMotion,
} from './pageTransition';
import '../../styles/pixel-transition-overlay.scss';

const MAX_CELLS = 1180;

function buildCells(width, height) {
  const area = width * height;
  let cellSize = Math.sqrt(area / MAX_CELLS);
  cellSize = Math.max(12, Math.min(26, cellSize));
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const cw = width / cols;
  const ch = height / rows;
  const cells = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const x = c * cw;
      const y = r * ch;
      cells.push({
        x,
        y,
        // Extend edge cells to viewport bounds; slight bleed avoids hairline gaps.
        w: c === cols - 1 ? width - x + 0.5 : cw + 0.5,
        h: r === rows - 1 ? height - y + 0.5 : ch + 0.5,
      });
    }
  }
  return cells;
}

function PixelTransitionOverlay({ location }) {
  const canvasRef = useRef(null);
  const cellsRef = useRef([]);
  const fillsRef = useRef([]);
  const dprRef = useRef(1);
  const timelineRef = useRef(null);
  const pathnameRef = useRef(location.pathname);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const cells = cellsRef.current;
    const fills = fillsRef.current;
    if (!canvas || !cells.length || !fills.length) return;

    const ctx = canvas.getContext('2d');
    const dpr = dprRef.current;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let maxV = 0;
    for (let i = 0; i < cells.length; i += 1) {
      const t = fills[i].v;
      if (t > maxV) maxV = t;
      if (t < 0.004) continue;

      const { x, y, w: cw, h: ch } = cells[i];
      const a = Math.min(1, Math.max(0, t));
      ctx.fillStyle = `rgba(8, 8, 10, ${0.97 * a})`;
      ctx.fillRect(x, y, cw, ch);
    }

    canvas.style.pointerEvents = maxV > 0.04 ? 'auto' : 'none';
  }, []);

  const killTimeline = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
  }, []);

  const resetGrid = useCallback(() => {
    resizeCanvas();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cells = buildCells(w, h);
    cellsRef.current = cells;
    fillsRef.current = cells.map(() => ({ v: 0 }));
    draw();
  }, [draw, resizeCanvas]);

  const runReveal = useCallback(() => {
    const fills = fillsRef.current;
    if (!fills.length || !fills.some((f) => f.v > 0.02)) {
      document.body.classList.remove('page-transitioning', 'page-transition--pixel');
      return;
    }

    killTimeline();
    timelineRef.current = gsap.to(fills, {
      v: 0,
      duration: 0.14,
      ease: 'power3.out',
      stagger: {
        amount: 0.3,
        from: 'random',
      },
      onUpdate: draw,
      onComplete: () => {
        draw();
        document.body.classList.remove('page-transitioning', 'page-transition--pixel');
      },
    });
  }, [draw, killTimeline]);

  const runCover = useCallback(() => {
    if (!isPageTransitionActiveViewport() || prefersReducedMotion()) {
      return;
    }

    killTimeline();
    resetGrid();
    const fills = fillsRef.current;

    timelineRef.current = gsap.to(fills, {
      v: 1,
      duration: 0.15,
      ease: 'power2.inOut',
      stagger: {
        amount: 0.32,
        from: 'random',
      },
      onUpdate: draw,
      onComplete: draw,
    });
  }, [draw, killTimeline, resetGrid]);

  const onNavStart = useCallback(() => {
    runCover();
  }, [runCover]);

  useEffect(() => {
    window.addEventListener('portfolio-pixel-nav-start', onNavStart);
    return () => window.removeEventListener('portfolio-pixel-nav-start', onNavStart);
  }, [onNavStart]);

  useEffect(() => {
    const prev = pathnameRef.current;
    if (prev === location.pathname) return;
    pathnameRef.current = location.pathname;

    if (!fillsRef.current.length) return;
    if (!fillsRef.current.some((f) => f.v > 0.02)) return;

    runReveal();
  }, [location.pathname, runReveal]);

  useEffect(() => {
    const onResize = () => {
      if (!fillsRef.current.some((f) => f.v > 0.02)) {
        resizeCanvas();
        return;
      }
      killTimeline();
      resetGrid();
      document.body.classList.remove('page-transitioning', 'page-transition--pixel');
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [killTimeline, resetGrid, resizeCanvas]);

  useEffect(
    () => () => {
      killTimeline();
      document.body.classList.remove('page-transitioning', 'page-transition--pixel');
    },
    [killTimeline]
  );

  return (
    <canvas
      ref={canvasRef}
      className="pixel-transition-canvas"
      aria-hidden="true"
    />
  );
}

export default withRouter(PixelTransitionOverlay);
