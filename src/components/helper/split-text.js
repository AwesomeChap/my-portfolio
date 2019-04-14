import React, {Component} from 'react';
import '../../css/nav-mobile.scss';

export default class SplitText extends Component{
  constructor(props){
    super(props);
    this.state = {
      clickedItem : false
    };
  }

  handleClick = () => {
    this.props.onClick(this.props.index);
  }

  render(){
    const upperSplitClasses = this.props.selected === this.props.index ? "upper-split split upper-split-move" : "upper-split split";
    const lowerSplitClasses = this.props.selected === this.props.index ? "lower-split split lower-split-move" : "lower-split split";
    return(  
      <div onClick={this.handleClick} className="menu-item" >
        <div className={upperSplitClasses} > {this.props.name} </div>
        <div className={lowerSplitClasses} > {this.props.name} </div>
      </div>
    )    
  }
}