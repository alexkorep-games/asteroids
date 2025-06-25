import { describe, it, expect, vi } from 'vitest';
import { degToRad, wrapScreen, createAsteroid, checkCollision, generateAsteroidVertices, getPlayerPolygon } from './gameHelpers';
import { ASTEROID_SIZES } from '../../../constants';
import { GameObject } from '../state/types';

describe('gameHelpers', () => {
  describe('degToRad', () => {
    it('should convert degrees to radians correctly', () => {
      expect(degToRad(0)).toBe(0);
      expect(degToRad(90)).toBe(Math.PI / 2);
      expect(degToRad(180)).toBe(Math.PI);
      expect(degToRad(270)).toBe(3 * Math.PI / 2);
      expect(degToRad(360)).toBe(2 * Math.PI);
    });
  });

  describe('wrapScreen', () => {
    const width = 800;
    const height = 600;

    it('should wrap the object around the screen when it goes off the left edge', () => {
      const obj: GameObject = { id: '1', x: -20, y: 300, radius: 10, velocityX: -1, velocityY: 0, angle: 0 };
      wrapScreen(obj, width, height);
      expect(obj.x).toBe(width + obj.radius);
    });

    it('should wrap the object around the screen when it goes off the right edge', () => {
      const obj: GameObject = { id: '1', x: width + 20, y: 300, radius: 10, velocityX: 1, velocityY: 0, angle: 0 };
      wrapScreen(obj, width, height);
      expect(obj.x).toBe(-obj.radius);
    });

    it('should wrap the object around the screen when it goes off the top edge', () => {
      const obj: GameObject = { id: '1', x: 400, y: -20, radius: 10, velocityX: 0, velocityY: -1, angle: 0 };
      wrapScreen(obj, width, height);
      expect(obj.y).toBe(height + obj.radius);
    });

    it('should wrap the object around the screen when it goes off the bottom edge', () => {
      const obj: GameObject = { id: '1', x: 400, y: height + 20, radius: 10, velocityX: 0, velocityY: 1, angle: 0 };
      wrapScreen(obj, width, height);
      expect(obj.y).toBe(-obj.radius);
    });
  });

  describe('createAsteroid', () => {
    it('should create a new asteroid with the specified size', () => {
      const size = 2;
      const width = 800;
      const height = 600;
      const asteroid = createAsteroid(size, width, height);

      expect(asteroid.size).toBe(size);
      expect(asteroid.radius).toBe(ASTEROID_SIZES[size].radius);
      expect(asteroid.vertices.length).toBe(ASTEROID_SIZES[size].points);
      expect(asteroid.x).toBeTypeOf('number');
      expect(asteroid.y).toBeTypeOf('number');
    });

    it('should create an asteroid at a specific position if provided', () => {
        const asteroid = createAsteroid(1, 800, 600, 100, 150);
        expect(asteroid.x).toBe(100);
        expect(asteroid.y).toBe(150);
    });
  });

  describe('checkCollision', () => {
    it('should return true for colliding objects', () => {
      const obj1: GameObject = { id: '1', x: 100, y: 100, radius: 20, velocityX: 0, velocityY: 0, angle: 0 };
      const obj2: GameObject = { id: '2', x: 110, y: 110, radius: 15, velocityX: 0, velocityY: 0, angle: 0 };
      expect(checkCollision(obj1, obj2)).toBe(true);
    });

    it('should return false for non-colliding objects', () => {
      const obj1: GameObject = { id: '1', x: 100, y: 100, radius: 20, velocityX: 0, velocityY: 0, angle: 0 };
      const obj2: GameObject = { id: '2', x: 150, y: 150, radius: 15, velocityX: 0, velocityY: 0, angle: 0 };
      expect(checkCollision(obj1, obj2)).toBe(false);
    });

    it('should return true for objects that are exactly touching', () => {
        const obj1: GameObject = { id: '1', x: 100, y: 100, radius: 20, velocityX: 0, velocityY: 0, angle: 0 };
        const obj2: GameObject = { id: '2', x: 135, y: 100, radius: 15, velocityX: 0, velocityY: 0, angle: 0 };
        expect(checkCollision(obj1, obj2)).toBe(true);
    });
  });

  describe('generateAsteroidVertices', () => {
    it('should generate the correct number of vertices', () => {
        const radius = 50;
        const numVertices = 12;
        const vertices = generateAsteroidVertices(radius, numVertices);
        expect(vertices.length).toBe(numVertices);
    });
  });

  describe('getPlayerPolygon', () => {
    it('should return 4 points', () => {
        const points = getPlayerPolygon(20);
        expect(points.length).toBe(4);
    });
  });
});
