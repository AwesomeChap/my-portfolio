import React, { useEffect, useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import SplitText from './SplitText';
import '../../styles/NavMobile.scss';

const ROUTES = ['/', '/about', '/work', '/projects', '/contact'];

const NavMobile = (props) => {
  const [clicked, setClicked] = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const pathname = props.location.pathname;
    const index = ROUTES.findIndex((route) => route === pathname);
    setSelected(index >= 0 ? index + 1 : 0);
    setClicked(false);
  }, [props.location.pathname]);

  useEffect(() => {
    if (!clicked) return undefined;

    const onPointerDown = (event) => {
      if (event.target.closest('#hamburger, .nav-m')) return;
      if (event.target.closest('.menu-item')) return;
      setClicked(false);
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [clicked]);

  const handleSelect = (index) => {
    setSelected(index);
  };

  const handleNavItemClick = (e, route, index) => {
    setSelected(index);
    setClicked(false);

    if (props.location.pathname === route) {
      e.preventDefault();
    }
  };

  const handleClick = () => {
    setClicked(!clicked);
  };

  const menuClasses = clicked ? 'open-menu' : 'close-menu';
  const hamburgerClasses = clicked ? 'close' : 'ham';
  const MINClasses = clicked ? 'menu-item fadeIn-menu-item' : ' menu-item fadeOut-menu-item';

  const routes = ['/', '/about', '/work', '/projects', '/contact'];
  const menu_items = ['HOME', 'ABOUT ME', 'WORK', 'PROJECTS', 'CONTACT'];

  const navLnks = menu_items.map((name, i) => {
    const isCurrent = props.location.pathname === routes[i];
    return isCurrent ? (
      <span
        key={i}
        className={`${MINClasses} selected-m-nav-item`}
        aria-current="page"
        onClick={() => setClicked(false)}
      >
        <SplitText
          onClick={handleSelect}
          index={i + 1}
          selected={selected}
          name={name}
        />
      </span>
    ) : (
      <NavLink
        key={i}
        activeClassName="selected-m-nav-item"
        className={MINClasses}
        exact
        to={routes[i]}
        onClick={(e) => handleNavItemClick(e, routes[i], i + 1)}
      >
        <SplitText
          onClick={handleSelect}
          index={i + 1}
          selected={selected}
          name={name}
        />
      </NavLink>
    );
  });

  return (
    <>
      <div className="nav-m">
        <div
          onClick={handleClick}
          id="hamburger"
          className={hamburgerClasses}
          title="Menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <div className="bar bar1" />
          <div className="bar bar2" />
          <div className="bar bar3" />
        </div>
      </div>
      <div id="menu-wrapper" className={menuClasses}>
        {navLnks}
      </div>
    </>
  );
};

export default withRouter(NavMobile);
