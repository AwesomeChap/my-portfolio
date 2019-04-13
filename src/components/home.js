import React, { Component } from 'react';
import Background from './helper/background';
import Mbackground from './helper/background';
import '../css/pages.scss';
import '../css/home.scss';
import MBackground from './helper/mBackground';

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
    let t1 = text1.length;
    let t2 = text2.length + t1;

    return (
      <div className="section home">
        {this.state.mobileView ? <MBackground /> : <Background />}
        <div className="intro">
          <div className="content">
            <div className="intro-text" style={{ color: "#777" }}>
              {
                text1.split("").map((t, i) => {
                  let style = { animationDelay: `${i / 10}s` };
                  return <span style={style}>{t}</span>
                })
              }
            </div>
            <div className="intro-text" >
              {
                text2.split("").map((t, i) => {
                  i += t1;
                  let style = { animationDelay: `${i / 10}s` };
                  return <span style={style}>{t}</span>
                })
              }
              <span>&nbsp;</span>
              {
                text3.split("").map((t, i) => {
                  i += t2;
                  let style = { animationDelay: `${i / 10}s` };
                  return <span style={style}>{t}</span>
                })
              }
            </div>
            {/* <div className="intro-text" ><span>I AM</span></div>
            <div className="intro-text" ><span>JATIN</span></div> */}
          </div>
        </div>
        <div className="follow-container-wrapper">
          <small className="follow-me">Follow me</small>
          <div className="follow-container">
            <a className="if" href="#"><i className="fab fa-facebook-f"></i></a>
            <a className="ig" href="#"><i className="fab fa-github"></i></a>
            <a className="iy" href="#"><i className="fab fa-youtube"></i></a>
            <a className="il" href="#"><i className="fab fa-linkedin-in"></i></a>
            <a className="it" href="#"><i className="fab fa-twitter"></i></a>
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

                  <a onClick={() => { this.setState({ shared: !this.state.shared }) }} href="https://twitter.com/intent/tweet/?text=Super%20fast%20and%20easy%20Social%20Media%20Sharing%20Buttons.%20No%20JavaScript.%20No%20tracking.&amp;url=http%3A%2F%2Fjatinkumar.tech" target="_blank" rel="noopener" aria-label="">
                    <i className="fab fa-twitter"></i>
                  </a>

                  <a onClick={() => { this.setState({ shared: !this.state.shared }) }} href="whatsapp://send?text=Super%20fast%20and%20easy%20Social%20Media%20Sharing%20Buttons.%20No%20JavaScript.%20No%20tracking.%20http%3A%2F%2Fjatinkumar.tech" target="_blank" rel="noopener" aria-label="Share on WhatsApp">
                    <i className="fab fa-whatsapp"></i>
                  </a>

                  <a onClick={() => { this.setState({ shared: !this.state.shared }) }} href="https://www.linkedin.com/shareArticle?mini=true&amp;url=http%3A%2F%2Fsharingbuttons.io&amp;title=Super%20fast%20and%20easy%20Social%20Media%20Sharing%20Buttons.%20No%20JavaScript.%20No%20tracking.&amp;summary=Super%20fast%20and%20easy%20Social%20Media%20Sharing%20Buttons.%20No%20JavaScript.%20No%20tracking.&amp;source=http%3A%2F%2Fjatinkumar.tech" target="_blank" rel="noopener" aria-label="">
                    <i className="fab fa-linkedin-in"></i>
                  </a>

                </div>
              </div>
            )
        }
      </div>
    )
  }
}