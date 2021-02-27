import React, { useState, useEffect } from 'react';
import Heading from './helper/heading';
import Footer from './Footer';
import '../styles/pages.scss';
import { works } from './helper/data';
import { workImg } from './helper/data-uri';
import MetaTags from 'react-meta-tags';
import Mouse from './helper/mouse';
import ScrollTopButton from './helper/scrollTopButton';

export default () => {
  return (
    <>
      <MetaTags>
        <title>Work - Jatin Kumar</title>
        <meta name="description" content="I always love to learn new technologies and like even more,
                  when I get the chance to apply them. I have been doing Fullstack
                  Web development for almost 2 years now. Till date my most work
                  experience came from contribution to small startups and college
                  technical festivals"/>
      </MetaTags>
      <div className="section">
        <div className="inner-section">
          <div className="sub-section">
            <div className="image-container">
              <div className="image-border">
                <div className="image">
                  <img src={workImg} alt="" />
                </div>
              </div>
            </div>
            <div className="text-container">
              <div>
                <Heading heading={"WORK"} subHeading={'Things I do'} />
                <div className="text">
                  I always love to learn new technologies and like even more,
                  when I get the chance to apply them. I have been doing Fullstack
                  Web development for almost 2 years now. Till date my most work
                  experience came from contribution to small startups and college
                  technical festivals
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="inner-section">
          <Heading repair={{ y: -80 }} heading={"EXPERIENCE"} subHeading={'Time - A Great Teacher'} />
          <div className="block">
            {
              works.map((work, i) => (
                <div key={"work" + i} className="block-item">
                  <div className="item-heading">{work.place} 
                    <br />
                    <span>{work.date}</span>
                    {work.link !== "" && <a target="_blank" href={work.link}><i className="fas fa-external-link-alt"></i></a>}
                  </div>
                  <div className="item-content"> <span className="hglt-red">{work.designation}</span> </div>
                  <ul className="block-ul">
                    {work.rspbs.map((resp, i) => (
                      <li key={"block-li" + i} className="block-li">{resp}</li>
                    ))}
                  </ul>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <ScrollTopButton />
      <Mouse />
      <Footer />
    </>
  )
}