import React, {Component} from 'react';
import '../../css/nav-mobile.scss';

export default class MenuItem extends Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  handleClick = () => {
    this.props.onClick(this.props.index);
  }

  render(){
    return(  
      <div onClick={this.handleClick} className="menu-item" >
        <div className="menu-item-bg"></div>
        <div className="menu-item-bg"></div>
        <div className={this.props.MINClasses}> <span>{this.props.name}</span> </div>
      </div>
    )    
  }
}