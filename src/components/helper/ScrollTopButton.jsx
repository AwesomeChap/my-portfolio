import React, { useEffect } from 'react';
import '../../styles/ScrollTopButton.scss'

export default () => {
  useEffect(() => {
    document.body.addEventListener('scroll', handleScroll);
    if (/Edge/.test(navigator.userAgent)) {
      document.querySelector('.scroll-top-button').style.display = 'none';
    }
    return () => document.body.removeEventListener('scroll', handleScroll);
  })

  const handleScroll = () => {
    if (document.body.scrollTop  <= 10) {
      document.querySelector('.scroll-top-button').style.transform = "translateX(-70px) rotate(180deg)";
    }
    else {
      document.querySelector('.scroll-top-button').style.transform = "translateX(0) rotate(360deg)";
    }
  }

  const handleClick = () => {
    document.body.style.scrollBehavior = "smooth";
    setTimeout(() => {
      document.body.scrollTo(0,0);
      document.body.style.scrollBehavior = "auto";
    }, 10);
  }

  return (
    <div onClick={handleClick} className="scroll-top-button"><i className="fas fa-angle-up"></i></div>
  );
} 