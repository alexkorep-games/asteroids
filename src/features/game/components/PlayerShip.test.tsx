import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import PlayerShip from './PlayerShip';
import { Player } from '../state/types';
import { PLAYER_SIZE } from '../../../constants';

describe('PlayerShip', () => {
  it('should render the player ship', () => {
    const player: Player = {
      id: '1',
      x: 100,
      y: 100,
      angle: 0,
      radius: PLAYER_SIZE / 2,
      isThrusting: false,
      invincibleTimer: 0,
      velocityX: 0,
      velocityY: 0,
      rotationDirection: 0,
    };
    const { container } = render(<PlayerShip player={player} />);
    expect(container.querySelector('g')).toBeInTheDocument();
  });
});
