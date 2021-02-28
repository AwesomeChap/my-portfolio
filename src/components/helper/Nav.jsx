import React, { useState, useEffect } from 'react';
import Svg from './LogoSvg';
import { NavLink, withRouter } from 'react-router-dom';
import '../../styles/nav.scss';
import '../../styles/pages.scss';

const Nav = (props) => {
  const [clicked, setClicked] = useState(0);
  const [navLinkClicked, setNavLinkClicked] = useState(false);

  const TIMEOUT_DELAY = 700;

  useEffect(() => {
    document.body.addEventListener("scroll", onWindowScroll);
    return () => {
      document.body.removeEventListener("scroll", onWindowScroll);
    }
  })

  const handleExpLink = (e) => {
    setTimeout(() => {
      history.push('/contact')
    }, 2000)
  }

  const handleNavLinkClick = (e) => {
    setNavLinkClicked(true);
    const { to } = e.target.dataset;
    if (clicked !== 0) {
      setClicked(false);
      e.preventDefault()

      setTimeout(() => {
        props.history.push(to);
        setNavLinkClicked(false);
      }, TIMEOUT_DELAY);
    }
  }

  const onWindowScroll = () => {
    if (clicked !== 0) {
      setClicked(false);
    }
  }

  const handleClick = () => {
    setClicked(!clicked);
  }

  const hamClasses = clicked ? "ham-1 close-1" : clicked === 0 ? "ham-1" : "ham-1 start-1";
  const navItemClasses = clicked ? "nav-item nav-item-open" : clicked === 0 ? "nav-item" : "nav-item nav-item-close";
  const navRightInnerClasses = clicked ? "nav-right-inner nav-right-inner-open" : clicked === 0 ? "nav-right-inner" : "nav-right-inner nav-right-inner-close";
  return (
    <>
      {navLinkClicked ? (<div className="black-screen in" />) : (<div className="black-screen out" />)}

      <div className="nav-bar" >
        <div className="nav-left">
          <NavLink data-to="/" className="nav-logo" activeClassName="selected" exact to="/">
            <Svg data-to="/" id="logo" />
          </NavLink>
        </div>
        <div className="nav-right-wrapper">
          <div className="nav-right">
            <div className={navRightInnerClasses}>
              <NavLink data-to="/" onClick={handleNavLinkClick} className={navItemClasses} activeClassName="selected" exact to="/"><span data-to="/" className="nav-item-span-1">Home</span></NavLink>
              <NavLink data-to="/about" onClick={handleNavLinkClick} className={navItemClasses} activeClassName="selected" exact to="/about"><span data-to="/about" className="nav-item-span-2">About Me</span></NavLink>
              <NavLink data-to="/work" onClick={handleNavLinkClick} className={navItemClasses} activeClassName="selected" exact to="/work"><span data-to="/work" className="nav-item-span-3">Work</span></NavLink>
              <NavLink data-to="/projects" onClick={handleNavLinkClick} className={navItemClasses} activeClassName="selected" exact to="/projects"><span data-to="/projects" className="nav-item-span-4">Projects</span></NavLink>
              {/* <NavLink data-to="/blog" onClick={handleNavLinkClick} className={navItemClasses} activeClassName="selected" exact to="/blog"><span data-to="/blog" className="nav-item-span-5">Blog</span></NavLink> */}
              <NavLink data-to="/contact" onClick={handleNavLinkClick} className={navItemClasses} activeClassName="selected" exact to="/contact"><span data-to="/contact" className="nav-item-span-6">Contact</span></NavLink>
            </div>
            <div onClick={handleClick} className="ham-hide-wrapper">
              <div className={hamClasses}>
                <div className="line line1"></div>
                <div className="line line2"></div>
                <div className="line line3"></div>
              </div>
            </div>
          </div>
        </div>
      </div></>
  )
}

export default withRouter(Nav);