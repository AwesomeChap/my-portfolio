import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class DelayedLink extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.timeout = null
  }

  componentWillUnmount(){
    clearTimeout(this.timeout);
  }

  handleClick = (e) => {
    const {replace, to, delay, onDelayStart, onDelayEnd} = this.props;
    const history = this.props.history;

    // onDelayStart(e, to);
    // if (e.defaultPrevented) {
    //   return;
    // }
    e.preventDefault();

    this.timeout = setTimeout(() => {
      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
      // onDelayEnd(e, to);
    }, 1000);
  }

  render() {
    return (
      <>
        <NavLink onClick={this.handleClick} className={this.props.navItemClasses} activeClassName="selected" exact ><span className="nav-item-span-1">Home</span></NavLink>
      </>
    );
  }
}