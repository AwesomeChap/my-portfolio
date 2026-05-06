import React, { useEffect, useRef, useState } from 'react';
import '../../styles/mouse.scss'

function resolveScrollContainer() {
  const candidates = [
    document.body,
    document.documentElement,
    document.scrollingElement,
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

  return document.scrollingElement || document.body;
}

export default () => {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollTopRef = useRef(0);
  const rafRef = useRef(null);

  const getScrollTop = () => {
    const el = resolveScrollContainer();
    return Math.max(
      window.scrollY || 0,
      window.pageYOffset || 0,
      document.documentElement?.scrollTop || 0,
      document.body?.scrollTop || 0,
      el ? el.scrollTop || 0 : 0
    );
  };

  useEffect(() => {
    let isMounted = true;

    const updateScrollUI = (forceHide = false) => {
      const scrollTop = getScrollTop();
      const hasScrolled = scrollTop > 20;
      const nextHidden = forceHide || hasScrolled;

      setIsHidden((prev) => (prev === nextHidden ? prev : nextHidden));
    };

    const runUpdate = (forceHide = false) => {
      if (!isMounted) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => updateScrollUI(forceHide));
    };

    const handleScroll = () => {
      const nextScrollTop = getScrollTop();
      if (nextScrollTop === lastScrollTopRef.current) return;
      const isScrollingDown = nextScrollTop > lastScrollTopRef.current;
      lastScrollTopRef.current = nextScrollTop;
      runUpdate(isScrollingDown);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.documentElement.addEventListener('scroll', handleScroll, { passive: true });
    document.body.addEventListener('scroll', handleScroll, { passive: true });

    const root = document.getElementById('root');
    if (root) root.addEventListener('scroll', handleScroll, { passive: true });

    if (/Edge/.test(navigator.userAgent)) {
      const mouseElement = document.getElementById('mouse');
      if (mouseElement) {
        mouseElement.style.display = 'none';
      }
    }
    lastScrollTopRef.current = getScrollTop();
    runUpdate(false);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      document.documentElement.removeEventListener('scroll', handleScroll);
      document.body.removeEventListener('scroll', handleScroll);
      if (root) root.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      isMounted = false;
    };
  }, []);

  const handleClick = () => {
    const el = resolveScrollContainer();
    const start = el.scrollTop || 0;
    const max = Math.max(0, el.scrollHeight - el.clientHeight);
    const skillsSection = document.getElementById('about-skills');
    let target = start;

    if (skillsSection) {
      const topGap = window.innerWidth <= 768 ? 28 : 50;
      const rect = skillsSection.getBoundingClientRect();
      target = Math.min(Math.max(0, start + rect.top - topGap), max);
    } else {
      const delta = Math.round(window.innerHeight * 0.65);
      target = Math.min(start + delta, max);
    }

    if (target <= start) return;

    setIsHidden(true);
    if (typeof el.scrollTo === 'function') {
      el.scrollTo({ top: target, left: 0, behavior: 'smooth' });
      return;
    }
    el.scrollTop = target;
  };

  return (
    <>
      <div id="mouse" className={isHidden ? 'is-hidden' : ''}>
        <button onClick={handleClick} className="scroll-cue" type="button" aria-label="Scroll down">
          <span className="scroll-cue__label">SCROLL</span>
          <span className="scroll-cue__icon-wrap" aria-hidden="true">
            <span className="scroll-cue__icon-track">
              <svg className="scroll-cue__icon" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 24 24">
                <path d="M11 21.883l-6.235-7.527-.765.644 7.521 9 7.479-9-.764-.645-6.236 7.529v-21.884h-1v21.883z" />
              </svg>
            </span>
          </span>
        </button>
      </div>
    </>
  );
};