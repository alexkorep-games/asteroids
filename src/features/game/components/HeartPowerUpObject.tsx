import React from 'react';
import { HeartPowerUp } from '../state/types';
import { HEART_RADIUS, SVG_HEART_FILL_CLASS, SVG_STROKE_COLOR } from '../../../constants';

interface HeartPowerUpObjectProps {
  heart: HeartPowerUp;
}

const HeartPowerUpObject: React.FC<HeartPowerUpObjectProps> = ({ heart }) => {
  // A simple SVG path for a heart shape, scaled by HEART_RADIUS
  const heartPath = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
  const scale = (HEART_RADIUS * 2) / 24;
  const transform = `translate(${heart.x}, ${heart.y}) scale(${scale}) translate(-12, -12)`;

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