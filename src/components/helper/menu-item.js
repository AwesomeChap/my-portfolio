import React, { Component } from 'react';
import '../../css/nav-mobile.scss';

export default class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedItem: false
    };
  }

  componentDidMount() {
    this.isFirefox = /Android.+Firefox\//.test(navigator.userAgent);
  }

  handleClick = () => {
    this.props.onClick(this.props.index);
    // this.setState({clickedItem : !this.state.clickedItem});
  }

  render() {
    return (
      <div onClick={this.handleClick} className="menu-item" >
        {
          !this.isFirefox ? (
            <>
              <div className="menu-item-bg"></div>
              <div className="menu-item-bg"></div>
            </>
          ) : (
            <>
              <div style={{ transform: "scaleX(1)" }} className="menu-item-bg"></div>
              <div style={{ transform: "scaleX(1)" }} className="menu-item-bg"></div>
            </>
            )
        }
        <div className={this.props.MINClasses}> <span>{this.props.name}</span> </div>
      </div>
    )
  }
}