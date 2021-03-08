import React, { useEffect } from 'react';
import '../../styles/mouse.scss'

export default () => {
  useEffect(() => {
    document.body.addEventListener('scroll', handleScroll);
    if (/Edge/.test(navigator.userAgent)) {
      document.getElementById('mouse').style.display = 'none';
    }

    return () => document.body.removeEventListener('scroll', handleScroll);
  })

  const handleScroll = () => {
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

  const handleClick = () => {
    let pageHeight = window.innerHeight * 0.9;
    document.body.style.scrollBehavior = "smooth";
    setTimeout(() => {
      document.body.scrollBy(0, pageHeight);
      document.body.style.scrollBehavior = "auto";
    }, 10);
  }

  return (
    <>
      <div id="mouse">
        <div onClick={handleClick} className="mouse-icon">
          <span className="mouse-wheel"></span>
        </div>
      </div>
      <div className="scrollbar-wrapper">
        <div className="scrollbar"></div>
      </div>
    </>
  )
}