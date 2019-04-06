import React, { Component } from 'react';
import Heading from './helper/heading';
import Expand from './helper/expand';
import Footer from './footer';
import '../css/pages.scss';
import { works } from './helper/data';
import { workImg } from './helper/data-uri';

export default class Work extends Component {
  render() {
    return (
      <>
        <div className="section">
          <div className="sub-section">
            <div className="sec sec1">
              <div className="inner-section">
                <div className="image-container">
                  <div className="image-border">
                    <div className="image">
                      <img src={workImg} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sec sec2">
              <div className="inner-section">
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
          <div className="sec sec3">
            <div className="inner-section">
              <Heading repair={{ y: -80 }} heading={"EXPERIENCE"} subHeading={'Time - Great Teacher'} />
              <div className="block">

                {
                  works.map((w, i) => (
                    <div key={"w" + i} className="block-item">
                      <div className="item-heading">{w.place} <span>{w.date}</span>
                        {w.link !== "" && <a target="_blank" href={w.link}><i className="fas fa-link"></i></a>}
                      </div>
                      <div className="item-content"> <span className="hglt-red">{w.designation}</span> </div>
                      <ul className="block-ul">
                        {w.rspbs.map((resp, i) => (
                          <li key={"block-li" + i} className="block-li">{resp}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                }

              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }
}