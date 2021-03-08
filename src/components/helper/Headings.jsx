import React, { useState, useEffect, useRef } from 'react';
import '../../styles/heading.scss';

export default (props) => {
  const { heading: headingText, subHeading: subHeadingText } = props;
  return (
    <>
      <div className="heading-block">
        <div className="heading-bg"></div>
        <div className="heading">{headingText}</div>
        <div className="desc">{subHeadingText}</div>
      </div>
    </>
  );
}