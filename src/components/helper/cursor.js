import React, { useEffect, useRef } from 'react';
import '../../styles/cursor.scss';

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
].join(',');

export default function Cursor() {
  const dotRef = useRef(null);
  const outlineRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
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

    const onMouseMove = (e) => {
      state.tx = e.clientX;
      state.ty = e.clientY;
      dotEl.style.left = `${state.tx}px`;
      dotEl.style.top = `${state.ty}px`;
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

    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mouseleave', onMouseLeaveDocument);
      document.removeEventListener('mouseenter', onMouseEnterDocument);
    };
  }, []);

  return (
    <>
      <div ref={outlineRef} className="cursor-dot-outline is-hidden" />
      <div ref={dotRef} className="cursor-dot is-hidden" />
    </>
  );
}