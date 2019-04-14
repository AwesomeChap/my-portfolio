import React, {Component} from 'react';

export default class MBackground extends Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
    return(
      <div className="m-background">
        <div className="uh">
          <div className="m-bg"></div>
          <div className="m-bg"></div>
        </div>
        <div className="lh">
          <div className="lh m-bg"></div>
          <div className="lh m-bg"></div>
        </div>
      </div>
    )
  }
}