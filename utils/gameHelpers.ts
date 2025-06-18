
import { Point, Asteroid, GameObject } from '../types';
import { GAME_WIDTH, GAME_HEIGHT, ASTEROID_SIZES, ASTEROID_JAGGEDNESS } from '../constants';

export const degToRad = (degrees: number): number => degrees * (Math.PI / 180);

export const generateId = (): string => `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const wrapScreen = (obj: GameObject): void => {
  if (obj.x < -obj.radius) obj.x = GAME_WIDTH + obj.radius;
  if (obj.x > GAME_WIDTH + obj.radius) obj.x = -obj.radius;
  if (obj.y < -obj.radius) obj.y = GAME_HEIGHT + obj.radius;
  if (obj.y > GAME_HEIGHT + obj.radius) obj.y = -obj.radius;
};

export const generateAsteroidVertices = (radius: number, numVertices: number): Point[] => {
  const vertices: Point[] = [];
  for (let i = 0; i < numVertices; i++) {
    const angle = (i / numVertices) * 2 * Math.PI;
    const r = radius * (1 - ASTEROID_JAGGEDNESS / 2 + Math.random() * ASTEROID_JAGGEDNESS);
    vertices.push({
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
    });
  }
  return vertices;
};

export const createAsteroid = (size: number, x?: number, y?: number, initialVelocityX?: number, initialVelocityY?: number): Asteroid => {
  const config = ASTEROID_SIZES[size];
  const angle = Math.random() * 360;
  const speed = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);
  
  return {
    id: generateId(),
    x: x ?? Math.random() * GAME_WIDTH,
    y: y ?? Math.random() * GAME_HEIGHT,
    velocityX: initialVelocityX ?? Math.cos(degToRad(angle)) * speed,
    velocityY: initialVelocityY ?? Math.sin(degToRad(angle)) * speed,
    angle: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2, // -1 to 1 degree per frame
    radius: config.radius,
    size,
    vertices: generateAsteroidVertices(config.radius, config.points),
  };
};

export const checkCollision = (obj1: GameObject, obj2: GameObject): boolean => {
  const dx = obj1.x - obj2.x;
  const dy = obj1.y - obj2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < obj1.radius + obj2.radius;
};

// Polygon representation for player ship, pointing upwards (0, -PLAYER_SIZE/2)
export const getPlayerPolygon = (playerSize: number): Point[] => {
  return [
    { x: 0, y: -playerSize * 0.66 }, // Nose
    { x: playerSize * 0.5, y: playerSize * 0.33 }, // Right wing
    { x: 0, y: playerSize * 0.15 }, // Tail center-ish (for a slightly more filled look)
    { x: -playerSize * 0.5, y: playerSize * 0.33 }, // Left wing
  ];
};
    