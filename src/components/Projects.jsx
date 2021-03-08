import React, { useState, useEffect } from 'react';
import Heading from './helper/Headings';
import Footer from './helper/Footer';
import { keywords } from './helper/data';
import { projects } from './helper/data';
import Mouse from './helper/Mouse';
import ScrollTopButton from './helper/ScrollTopButton';
import ProjectList from './helper/ProjectList';
import { projectImg } from './helper/data-uri';
import '../styles/projects.scss'
import MetaTags from 'react-meta-tags';

const DEFAULT_FILTER = "Show All";

export default (props) => {
  const [selectedFilter, setSelectedFilter] = useState(DEFAULT_FILTER);
  const [noOfProjects, setNoOfProjects] = useState(0);

  useEffect(() => {
    let looped = false;
    let count = 0;

    props.trackPageView();

    projects.forEach((project, i) => {
      if (project.keywords.indexOf(selectedFilter) !== -1) count++;
      if (i === projects.length - 1) looped = true;
    });

    if (looped) {
      setNoOfProjects(count);
    }
  }, [selectedFilter])

  const checkItem = (item) => selectedFilter !== item;

  const handleClick = (e) => {
    let currentSelect = e.target.dataset.name;
    if (checkItem(currentSelect)) {
      setSelectedFilter(currentSelect);
    }
    else {
      setSelectedFilter(DEFAULT_FILTER)
    }
  }

  let kws = keywords.map((kw, index) => {
    const classes = checkItem(kw) ? 'kw' : 'kw-selected';
    return <div key={`keyword-${index}-${kw}`} onClick={handleClick} data-name={kw} className={classes}>{kw}</div>
  });

  return (
    <>
      <MetaTags>
        <title>Projects - Jatin Kumar</title>
        <meta name="description" content="Projects matter a lot for me. As they are great medium by which I can
                  explore a technology or framework and check it's pros and limits at the
                  same time.They also make learning new skills very easy and enjoyable as
                  you mostly are working on something that you love and enjoy."/>
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
                  you mostly are working on something that you love and enjoy.
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
              selectedFilter === "Show All" ? (
                <div className="show-filters">Showing all projects. Use the filter to display them by skill or technology</div>
              ) : (
                  <div className="show-filters">Showing <span>{noOfProjects}</span> projects related to <span>{selectedFilter}</span> </div>
                )
            }
            <div className="projects-container">
              <ProjectList filter={selectedFilter} />
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