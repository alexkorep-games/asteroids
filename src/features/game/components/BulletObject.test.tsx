import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import BulletObject from './BulletObject';
import { Bullet } from '../state/types';

describe('BulletObject', () => {
  it('should render the bullet', () => {
    const bullet: Bullet = {
      id: '1',
      x: 100,
      y: 100,
      angle: 0,
      radius: 2,
      life: 100,
      velocityX: 0,
      velocityY: 0,
    };
    const { container } = render(<BulletObject bullet={bullet} />);
    expect(container.querySelector('circle')).toBeInTheDocument();
  });
});
