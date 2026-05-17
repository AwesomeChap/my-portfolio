/** Resolve the element that actually scrolls (viewport vs #root). */
export function resolveScrollContainer() {
  const scrollingElement = document.scrollingElement;
  if (scrollingElement) {
    const max = scrollingElement.scrollHeight - scrollingElement.clientHeight;
    if (max > 2) return scrollingElement;
  }

  const candidates = [
    document.body,
    document.documentElement,
    document.getElementById('root'),
    document.querySelector('.router-wrapper'),
  ].filter(Boolean);

  const seen = new Set();
  for (const el of candidates) {
    if (seen.has(el)) continue;
    seen.add(el);
    const max = el.scrollHeight - el.clientHeight;
    if (max > 2) return el;
  }

  return document.scrollingElement || document.documentElement || document.body;
}

export function getScrollTop() {
  const el = resolveScrollContainer();
  if (!el) return 0;
  return Math.max(0, el.scrollTop || 0);
}

export function getScrollProgress() {
  const el = resolveScrollContainer();
  const max = Math.max(0, el.scrollHeight - el.clientHeight);
  if (max < 1) return 0;
  return Math.min(1, Math.max(0, getScrollTop() / max));
}

export function getScrollMax() {
  const el = resolveScrollContainer();
  return Math.max(0, el.scrollHeight - el.clientHeight);
}

function resolveScrollBehavior(requested) {
  if (requested !== 'smooth') return 'auto';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'auto';
  }
  return 'smooth';
}

/** Scroll the page to a normalized position in [0, 1]. */
export function scrollToProgress(progress, { behavior = 'auto' } = {}) {
  const clamped = Math.min(1, Math.max(0, progress));
  const el = resolveScrollContainer();
  const max = Math.max(0, el.scrollHeight - el.clientHeight);
  const top = Math.round(clamped * max);
  const resolvedBehavior = resolveScrollBehavior(behavior);

  window.scrollTo({ top, left: 0, behavior: resolvedBehavior });

  if (typeof el.scrollTo === 'function') {
    el.scrollTo({ top, left: 0, behavior: resolvedBehavior });
  } else {
    el.scrollTop = top;
  }

  if (document.body && document.body !== el) {
    if (resolvedBehavior === 'smooth' && typeof document.body.scrollTo === 'function') {
      document.body.scrollTo({ top, left: 0, behavior: resolvedBehavior });
    } else {
      document.body.scrollTop = top;
    }
  }
  if (document.documentElement && document.documentElement !== el) {
    if (
      resolvedBehavior === 'smooth'
      && typeof document.documentElement.scrollTo === 'function'
    ) {
      document.documentElement.scrollTo({ top, left: 0, behavior: resolvedBehavior });
    } else {
      document.documentElement.scrollTop = top;
    }
  }
}
