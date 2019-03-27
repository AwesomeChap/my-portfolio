import React, {Component} from 'react';
import Heading from './helper/heading';
import Expand from './helper/expand';
import '../css/pages.scss';

export default class Work extends Component{
  render(){
    return(
      <div className="section">
        <div className="sub-section">
          <div className="sec sec1">
            <div className="inner-section">
              ONE
            </div>
          </div>
          <div className="sec sec2">
            <div className="inner-section"> 
              <Heading heading={"WORK"} subHeading={'Things I do'}/>
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
            <Heading repair={{y:-80}} heading={"EXPERIENCE"} subHeading={'Time - Great Teacher'}/>
            <div className="projects-block">
              <div className="block">

                <div className="block-item">
                  <div className="item-heading">INFOX, Techspace USICT <span>Sep,1 2018 - Oct,26 2018</span>
                    <a target="_blank" href="https://github.com/techspaceusict/infox18"><i class="fas fa-link"></i></a>
                  </div>
                  <div className="item-content"> <span className="hglt">Lead Frontend Developer</span> </div>
                  <ul className="block-ul">
                    <li className="block-li">Created robust UI</li>
                    <li className="block-li">Wrote almost everything from scratch</li>
                    <li className="block-li">Designed icons</li>
                    <li className="block-li">Managed working of frontend with Backend</li>
                    <li className="block-li">Work in multidisciplinary team</li>
                  </ul>
                </div>

                <div className="block-item">
                  <div className="item-heading">Web Masters, Techspace USICT <span>Oct,28 2018</span></div>
                  <div className="item-content"> <span className="hglt">Organiser & Co-Judge</span></div>
                  <ul className="block-ul">
                    <li className="block-li">Monitered Progress of participants</li>
                    <li className="block-li">Provided Guidence in Pre-event discussion</li>
                    <li className="block-li">Judged considering all equal</li>
                  </ul>
                </div>

                <div className="block-item">
                  <div className="item-heading">Delhipreneurs <span>July,1 2018 - present</span></div>
                  <div className="item-content"> <span className="hglt">Web Developer</span></div>
                  <ul className="block-ul">
                    <li className="block-li">Wrote vareity of animations</li>
                    <li className="block-li">improved previous template</li>
                    <li className="block-li">Designed logo</li>
                    <li className="block-li">Connected Frontend and Backend </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}