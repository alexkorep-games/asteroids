import React from 'react';
import { Point } from '../state/types';

interface VirtualJoystickProps {
  basePosition: Point;
  nubPosition: Point;
  isActive: boolean;
  baseRadius: number;
  nubRadius: number;
}

const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  basePosition,
  nubPosition,
  isActive,
  baseRadius,
  nubRadius,
}) => {
  if (!isActive) {
    return null;
  }

  return (
    <g pointerEvents="none" aria-hidden="true"> {/* Visual only, no direct interaction */}
      <circle
        cx={basePosition.x}
        cy={basePosition.y}
        r={baseRadius}
        fill="rgba(128, 128, 128, 0.2)" // More transparent base
        stroke="rgba(200, 200, 200, 0.3)"
        strokeWidth="1.5"
      />
      <circle
        cx={nubPosition.x}
        cy={nubPosition.y}
        r={nubRadius}
        fill="rgba(180, 180, 180, 0.4)" // More transparent nub
        stroke="rgba(220, 220, 220, 0.5)"
        strokeWidth="1.5"
      />
    </g>
  );
};

export default VirtualJoystick;