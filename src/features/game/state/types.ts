export interface Point {
  x: number;
  y: number;
}

export interface GameObject {
  id: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  angle: number; // degrees, 0 is pointing "up" or North
  radius: number; // for collision detection
}

export interface Player extends GameObject {
  isThrusting: boolean;
  rotationDirection: number; // -1 for left, 1 for right, 0 for none (legacy, for joystick may not be used)
  invincibleTimer: number; // frames of invincibility
}

export interface Asteroid extends GameObject {
  size: number; // 3 (large), 2 (medium), 1 (small)
  vertices: Point[]; // shape of the asteroid, relative to its center
  rotationSpeed: number; // degrees per frame
}

export interface Bullet extends GameObject {
  life: number; // frames until it disappears
}

export interface HeartPowerUp extends GameObject {
  life: number; // frames until it disappears
}

export enum GameState {
  StartScreen,
  Playing,
  GameOver,
}

export type KeysPressed = Record<string, boolean>;

export interface JoystickState {
  active: boolean;
  touchId: number | null;
  anchorPoint: Point | null; // Initial touch location in SVG coords, for calculating relative movement
  visualBase: Point | null; // The fixed position where joystick base is drawn
  nub: Point | null; // Position of the nub, relative to visualBase conceptually but stored as absolute SVG coords
  delta: Point | null; // dx, dy of nub from visualBase, for control input
}