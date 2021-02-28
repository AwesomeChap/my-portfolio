import React, { useEffect, useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Svg from './LogoSvg';
import SplitText from './SplitText';
import '../../styles/NavMobile.scss';

const ROUTES = ['/', '/about', '/work', '/projects', '/contact'];

const NavMobile = (props) => {
  const [clicked, setClicked] = useState(0);
  const [selected, setSelected] = useState(false);
  const [svgWidth, setSvgWidth] = useState(undefined);

  useEffect(() => {
    window.innerWidth <= 476 ? setSvgWidth(50) : window.innerWidth <= 767 ? setSvgWidth(65) : false;
    ROUTES.forEach((route, routeIndex)=>{
      if(route === props.history.location.pathname) {
        setSelected(routeIndex + 1);
        return routeIndex + 1; 
      }
    });
  })

  useEffect(() => {
    setClicked(!clicked);
  }, [selected])

  useEffect(() => {

  }, [clicked]);

  const handleSelect = (index) => {
    setSelected(index);
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
      return (
        <NavLink key={i} activeClassName="selected-m-nav-item" className={MINClasses} exact to={routes[i]}
        >
          <SplitText 
            onClick={handleSelect} index={i + 1} 
            selected={selected} name={name}
          />
        </NavLink>
      );
    })
    return (
      <>
        <div className="nav-m">
          <NavLink className="nav-logo-m" exact to="/">
            <Svg width={svgWidth} id="logo" />
          </NavLink>
          <div onClick={handleClick} id="hamburger" className={hamburgerClasses}>
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