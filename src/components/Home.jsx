import React, { useState, useEffect } from 'react';
import EyesToLogoTransition from "./helper/EyesToLogoTransition";
import ShareWithLove from './helper/ShareWithLove';
import DistortedPixelsHero from './helper/DistortedPixelsHero';
import '../styles/pages.scss';
import '../styles/home.scss';
import MBackground from './helper/MBackground';
import MetaTags from 'react-meta-tags';
import portfolioImg from '../images/portfolio.PNG';

const title = "Portfolio - Jatin Kumar";

export default (props) => {
  const [mobileView, setMobileView] = useState(undefined);
  const [tabletView, setTabletView] = useState(undefined);

  useEffect(() => {
    setMobileView(window.innerWidth <= 479);
    setTabletView(window.innerWidth <= 1024);
    props.trackPageView();
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    }
  }, [])

  const onWindowResize = () => {
    setMobileView(window.innerWidth <= 479);
    setTabletView(window.innerWidth <= 1024);
  }

  const useDistortedHero = mobileView === false && tabletView === false;

  const text1 = "HELLO.";
  const text2 = "I'M";
  const text3 = "JATIN";
  let t0 = 0.7;
  let t1 = text1.length / 15 + t0;
  let t2 = text2.length / 15 + t1;

  return (
    <>
      <MetaTags>
        <title>Jatin Kumar</title>
        <meta name="title" content={title} />
        <meta name="description" content="It is a Web Portfolio of Jatin Kumar" />
        <meta property="fb:app_id" content="161134417887112" />
        <meta property="og:title" content="Jatin Kumar Portfolio" />
        <meta property="og:description" content="It is a Web Portfolio of Jatin Kumar" />
        <meta property="og:image:url" content={portfolioImg} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="300" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Jatin Kumar" />
        <meta property="og:url" content="http://www.jatinkumar.tech" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@jatink99" />
        <meta name="twitter:creator" content="@jatink99" />
        <meta name="twitter:image" content={portfolioImg} />
      </MetaTags>
      <div className="section home">
        {mobileView ? <MBackground /> : null}
        {useDistortedHero ? <DistortedPixelsHero /> : null}
        <div className={`intro ${useDistortedHero ? 'intro--distorted-desktop' : ''}`}>
          <div className="content">
            {useDistortedHero ? (
              <h1 className="distorted-intro-title__sr">HELLO. I&apos;M JATIN</h1>
            ) : (
              <>
                <div className="intro-text" style={{ color: "#777" }}>
                  {
                    text1.split("").map((t, i) => {
                      let style = { animationDelay: `${t0 + i / 15}s` };
                      return <span style={style} key={`intro-text-${t}-${i}`}>{t}</span>
                    })
                  }
                </div>
                <div className="intro-text" >
                  {
                    text2.split("").map((t, i) => {
                      let style = { animationDelay: `${t1 + i / 15}s` };
                      return <span style={style} key={`intro-text-${t}-${i}`}>{t}</span>
                    })
                  }
                  <span>&nbsp;</span>
                  {
                    text3.split("").map((t, i) => {
                      let style = { animationDelay: `${t2 + i / 15}s` };
                      return <span style={style} key={`intro-text-${t}-${i}`}>{t}</span>
                    })
                  }
                </div>
              </>
            )}
          </div>
        </div>
        <div className="follow-container-wrapper">
          <small className="follow-me">Follow me</small>
          <div className="follow-container">
            <a className="il" target="_blank" href="https://www.linkedin.com/in/-jatin-kumar/"><i className="fab fa-linkedin-in"></i></a>
            <a className="ii" target="_blank" href="https://www.instagram.com/jatin.shots/"><i className="fab fa-instagram"></i></a>
            <a className="im" target="_blank" href="https://medium.com/@jatin15011999"><i className="fab fa-medium-m"></i></a>
            <a className="ig" target="_blank" href="https://github.com/AwesomeChap"><i className="fab fa-github"></i></a>
            <a className="iy" target="_blank" href="https://www.youtube.com/channel/UCWOv0PVApOlYYk56d0pU57g"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

        <ShareWithLove trackClickEvent={props.trackClickEvent} />
        <EyesToLogoTransition trackClickEvent={props.trackClickEvent}/>
      </div>
    </>
  )
}