import React, { useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import smoothscroll from 'smoothscroll-polyfill';
import {
  getPageTransitionClearMs,
  isPageTransitionActiveViewport,
  prefersReducedMotion,
} from './pageTransition';

/** html is overflow:hidden; body/#root often carry scroll — reset every candidate */
function scrollRouteToTop() {
  const opts = { top: 0, left: 0, behavior: 'auto' };
  try {
    window.scrollTo(opts);
  } catch (e) {
    window.scrollTo(0, 0);
  }

  const candidates = [
    document.scrollingElement,
    document.documentElement,
    document.body,
    document.getElementById('root'),
  ].filter(Boolean);

  const seen = new Set();
  candidates.forEach((el) => {
    if (!el || seen.has(el)) return;
    seen.add(el);
    el.scrollTop = 0;
    el.scrollLeft = 0;
    if (typeof el.scrollTo === 'function') {
      try {
        el.scrollTo(opts);
      } catch (e) {
        /* empty */
      }
    }
  });
}

const ScrollToTop = (props) => {
  const skipTransitionClassRef = useRef(true);
  const skipOutletEnterRef = useRef(true);

  useEffect(() => {
    smoothscroll.polyfill();
    scrollRouteToTop();
    const id = window.requestAnimationFrame(() => {
      scrollRouteToTop();
    });
    return () => window.cancelAnimationFrame(id);
  }, [props.location.pathname, props.location.search]);

  useEffect(() => {
    if (skipOutletEnterRef.current) {
      skipOutletEnterRef.current = false;
      return undefined;
    }

    const outlet = document.getElementById('route-outlet');
    if (!outlet || !isPageTransitionActiveViewport() || prefersReducedMotion()) return undefined;

    outlet.classList.remove('route-outlet--enter');
    void outlet.offsetWidth;
    outlet.classList.add('route-outlet--enter');
    const animId = window.setTimeout(() => {
      outlet.classList.remove('route-outlet--enter');
    }, 480);

    return () => window.clearTimeout(animId);
  }, [props.location.pathname, props.location.search]);

  useEffect(() => {
    if (skipTransitionClassRef.current) {
      skipTransitionClassRef.current = false;
      return undefined;
    }

    if (!isPageTransitionActiveViewport()) return undefined;

    document.body.classList.add('page-transitioning');
    const ms = getPageTransitionClearMs();
    const timeoutId = window.setTimeout(() => {
      document.body.classList.remove('page-transitioning', 'page-transition--pixel');
    }, Math.max(0, ms));

    return () => {
      window.clearTimeout(timeoutId);
      /* Keep class through commit — nav click may have added it before pathname updates */
    };
  }, [props.location.pathname]);

  return <> {props.children} </>;
}

export default withRouter(ScrollToTop)