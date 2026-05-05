import React, { useEffect } from 'react';
import '../../styles/mouse.scss'

export default () => {
  const getScrollTop = () => (
    window.scrollY
    || document.documentElement.scrollTop
    || document.body.scrollTop
    || 0
  );

  useEffect(() => {
    document.body.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (/Edge/.test(navigator.userAgent)) {
      const mouseElement = document.getElementById('mouse');
      if (mouseElement) {
        mouseElement.style.display = 'none';
      }
    }
    handleScroll();

    return () => {
      document.body.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const scrollTop = getScrollTop();
    const mouseElement = document.getElementById('mouse');
    const scrollbarElement = document.querySelector('.scrollbar');
    const maxScroll = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    ) - window.innerHeight;

    if (!mouseElement || !scrollbarElement) return;

    if (scrollTop > 20) {
      mouseElement.style.opacity = 0;
      mouseElement.style.visibility = 'hidden';
    }
    else {
      mouseElement.style.opacity = 1;
      mouseElement.style.visibility = 'visible';
    }

    const widthPercent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    scrollbarElement.style.width = `${widthPercent}%`;
  };

  const handleClick = () => {
    let pageHeight = window.innerHeight * 0.9;
    document.body.style.scrollBehavior = "smooth";
    setTimeout(() => {
      document.body.scrollBy(0, pageHeight);
      document.body.style.scrollBehavior = "auto";
    }, 10);
  };

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
  );
};