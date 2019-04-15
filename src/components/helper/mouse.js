import React, { Component } from 'react';
import '../../css/mouse.scss'

export default class Mouse extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    document.body.addEventListener('scroll',this.handleScroll);
  }

  handleScroll = () => {
    if(document.body.scrollTop > 20){
      document.querySelector('.mouse').style.opacity = 0;
    }
    else{
      document.querySelector('.mouse').style.opacity = 1;
    }

    document.querySelector(".scrollbar").style.width = (document.body.scrollTop/(document.body.scrollHeight - window.innerHeight))*100 + "%";
  } 

  handleClick = () => {
    let pageHeight = window.innerHeight*0.9;
    document.body.style.scrollBehavior = "smooth";
    setTimeout(()=>{
      document.body.scrollBy(0, pageHeight);
      document.body.style.scrollBehavior = "auto";
    },10);
  }

  componentWillUnmount

  render() {
    return (
      <>
        <div class="mouse">
          <div onClick={this.handleClick}  class="mouse-icon">
            <span class="mouse-wheel"></span>
          </div>
        </div>
        <div className="scrollbar-wrapper">
          <div className="scrollbar"></div>
        </div>
      </>
    )
  }
}