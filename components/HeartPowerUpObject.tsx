import React from 'react';
import { HeartPowerUp } from '../types';
import { HEART_RADIUS, SVG_HEART_FILL_CLASS, SVG_STROKE_COLOR } from '../constants';

interface HeartPowerUpObjectProps {
  heart: HeartPowerUp;
}

const HeartPowerUpObject: React.FC<HeartPowerUpObjectProps> = ({ heart }) => {
  // A simple SVG path for a heart shape, scaled by HEART_RADIUS
  // Path is roughly centered at (0,0)
  // M0,${HR*0.3} A${HR*0.35},${HR*0.35} 0 0,1 ${HR*0.35},-${HR*0.1} L${HR*0.35},-${HR*0.1} Q${HR*0.35},-${HR*0.6} 0,-${HR*0.85} Q-${HR*0.35},-${HR*0.6} -${HR*0.35},-${HR*0.1} A${HR*0.35},${HR*0.35} 0 0,1 0,${HR*0.3} Z
  const HR = HEART_RADIUS;
  const heartPath = `M0,${HR*0.25} C${HR*0.1},-${HR*0.5} ${HR*0.8},-${HR*0.5} ${HR*0.5},-${HR*0.15} C${HR*1.1},${HR*0.3} ${HR*0.25},${HR*0.8} 0,${HR*0.65} C-${HR*0.25},${HR*0.8} -${HR*1.1},${HR*0.3} -${HR*0.5},-${HR*0.15} C-${HR*0.8},-${HR*0.5} -${HR*0.1},-${HR*0.5} 0,${HR*0.25} Z`;


  const transform = `translate(${heart.x}, ${heart.y})`;

  return (
    <g transform={transform}>
      <path
        d={heartPath}
        className={`${SVG_HEART_FILL_CLASS} fill-current`}
        stroke={SVG_STROKE_COLOR}
        strokeWidth="1"
        shapeRendering="crispEdges"
      />
    </g>
  );
};

export default HeartPowerUpObject;