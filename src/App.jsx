import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import NavBar from './components/helper/Nav';
import NavBarMobile from './components/helper/NavMobile';
import { About, Blog, Contact, Home, Work, Projects, Footer } from './components/index';
import ScrollToTop from './components/helper/ScrollToTop';
import Cursor from './components/helper/cursor';
import ReactGa from "react-ga";

export default () => {
  const [isMobile, setIsMobile] = useState(undefined);
  const [isMobileView, setIsMobileView] = useState(undefined);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    setIsMobileView(window.innerWidth <= 479);

    ReactGa.initialize("UA-191535134-2");

    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    }
  })

  const trackPageView = () => {
    ReactGa.pageview(window.location.pathname);
  }

  const trackClickEvent = (category, action) => {
    ReactGa.event({category, action});
  }

  const onWindowResize = () => {
    setIsMobileView(window.innerWidth <= 479);
  }

  const isBiggerScreenDevice = !isMobileView && !isMobile;

  return (
    <>
      <div className="router-wrapper">
        <Router>
          <ScrollToTop>{isBiggerScreenDevice ? <NavBar /> : <NavBarMobile />}</ScrollToTop>
          <Route exact path="/" render={(props) => <Home {...props} trackPageView={trackPageView} trackClickEvent={trackClickEvent} />}></Route>
          <Route exact path="/about" render={(props) => <About {...props} trackPageView={trackPageView} />}></Route>
          <Route exact path="/work" render={(props) => <Work {...props} trackPageView={trackPageView} />}></Route>
          <Route exact path="/projects" render={(props) => <Projects {...props} trackPageView={trackPageView} />}></Route>
          <Route exact path="/blog" render={(props) => <Blog {...props} trackPageView={trackPageView} />}></Route>
          <Route exact path="/contact" render={(props) => <Contact {...props} trackPageView={trackPageView} />}></Route>
          {isBiggerScreenDevice && <Cursor />}
        </Router>
      </div>
    </>
  )
}