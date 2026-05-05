import React from 'react';
import '../../styles/SplitText.scss';

export default (props) => {
  const upperSplitClasses = props.selected === props.index ? "upper-split split upper-split-move" : "upper-split split";
  const lowerSplitClasses = props.selected === props.index ? "lower-split split lower-split-move" : "lower-split split";
  return (
    <div className="menu-item" >
      <div className={upperSplitClasses} > {props.name} </div>
      <div className={lowerSplitClasses} > {props.name} </div>
    </div>
  )
}