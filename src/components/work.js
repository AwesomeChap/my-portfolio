import React, { Component } from 'react';
import Heading from './helper/heading';
import Expand from './helper/expand';
import Footer from './footer';
import '../css/pages.scss';
import { works } from './helper/data';
import { workImg } from './helper/data-uri';
import MetaTags from 'react-meta-tags';
import portfolio from '../images/portfolio.PNG';

export default class Work extends Component {

  constructor(props) {
    super(props);
    this.state = { breakLine: window.innerWidth <= 1024 }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    window.innerWidth <= 1024 ? this.setState({ breakLine: true }) : this.setState({ breakLine: false });
  }

  render() {
    return (
      <>
        <MetaTags>
          <title>Work - Jatin Kumar</title>
          {/* <meta name="apple-mobile-web-app-title" content="Work - Jatin Kumar" />
          <meta name="application-name" content="Jatin Kumar Portfolio" />
          <meta name="description" content="I always love to learn new technologies and like even more, when I get the chance to apply them. I have been doing Fullstack Web development for almost 2 years now. Till date my most work experience came from contribution to small startups and college technical festivals" />
          <meta property="og:title" content="Work Jatin Kumar" />
          <meta property="og:image" content={portfolio} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Jatin Kumar" />
          <meta property="og:url" content="jatinkumar.tech/work" />
          <meta property="og:description" content="I always love to learn new technologies and like even more, when I get the chance to apply them. I have been doing Fullstack Web development for almost 2 years now. Till date my most work experience came from contribution to small startups and college technical festivals" /> */}
        </MetaTags>
        <div className="section">

          <div className="inner-section">

            <div className="sub-section">

              <div className="image-container">
                <div className="image-border">
                  <div className="image">
                    <img src={workImg} alt="" />
                  </div>
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
            <Heading repair={{ y: -80 }} heading={"EXPERIENCE"} subHeading={'Time - Great Teacher'} />
            <div className="block">

              {
                works.map((w, i) => (
                  <div key={"w" + i} className="block-item">
                    <div className="item-heading">{w.place} {this.state.breakLine && <br />} <span>{w.date}</span>
                      {w.link !== "" && <a target="_blank" href={w.link}><i className="fas fa-link"></i></a>}
                    </div>
                    <div className="item-content"> <span className="hglt-red">{w.designation}</span> </div>
                    <ul className="block-ul">
                      {w.rspbs.map((resp, i) => (
                        <li key={"block-li" + i} className="block-li">{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))
              }

            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }
}