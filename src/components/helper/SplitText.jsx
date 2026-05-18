import React from 'react';
import '../../styles/SplitText.scss';

export default (props) => {
  const isActive = props.selected === props.index;

  return (
    <span className={isActive ? 'nav-label nav-label--active' : 'nav-label'}>
      {props.name}
    </span>
  );
};
