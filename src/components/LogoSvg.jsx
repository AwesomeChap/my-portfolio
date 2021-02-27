import React from 'react';
import '../styles/svg.scss';

const svg =  ({fill="rgb(255, 13, 45)",stroke="#111", strokeWidth="1.5", width="80"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} version="1.1" viewBox="0 0 170 110">
    <g id="logo-group">
      <polygon className="jk" fill={fill} stroke={stroke} strokeWidth={strokeWidth} points="1,55 19,19 83,8 82,13 " />
      <polygon className="jk" fill={fill} stroke={stroke} strokeWidth={strokeWidth} points="41,105 67,81 91,7 83,8 " />
      <polygon className="jk" fill={fill} stroke={stroke} strokeWidth={strokeWidth} points="22,59 14,92 41,105 43,99 " />
      <polygon className="jk" fill={fill} stroke={stroke} strokeWidth={strokeWidth} points="170,1 151,36 96,54 100,45 " />
      <polygon className="jk" fill={fill} stroke={stroke} strokeWidth={strokeWidth} points="150,110 121,100 96,54 103,51 " />
      <polygon className="jk" fill={fill} stroke={stroke} strokeWidth={strokeWidth} points="121,5 93,31 65,106 71,106 " />
    </g>
  </svg>
);

export default svg;