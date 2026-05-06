import React, { useEffect, useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import SplitText from './SplitText';
import '../../styles/NavMobile.scss';

const ROUTES = ['/', '/about', '/work', '/projects', '/contact'];

const NavMobile = (props) => {
  const [clicked, setClicked] = useState(0);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    ROUTES.forEach((route, routeIndex) => {
      if (route === props.history.location.pathname) {
        setSelected(routeIndex + 1);
      }
    });
  });

  useEffect(() => {
    setClicked(!clicked);
  }, [selected])

  useEffect(() => {

  }, [clicked]);

  const handleSelect = (index) => {
    setSelected(index);
  }

  const handleNavItemClick = (e, route, index) => {
    if (props.location.pathname === route) {
      e.preventDefault();
      setSelected(index);
      setClicked(false);
      return;
    }
  }

  const handleClick = () => {
    setClicked(!clicked);
  }

  const menuClasses = clicked ? "open-menu" : "close-menu";
    const hamburgerClasses = clicked ? "close" : clicked === 0 ? "" : "ham";
    const MINClasses = clicked ? "menu-item fadeIn-menu-item" : " menu-item fadeOut-menu-item";

    const routes = ['/', '/about', '/work', '/projects',
      // '/blog',
      '/contact'];
    const menu_items = ['HOME', 'ABOUT ME', 'WORK', 'PROJECTS',
      // 'BLOG',
      'CONTACT']; 

    const navLnks = menu_items.map((name, i) => {
      const isCurrent = props.location.pathname === routes[i];
      return (
        isCurrent ? (
          <span
            key={i}
            className={`${MINClasses} selected-m-nav-item`}
            aria-current="page"
            onClick={() => setClicked(false)}
          >
            <SplitText
              onClick={handleSelect} index={i + 1}
              selected={selected} name={name}
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
              onClick={handleSelect} index={i + 1}
              selected={selected} name={name}
            />
          </NavLink>
        )
      );
    })
    return (
      <>
        <div className="nav-m">
          <div onClick={handleClick} id="hamburger" className={hamburgerClasses} title="Menu">
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>
          </div>
        </div>
        <div id="menu-wrapper" className={menuClasses} >
          {navLnks}
        </div>
      </>
    );
} 

export default withRouter(NavMobile);