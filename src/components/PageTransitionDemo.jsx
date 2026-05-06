import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import Heading from './helper/Headings';
import Mouse from './helper/Mouse';
import Footer from './helper/Footer';
import ScrollTopButton from './helper/ScrollTopButton';
import {
  BLACK_SCREEN_MS,
  isPixelTransitionEnabled,
  previewPixelTransition,
  setPixelTransitionEnabled,
} from './helper/pageTransition';
import '../styles/pages.scss';
import '../styles/transition-demo.scss';

const title = 'Page transitions — Jatin Kumar';

export default (props) => {
  const [breakline, setBreakline] = useState(undefined);
  const [pixelNavOn, setPixelNavOn] = useState(false);

  useEffect(() => {
    setBreakline(window.innerWidth <= 767);
    props.trackPageView?.();
    setPixelNavOn(isPixelTransitionEnabled());
    window.addEventListener('resize', onWindowResize);
    return () => window.removeEventListener('resize', onWindowResize);
  }, []);

  const onWindowResize = () => {
    setBreakline(window.innerWidth <= 767);
  };

  const togglePixelNav = () => {
    const next = !pixelNavOn;
    setPixelNavOn(next);
    setPixelTransitionEnabled(next);
  };

  const handlePreview = () => {
    previewPixelTransition(BLACK_SCREEN_MS);
  };

  return (
    <>
      <MetaTags>
        <title>{title}</title>
        <meta name="description" content="Pixel overlay demo for SPA route transitions" />
      </MetaTags>

      <section className="transition-demo">
        <Heading
          heading="TRANSITIONS"
          subHeading="Pixel overlay & timing"
        />

        <p className="transition-demo__lead">
          Route changes use a <strong>GSAP-staggered pixel grid</strong> (tiles fill at random, then clear after the swap)—similar in spirit to classic pixel page-load demos.
          The overlay is <strong>on by default</strong>; toggle below to disable for this session or preview without navigating.
          Nav timing uses {BLACK_SCREEN_MS} ms before the route commits on desktop. <strong>Mobile and narrow viewports (≤479px)</strong> skip transitions entirely. With <strong>prefers-reduced-motion</strong>, the horizontal wipe is used instead of pixels.
        </p>

        <div className="transition-demo__actions">
          <button
            type="button"
            className={`transition-demo__btn${pixelNavOn ? ' transition-demo__btn--primary' : ''}`}
            onClick={togglePixelNav}
          >
            {pixelNavOn ? 'Pixel overlay enabled (click to disable)' : 'Pixel overlay disabled (click to enable)'}
          </button>
          <button
            type="button"
            className="transition-demo__btn transition-demo__btn--primary"
            onClick={handlePreview}
          >
            Preview pixel transition
          </button>
        </div>

        <p className="transition-demo__hint">
          Open this page at <code>/transition-demo</code>. Disabling overlay stores <code>portfolio_pixel_transition=0</code> in session storage; clearing site data restores the default (on).
        </p>

        <Link className="transition-demo__back" to="/">
          ← Back to home
        </Link>
      </section>

      {breakline === false ? <Mouse /> : null}
      <ScrollTopButton />
      <Footer />
    </>
  );
};
