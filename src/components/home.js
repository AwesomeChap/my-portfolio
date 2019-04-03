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
          <span><i className="fab if fa-facebook-f"></i></span>
          <span><i className="fab ig fa-github"></i></span>
          <span><i className="fab il fa-linkedin-in"></i></span>
          <span><i className="fab it fa-twitter"></i></span>
        </div>
        <div className="love">SHARE WITH <span>❤</span></div>
      </div>
    )
  }
}