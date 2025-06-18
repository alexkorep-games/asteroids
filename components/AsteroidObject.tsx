
import React from 'react';
import { Asteroid } from '../types';
import { SVG_ASTEROID_FILL_COLOR, SVG_STROKE_COLOR } from '../constants';

interface AsteroidObjectProps {
  asteroid: Asteroid;
}

const AsteroidObject: React.FC<AsteroidObjectProps> = ({ asteroid }) => {
  const points = asteroid.vertices.map(p => `${p.x},${p.y}`).join(' ');
  const transform = `translate(${asteroid.x}, ${asteroid.y}) rotate(${asteroid.angle})`;

  return (
    <g transform={transform}>
      <polygon
        points={points}
        fill={SVG_ASTEROID_FILL_COLOR}
        stroke={SVG_STROKE_COLOR}
        strokeWidth="1.5"
        shapeRendering="crispEdges"
      />
    </g>
  );
};

export default AsteroidObject;
