import React, { useState, useEffect } from 'react';
import Heading from './helper/Headings';
import Mouse from './helper/Mouse'; 
import Footer from './helper/Footer';
import MetaTags from 'react-meta-tags';
import { set1, set2 } from './helper/data';
import aboutImg from '../images/about-me.png';
import ScrollTopButton from './helper/ScrollTopButton';
import DistortedPixelsPortrait from './helper/DistortedPixelsPortrait';

/** Smooth square photo fallback (tablet / mobile) — no canvas pixelation. */
const AboutPortraitPhoto = ({ src, alt }) => (
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

    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    }
  }, [])

  useEffect(() => {
    /* Observe .skill-wrapper, not .proficiency: scaleX(0) on the bar track
       shrinks its intersection geometry so lower rows may never hit the threshold. */
    const rows = document.querySelectorAll("#about-skills .skill-wrapper");
    if (!rows.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const proficiency = entry.target.querySelector(".proficiency");
          const bar = proficiency?.querySelector(".barValue");
          if (entry.isIntersecting) {
            if (proficiency) proficiency.classList.add("animateSkillBarWrapper");
            if (bar) bar.classList.add("animateSkillBar");
            return;
          }
          if (proficiency) proficiency.classList.remove("animateSkillBarWrapper");
          if (bar) bar.classList.remove("animateSkillBar");
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px 12% 0px" }
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  const onWindowResize = () => {
    setBreakline(window.innerWidth <= 767);
    setTabletView(window.innerWidth <= 1024);
  }

  const useDistortedPortrait = tabletView === false;

  const getSkillsSet = (set) => (
    set.map((s, i) => {
      let inlineStyle = { width: s.value + "%" }
      return (
        <div key={i} className="skill-wrapper">
          <div className="skill">{s.name}</div>
          <div className="proficiency">
            <div style={inlineStyle} className="barValue"></div>
          </div>
        </div>
      )
    })
  )

  const semester = () => {
      const currentDate = new Date();
      const semStartDate = new Date(2021,2,1);
      let months = (currentDate.getFullYear() - semStartDate.getFullYear()) * 12;
      months -= semStartDate.getMonth();
      months += currentDate.getMonth();

      if(months < 0) months = 0;
      
      const sem = parseInt(months/6) + 1;

      switch(sem){
        case 1: return "1st";
        case 2: return "2nd";
        case 3: return "3rd";
        case 4: return "4th";
        case 5: return "5th";
        case 6: return "final";
        default: return "";
      }
  }

  return (
    <>
      <MetaTags>
        <title>About - Jatin Kumar</title>
      </MetaTags>
      <div className="section section-about">
        <div className="inner-section">

          <div className="sub-section">
            <div className="image-container">
              <div className="image">
                {useDistortedPortrait ? (
                  <DistortedPixelsPortrait src={aboutImg} alt="Jatin Kumar portrait" />
                ) : (
                  <AboutPortraitPhoto src={aboutImg} alt="Jatin Kumar portrait" />
                )}
              </div>
            </div>


            <div className="text-container">
              <div>
                <Heading heading={"ABOUT ME"} subHeading={'Who am I?'} />
                <div className="text">
                  Hi there, I am Jatin Kumar from New Delhi, who likes to mix code and creativity.
                  I am always up for learning something new. I am currently in my {semester()} Semester of <span className="hglt">Bachelor Informatik</span> which I am pursuing from
                  &nbsp;
                  <a href="https://www.plus.ac.at/" target="_blank" rel="noopener noreferrer">
                    University of Salzburg
                  </a>.
                  In my free time I like to play cricket, make drawings, go for a walk and watch science fiction movies.
              </div>
              </div>
            </div>

          </div>

        </div>

        <div className="inner-section" id="about-skills" data-scroll-cue-target>
          <Heading repair={{ y: -90 }} heading={"SKILLS"} subHeading={'My Stack'} />
          <div className="skills-block">
            <div className="set">
              {getSkillsSet(set1)}
            </div>
            <div className="set">
              {getSkillsSet(set2)}
            </div>
          </div>
        </div>

        <div className="inner-section">
          <Heading repair={{ y: -190 }} heading={"ACHEIVEMENTS"} subHeading={'Some worthy payoffs'} />
          <div className="block-items-wrapper">
            <div className="block-item">
              <div className="item-heading">HackNSUT, NSUT {breakline && <br />} <span>March,31 2019</span></div>
              <div className="item-content">Our Team Came at <span>1st Position</span></div>
            </div>
            <div className="block-item">
              <div className="item-heading">WebQuicky, BPIT {breakline && <br />} <span>April,10 2018</span></div>
              <div className="item-content">Our Team Came at <span>2nd Position</span></div>
            </div>
          </div>
        </div>

      </div>
      <Mouse />
      <ScrollTopButton />
      <Footer />
    </>
  )
}