import React, { useState, useEffect } from 'react'
import '../../styles/projects.scss';
import { projects as projectsData } from './data';

export default (props) => {
  let noOfProjectsFound = 0;
  let noProjectsMessage = (
    <div></div>
  );
  let projects = projectsData;
  projects = projects.map((project, i) => {
    let shouldReturn = true;
    shouldReturn = shouldReturn && (project.keywords.indexOf(props.filter) !== -1) || props.filter === 'Show All';
    
    if (shouldReturn) {
      noOfProjectsFound++;
      return (
        <div key={"project" + i} className="project-wrapper">
          <div className="project-title">
            <div className="dots">
              <div></div> <div></div> <div></div>
            </div>
            <div className="name">{project.name}</div>
          </div>
          <div className="project">
            <img src={project.imgUrl} alt="" />
            <div className="project-info">
              <div className="bg-up"></div>
              <div className="bg-down"></div>
              <div className="project-details">
                <div className="pd1"> <div className="pd-tab" >Technologies Used</div> </div>
                <div className="pd2">
                  <div>
                    <>
                      {
                        project.keywords.map((kw, i) => {
                          return <span className="pd-tab" key={"keyword-" + i}>{kw}</span>
                        })
                      }
                    </>
                  </div>
                </div>
                <div className="pd3">
                  {project.link !== '' && <a href={project.link} target="_blank"><i className="fas fa-share"></i></a>}
                  {project.gitUrl !== '' && <a href={project.gitUrl} target="_blank"><i className="fab fa-github"></i></a>}
                </div>
              </div>
            </div>
          </div>
          <div className="project-desc">
            <p>{project.desc}</p>
          </div>
        </div>
      )
    }
    else {
      return <></>
    }
  })

  return (
    <>
      {noOfProjectsFound !== 0 ? projects : noProjectsMessage}
    </>
  );
}