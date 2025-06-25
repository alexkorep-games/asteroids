import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import AsteroidObject from './AsteroidObject';
import { Asteroid } from '../state/types';

describe('AsteroidObject', () => {
  it('should render the asteroid', () => {
    const asteroid: Asteroid = {
      id: '1',
      x: 100,
      y: 100,
      angle: 0,
      radius: 20,
      size: 3,
      vertices: [],
      velocityX: 0,
      velocityY: 0,
      rotationSpeed: 0,
    };
    const { container } = render(<AsteroidObject asteroid={asteroid} />);
    expect(container.querySelector('g')).toBeInTheDocument();
  });
});
