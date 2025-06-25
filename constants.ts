export const PLAYER_SIZE = 20; // Effectively the radius for collision and base for drawing
export const PLAYER_THRUST = 0.1; // Max thrust power
export const PLAYER_MAX_SPEED = 4;
export const PLAYER_ROTATION_SPEED = 5; // degrees per frame (legacy for keyboard)
export const PLAYER_DRAG = 0.99; // friction
export const PLAYER_INVINCIBILITY_DURATION = 120; // frames (2 seconds at 60fps)

export const BULLET_SPEED = 7;
export const BULLET_RADIUS = 3;
export const BULLET_LIFESPAN = 70; // frames
export const BULLET_COOLDOWN = 10; // frames between shots

export const ASTEROID_SIZES: Record<number, { radius: number; points: number; score: number; minSpeed: number; maxSpeed: number; childCount: number }> = {
  3: { radius: 50, points: 12, score: 20, minSpeed: 0.5, maxSpeed: 1.5, childCount: 2 }, // Large
  2: { radius: 25, points: 10, score: 50, minSpeed: 0.8, maxSpeed: 2.0, childCount: 2 }, // Medium
  1: { radius: 12, points: 8, score: 100, minSpeed: 1.0, maxSpeed: 2.5, childCount: 0 },   // Small
};
export const ASTEROID_JAGGEDNESS = 0.4; // 0 = circle, 1 = very jagged
export const INITIAL_ASTEROID_COUNT = 4;
export const MAX_ASTEROIDS_PER_WAVE_BASE = 7; // Max asteroids = INITIAL_ASTEROID_COUNT + wave_number, capped by this
export const NEW_WAVE_ASTEROID_INCREMENT = 1;


export const INITIAL_LIVES = 3;
export const MAX_LIVES = 16; // Maximum lives a player can have

export const TEXT_COLOR = "text-lime-400"; // Classic DOS green
export const BORDER_COLOR = "border-lime-400";
export const SVG_STROKE_COLOR = "currentColor"; // Will inherit TEXT_COLOR
export const SVG_PLAYER_FILL_COLOR = "currentColor";
export const SVG_BULLET_FILL_COLOR = "currentColor";
export const SVG_ASTEROID_FILL_COLOR = "transparent";
export const SVG_HEART_FILL_CLASS = "text-red-500";


export const KEY_BINDINGS = {
  THRUST: "ArrowUp", // Legacy
  ROTATE_LEFT: "ArrowLeft", // Legacy
  ROTATE_RIGHT: "ArrowRight", // Legacy
  SHOOT: " ", // Legacy for manual shooting, now automatic
  START_GAME: "Enter",
};

// Joystick Constants
export const JOYSTICK_BASE_RADIUS = 60; // Visual radius of the joystick base in SVG coordinates
export const JOYSTICK_NUB_RADIUS = 30;  // Visual radius of the joystick nub in SVG coordinates
// Maximum distance nub can be dragged from base center, as a ratio of JOYSTICK_BASE_RADIUS.
// E.g., 1.0 means nub can reach the edge of the base circle. Used for rotation control.
export const JOYSTICK_MAX_DELTA_RATIO = 1.0; 
// Dead zone radius as a ratio of JOYSTICK_BASE_RADIUS. No rotation input if nub is within this distance from base center.
export const JOYSTICK_DEAD_ZONE_RATIO = 0.1; 
// Note: Joystick now only controls rotation. Thrust is handled by left-screen touch.

// Heart Power-up Constants
export const HEART_DROP_CHANCE = 0.1; // 10% chance for smallest asteroids
export const HEART_RADIUS = 10;
export const HEART_LIFESPAN = 300; // 5 seconds at 60fps