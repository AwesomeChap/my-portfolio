import React, { useState } from 'react';
import '../../styles/SplitText.scss';

export default (props) => {
  const [clickedItem, setClickedItem] = useState(false);

  const handleClick = () => {
    props.onClick(props.index);
  }

  const upperSplitClasses = props.selected === props.index ? "upper-split split upper-split-move" : "upper-split split";
  const lowerSplitClasses = props.selected === props.index ? "lower-split split lower-split-move" : "lower-split split";
  return (
    <div onClick={handleClick} className="menu-item" >
      <div className={upperSplitClasses} > {props.name} </div>
      <div className={lowerSplitClasses} > {props.name} </div>
    </div>
  )
}