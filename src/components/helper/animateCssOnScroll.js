import React, { Component } from 'react';

export default class AOS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible : false,
      className: this.props.className ? this.props.className : '',
      style: this.props.style ? this.props.style : {}
    };
  }

  modifyClasses = (child) => {
    let className = child.props.className ? child.props.className : "";
    let style = child.props.style ? child.props.style : {};

    className = className.concat(" " + this.state.className);
    Object.assign(style,this.state.style);

    console.log(className);

    const props = {
      className,
      style
    };

    return React.cloneElement(child, props);
  }

  isVisible = () => {
    
  }

  componentDidMount() {
    // if()
    // console.log(document.querySelector('.barValue').classList);
    // console.log(this.props.children.className);
    // console.log(this.node.offsetTop, window.scrollY);
    console.log(this.node.offsetTop);
  }

  render() {
    return (
      <div ref={(node) => { this.node = node }}>
        {this.props.children}
        {/* {React.Children.map(this.props.children, child => this.modifyClasses(child))} */}
      </div>
    )
  }
} 