import React, { useEffect } from 'react';
import '../../styles/ScrollTopButton.scss'

export default () => {
  useEffect(() => {
    const scroller = document.scrollingElement || document.documentElement;
    scroller.addEventListener('scroll', handleScroll);
    if (/Edge/.test(navigator.userAgent)) {
      document.querySelector('.scroll-top-button').style.display = 'none';
    }
    handleScroll();
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, [])

  const handleScroll = () => {
    const scroller = document.scrollingElement || document.documentElement;
    if (scroller.scrollTop <= 10) {
      document.querySelector('.scroll-top-button').style.transform = "translateX(-70px) rotate(180deg)";
    }
    else {
      document.querySelector('.scroll-top-button').style.transform = "translateX(0) rotate(360deg)";
    }
  }

  const handleClick = () => {
    const scroller = document.scrollingElement || document.documentElement;
    scroller.style.scrollBehavior = "smooth";
    setTimeout(() => {
      scroller.scrollTo(0,0);
      scroller.style.scrollBehavior = "auto";
    }, 10);
  }

  return (
    <div onClick={handleClick} className="scroll-top-button"><i className="fas fa-angle-up"></i></div>
  );
} 