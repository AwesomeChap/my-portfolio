import React, { useState, useEffect } from 'react';
import Heading from './helper/Headings';
import Footer from './helper/Footer';
import '../styles/pages.scss';
import { works } from './helper/data';
import workHeroImg from '../images/work-hero.png';
import MetaTags from 'react-meta-tags';
import Mouse from './helper/Mouse';
import ScrollTopButton from './helper/ScrollTopButton';
import DistortedPixelsPortrait from './helper/DistortedPixelsPortrait';

const WorkHeroPhoto = ({ src, alt }) => (
  <div className="about-pixel">
    <img src={src} alt={alt} className="about-pixel__photo" />
  </div>
);

export default (props) => {
  const [breakline, setBreakline] = useState(undefined);
  const [tabletView, setTabletView] = useState(undefined);

  useEffect(() => {
    setBreakline(window.innerWidth <= 767);
    setTabletView(window.innerWidth <= 1024);
    props.trackPageView();
    window.addEventListener('resize', onWindowResize);
    return () => window.removeEventListener('resize', onWindowResize);
  }, []);

  const onWindowResize = () => {
    setBreakline(window.innerWidth <= 767);
    setTabletView(window.innerWidth <= 1024);
  };

  const useDistortedHero = tabletView === false;

  return (
    <>
      <MetaTags>
        <title>Work - Jatin Kumar</title>
        <meta name="description" content="I always love to learn new technologies and like even more,
                  when I get the chance to apply them. I have been doing Fullstack
                  Web development for almost 2 years now. Till date my most work
                  experience came from contribution to small startups and college
                  technical festivals"/>
      </MetaTags>
      <div className="section section-work work-page">
        <div className="inner-section">
          <div className="sub-section">
            <div className="image-container">
              <div className="image">
                {useDistortedHero ? (
                  <DistortedPixelsPortrait src={workHeroImg} alt="Developer desk with laptop and dual monitors" />
                ) : (
                  <WorkHeroPhoto src={workHeroImg} alt="Developer desk with laptop and dual monitors" />
                )}
              </div>
            </div>
            <div className="text-container">
              <div>
                <Heading heading={"WORK"} subHeading={'Things I do'} />
                <div className="text">
                  I always love to learn new technologies and like even more,
                  when I get the chance to apply them. I have been doing Fullstack
                  Web development for almost 2 years now. Till date my most work
                  experience came from contribution to small startups and college
                  technical festivals
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="inner-section">
          <Heading repair={{ y: -80 }} heading={"EXPERIENCE"} subHeading={'Time - A Great Teacher'} />
          <div className="block-items-wrapper">
            {
              works.map((work, i) => (
                <div key={"work" + i} className="block-item">
                  <div className="item-heading">
                    {work.place}
                    {breakline && <br />}
                    {' '}
                    <span>{work.date}</span>
                    {work.link !== "" && (
                      <a target="_blank" rel="noopener noreferrer" href={work.link}>
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    )}
                  </div>
                  <div className="item-content">
                    <span>{work.designation}</span>
                  </div>
                  <ul className="block-ul">
                    {work.rspbs.map((resp, j) => (
                      <li key={"block-li" + i + "-" + j} className="block-li">{resp}</li>
                    ))}
                  </ul>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <Mouse />
      <ScrollTopButton />
      <Footer />
    </>
  )
}
