import React, { useState, useEffect } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import NavBar from './components/helper/Nav';
import NavBarMobile from './components/helper/NavMobile';
import LiquidGradientBackground from './components/helper/LiquidGradientBackground';
import { About, Blog, Contact, Home, Work, Projects, NotFound } from './components/index';
import ScrollToTop from './components/helper/ScrollToTop';
import PixelTransitionOverlay from './components/helper/PixelTransitionOverlay';
import Cursor from './components/helper/cursor';
import {
  subscribeExperimentalMode,
  syncExperimentalBodyClass,
} from './components/helper/experimentalMode';
import ReactGa from "react-ga";

export default () => {
  const [isMobile, setIsMobile] = useState(undefined);
  const [isMobileView, setIsMobileView] = useState(undefined);
  const [isMobileNav, setIsMobileNav] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 767
  );
  const [experimentalActive, setExperimentalActive] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    setIsMobileView(window.innerWidth <= 479);
    setIsMobileNav(window.innerWidth <= 767);
    syncExperimentalBodyClass();

    ReactGa.initialize("UA-191535134-2");

    const unsubscribeExperimental = subscribeExperimentalMode(setExperimentalActive);

    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
      unsubscribeExperimental();
    }
  }, [])

  const trackPageView = () => {
    ReactGa.pageview(window.location.pathname);
  }

  const trackClickEvent = (category, action) => {
    ReactGa.event({category, action});
  }

  const onWindowResize = () => {
    setIsMobileView(window.innerWidth <= 479);
    setIsMobileNav(window.innerWidth <= 767);
  }

  const isBiggerScreenDevice = isMobileView === false && isMobile === false;
  const showEnhancedEffects = isBiggerScreenDevice || experimentalActive;

  return (
    <>
      <div className="router-wrapper">
        {showEnhancedEffects ? <LiquidGradientBackground /> : null}
        <div className="app-content-layer">
          <Router>
            <ScrollToTop>
              {isMobileNav ? <NavBarMobile /> : <NavBar />}
            </ScrollToTop>
            {showEnhancedEffects ? <PixelTransitionOverlay /> : null}
            <div id="route-outlet">
            <Switch>
            <Route exact path="/" render={(props) => <Home {...props} trackPageView={trackPageView} trackClickEvent={trackClickEvent} />}></Route>
            <Route exact path="/about" render={(props) => <About {...props} trackPageView={trackPageView} />}></Route>
            <Route exact path="/work" render={(props) => <Work {...props} trackPageView={trackPageView} />}></Route>
            <Route exact path="/projects" render={(props) => <Projects {...props} trackPageView={trackPageView} />}></Route>
            <Route exact path="/blog" render={(props) => <Blog {...props} trackPageView={trackPageView} />}></Route>
            <Route exact path="/contact" render={(props) => <Contact {...props} trackPageView={trackPageView} />}></Route>
            <Route render={(props) => <NotFound {...props} trackPageView={trackPageView} />} />
            </Switch>
            </div>
            {isBiggerScreenDevice && <Cursor />}
          </Router>
        </div>
      </div>
    </>
  )
}
