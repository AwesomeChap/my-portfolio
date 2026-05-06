import React, { useState, useEffect, useRef } from 'react';
import Heading from './helper/Headings';
import Mouse from './helper/Mouse'; 
import Footer from './helper/Footer';
import MetaTags from 'react-meta-tags';
import { set1, set2 } from './helper/data';
import { newAboutImg } from './helper/data-uri';
import ScrollTopButton from './helper/ScrollTopButton';
import DistortedPixelsPortrait from './helper/DistortedPixelsPortrait';

/** Crisp pixelated portrait: high-res downsample + nearest-neighbor upscale (DPR-aware). */
const PixelatedPortrait = ({ src, alt }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const img = new Image();
    img.decoding = 'async';
    img.src = src;

    let rafId = 0;
    let resizeObserver;

    const drawCover = (targetCtx, targetW, targetH) => {
      const iw = img.naturalWidth || 1;
      const ih = img.naturalHeight || 1;
      const scale = Math.max(targetW / iw, targetH / ih);
      const drawW = iw * scale;
      const drawH = ih * scale;
      const drawX = (targetW - drawW) / 2;
      const drawY = 0;
      targetCtx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    const draw = () => {
      if (!img.complete || !img.naturalWidth) return;

      const rect = canvas.getBoundingClientRect();
      const cssSize = Math.max(1, Math.round(Math.min(rect.width, rect.height)));
      if (!cssSize) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const buf = Math.max(1, Math.round(cssSize * dpr));

      if (canvas.width !== buf || canvas.height !== buf) {
        canvas.width = buf;
        canvas.height = buf;
      }
      canvas.style.width = `${cssSize}px`;
      canvas.style.height = `${cssSize}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;

      // Macro-pixel size (~4.5–6.75 CSS px per block): slightly lower res than before.
      const blockCss = Math.max(4, Math.min(6.75, cssSize / 76));
      const sampleSize = Math.max(56, Math.round(cssSize / blockCss));

      const low = document.createElement('canvas');
      low.width = sampleSize;
      low.height = sampleSize;
      const lowCtx = low.getContext('2d');
      if (!lowCtx) return;
      lowCtx.imageSmoothingEnabled = true;
      lowCtx.imageSmoothingQuality = 'high';
      drawCover(lowCtx, sampleSize, sampleSize);

      ctx.clearRect(0, 0, cssSize, cssSize);

      // Pixel-aligned circular silhouette: only whole macro-cells inside the circle
      // (no smooth crop slicing through blocks).
      const cx = cssSize / 2;
      const cy = cssSize / 2;
      const r = cssSize / 2;

      for (let j = 0; j < sampleSize; j += 1) {
        for (let i = 0; i < sampleSize; i += 1) {
          const x0 = Math.round((i * cssSize) / sampleSize);
          const x1 = Math.round(((i + 1) * cssSize) / sampleSize);
          const y0 = Math.round((j * cssSize) / sampleSize);
          const y1 = Math.round(((j + 1) * cssSize) / sampleSize);
          const px = (x0 + x1) / 2;
          const py = (y0 + y1) / 2;
          const dist = Math.hypot(px - cx, py - cy);
          if (dist > r) continue;

          const dw = x1 - x0;
          const dh = y1 - y0;
          if (dw < 1 || dh < 1) continue;

          const edgeStart = r * 0.78;
          let alpha = 1;
          if (dist > edgeStart) {
            const t = (dist - edgeStart) / (r - edgeStart);
            alpha = 1 - t * t * 0.82;
          }
          if (alpha < 0.04) continue;

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.drawImage(low, i, j, 1, 1, x0, y0, dw, dh);
          ctx.restore();
        }
      }
    };

    const queue = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(draw);
    };

    img.onload = queue;
    if (img.complete) queue();

    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(queue);
      if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);
    } else {
      window.addEventListener('resize', queue);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', queue);
    };
  }, [src]);

  return (
    <div className="about-pixel" role="img" aria-label={alt}>
      <canvas ref={canvasRef} className="about-pixel__canvas" />
    </div>
  );
};

export default (props) => {
  const [breakline, setBreakline] = useState(undefined);
  const [tabletView, setTabletView] = useState(undefined);

  useEffect(() => {
    setBreakline(window.innerWidth <= 767);
    setTabletView(window.innerWidth <= 1024);
    props.trackPageView();

    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    }
  }, [])

  useEffect(() => {
    /* Observe .skill-wrapper, not .proficiency: scaleX(0) on the bar track
       shrinks its intersection geometry so lower rows may never hit the threshold. */
    const rows = document.querySelectorAll("#about-skills .skill-wrapper");
    if (!rows.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const proficiency = entry.target.querySelector(".proficiency");
          const bar = proficiency?.querySelector(".barValue");
          if (entry.isIntersecting) {
            if (proficiency) proficiency.classList.add("animateSkillBarWrapper");
            if (bar) bar.classList.add("animateSkillBar");
            return;
          }
          if (proficiency) proficiency.classList.remove("animateSkillBarWrapper");
          if (bar) bar.classList.remove("animateSkillBar");
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px 12% 0px" }
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  const onWindowResize = () => {
    setBreakline(window.innerWidth <= 767);
    setTabletView(window.innerWidth <= 1024);
  }

  const useDistortedPortrait = tabletView === false;

  const getSkillsSet = (set) => (
    set.map((s, i) => {
      let inlineStyle = { width: s.value + "%" }
      return (
        <div key={i} className="skill-wrapper">
          <div className="skill">{s.name}</div>
          <div className="proficiency">
            <div style={inlineStyle} className="barValue"></div>
          </div>
        </div>
      )
    })
  )

  const semester = () => {
      const currentDate = new Date();
      const semStartDate = new Date(2021,2,1);
      let months = (currentDate.getFullYear() - semStartDate.getFullYear()) * 12;
      months -= semStartDate.getMonth();
      months += currentDate.getMonth();

      if(months < 0) months = 0;
      
      const sem = parseInt(months/6) + 1;

      switch(sem){
        case 1: return "1st";
        case 2: return "2nd";
        case 3: return "3rd";
        case 4: return "4th";
        case 5: return "5th";
        case 6: return "final";
        default: return "";
      }
  }

  return (
    <>
      <MetaTags>
        <title>About - Jatin Kumar</title>
      </MetaTags>
      <div className="section section-about">
        <div className="inner-section">

          <div className="sub-section">
            <div className="image-container">
              <div className="image">
                {useDistortedPortrait ? (
                  <DistortedPixelsPortrait src={newAboutImg} alt="Jatin Kumar portrait" />
                ) : (
                  <PixelatedPortrait src={newAboutImg} alt="Jatin Kumar portrait" />
                )}
              </div>
            </div>


            <div className="text-container">
              <div>
                <Heading heading={"ABOUT ME"} subHeading={'Who am I?'} />
                <div className="text">
                  Hi there, I am Jatin Kumar from New Delhi, who likes to mix code and creativity.
                  I am always up for learning something new. I am currently in my {semester()} Semester of <span className="hglt">Bachelor Informatik</span> which I am pursuing from
                  &nbsp;
                  <a href="https://www.plus.ac.at/" target="_blank" rel="noopener noreferrer">
                    University of Salzburg
                  </a>.
                  In my free time I like to play cricket, make drawings, go for a walk and watch science fiction movies.
              </div>
              </div>
            </div>

          </div>

        </div>

        <div className="inner-section" id="about-skills">
          <Heading repair={{ y: -90 }} heading={"SKILLS"} subHeading={'My Stack'} />
          <div className="skills-block">
            <div className="set">
              {getSkillsSet(set1)}
            </div>
            <div className="set">
              {getSkillsSet(set2)}
            </div>
          </div>
        </div>

        <div className="inner-section">
          <Heading repair={{ y: -190 }} heading={"ACHEIVEMENTS"} subHeading={'Some worthy payoffs'} />
          <div className="block-items-wrapper">
            <div className="block-item">
              <div className="item-heading">HackNSUT, NSUT {breakline && <br />} <span>March,31 2019</span></div>
              <div className="item-content">Our Team Came at <span>1st Position</span></div>
            </div>
            <div className="block-item">
              <div className="item-heading">WebQuicky, BPIT {breakline && <br />} <span>April,10 2018</span></div>
              <div className="item-content">Our Team Came at <span>2nd Position</span></div>
            </div>
          </div>
        </div>

      </div>
      <Mouse />
      <ScrollTopButton />
      <Footer />
    </>
  )
}