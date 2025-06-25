
import React from 'react';
import { Player } from '../state/types';
import { PLAYER_SIZE, SVG_PLAYER_FILL_COLOR, SVG_STROKE_COLOR } from '../../../constants';
import { getPlayerPolygon } from '../utils/gameHelpers';

interface PlayerShipProps {
  player: Player;
}

const PlayerShip: React.FC<PlayerShipProps> = ({ player }) => {
  const playerPolygonPoints = getPlayerPolygon(PLAYER_SIZE)
    .map(p => `${p.x},${p.y}`)
    .join(' ');

  const thrustPolygonPoints = [
    { x: 0, y: PLAYER_SIZE * 0.33 + 2 },
    { x: PLAYER_SIZE * 0.25, y: PLAYER_SIZE * 0.33 + PLAYER_SIZE * 0.33 + Math.random() * 5},
    { x: -PLAYER_SIZE * 0.25, y: PLAYER_SIZE * 0.33 + PLAYER_SIZE * 0.33 + Math.random() * 5},
  ].map(p => `${p.x},${p.y}`).join(' ');

  const transform = `translate(${player.x}, ${player.y}) rotate(${player.angle})`;

  return (
    <g transform={transform} className={player.invincibleTimer > 0 && (player.invincibleTimer / 10) % 2 < 1 ? 'opacity-50' : 'opacity-100'}>
      <polygon
        points={playerPolygonPoints}
        fill={SVG_PLAYER_FILL_COLOR}
        stroke={SVG_STROKE_COLOR}
        strokeWidth="1.5"
        shapeRendering="crispEdges"
      />
      {player.isThrusting && (
        <polygon
          points={thrustPolygonPoints}
          className="text-orange-400 fill-current" // This uses Tailwind classes correctly
          strokeWidth="1"
          shapeRendering="crispEdges"
        />
      )}
    </g>
  );
};

export default PlayerShip;
