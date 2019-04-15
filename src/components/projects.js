import React, { Component } from 'react';
import Heading from './helper/heading';
import Expand from './helper/expand';
import Footer from './footer';
import { keywords } from './helper/data';
import { projects } from './helper/data';
import ProjectList from './helper/project-list';
import { projectImg } from './helper/data-uri';
import '../css/projects.scss'
import MetaTags from 'react-meta-tags';
import portfolio from '../images/portfolio.PNG';

export default class Projects extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: "Show All",
      no_of_projects: 0,
    }
  }

  checkItem = (item) => this.state.selectedFilter !== item;

  handleClick = (e) => {
    let currentSelect = e.target.dataset.name;
    console.log(`current select is ${currentSelect}`);

    if (this.checkItem(currentSelect)) {
      this.setState({ selectedFilter: currentSelect }, () => {
        let mapped = false;
        let count = 0;

        projects.map((p, i) => {

          if (p.keywords.indexOf(this.state.selectedFilter) !== -1) {
            count++;
            console.log(p);
          }

          if (i === projects.length - 1) {
            mapped = true;
          }
        });

        if (mapped) {
          this.setState({ no_of_projects: count });
        }
      });
    }

  }

  render() {

    let kws = keywords.map((kw, index) => {
      const classes = this.checkItem(kw) ? 'kw' : 'kw-selected';
      return <div key={index} onClick={this.handleClick} data-name={kw} className={classes}>{kw}</div>
    });

    return (
      <>
        <MetaTags>
          <title>Projects - Jatin Kumar</title>
          {/* <meta name="apple-mobile-web-app-title" content="Projects - Jatin Kumar" />
          <meta name="application-name" content="Jatin Kumar Portfolio" />
          <meta name="description" content="Projects matter a lot for me. As they are great medium by which I can explore a technology or framework and check it's pros and limits at the same time.They also make learning new skills very easy and enjoyable a you mostly are working on something that you like and enjoy" />
          <meta property="og:title" content="Projects Jatin Kumar" />
          <meta property="og:image" content={portfolio} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Jatin Kumar" />
          <meta property="og:url" content="jatinkumar.tech/projects" />
          <meta property="og:description" content="Projects matter a lot for me. As they are great medium by which I can explore a technology or framework and check it's pros and limits at the same time.They also make learning new skills very easy and enjoyable as you mostly are working on something that you like and enjoy" /> */}
        </MetaTags>
        <div className="section">

          <div className="inner-section">

            <div className="sub-section">

              <div className="image-container">
                <div className="image-border">
                  <div className="image">
                    <img src={projectImg} alt="" />
                  </div>
                </div>
              </div>

              <div className="text-container">
                <div>
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
          </div>
          <div className="inner-section">
            <Heading repair={{ y: -90 }} heading={"WHAT I MAKE"} subHeading={'some cool ones'} />
            <div className="block">
              <div className="keywords">{kws}</div>
              {
                this.state.selectedFilter === "Show All" ? (
                  <div className="show-filters">Showing all projects. Use the filter to display them by skill or technology</div>
                ) : (
                    <div className="show-filters">Showing <span>{this.state.no_of_projects}</span> projects related to <span>{this.state.selectedFilter}</span> </div>
                  )
              }
              <div className="projects-container">
                <ProjectList filter={this.state.selectedFilter} />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }
}