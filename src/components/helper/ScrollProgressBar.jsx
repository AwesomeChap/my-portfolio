import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/ScrollProgressBar.scss';
import { emitCursorMove } from './cursorSync';
import {
  getScrollProgress,
  resolveScrollContainer,
  scrollToProgress,
} from './scrollContainer';

const MIN_SCROLL_RANGE = 24;
const SCROLL_PIXEL_COUNT = 44;
const SCROLL_PIXEL_GAP = 5;
const DRAG_THRESHOLD_PX = 4;

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden
  );
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isTrackHovered, setIsTrackHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pixelSizes, setPixelSizes] = useState(() =>
    Array.from({ length: SCROLL_PIXEL_COUNT }, () => 11)
  );
  const [portalReady, setPortalReady] = useState(false);
  const trackRef = useRef(null);
  const rafLoopRef = useRef(null);
  const scrollEndTimerRef = useRef(null);
  const isTickingRef = useRef(false);
  const isInteractingRef = useRef(false);
  const pointerStartYRef = useRef(0);
  const pointerStartIndexRef = useRef(null);
  const pointerOnThumbRef = useRef(false);
  const didDragRef = useRef(false);
  const activePointerIdRef = useRef(null);

  const filledCount = Math.min(
    SCROLL_PIXEL_COUNT,
    Math.ceil(progress * SCROLL_PIXEL_COUNT)
  );
  const thumbIndex = filledCount > 0 ? filledCount - 1 : -1;
  const hasThumb = thumbIndex >= 0;

  const progressFromClientY = useCallback((clientY) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    if (rect.height < 1) return 0;
    const y = clientY - rect.top;
    return Math.min(1, Math.max(0, y / rect.height));
  }, []);

  const progressForPixelIndex = useCallback(
    (index) => (index + 0.5) / SCROLL_PIXEL_COUNT,
    []
  );

  const scrollToPixelIndex = useCallback(
    (index) => {
      const next = progressForPixelIndex(index);
      scrollToProgress(next, { behavior: 'smooth' });
    },
    [progressForPixelIndex]
  );

  const startTicking = useCallback(() => {
    if (isTickingRef.current) return;
    isTickingRef.current = true;

    const tick = () => {
      if (!isTickingRef.current) return;
      const el = resolveScrollContainer();
      const max = Math.max(0, el.scrollHeight - el.clientHeight);
      const nextVisible = max >= MIN_SCROLL_RANGE;
      setVisible((prev) => (prev === nextVisible ? prev : nextVisible));
      if (!isInteractingRef.current) {
        const nextProgress = nextVisible ? getScrollProgress() : 0;
        setProgress(nextProgress);
      }
      rafLoopRef.current = requestAnimationFrame(tick);
    };

    rafLoopRef.current = requestAnimationFrame(tick);
  }, []);

  const stopTicking = useCallback(() => {
    isTickingRef.current = false;
    if (rafLoopRef.current) {
      cancelAnimationFrame(rafLoopRef.current);
      rafLoopRef.current = null;
    }
    const el = resolveScrollContainer();
    const max = Math.max(0, el.scrollHeight - el.clientHeight);
    const nextVisible = max >= MIN_SCROLL_RANGE;
    const nextProgress = nextVisible ? getScrollProgress() : 0;
    setVisible((prev) => (prev === nextVisible ? prev : nextVisible));
    setProgress(nextProgress);
  }, []);

  useEffect(() => {
    let mounted = true;

    const apply = () => {
      if (!mounted || isInteractingRef.current) return;
      const el = resolveScrollContainer();
      const max = Math.max(0, el.scrollHeight - el.clientHeight);
      const nextVisible = max >= MIN_SCROLL_RANGE;
      const nextProgress = nextVisible ? getScrollProgress() : 0;
      setVisible((prev) => (prev === nextVisible ? prev : nextVisible));
      setProgress(nextProgress);
    };

    const onScrollActivity = () => {
      if (isInteractingRef.current) return;
      startTicking();
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
      scrollEndTimerRef.current = window.setTimeout(stopTicking, 120);
    };

    apply();

    const listenerOpts = { passive: true, capture: true };
    const scrollTargets = [
      window,
      document,
      document.documentElement,
      document.body,
      document.getElementById('root'),
    ].filter(Boolean);

    scrollTargets.forEach((target) => {
      target.addEventListener('scroll', onScrollActivity, listenerOpts);
    });
    window.addEventListener('wheel', onScrollActivity, listenerOpts);
    window.addEventListener('touchmove', onScrollActivity, listenerOpts);
    window.addEventListener('resize', onScrollActivity, { passive: true });

    return () => {
      mounted = false;
      scrollTargets.forEach((target) => {
        target.removeEventListener('scroll', onScrollActivity, listenerOpts);
      });
      window.removeEventListener('wheel', onScrollActivity, listenerOpts);
      window.removeEventListener('touchmove', onScrollActivity, listenerOpts);
      window.removeEventListener('resize', onScrollActivity);
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
      stopTicking();
    };
  }, [startTicking, stopTicking]);

  useEffect(() => {
    const onVisibilityChange = () => {
      const tabVisible = !document.hidden;
      setIsTabVisible(tabVisible);
      document.documentElement.classList.toggle('tab-hidden', !tabVisible);
      if (!tabVisible) {
        setIsTrackHovered(false);
        setHoveredIndex(null);
        stopTicking();
      }
    };

    onVisibilityChange();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.documentElement.classList.remove('tab-hidden');
    };
  }, [stopTicking]);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const measure = () => {
      const height = track.clientHeight;
      if (height < 1) return;
      const gapTotal = (SCROLL_PIXEL_COUNT - 1) * SCROLL_PIXEL_GAP;
      const available = Math.max(0, height - gapTotal);
      const base = Math.floor(available / SCROLL_PIXEL_COUNT);
      let remainder = available - base * SCROLL_PIXEL_COUNT;
      const sizes = Array.from({ length: SCROLL_PIXEL_COUNT }, () => {
        const extra = remainder > 0 ? 1 : 0;
        if (remainder > 0) remainder -= 1;
        return Math.max(4, base + extra);
      });
      setPixelSizes(sizes);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [visible]);

  const endPointerInteraction = useCallback(() => {
    activePointerIdRef.current = null;
    didDragRef.current = false;
    pointerStartIndexRef.current = null;
    pointerOnThumbRef.current = false;
    isInteractingRef.current = false;
    setIsDragging(false);
    document.body.classList.remove('scroll-progress-dragging');
    startTicking();
    scrollEndTimerRef.current = window.setTimeout(stopTicking, 120);
  }, [startTicking, stopTicking]);

  useEffect(() => {
    if (isTabVisible || !isInteractingRef.current) return;
    endPointerInteraction();
  }, [isTabVisible, endPointerInteraction]);

  const beginDrag = useCallback(() => {
    didDragRef.current = true;
    isInteractingRef.current = true;
    setIsDragging(true);
    document.body.classList.add('scroll-progress-dragging');
  }, []);

  const resolveTrackTarget = useCallback((eventTarget) => {
    const thumbSlot = eventTarget.closest('.scroll-progress__thumb-slot');
    if (thumbSlot) {
      return {
        index: Number(thumbSlot.dataset.scrollIndex),
        isThumb: true,
      };
    }
    const thumb = eventTarget.closest('.scroll-progress__thumb');
    if (thumb) {
      const slot = thumb.closest('.scroll-progress__thumb-slot');
      return {
        index: Number(slot?.dataset?.scrollIndex),
        isThumb: true,
      };
    }
    const pixel = eventTarget.closest('.scroll-progress__pixel');
    if (pixel) {
      return {
        index: Number(pixel.dataset.scrollIndex),
        isThumb: false,
      };
    }
    return null;
  }, []);

  const onTrackPointerDown = useCallback(
    (event) => {
      if (event.button !== 0) return;
      const target = resolveTrackTarget(event.target);
      if (!target || Number.isNaN(target.index)) return;

      event.preventDefault();
      activePointerIdRef.current = event.pointerId;
      pointerStartYRef.current = event.clientY;
      pointerStartIndexRef.current = target.index;
      pointerOnThumbRef.current = target.isThumb;
      didDragRef.current = false;
      isInteractingRef.current = false;
      setIsDragging(false);
      trackRef.current?.setPointerCapture(event.pointerId);
      startTicking();
    },
    [resolveTrackTarget, startTicking]
  );

  const onTrackPointerMove = useCallback(
    (event) => {
      if (activePointerIdRef.current !== event.pointerId) return;

      const moved = Math.abs(event.clientY - pointerStartYRef.current);
      const canDrag = pointerOnThumbRef.current && hasThumb;

      if (!didDragRef.current && moved >= DRAG_THRESHOLD_PX && canDrag) {
        beginDrag();
        emitCursorMove(event.clientX, event.clientY, { instant: true });
      }

      if (!didDragRef.current) return;

      emitCursorMove(event.clientX, event.clientY, { instant: true });
      const next = progressFromClientY(event.clientY);
      scrollToProgress(next, { behavior: 'auto' });
      setProgress(next);
    },
    [beginDrag, hasThumb, progressFromClientY]
  );

  const onTrackPointerUp = useCallback(
    (event) => {
      if (activePointerIdRef.current !== event.pointerId) return;

      trackRef.current?.releasePointerCapture(event.pointerId);

      if (
        !didDragRef.current
        && pointerStartIndexRef.current !== null
        && !pointerOnThumbRef.current
      ) {
        scrollToPixelIndex(pointerStartIndexRef.current);
      }

      endPointerInteraction();
    },
    [endPointerInteraction, scrollToPixelIndex]
  );

  const onTrackPointerCancel = useCallback(
    (event) => {
      if (activePointerIdRef.current !== event.pointerId) return;
      trackRef.current?.releasePointerCapture(event.pointerId);
      endPointerInteraction();
    },
    [endPointerInteraction]
  );

  const onPixelKeyDown = useCallback(
    (event, index) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      scrollToPixelIndex(index);
    },
    [scrollToPixelIndex]
  );

  const isShown = visible && isTabVisible;
  const isBarInteractive = isShown && (isTrackHovered || isDragging);

  const renderThumb = (index) => {
    const slotSize = pixelSizes[index];
    const caretHalf = Math.max(7, Math.round(slotSize * 0.52));
    const caretHeight = Math.max(8, Math.round(slotSize * 0.66));
    const isHovered = hoveredIndex === index;

    return (
      <div
        key={`thumb-${index}`}
        className="scroll-progress__thumb-slot"
        data-scroll-index={index}
        style={{ width: slotSize, height: slotSize }}
      >
        <span
          className="scroll-progress__pixel is-filled scroll-progress__thumb-slot-pixel"
          style={{ width: slotSize, height: slotSize }}
          data-scroll-index={index}
          aria-hidden="true"
        />
        <div
          className={`scroll-progress__thumb${
            isDragging ? ' is-dragging' : ''
          }${isHovered ? ' is-hovered' : ''}`}
          role={isBarInteractive ? 'slider' : undefined}
          tabIndex={isBarInteractive ? 0 : -1}
          aria-label="Scroll position"
          aria-hidden={!isBarInteractive}
          aria-valuemin={0}
          aria-valuemax={SCROLL_PIXEL_COUNT}
          aria-valuenow={index + 1}
          aria-orientation="vertical"
          style={{
            '--caret-half': `${caretHalf}px`,
            '--caret-height': `${caretHeight}px`,
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => {
            setHoveredIndex((prev) => (prev === index ? null : prev));
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              scrollToPixelIndex(Math.max(0, index - 1));
            } else if (event.key === 'ArrowDown') {
              event.preventDefault();
              scrollToPixelIndex(Math.min(SCROLL_PIXEL_COUNT - 1, index + 1));
            } else if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
            }
          }}
        >
          <span className="scroll-progress__thumb-blur" aria-hidden="true" />
          <span className="scroll-progress__thumb-inner">
            <span
              className="scroll-progress__thumb-caret scroll-progress__thumb-caret--up"
              aria-hidden="true"
            />
            <span
              className="scroll-progress__thumb-caret scroll-progress__thumb-caret--down"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    );
  };

  const bar = (
    <div
      className={`scroll-progress${isShown ? ' scroll-progress--visible' : ''}${
        isTrackHovered ? ' scroll-progress--track-hovered' : ''
      }${isDragging ? ' scroll-progress--dragging' : ''}`}
      aria-hidden={!isShown}
      onMouseEnter={() => setIsTrackHovered(true)}
      onMouseLeave={() => setIsTrackHovered(false)}
    >
      <div
        ref={trackRef}
        className="scroll-progress__track"
        role={isBarInteractive ? 'scrollbar' : undefined}
        aria-label="Page scroll"
        aria-hidden={!isBarInteractive}
        inert={!isBarInteractive ? true : undefined}
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={SCROLL_PIXEL_COUNT}
        aria-valuenow={filledCount}
        onPointerDown={onTrackPointerDown}
        onPointerMove={onTrackPointerMove}
        onPointerUp={onTrackPointerUp}
        onPointerCancel={onTrackPointerCancel}
      >
        {Array.from({ length: SCROLL_PIXEL_COUNT }, (_, index) => {
          if (hasThumb && index === thumbIndex) {
            return renderThumb(index);
          }

          const isFilled = index < thumbIndex;
          const isHovered = hoveredIndex === index;

          return (
            <span
              key={index}
              data-scroll-index={index}
              role={isBarInteractive ? 'button' : undefined}
              tabIndex={isBarInteractive ? 0 : -1}
              aria-hidden={!isBarInteractive}
              className={`scroll-progress__pixel${
                isFilled ? ' is-filled' : ''
              }${isHovered ? ' is-hovered' : ''}`}
              style={{
                width: pixelSizes[index],
                height: pixelSizes[index],
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => {
                setHoveredIndex((prev) => (prev === index ? null : prev));
              }}
              onKeyDown={(event) => onPixelKeyDown(event, index)}
            />
          );
        })}
      </div>
      <div className="scroll-progress__bottom-spacer" aria-hidden="true" />
    </div>
  );

  if (!portalReady) return null;

  return createPortal(bar, document.body);
}
