import React, { Component } from 'react'
import '../../css/projects.scss';
import { projects } from './data';
import superMarketImage from '../../images/sp.png';

export default class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: projects,
    };
  }

  render() {
    let projects = this.state.projects;
    projects = projects.map((p, i) => {
      let shouldReturn = true;

      shouldReturn = shouldReturn && (p.keywords.indexOf(this.props.filter) !== -1) || this.props.filter === 'Show All';

      if(shouldReturn)
      {
        return (
          <div key={"project"+i} className="project-wrapper">
            <div className="project-title">
              <div className="dots">
                <div></div> <div></div> <div></div>
              </div>
              <div className="name">{p.name}</div>
            </div>
            <div className="project">
              <img src={p.imgUrl} alt="" />
              <div className="project-info">
                <div className="bg-up"></div>
                <div className="bg-down"></div>
                <div className="project-details">
                  <div className="pd1"> <div>Technologies Used</div> </div>
                  <div className="pd2">
                    <div>
                      <>
                        {
                          p.keywords.map((kw,i) => {
                            return <span key={"keyword-"+i}>{kw}</span>
                          })
                        }
                      </>
                    </div>
                  </div>
                  <div className="pd3">
                    {p.link !== '' && <a href={p.link} target="_blank"><i className="fas fa-share"></i></a>}
                    {p.gitUrl !== '' && <a href={p.gitUrl} target="_blank"><i className="fab fa-github"></i></a>}
                  </div>
                </div>
              </div>
            </div>
            <div className="project-desc">
              <p>{p.desc}</p>
            </div>
          </div>
          )
        }else{return <></>}
    })

    return (
      <>
      {projects}
      </>
    );
  }
}