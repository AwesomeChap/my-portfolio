import React, { Component } from 'react';
import '../../styles/mouse.scss'

export default class Mouse extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.body.addEventListener('scroll', this.handleScroll);
    if (/Edge/.test(navigator.userAgent)) {
      document.getElementById('mouse').style.display = 'none';
    }
  }

  handleScroll = () => {
    if (document.body.scrollTop > 20) {
      document.getElementById('mouse').style.opacity = 0;
      document.getElementById('mouse').style.visibility = "hidden";
    }
    else {
      document.getElementById('mouse').style.opacity = 1;
      document.getElementById('mouse').style.visibility = "visible";
    }

    document.querySelector(".scrollbar").style.width = (document.body.scrollTop / (document.body.scrollHeight - window.innerHeight)) * 100 + "%";
  }

  handleClick = () => {
    let pageHeight = window.innerHeight * 0.9;
    document.body.style.scrollBehavior = "smooth";
    setTimeout(() => {
      document.body.scrollBy(0, pageHeight);
      document.body.style.scrollBehavior = "auto";
    }, 10);
  }

  componentWillUnmount

  render() {
    return (
      <>
        <div id="mouse">
          <div onClick={this.handleClick} className="mouse-icon">
            <span className="mouse-wheel"></span>
          </div>
        </div>
        <div className="scrollbar-wrapper">
          <div className="scrollbar"></div>
        </div>
      </>
    )
  }
}