const CURSOR_MOVE_EVENT = 'portfolio:cursor-move';

/** Push cursor position (used while dragging the custom scrollbar). */
export function emitCursorMove(x, y, { instant = false } = {}) {
  window.dispatchEvent(
    new CustomEvent(CURSOR_MOVE_EVENT, { detail: { x, y, instant } })
  );
}

export function subscribeCursorMove(handler) {
  const onMove = (event) => handler(event.detail);
  window.addEventListener(CURSOR_MOVE_EVENT, onMove);
  return () => window.removeEventListener(CURSOR_MOVE_EVENT, onMove);
}
