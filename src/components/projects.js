import React, { Component } from 'react';
import Heading from './helper/heading';
import Expand from './helper/expand';
import { keywords } from './helper/data';
import ProjectList from './helper/project-list';
import {projectImg} from './helper/data-uri';

export default class Projects extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: "Show All"
    }
  }

  checkItem = (item) => this.state.selectedFilter !== item;

  handleClick = (e) => {
    let currentSelect = e.target.dataset.name;
    console.log(`current select is ${currentSelect}`);

    if (this.checkItem(currentSelect)) {
      this.setState({ selectedFilter: currentSelect });
    }

  }

  render() {

    let kws = keywords.map((kw, index) => {
      const classes = this.checkItem(kw) ? 'kw' : 'kw-selected';
      return <div key={index} onClick={this.handleClick} data-name={kw} className={classes}>{kw}</div>
    });

    return (
      <div className="section">
        <div className="sub-section">
          <div className="sec sec1">
            <div className="inner-section">
              <div className="image-container">
                <div className="image-border">
                  <div className="image">
                    <img src={projectImg} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sec sec2">
            <div className="inner-section">
              <Heading heading={"PROJECTS"} subHeading={"Developer's Playground"} />
              <div className="text">
                Projects matter a lot for me. As they are great medium by which I can
                explore a technology or framework and check it's pros and limits at the
                same time.They also make learning new skills very easy and enjoyable as
                you mostly are working on something that you like and enjoy
              </div>
            </div>
          </div>
        </div>
        <div className="sec sec3">
          <div className="inner-section">
            <Heading repair={{ y: -90 }} heading={"WHAT I MAKE"} subHeading={'some cool ones'} />
            <div className="block">
              <div className="keywords">{kws}</div>
              <div className="show-filters">CLick above to apply or toggle filter </div>
              <div className="projects-container">
                <ProjectList filter={this.state.selectedFilter} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}