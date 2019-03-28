import React, { Component } from 'react';
import Svg from './svg';
import { NavLink } from 'react-router-dom';
import '../css/nav.scss';

export default class Nav extends Component {
  constructor(props){
    super(props);
    this.state = {
      clicked : 0
    }
  }

  handleClick=()=>{
    this.setState({clicked : !this.state.clicked});
  }

  render() {
    const hamClasses = this.state.clicked ? "ham-1 close-1" : this.state.clicked === 0 ? "ham-1" :  "ham-1 start-1";
    const navItemClasses = this.state.clicked ? "nav-item nav-item-open" : this.state.clicked === 0 ? "nav-item" : "nav-item nav-item-close";
    return (
      <div className="nav-bar" >
        <div className="nav-left">
          <NavLink className="nav-logo" activeClassName="selected" exact to="/">
            <Svg id="logo" />
          </NavLink>
        </div>
        <div className="nav-right-wrapper">
          <div className="nav-right">
            <div className="nav-right-inner">
              <NavLink className={navItemClasses} activeClassName="selected" exact to="/">Home</NavLink>
              <NavLink className={navItemClasses} activeClassName="selected" exact to="/about">About Me</NavLink>
              <NavLink className={navItemClasses} activeClassName="selected" exact to="/work">Work</NavLink>
              <NavLink className={navItemClasses} activeClassName="selected" exact to="/projects">Projects</NavLink>
              <NavLink className={navItemClasses} activeClassName="selected" exact to="/blog">Blog</NavLink>
              <NavLink className={navItemClasses} activeClassName="selected" exact to="/contact">Contact</NavLink>
            </div>
            <div onClick={this.handleClick} class="ham-hide-wrapper">
              <div className={hamClasses}>
                <div className="line line1"></div>
                <div className="line line2"></div>
                <div className="line line3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}