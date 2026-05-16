import React, { useState, useEffect, useRef } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { beginPageTransition, getNavPushDelay } from './pageTransition';
import '../../styles/nav.scss';
import '../../styles/pages.scss';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Me' },
  { to: '/work', label: 'Work' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

const Nav = (props) => {
  const [clicked, setClicked] = useState(0);
  const [navLinkClicked, setNavLinkClicked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const resolveScrollContainer = () => {
      const root = document.getElementById('root');
      const candidates = [
        document.scrollingElement,
        document.documentElement,
        document.body,
        root
      ];

      for (const el of candidates) {
        if (!el) continue;
        if (el.scrollHeight > el.clientHeight + 1) return el;
      }

      return document.scrollingElement || document.documentElement || document.body;
    };

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

    const updateScrolledState = () => {
      setIsScrolled(getScrollTop() > 0);
    };

    const root = document.getElementById('root');
    let pollId = null;

    updateScrolledState();
    window.addEventListener('scroll', updateScrolledState, { passive: true });
    document.addEventListener('scroll', updateScrolledState, { passive: true });
    document.documentElement.addEventListener('scroll', updateScrolledState, { passive: true });
    document.body.addEventListener('scroll', updateScrolledState, { passive: true });
    if (root) root.addEventListener('scroll', updateScrolledState, { passive: true });
    window.addEventListener('wheel', updateScrolledState, { passive: true });
    window.addEventListener('touchmove', updateScrolledState, { passive: true });
    pollId = window.setInterval(updateScrolledState, 120);

    return () => {
      window.removeEventListener('scroll', updateScrolledState);
      document.removeEventListener('scroll', updateScrolledState);
      document.documentElement.removeEventListener('scroll', updateScrolledState);
      document.body.removeEventListener('scroll', updateScrolledState);
      if (root) root.removeEventListener('scroll', updateScrolledState);
      window.removeEventListener('wheel', updateScrolledState);
      window.removeEventListener('touchmove', updateScrolledState);
      if (pollId) window.clearInterval(pollId);
    };
  }, []);

  useEffect(() => {
    if (clicked === 0) return undefined;
    const isHomePage = props.location.pathname === '/';
    lastScrollTopRef.current = window.pageYOffset || 0;

    const closeNavOnScroll = () => {
      if (isHomePage) {
        const nextScrollTop = window.pageYOffset || 0;
        if (nextScrollTop === lastScrollTopRef.current) return;
        lastScrollTopRef.current = nextScrollTop;
      }
      setClicked(false);
    };

    const closeNavOnScrollIntent = () => {
      if (isHomePage) return;
      setClicked(false);
    };

    window.addEventListener('scroll', closeNavOnScroll, { passive: true });
    document.addEventListener('scroll', closeNavOnScroll, { passive: true });
    document.body.addEventListener('scroll', closeNavOnScroll, { passive: true });
    window.addEventListener('wheel', closeNavOnScrollIntent, { passive: true });
    window.addEventListener('touchmove', closeNavOnScrollIntent, { passive: true });

    return () => {
      window.removeEventListener('scroll', closeNavOnScroll);
      document.removeEventListener('scroll', closeNavOnScroll);
      document.body.removeEventListener('scroll', closeNavOnScroll);
      window.removeEventListener('wheel', closeNavOnScrollIntent);
      window.removeEventListener('touchmove', closeNavOnScrollIntent);
    };
  }, [clicked, props.location.pathname]);

  const handleNavLinkClick = (e) => {
    setNavLinkClicked(true);
    const to = e.currentTarget.getAttribute('data-to');
    const isCurrentRoute = props.location.pathname === to;

    if (isCurrentRoute) {
      e.preventDefault();
      setClicked(false);
      setNavLinkClicked(false);
      return;
    }

    beginPageTransition();

    if (clicked !== 0) {
      setClicked(false);
      e.preventDefault();
      const delay = getNavPushDelay();
      setTimeout(() => {
        props.history.push(to);
        setNavLinkClicked(false);
      }, delay);
    }
  };

  const handleToggleMenu = () => {
    setClicked(!clicked);
  };

  const hamClasses =
    clicked ? 'ham-1 close-1' : clicked === 0 ? 'ham-1' : 'ham-1 start-1';
  const navItemClasses =
    clicked ? 'nav-item nav-item-open'
      : clicked === 0 ? 'nav-item'
        : 'nav-item nav-item-close';
  const navRightSurfaceModifier =
    clicked === true ? 'nav-right-surface--open'
      : clicked === false ? 'nav-right-surface--close'
        : '';
  const navScrolledModifier = isScrolled ? 'nav-right-surface--opaque' : '';

  const isMenuOpen = clicked === true;
  const isCurrentRoute = (to) => (
    to === '/' ? props.location.pathname === '/' : props.location.pathname === to
  );

  /* GSAP pixel curtain on desktop; black-screen wipe when reduced motion. */
  const showBlackScreen = reducedMotion;

  return (
    <>
      {showBlackScreen ? (
        navLinkClicked ? (
          <div className={`black-screen in${reducedMotion ? ' black-screen--reduced' : ''}`} />
        ) : (
          <div className={`black-screen out${reducedMotion ? ' black-screen--reduced' : ''}`} />
        )
      ) : null}

      <div className="nav-bar">
        <div className="nav-left">
          <NavLink
            data-to="/"
            className="nav-logo"
            activeClassName="selected"
            exact
            to="/"
            title="Jatin Kumar"
            onClick={handleNavLinkClick}
          >
            <img
              data-to="/"
              className="nav-logo__img"
              src={`${import.meta.env.BASE_URL}logo_minimalist.svg`}
              alt="Jatin Kumar"
            />
          </NavLink>
        </div>

        <div className="nav-right-wrapper">
          <div className="nav-right">
            <div
                className={`nav-right-surface${navRightSurfaceModifier ? ` ${navRightSurfaceModifier}` : ''}${navScrolledModifier ? ` ${navScrolledModifier}` : ''}`}
            >
              <div className="nav-right-expandable">
                <div
                  id="nav-primary-panel"
                  className="nav-right-inner"
                  role="navigation"
                  aria-label="Site sections"
                  aria-hidden={!isMenuOpen}
                >
                  {NAV_LINKS.map((item) => (
                    isCurrentRoute(item.to) ? (
                      <span
                        key={item.to}
                        className={`${navItemClasses} selected`}
                        aria-current="page"
                        onClick={() => setClicked(false)}
                      >
                        <span className="nav-item-text">{item.label}</span>
                      </span>
                    ) : (
                      <NavLink
                        key={item.to}
                        data-to={item.to}
                        onClick={handleNavLinkClick}
                        className={navItemClasses}
                        activeClassName="selected"
                        exact
                        to={item.to}
                        tabIndex={clicked === true ? 0 : -1}
                      >
                        <span className="nav-item-text">{item.label}</span>
                      </NavLink>
                    )
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="ham-hide-wrapper"
                onClick={handleToggleMenu}
                aria-expanded={isMenuOpen}
                aria-controls="nav-primary-panel"
                aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                title={isMenuOpen ? 'Close menu' : 'Menu'}
              >
                <div className={hamClasses} aria-hidden>
                  <div className="line line1" />
                  <div className="line line2" />
                  <div className="line line3" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(Nav);
