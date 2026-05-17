import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/cursor.scss';
import { subscribeCursorMove } from './cursorSync';

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  '[role="button"]',
  'input',
  'textarea',
  'select',
  'label',
  '[data-cursor="interactive"]',
  '.cursor-pointer',
  '.scroll-progress__thumb',
].join(',');

export default function Cursor() {
  const dotRef = useRef(null);
  const outlineRef = useRef(null);
  const rafRef = useRef(0);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!portalReady) return undefined;

    const dotEl = dotRef.current;
    const outlineEl = outlineRef.current;
    if (!dotEl || !outlineEl) return undefined;

    const state = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      tx: window.innerWidth / 2,
      ty: window.innerHeight / 2,
      visible: false,
      active: false,
    };

    const setVisibility = (visible) => {
      state.visible = visible;
      dotEl.classList.toggle('is-hidden', !visible);
      outlineEl.classList.toggle('is-hidden', !visible);
    };

    const setActive = (active) => {
      state.active = active;
      dotEl.classList.toggle('is-active', active);
      outlineEl.classList.toggle('is-active', active);
    };

    const applyPosition = (x, y, { instant = false } = {}) => {
      state.tx = x;
      state.ty = y;
      dotEl.style.left = `${x}px`;
      dotEl.style.top = `${y}px`;
      if (instant) {
        state.x = x;
        state.y = y;
        outlineEl.style.left = `${x}px`;
        outlineEl.style.top = `${y}px`;
      }
    };

    const onMouseMove = (e) => {
      if (document.body.classList.contains('scroll-progress-dragging')) return;
      applyPosition(e.clientX, e.clientY);
      if (!state.visible) setVisibility(true);
    };

    const onMouseDown = () => setActive(true);
    const onMouseUp = () => {
      const overInteractive = document.querySelector(':hover')?.closest(INTERACTIVE_SELECTOR);
      setActive(Boolean(overInteractive));
    };
    const onMouseOver = (e) => setActive(Boolean(e.target.closest(INTERACTIVE_SELECTOR)));
    const onMouseOut = (e) => {
      const toInteractive = e.relatedTarget?.closest?.(INTERACTIVE_SELECTOR);
      if (!toInteractive) setActive(false);
    };
    const onMouseLeaveDocument = () => setVisibility(false);
    const onMouseEnterDocument = () => setVisibility(true);

    const animate = () => {
      state.x += (state.tx - state.x) * 0.15;
      state.y += (state.ty - state.y) * 0.15;
      outlineEl.style.left = `${state.x}px`;
      outlineEl.style.top = `${state.y}px`;
      rafRef.current = window.requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('mouseleave', onMouseLeaveDocument);
    document.addEventListener('mouseenter', onMouseEnterDocument);

    const onScrollbarDrag = () => {
      setActive(true);
      setVisibility(true);
    };
    const onScrollbarDragEnd = () => {
      const overInteractive = document.querySelector(':hover')?.closest(INTERACTIVE_SELECTOR);
      setActive(Boolean(overInteractive));
    };

    const unsubCursorMove = subscribeCursorMove(({ x, y, instant }) => {
      applyPosition(x, y, { instant });
    });

    const onDragClassChange = () => {
      if (document.body.classList.contains('scroll-progress-dragging')) {
        onScrollbarDrag();
      } else {
        onScrollbarDragEnd();
      }
    };

    const dragObserver = new MutationObserver(onDragClassChange);
    dragObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    applyPosition(state.tx, state.ty, { instant: true });
    setVisibility(true);
    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      dragObserver.disconnect();
      unsubCursorMove();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mouseleave', onMouseLeaveDocument);
      document.removeEventListener('mouseenter', onMouseEnterDocument);
    };
  }, [portalReady]);

  const cursor = (
    <>
      <div ref={outlineRef} className="cursor-dot-outline is-hidden" />
      <div ref={dotRef} className="cursor-dot is-hidden" />
    </>
  );

  if (!portalReady) return null;

  return createPortal(cursor, document.body);
}