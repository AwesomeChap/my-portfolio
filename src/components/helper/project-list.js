import React, { Component } from 'react'
import '../../css/projects.scss';
import { projects } from './data';
import superMarketImage from '../../images/sp.png';

export default class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: projects,
      kws : this.props.kws ? this.props.kws : [],
    };
  }
  render() {
    let projects = this.state.projects;
    projects = projects.map((p, i) => {
      let shouldReturn = true;

      this.state.kws.forEach(kw => {
        shouldReturn = shouldReturn && (p.keywords.indexOf(kw) !== -1)
      });

      if(shouldReturn)
      {
        return (
          <div className="project-wrapper">
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
                    <a href={p.link} className={p.link === '' && "disabled"}  target="_blank"><i class="fas fa-share"></i></a>
                    <a href={p.gitUrl} className={p.gitUrl === '' && "disabled"} target="_blank"><i class="fab fa-github"></i></a>
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