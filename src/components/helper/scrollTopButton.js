import React, { Component } from 'react';
import '../../styles/main.scss'

export default class ScrollTopButton extends Component {
  componentDidMount() {
    document.body.addEventListener('scroll', this.handleScroll);
    if (/Edge/.test(navigator.userAgent)) {
      document.querySelector('.scroll-top-button').style.display = 'none';
    }
  }

  handleScroll = () => {
    if (document.body.scrollTop  <= 10) {
      // document.querySelector('.scroll-top-button').style.opacity = 0;
      // document.querySelector('.scroll-top-button').style.visibility = "hidden";
      document.querySelector('.scroll-top-button').style.transform = "translateX(-70px) rotate(180deg)";
    }
    else {
      // document.querySelector('.scroll-top-button').style.opacity = 1;
      // document.querySelector('.scroll-top-button').style.visibility = "visible";
      document.querySelector('.scroll-top-button').style.transform = "translateX(0) rotate(360deg)";
    }
  }

  handleClick = () => {
    document.body.style.scrollBehavior = "smooth";
    setTimeout(() => {
      document.body.scrollTo(0,0);
      document.body.style.scrollBehavior = "auto";
    }, 10);
  }

  render() {
    return (
      <div onClick={this.handleClick} className="scroll-top-button"><i className="fas fa-angle-up"></i></div>
    );
  }
} 