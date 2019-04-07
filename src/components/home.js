import React, { Component } from 'react';
import Background from './helper/background';
import '../css/pages.scss';
import '../css/home.scss';

export default class Home extends Component {
  render() {

    const text1 = "HELLO.";
    const text2 = "I'M";
    const text3= "JATIN";
    let t1 = text1.length;
    let t2 = text2.length + t1;

    return (
      <div className="section home">
        <Background />
        <div className="intro">
          <div class="content">
            <div className="intro-text" style={{ color: "#999" }}>
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
                  i+=t1;
                  let style = { animationDelay: `${i / 10}s` };
                  return <span style={style}>{t}</span>
                })
              }
              <span>&nbsp;</span>
              {
                text3.split("").map((t, i) => {
                  i+=t2;
                  let style = { animationDelay: `${i / 10}s` };
                  return <span style={style}>{t}</span>
                })
              }
            </div>
            {/* <div className="intro-text" ><span>I AM</span></div>
            <div className="intro-text" ><span>JATIN</span></div> */}
          </div>
        </div>
        <div className="follow-container">
          <a className="if" href="#"><i className="fab fa-facebook-f"></i></a>
          <a className="ig" href="#"><i className="fab fa-github"></i></a>
          <a className="il" href="#"><i className="fab fa-linkedin-in"></i></a>
          <a className="it" href="#"><i className="fab fa-twitter"></i></a>
        </div>
        <div className="love">SHARE WITH <span>❤</span></div>
      </div>
    )
  }
}