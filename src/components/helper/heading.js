import React, {Component} from 'react';
import '../../css/heading.scss';
import {TweenLite} from 'gsap';

export default class Heading extends Component {
  constructor(props){
    super(props);
    this.state = {
      screenWidth: 0,
      screenHeight: 0,
      e_width: 0,
      e_height : 0,
      e_offsetX : 0,
      e_offsetY : 0
    };
    this.myTween = null;
    this.myTween1 = null;
    this.myTween2 = null;
    this.myTween3 = null;
  };

  componentDidMount(){
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ 
      screenWidth: window.innerWidth, 
      screenHeight: window.innerHeight,
      e_height : this.headingWrapper.clientHeight,
      e_width : this.headingWrapper.clientWidth,
      e_offsetX : this.headingWrapper.offsetLeft,
      e_offsetY : this.headingWrapper.offsetTop, 
      e_offsetX_1 : this.headingWrapper.getBoundingClientRect().x,
      e_offsetY_1 : this.headingWrapper.getBoundingClientRect().y,  
      disabled : this.props.disabled ? true : false,
    });
  }

  handleClick = (e) => {
    const {e_width, e_height, e_offsetX, e_offsetY, e_offsetX_1, e_offsetY_1} = this.state;
    console.log(e_width, e_height, e_offsetX, e_offsetY, e_offsetX_1, e_offsetY_1);
    // console.log(e.nativeEvent);
  }

  handleMouseMove = (e) => {
    const {e_width, e_height, e_offsetX, e_offsetY, screenWidth, screenHeight} = this.state;
    let x = e.clientX;
    let y = e.clientY;
    let cx = e_offsetX + e_width/2;
    let cy = e_offsetY + e_height/2;

    let dx = cx - x, dy = cy - y;
    dx *= 100/screenWidth;
    dy *= 100/screenHeight;

    if(!this.state.disabled){
      if(this.props.repair){
        if(this.props.repair.y){
          dy+=this.props.repair.y;
        }
        if(this.props.repair.x){
          dx+=this.props.repair.x;
        }
        this.myTween1 = TweenLite.to(this.headingBg, 1, {x: 0.5*dx, y: 0.5*dy, ease: Power1.easeOut});
        this.myTween2 = TweenLite.to(this.heading, 1, {x: 1*dx, y: 1*dy, ease: Power1.easeOut});
        this.myTween3 = TweenLite.to(this.subHeading, 1, {x: 1*dx, y: 1*dy, ease: Power3.easeOut});
      }
      else{
        this.myTween1 = TweenLite.to(this.headingBg, 1, {x: 0.5*dx, y: 0.5*dy, ease: Power1.easeOut});
        this.myTween2 = TweenLite.to(this.heading, 1, {x: 1*dx, y: 1*dy, ease: Power1.easeOut});
        this.myTween3 = TweenLite.to(this.subHeading, 1, {x: 1*dx, y: 1*dy, ease: Power3.easeOut});
      }   
    }
  }

  render(){
    const {heading, subHeading} = this.props;
    return(
      <>
        <div ref={div => this.headingWrapper = div} onMouseMove={this.handleMouseMove} onClick={this.handleClick} className="heading-block">
          <div ref={div => this.headingBg = div} className="heading-bg"></div>
          <div ref={div => this.heading = div} className="heading">{heading}</div>
          <div ref={div => this.subHeading = div} className="desc">{subHeading}</div>
        </div>
      </>
    );
  }
}