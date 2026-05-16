import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import DistortedPixelsText from './helper/DistortedPixelsText';
import { beginPageTransition, getNavPushDelay } from './helper/pageTransition';
import '../styles/pages.scss';
import '../styles/home.scss';
import '../styles/mouse.scss';
import '../styles/not-found.scss';

const SCROLL_CUE_ARROW = (
  <svg
    className="scroll-cue__icon scroll-cue__icon--left"
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
    viewBox="0 0 24 24"
  >
    <path d="M11 21.883l-6.235-7.527-.765.644 7.521 9 7.479-9-.764-.645-6.236 7.529v-21.884h-1v21.883z" />
  </svg>
);

const title = 'Page not found — Jatin Kumar';

const MOBILE_TITLE = '404';
const MOBILE_SUB = "This page doesn't exist.";

export default (props) => {
  const [tabletView, setTabletView] = useState(undefined);
  const [mobileView, setMobileView] = useState(undefined);

  useEffect(() => {
    setTabletView(window.innerWidth <= 1024);
    setMobileView(window.innerWidth <= 479);
    props.trackPageView?.();
    document.body.classList.add('page-not-found');
    const onResize = () => {
      setTabletView(window.innerWidth <= 1024);
      setMobileView(window.innerWidth <= 479);
    };
    window.addEventListener('resize', onResize);
    return () => {
      document.body.classList.remove('page-not-found');
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const useDistorted = mobileView === false && tabletView === false;
  const showHomeButton = tabletView === false;

  const titleChars = MOBILE_TITLE.split('');
  const t0 = 0.35;

  const handleBackHome = (e) => {
    beginPageTransition();
    const delay = getNavPushDelay();
    if (delay <= 0) return;
    e.preventDefault();
    window.setTimeout(() => props.history.push('/'), delay);
  };

  return (
    <>
      <MetaTags>
        <title>{title}</title>
        <meta name="robots" content="noindex" />
        <meta name="description" content="This page does not exist on jatinkumar.tech" />
      </MetaTags>

      <section className="section not-found" aria-labelledby="not-found-sr-title">
        <h1 id="not-found-sr-title" className="distorted-intro-title__sr">
          404. This page doesn&apos;t exist.
        </h1>

        <div className="not-found__stage">
          {useDistorted ? (
            <DistortedPixelsText variant="notFound" className="not-found__pixels" />
          ) : null}

          <div className={`not-found__intro${useDistorted ? ' not-found__intro--distorted' : ''}`}>
            <div className="content">
              {useDistorted ? null : (
                <>
                  <div className="intro-text not-found__intro-title">
                    {titleChars.map((t, i) => (
                      <span
                        key={`404-${i}`}
                        style={{ animationDelay: `${t0 + i / 12}s` }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="intro-text not-found__intro-sub">{MOBILE_SUB}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {showHomeButton ? (
          <nav className="not-found__actions" aria-label="Helpful links">
            <Link
              className="scroll-cue scroll-cue--back not-found__home-cue"
              to="/"
              onClick={handleBackHome}
              aria-label="Back to home"
            >
              <span className="scroll-cue__icon-wrap" aria-hidden="true">
                <span className="scroll-cue__icon-track scroll-cue__icon-track--horizontal">
                  {SCROLL_CUE_ARROW}
                </span>
              </span>
              <span className="scroll-cue__label">BACK TO HOME</span>
            </Link>
          </nav>
        ) : null}
      </section>
    </>
  );
};
