import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import NavBar from './components/helper/Nav';
import NavBarMobile from './components/helper/NavMobile';
import { About, Blog, Contact, Home, Work, Projects, Footer } from './components/index';
import ScrollToTop from './components/helper/ScrollToTop';
import Cursor from './components/helper/cursor';

export default () => {
  const [isMobile, setIsMobile] = useState(undefined);
  const [isMobileView, setIsMobileView] = useState(undefined);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    setIsMobileView(window.innerWidth <= 479);
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    }
  })

  const onWindowResize = () => {
    setIsMobileView(window.innerWidth <= 479);
  }

  const isBiggerScreenDevice = !isMobileView && !isMobile;

  return (
    <>
      <div className="router-wrapper">
        <Router>
          <ScrollToTop>{isBiggerScreenDevice ? <NavBar /> : <NavBarMobile />}</ScrollToTop>
          <Route exact path="/" component={Home}></Route>
          <Route exact path="/about" component={About}></Route>
          <Route exact path="/work" component={Work}></Route>
          <Route exact path="/projects" component={Projects}></Route>
          <Route exact path="/blog" component={Blog}></Route>
          <Route exact path="/contact" component={Contact}></Route>
          {isBiggerScreenDevice && <Cursor />}
        </Router>
      </div>
    </>
  )
}