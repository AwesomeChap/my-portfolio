import React, { useState, useEffect } from 'react';
import Heading from './helper/Headings';
import Mouse from './helper/Mouse'; 
import Footer from './helper/Footer';
import ExpandText from "./helper/ExpandText";
import MetaTags from 'react-meta-tags';
import { set1, set2 } from './helper/data';
import { newAboutImg } from './helper/data-uri';
import ScrollTopButton from './helper/ScrollTopButton';

export default (props) => {
  const [breakline, setBreakline] = useState(undefined);

  useEffect(() => {
    setBreakline(window - innerWidth <= 767);
    animateSkillBars();
    document.querySelector('body').addEventListener("scroll", animateSkillBars);
  
    props.trackPageView();

    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    }
  })

  const onWindowResize = () => {
    setBreakline(window.innerWidth <= 767);
  }

  const animateSkillBars = (_className) => {
    const bars = document.querySelectorAll(".barValue");
    const barWrappers = document.querySelectorAll(".proficiency");

    bars.forEach(bar => {
      if (bar.getBoundingClientRect().top <= window.innerHeight && bar.getBoundingClientRect().top > 0) {
        bar.classList.add("animateSkillBar");'MongoDB', 'Express', 'React', 'Node'
      }
      else if (bar.getBoundingClientRect().top >= window.innerHeight && bar.getBoundingClientRect().top > 0) {
        bar.classList.remove("animateSkillBar");
      }
      if (bar.getBoundingClientRect().top < 0) {
        bar.classList.remove("animateSkillBar");
      }
    });

    barWrappers.forEach(bw => {
      if (bw.getBoundingClientRect().top <= window.innerHeight && bw.getBoundingClientRect().top > 0) {
        bw.classList.add("animateSkillBarWrapper");
      }
      else if (bw.getBoundingClientRect().top >= window.innerHeight && bw.getBoundingClientRect().top > 0) {
        bw.classList.remove("animateSkillBarWrapper");
      }
      if (bw.getBoundingClientRect().top < 0) {
        bw.classList.remove("animateSkillBarWrapper");
      }
    });
  }

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

  return (
    <>
      <MetaTags>
        <title>About - Jatin Kumar</title>
      </MetaTags>
      <div className="section">

        <div className="inner-section">

          <div className="sub-section">
            <div className="image-container">
              <div className="image-border">
                <div className="image">
                  <img className="about-img" src={newAboutImg} alt="" />
                </div>
              </div>
            </div>


            <div className="text-container">
              <div>
                <Heading heading={"ABOUT ME"} subHeading={'A brief introduction'} />
                <div className="text">
                  Hi there, My name is Jatin Kumar from New Delhi, who likes to mix code and creativity.
                  I work across full Javascript Stack mainly <ExpandText terms={['MongoDB', 'Express', 'React', 'Node']} />  stack. 
                   I am currently in my 2nd year of B.tech which I am persuing from <span className="hglt">USICT</span>, GGSIPU
                  In my free time I like to play cricket and spread gained knowledge by means of youtube
                  videos and blogs.
              </div>
              </div>
            </div>

          </div>

        </div>

        <div className="inner-section">
          <Heading repair={{ y: -90 }} heading={"SKILLS"} subHeading={'Stuff I love'} />
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
          <div className="block">
            <div className="block-item">
              <div className="item-heading">HackNSUT, NSUT {breakline && <br />} <span>March,31 2019</span></div>
              <div className="item-content">Our Team Came at <span>1 Position</span></div>
            </div>
            <div className="block-item">
              <div className="item-heading">WebQuicky, BPIT {breakline && <br />} <span>April,10 2018</span></div>
              <div className="item-content">Our Team Came at <span>2 Position</span></div>
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