import React, { Component } from 'react';
import Svg from './svg';
import { NavLink, withRouter } from 'react-router-dom';
import DelayedLink from './delayedLink';
import '../css/nav.scss';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: 0,
    }
    this.delay = 0;
  }

  handleExpLink = (e) => {
    setTimeout(() => {
      history.push('/contact')
    }, 2000)
  }

  handleNavLinkClick = (e) => {
    const to = e.target.dataset.to;
    console.log(to);
    if (this.state.clicked !== 0) {
      this.setState({ clicked: false });
      e.preventDefault()
      setTimeout(() => {
          this.props.history.push(to)
      },this.delay);
    }
  }

  handleScroll = () => {
    if (this.state.clicked !== 0) {
      this.setState({ clicked: false });
    }
  }

  componentDidMount() {
    // setTimeout(()=>{
    //   this.props.history.push('/contact');
    // },1000);
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleClick = () => {
    // console.log(this.node);
    this.setState({ clicked: !this.state.clicked });
  }

  render() {
    const hamClasses = this.state.clicked ? "ham-1 close-1" : this.state.clicked === 0 ? "ham-1" : "ham-1 start-1";
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
              <NavLink data-to="/" onClick={this.handleNavLinkClick} className={navItemClasses} activeClassName="selected" exact to="/"><span data-to="/" className="nav-item-span-1">Home</span></NavLink>
              <NavLink data-to="/about" onClick={this.handleNavLinkClick} className={navItemClasses} activeClassName="selected" exact to="/about"><span data-to="/about" className="nav-item-span-2">About Me</span></NavLink>
              <NavLink data-to="/work" onClick={this.handleNavLinkClick} className={navItemClasses} activeClassName="selected" exact to="/work"><span data-to="/work" className="nav-item-span-3">Work</span></NavLink>
              <NavLink data-to="/projects" onClick={this.handleNavLinkClick} className={navItemClasses} activeClassName="selected" exact to="/projects"><span data-to="/projects" className="nav-item-span-4">Projects</span></NavLink>
              {/* <NavLink data-to="/blog" onClick={this.handleNavLinkClick} className={navItemClasses} activeClassName="selected" exact to="/blog"><span data-to="/blog" className="nav-item-span-5">Blog</span></NavLink> */}
              <NavLink data-to="/contact" onClick={this.handleNavLinkClick} className={navItemClasses} activeClassName="selected" exact to="/contact"><span data-to="/contact" className="nav-item-span-6">Contact</span></NavLink>
            </div>
            <div ref={(node) => this.node = node} onClick={this.handleClick} className="ham-hide-wrapper">
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

export default withRouter(Nav);