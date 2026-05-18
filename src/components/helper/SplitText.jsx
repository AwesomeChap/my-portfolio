import React from 'react';
import '../../styles/SplitText.scss';

export default (props) => {
  const isActive = props.selected === props.index;

  if (isActive) {
    return (
      <span className="nav-label nav-label--active">
        <span className="nav-label__pixel-text">{props.name}</span>
      </span>
    );
  }

  return <span className="nav-label">{props.name}</span>;
};
