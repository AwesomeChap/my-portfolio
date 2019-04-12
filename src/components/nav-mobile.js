import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Svg from './svg';
import MenuItem from './helper/menu-item';
import '../css/nav-mobile.scss';

export default class NavMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: 0,
      selected: false,
      svgWidth : 80
    }
  }
 
  componentDidMount(){
    window.innerWidth <= 476 ? this.setState({svgWidth : 50}) : window.innerWidth <= 767 ? this.setState({svgWidth : 65}) : ""; 
  }

  handleSelect = (index) => {
    this.setState({
      selected : index
    },()=>{
      console.log("you clicked ",this.state.selected);
      setTimeout(() => {
        this.setState({clicked:!this.state.clicked});
      }, 1550);
    });
  }

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked, selected:false },()=>{
      console.log("you clicked ",this.state.selected);
    });
  }

  render() {
    const navBgClasses = this.state.selected ? "shrink-nav-bar-bg nav-bar-bg" : "nav-bar-bg";   
    const menuClasses = this.state.clicked ? "open-menu" : "close-menu";
    const hamburgerClasses = this.state.clicked ? "close" : this.state.clicked === 0 ? "" : "ham";
    const MINClasses = this.state.clicked ? "menu-item-name fadeIn-menu-item" : " menu-item-name fadeOut-menu-item";
    const MINClasses2 = this.state.selected ? "menu-item-name fadeOut-menu-item" : "";

    const routes = ['/','/about','/work','/projects',
    // '/blog',
    '/contact'];
    const menu_items = ['HOME','ABOUT ME','WORK','PROJECTS',
    // 'BLOG',
    'CONTACT'];
    
    const navLnks = menu_items.map((name,i)=>{
      if(this.state.selected === false){
        return(
          <NavLink key={i} activeClassName="selected-m-nav-item" className="menu-item-wrapper"  exact to={routes[i]}>
            <MenuItem onClick={this.handleSelect} index={i + 1} MINClasses={MINClasses} name={name} />
          </NavLink>
        );
      }
      else{
        if(this.state.selected !== i + 1){
          return (
          <NavLink key={i} activeClassName="selected-m-nav-item" className="menu-item-wrapper shrink-item" exact to={routes[i]}>
            <MenuItem onClick={this.handleSelect} index={i + 1} MINClasses={MINClasses2} name={name} />
          </NavLink>
          );
        }
        else{
          return(
            <NavLink key={i} activeClassName="selected-m-nav-item" className="menu-item-wrapper fadeOut-menu-item selected-menu-item" exact to={routes[i]}>
              <MenuItem onClick={this.handleSelect} index={i + 1} MINClasses={MINClasses} name={name} />
            </NavLink>
          );
        }
      }
    })
    return (
      <>
        <div className="nav-m">
          <NavLink className="nav-logo-m" exact to="/">
            {/* <div className="name-logo">JATIN KUMAR</div> */}
            <Svg width={this.state.svgWidth} id="logo" />
          </NavLink>
          <div onClick={this.handleClick} id="hamburger" className={hamburgerClasses}>
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>
          </div>
        </div>
        <div id="menu-wrapper" className={menuClasses} >
          <div className={"menu"}>
            {navLnks}
          </div>
        </div>
      </>
    );
  }
} 