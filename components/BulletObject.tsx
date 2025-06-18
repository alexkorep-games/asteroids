
import React from 'react';
import { Bullet } from '../types';
import { SVG_BULLET_FILL_COLOR, SVG_STROKE_COLOR } from '../constants';

interface BulletObjectProps {
  bullet: Bullet;
}

const BulletObject: React.FC<BulletObjectProps> = ({ bullet }) => {
  return (
    <circle
      cx={bullet.x}
      cy={bullet.y}
      r={bullet.radius}
      fill={SVG_BULLET_FILL_COLOR}
      stroke={SVG_STROKE_COLOR}
      strokeWidth="1"
      shapeRendering="crispEdges"
    />
  );
};

export default BulletObject;
