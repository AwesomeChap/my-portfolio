import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Svg from './svg';
import SplitText from './helper/split-text';
import '../css/nav-mobile.scss';

class NavMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: 0,
      selected: false,
      svgWidth: 80
    }
  }

  componentDidMount() {
    window.innerWidth <= 476 ? this.setState({ svgWidth: 50 }) : window.innerWidth <= 767 ? this.setState({ svgWidth: 65 }) : "";
    const routes = ['/', '/about', '/work', '/projects', '/contact'];
    let selected = routes.map((r,i)=>{
      if(r === this.props.history.location.pathname) {
        this.setState({selected : i+1});
        return i+1;
      };
    });
  
  }

  handleSelect = (index) => {
    this.setState({
      selected: index
    }, () => {
      console.log("you clicked ", this.state.selected);
      this.setState({ clicked: !this.state.clicked });
    });
  }

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked}, () => {
      console.log("you clicked ", this.state.selected);
    });
  }

  render() {

    const menuClasses = this.state.clicked ? "open-menu" : "close-menu";
    const hamburgerClasses = this.state.clicked ? "close" : this.state.clicked === 0 ? "" : "ham";
    const MINClasses = this.state.clicked ? "menu-item fadeIn-menu-item" : " menu-item fadeOut-menu-item";

    const routes = ['/', '/about', '/work', '/projects',
      // '/blog',
      '/contact'];
    const menu_items = ['HOME', 'ABOUT ME', 'WORK', 'PROJECTS',
      // 'BLOG',
      'CONTACT']; 

    const navLnks = menu_items.map((name, i) => {
      return (
        <NavLink key={i} activeClassName="selected-m-nav-item" className={MINClasses} exact to={routes[i]}
        >
          <SplitText 
            onClick={this.handleSelect} index={i + 1} 
            selected={this.state.selected} name={name}
          />
        </NavLink>
      );
    })
    return (
      <>
        <div className="nav-m">
          <NavLink className="nav-logo-m" exact to="/">
            <Svg width={this.state.svgWidth} id="logo" />
          </NavLink>
          <div onClick={this.handleClick} id="hamburger" className={hamburgerClasses}>
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>
          </div>
        </div>
        <div id="menu-wrapper" className={menuClasses} >
          {navLnks}
        </div>
      </>
    );
  }
} 

export default withRouter(NavMobile);