import React, { useState, useEffect, useRef } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import '../../styles/nav.scss';
import '../../styles/pages.scss';

const TIMEOUT_DELAY = 700;

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
  const lastScrollTopRef = useRef(0);

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
    if (clicked !== 0) {
      setClicked(false);
      e.preventDefault();
      setTimeout(() => {
        props.history.push(to);
        setNavLinkClicked(false);
      }, TIMEOUT_DELAY);
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

  const isMenuOpen = clicked === true;

  return (
    <>
      {navLinkClicked ? <div className="black-screen in" /> : <div className="black-screen out" />}

      <div className="nav-bar">
        <div className="nav-left">
          <NavLink data-to="/" className="nav-logo" activeClassName="selected" exact to="/" title="Jatin Kumar">
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
              className={`nav-right-surface${navRightSurfaceModifier ? ` ${navRightSurfaceModifier}` : ''}`}
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
