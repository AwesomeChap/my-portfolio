import React, { Component } from 'react';
import Svg from './svg';
import { NavLink } from 'react-router-dom';
import '../css/nav.scss';

export default () => (
  <>
    <div className="nav-bar" >
      <div className="nav-left">
        <NavLink className="nav-logo" activeClassName="selected" exact to="/">
          <Svg id="logo" />
        </NavLink>
      </div>
      <div className="nav-right">
        <NavLink className="nav-item" activeClassName="selected" exact to="/">Home</NavLink>
        <NavLink className="nav-item" activeClassName="selected" exact to="/about">About Me</NavLink>
        <NavLink className="nav-item" activeClassName="selected" exact to="/work">Work</NavLink>
        <NavLink className="nav-item" activeClassName="selected" exact to="/projects">Projects</NavLink>
        <NavLink className="nav-item" activeClassName="selected" exact to="/blog">Blog</NavLink>
        <NavLink className="nav-item" activeClassName="selected" exact to="/contact">Contact</NavLink>
      </div>
    </div>
  </>
);