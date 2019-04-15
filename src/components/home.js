import React, { Component } from 'react';
import Background from './helper/background';
import '../css/pages.scss';
import '../css/home.scss';
import MBackground from './helper/mBackground';
import MetaTags from 'react-meta-tags';
import portfolio from '../images/portfolio.PNG';

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mobileView: false,
      shared: false
    }
  }
  componentDidMount() {
    this.setState({ mobileView: window.innerWidth <= 479 });
    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ mobileView: window.innerWidth <= 479 });
  }

  render() {

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
          <meta name="apple-mobile-web-app-title" content="Jatin Kumar" />
          <meta name="application-name" content="Jatin Kumar Portfolio" />
          <meta name="description" content="It is a Web Portfolio of Jatin Kumar" />
          <meta property="og:title" content="Jatin Kumar Portfolio" />
          <meta property="og:image" content={portfolio} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Jatin Kumar" />
          <meta property="og:url" content="jatinkumar.tech" />
          <meta property="og:description" content="It is a Web Portfolio of Jatin Kumar" />
        </MetaTags>
        <div className="section home">
          {this.state.mobileView ? <MBackground /> : <Background />}
          <div className="intro">
            <div className="content">
              <div className="intro-text" style={{ color: "#777" }}>
                {
                  text1.split("").map((t, i) => {
                    let style = { animationDelay: `${t0 + i / 15}s` };
                    return <span style={style}>{t}</span>
                    t1 += i / 15;
                  })
                }
              </div>
              <div className="intro-text" >
                {
                  text2.split("").map((t, i) => {
                    let style = { animationDelay: `${t1 + i / 15}s` };
                    return <span style={style}>{t}</span>
                  })
                }
                <span>&nbsp;</span>
                {
                  text3.split("").map((t, i) => {
                    let style = { animationDelay: `${t2 + i / 15}s` };
                    return <span style={style}>{t}</span>
                  })
                }
              </div>
            </div>
          </div>
          <div className="follow-container-wrapper">
            <small className="follow-me">Follow me</small>
            <div className="follow-container">
              <a className="if" target="_blank" href="https://www.facebook.com/J4TINKUMAR"><i className="fab fa-facebook-f"></i></a>
              <a className="ig" target="_blank" href="https://github.com/AwesomeChap"><i className="fab fa-github"></i></a>
              <a className="iy" target="_blank" href="https://www.youtube.com/channel/UCWOv0PVApOlYYk56d0pU57g"><i className="fab fa-youtube"></i></a>
              <a className="il" target="_blank" href="https://www.linkedin.com/in/-jatin-kumar/"><i className="fab fa-linkedin-in"></i></a>
              <a className="it" target="_blank" href="https://twitter.com/jatink99"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
          {
            !this.state.shared ? (
              <div onClick={() => { this.setState({ shared: !this.state.shared }) }} className="love">SHARE WITH <span>❤</span></div>
            ) : (
                <div className="love">
                  <div className="share-buttons">

                    <a onClick={() => { this.setState({ shared: !this.state.shared }) }}
                      href="https://facebook.com/sharer/sharer.php?u=http%3A%2F%2Fjatinkumar.tech"
                      target="_blank" rel="noopener" aria-label=""
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>

                    <a onClick={() => { this.setState({ shared: !this.state.shared }) }} href="https://www.linkedin.com/shareArticle?mini=true&amp;url=http%3A%2F%2Fjatinkumar.tech&amp;title=Portfolio of Jatin Kumar.&amp;summary=It is web based portfolio website of Jatin Kumar which shares various things like Projects, Skills, Work Experience, etc.&amp;source=http%3A%2F%2Fjatinkumar.tech" target="_blank" rel="noopener" aria-label="">
                      <i className="fab fa-linkedin-in"></i>
                    </a>

                    <a onClick={() => { this.setState({ shared: !this.state.shared }) }} href="https://twitter.com/intent/tweet/?text=Just saw the awesome portfolio of jatin, and couldn't resist without sharing it, you can view it live here. &amp;url=http%3A%2F%2Fjatinkumar.tech" target="_blank" rel="noopener" aria-label="">
                      <i className="fab fa-twitter"></i>
                    </a>

                    {/* <a onClick={() => { this.setState({ shared: !this.state.shared }) }} href="whatsapp://send?text=Web based portfolio of Jatin Kumar which displays various things like Projects, Skills, Work Experience, etc." target="_blank" rel="noopener" aria-label="Share on WhatsApp">
                      <i className="fab fa-whatsapp"></i>
                    </a> */}

                  </div>
                </div>
              )
          }
        </div>
      </>
    )
  }
}