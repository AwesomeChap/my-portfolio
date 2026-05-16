import React, { useState, useEffect } from 'react';
import Heading from './helper/Headings';
import Footer from './helper/Footer';
import { keywords } from './helper/data';
import { projects } from './helper/data';
import Mouse from './helper/Mouse';
import ScrollTopButton from './helper/ScrollTopButton';
import ProjectList from './helper/ProjectList';
import projectsHeroImg from '../images/projects-hero.png';
import '../styles/pages.scss';
import '../styles/projects.scss';
import MetaTags from 'react-meta-tags';
import DistortedPixelsPortrait from './helper/DistortedPixelsPortrait';
import MaintenanceBlock from './helper/MaintenanceBlock';

const DEFAULT_FILTER = "Show All";

/** Production: set true when the project grid is ready to ship. */
const PROJECTS_LIST_LIVE = false;

const DEV_PREVIEW_KEY = "portfolio_projects_list_preview";

function isLocalDevHost() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "[::1]" ||
    host.endsWith(".local")
  );
}

const ProjectsHeroPhoto = ({ src, alt }) => (
  <div className="about-pixel">
    <img src={src} alt={alt} className="about-pixel__photo" />
  </div>
);

export default (props) => {
  const [selectedFilter, setSelectedFilter] = useState(DEFAULT_FILTER);
  const [noOfProjects, setNoOfProjects] = useState(0);
  const [tabletView, setTabletView] = useState(undefined);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [devShowList, setDevShowList] = useState(false);

  useEffect(() => {
    setTabletView(window.innerWidth <= 1024);
    props.trackPageView();
    const onResize = () => setTabletView(window.innerWidth <= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const local = isLocalDevHost();
    setIsLocalhost(local);
    if (!local) return;
    try {
      setDevShowList(sessionStorage.getItem(DEV_PREVIEW_KEY) === "1");
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    let count = 0;
    projects.forEach((project) => {
      if (project.keywords.indexOf(selectedFilter) !== -1) count += 1;
    });
    setNoOfProjects(count);
  }, [selectedFilter]);

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

  const useDistortedHero = tabletView === false;
  const showProjectsList = isLocalhost ? devShowList : PROJECTS_LIST_LIVE;

  const toggleDevPreview = () => {
    const next = !devShowList;
    setDevShowList(next);
    try {
      if (next) sessionStorage.setItem(DEV_PREVIEW_KEY, "1");
      else sessionStorage.removeItem(DEV_PREVIEW_KEY);
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <>
      <MetaTags>
        <title>Projects - Jatin Kumar</title>
        <meta name="description" content="Projects matter a lot for me. As they are great medium by which I can
                  explore a technology or framework and check it's pros and limits at the
                  same time.They also make learning new skills very easy and enjoyable as
                  you mostly are working on something that you love and enjoy."/>
      </MetaTags>
      <div className="section section-work">

        <div className="inner-section">

          <div className="sub-section">

            <div className="image-container">
              <div className="image">
                {useDistortedHero ? (
                  <DistortedPixelsPortrait src={projectsHeroImg} alt="Developer desk with laptop and dual monitors" />
                ) : (
                  <ProjectsHeroPhoto src={projectsHeroImg} alt="Developer desk with laptop and dual monitors" />
                )}
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
        <div className="inner-section" id="projects-make" data-scroll-cue-target>
          <Heading repair={{ y: -90 }} heading={"WHAT I MAKE"} subHeading={'some cool ones'} />
          {showProjectsList ? (
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
          ) : (
            <MaintenanceBlock
              text="This section is still under construction. The project showcase will appear here once the pixel dust settles."
            />
          )}
        </div>
      </div>

      {isLocalhost ? (
        <div className="dev-preview-toggle">
          <button
            type="button"
            className="dev-preview-toggle__btn"
            onClick={toggleDevPreview}
            aria-pressed={devShowList}
          >
            {devShowList
              ? "Dev: showing project grid"
              : "Dev: showing maintenance (prod view)"}
          </button>
        </div>
      ) : null}

      <Mouse />
      <ScrollTopButton />
      <Footer />
    </>
  )
}
