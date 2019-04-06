import React, { Component } from 'react';
import Heading from './helper/heading';
import Footer from './footer';
import Expand from './helper/expand';
import { set1, set2 } from './helper/data';
import { aboutImg } from './helper/data-uri';

export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: 0,
      breakLine: false
    };
  }

  componentDidMount() {
    var bars = document.querySelectorAll(".barValue");
    var barsWrapper = document.querySelectorAll(".proficiency");

    window.addEventListener('scroll', function () {

      // console.log('you scrolled me');

      barsWrapper.forEach(bw => {
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

      bars.forEach(bar => {
        if (bar.getBoundingClientRect().top <= window.innerHeight && bar.getBoundingClientRect().top > 0) {
          bar.classList.add("animateSkillBar");
        }
        else if (bar.getBoundingClientRect().top >= window.innerHeight && bar.getBoundingClientRect().top > 0) {
          bar.classList.remove("animateSkillBar");
        }
        if (bar.getBoundingClientRect().top < 0) {
          bar.classList.remove("animateSkillBar");
        }
      });
    });

    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    window.innerWidth <= 767 ? this.setState({ breakLine: true }) : this.setState({ breakLine: false });
  }

  render() {

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
        <div className="section">

          <div className="inner-section">

            <div className="sub-section">
              <div className="image-container">
                <div className="image-border">
                  <div className="image">
                    <img className="about-img" src={aboutImg} alt="" />
                  </div>
                </div>
              </div>


              <div className="text-container">
                <div>
                  <Heading heading={"ABOUT ME"} subHeading={'A brief introduction'} />
                  <div className="text">
                    Hi there, My name is Jatin Kumar from New Delhi, who likes to mix code and creativity.
                  I work across full Javascript Stack mainly <span className="hglt">MERN</span>  stack. {/*<Expand terms={['MongoDB', 'Express', 'React', 'Node']} />*/}
                    I am currently in my 2nd year of B.tech which I am persuing from <span className="hglt">USICT</span>, GGSIPU
                    In my free time I like to play cricket and spread gained knowledge by means of youtube
                    videos and blogs.
                </div>
                </div>
              </div>

            </div>

          </div>

          <div className="inner-section">
            <Heading repair={{ y: -90 }} heading={"SKILLS"} subHeading={'My tools'} />
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
                <div className="item-heading">HackNSUT, NSUT {this.state.breakLine && <br />} <span>March,31 2019</span></div>
                <div className="item-content">Our Team Came at <span>1 Position</span></div>
              </div>
              <div className="block-item">
                <div className="item-heading">WebQuicky, BPIT {this.state.breakLine && <br />} <span>April,10 2018</span></div>
                <div className="item-content">Our Team Came at <span>2 Position</span></div>
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </>
    )
  }
}