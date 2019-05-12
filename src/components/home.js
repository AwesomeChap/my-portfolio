import React, { Component } from 'react';
import Background from './helper/background';
import '../css/pages.scss';
import '../css/home.scss';
import MBackground from './helper/mBackground';
import MetaTags from 'react-meta-tags';
import portfolio from '../images/portfolio.PNG';
import resume from '../../resume-updated.pdf';

const shareUrl = "http://www.jatinkumar.tech";
const title = "Portfolio - Jatin Kumar"

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
          {/* <meta name="title" content="Portfolio - Jatin Kumar" />
          <meta name="description" content="It is a Web Portfolio of Jatin Kumar" />
          <meta property="fb:app_id" content="161134417887112" />
          <meta property="og:title" content="Jatin Kumar Portfolio" />
          <meta property="og:description" content="It is a Web Portfolio of Jatin Kumar" />
          <meta property="og:image:url" content="http://www.jatinkumar.tech/portfolio.81482cd6.PNG" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="400" />
          <meta property="og:image:height" content="300" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Jatin Kumar" />
          <meta property="og:url" content="http://www.jatinkumar.tech" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@jatink99" />
          <meta name="twitter:creator" content="@jatink99" />
          <meta name="twitter:image" content="http://jatinkumar.tech/portfolio.81482cd6.PNG" /> */}
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

          <div className="love-wrapper">
            {
              !this.state.shared ? (
                <div onClick={() => { this.setState({ shared: !this.state.shared }) }} className="love">
                  SHARE WITH <span>❤</span>
                </div>
              ) : (
                  <div className="love">
                    <div className="share-buttons">

                      <a onClick={() => { this.setState({ shared: !this.state.shared }) }}
                        href="https://www.facebook.com/sharer/sharer.php?u=http://jatinkumar.tech"
                        target="_blank" rel="noopener" aria-label=""
                      >
                        <i className="fab fa-facebook-f"></i>
                      </a>

                      <a onClick={() => { this.setState({ shared: !this.state.shared }) }}
                        href="https://www.linkedin.com/shareArticle?mini=true&amp;url=http%3A%2F%2Fjatinkumar.tech&amp;title=Jatin Kumar. FullStack (MERN) Web Dev, Web Designer.&amp;summary=Jatin Kumar, who likes to mix code and creativity, I basically Work across full javascript stack mainly MERN. I am currently in my 2nd Year which I am pursuing from USICT, GGSIPU.&amp;source=http%3A%2F%2Fjatinkumar.tech"
                        target="_blank" rel="noopener" aria-label=""
                      >
                        <i className="fab fa-linkedin-in"></i>
                      </a>

                      <a onClick={() => { this.setState({ shared: !this.state.shared }) }}
                        href="https://twitter.com/intent/tweet/?text=http://www.jatinkumar.tech Web Portfolio of a FullStack (MERN) Web Developer, Web Designer @jatink99"
                        target="_blank" rel="noopener" aria-label=""
                      >
                        <i className="fab fa-twitter"></i>
                      </a>

                      <a onClick={() => { this.setState({ shared: !this.state.shared }) }}
                        href="https://api.whatsapp.com/send?text=Portfolio - Jatin Kumar http://www.jatinkumar.tech"
                        target="_blank" rel="noopener" aria-label="Share on WhatsApp"
                      >
                        <i className="fab fa-whatsapp"></i>
                      </a>

                    </div>
                  </div>
                )
            }
            <a className="download" href={resume} target="_blank">
              RESUME
            </a>
          </div>
        </div>
      </>
    )
  }
}