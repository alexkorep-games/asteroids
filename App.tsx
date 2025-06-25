import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, Asteroid, Bullet, GameState, KeysPressed, Point, JoystickState, HeartPowerUp } from './types';
import PlayerShip from './components/PlayerShip';
import AsteroidObject from './components/AsteroidObject';
import BulletObject from './components/BulletObject';
import GameUI from './components/GameUI';
import VirtualJoystick from './components/VirtualJoystick';
import HeartPowerUpObject from './components/HeartPowerUpObject';
import {
  PLAYER_SIZE, PLAYER_THRUST, PLAYER_MAX_SPEED, PLAYER_ROTATION_SPEED, PLAYER_DRAG, PLAYER_INVINCIBILITY_DURATION,
  BULLET_SPEED, BULLET_RADIUS, BULLET_LIFESPAN, BULLET_COOLDOWN,
  ASTEROID_SIZES, INITIAL_ASTEROID_COUNT, MAX_ASTEROIDS_PER_WAVE_BASE, NEW_WAVE_ASTEROID_INCREMENT,
  INITIAL_LIVES, MAX_LIVES, TEXT_COLOR, KEY_BINDINGS,
  JOYSTICK_BASE_RADIUS, JOYSTICK_NUB_RADIUS, JOYSTICK_MAX_DELTA_RATIO, JOYSTICK_DEAD_ZONE_RATIO,
  HEART_DROP_CHANCE, HEART_RADIUS, HEART_LIFESPAN
} from './constants';
import { degToRad, generateId, wrapScreen, createAsteroid, checkCollision } from './utils/gameHelpers';

const App: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [gameState, setGameState] = useState<GameState>(GameState.StartScreen);
  const [player, setPlayer] = useState<Player>({
    id: generateId(),
    x: dimensions.width / 2,
    y: dimensions.height / 2,
    velocityX: 0,
    velocityY: 0,
    angle: 0,
    radius: PLAYER_SIZE / 2,
    isThrusting: false,
    rotationDirection: 0,
    invincibleTimer: 0,
  });
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [hearts, setHearts] = useState<HeartPowerUp[]>([]);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(INITIAL_LIVES);
  const [keysPressed, setKeysPressed] = useState<KeysPressed>({});
  const [bulletCooldownTimer, setBulletCooldownTimer] = useState<number>(0);
  const [currentWave, setCurrentWave] = useState<number>(1);

  const FIXED_JOYSTICK_PADDING = 30; // SVG units
  const fixedJoystickBasePoint: Point = {
    x: dimensions.width - JOYSTICK_BASE_RADIUS - FIXED_JOYSTICK_PADDING,
    y: dimensions.height - JOYSTICK_BASE_RADIUS - FIXED_JOYSTICK_PADDING
  };

  const [joystick, setJoystick] = useState<JoystickState>({
    active: false,
    touchId: null,
    anchorPoint: null,
    visualBase: null,
    nub: null,
    delta: null,
  });
  const [isTouchThrusting, setIsTouchThrusting] = useState<boolean>(false);
  const [thrustTouchId, setThrustTouchId] = useState<number | null>(null);

  const gameAreaRef = useRef<SVGSVGElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const getSVGCoordinates = useCallback((clientX: number, clientY: number): Point | null => {
    if (!gameAreaRef.current) return null;
    const svg = gameAreaRef.current;
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    
    const svgRect = svg.getBoundingClientRect();
    point.x -= svgRect.left;
    point.y -= svgRect.top;

    const screenCtm = svg.getScreenCTM();
    if (screenCtm) {
        const unscaledSvgPoint = point.matrixTransform(screenCtm.inverse());
        return { x: unscaledSvgPoint.x, y: unscaledSvgPoint.y };
    }
    return null;
  }, []);


  const resetPlayer = useCallback(() => {
    setPlayer({
      id: generateId(),
      x: dimensions.width / 2,
      y: dimensions.height / 2,
      velocityX: 0,
      velocityY: 0,
      angle: 0,
      radius: PLAYER_SIZE / 2,
      isThrusting: false,
      rotationDirection: 0,
      invincibleTimer: PLAYER_INVINCIBILITY_DURATION,
    });
  }, [dimensions]);
  
  const spawnAsteroids = useCallback((count: number) => {
    const newAsteroids: Asteroid[] = [];
    const safeZoneRadius = PLAYER_SIZE * 5; 
    const playerInitialX = dimensions.width / 2;
    const playerInitialY = dimensions.height / 2;

    for (let i = 0; i < count; i++) {
      let newAst: Asteroid;
      let attempts = 0;
      do {
        newAst = createAsteroid(3, dimensions.width, dimensions.height);
        attempts++;
        if (attempts > 50) { 
            console.warn("Failed to place asteroid away from player after 50 attempts.");
            break;
        }
      } while (
        checkCollision(newAst, { 
            id: 'player-spawn-check',
            x: playerInitialX, 
            y: playerInitialY, 
            radius: safeZoneRadius,
            velocityX:0, velocityY:0, angle:0 
        })
      );
      newAsteroids.push(newAst);
    }
    setAsteroids(prev => [...prev, ...newAsteroids]);
  }, [dimensions]);

  const startGame = useCallback(() => {
    setScore(0);
    setLives(INITIAL_LIVES);
    setCurrentWave(1);
    resetPlayer();
    setAsteroids([]);
    spawnAsteroids(INITIAL_ASTEROID_COUNT);
    setBullets([]);
    setHearts([]);
    setJoystick({active: false, touchId: null, anchorPoint: null, visualBase: null, nub: null, delta: null});
    setIsTouchThrusting(false);
    setThrustTouchId(null);
    setGameState(GameState.Playing);
  }, [resetPlayer, spawnAsteroids]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed(prev => ({ ...prev, [e.key]: true }));
      if ((gameState === GameState.StartScreen || gameState === GameState.GameOver) && !isTouchThrusting && !joystick.active) {
        if (e.key === KEY_BINDINGS.START_GAME) {
          startGame();
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, startGame, isTouchThrusting, joystick.active]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (gameState === GameState.StartScreen || gameState === GameState.GameOver) {
      startGame();
      return; 
    }
    if (gameState !== GameState.Playing) return;
    
    Array.from(e.changedTouches).forEach(touch => {
        const clientX = touch.clientX;
        const screenWidth = window.innerWidth;

        if (clientX > screenWidth / 2) { 
            if (!joystick.active && touch.identifier !== thrustTouchId) {
                const svgInitialTouchPoint = getSVGCoordinates(touch.clientX, touch.clientY);
                if (svgInitialTouchPoint) {
                    setJoystick({
                        active: true,
                        touchId: touch.identifier,
                        anchorPoint: svgInitialTouchPoint,
                        visualBase: fixedJoystickBasePoint, 
                        nub: fixedJoystickBasePoint,        
                        delta: { x: 0, y: 0 },
                    });
                }
            }
        } else { 
            if (!isTouchThrusting && touch.identifier !== joystick.touchId) {
                setIsTouchThrusting(true);
                setThrustTouchId(touch.identifier);
            }
        }
    });
  }, [gameState, getSVGCoordinates, startGame, joystick.active, joystick.touchId, isTouchThrusting, thrustTouchId, fixedJoystickBasePoint]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    Array.from(e.changedTouches).forEach(touch => {
        if (joystick.active && joystick.touchId === touch.identifier && joystick.anchorPoint && joystick.visualBase) {
            const currentSvgTouchPoint = getSVGCoordinates(touch.clientX, touch.clientY);
            if (currentSvgTouchPoint) {
                const touchMovementX = currentSvgTouchPoint.x - joystick.anchorPoint.x;
                const touchMovementY = currentSvgTouchPoint.y - joystick.anchorPoint.y;

                let dx_from_visualBase = touchMovementX;
                let dy_from_visualBase = touchMovementY;

                const distance_from_visualBase = Math.sqrt(dx_from_visualBase * dx_from_visualBase + dy_from_visualBase * dy_from_visualBase);
                const maxDeltaConstraint = JOYSTICK_BASE_RADIUS * JOYSTICK_MAX_DELTA_RATIO;

                if (distance_from_visualBase > maxDeltaConstraint) {
                    dx_from_visualBase = (dx_from_visualBase / distance_from_visualBase) * maxDeltaConstraint;
                    dy_from_visualBase = (dy_from_visualBase / distance_from_visualBase) * maxDeltaConstraint;
                }
                
                const finalNubX = joystick.visualBase.x + dx_from_visualBase;
                const finalNubY = joystick.visualBase.y + dy_from_visualBase;
                
                setJoystick(j => {
                    if (!j.visualBase || !j.anchorPoint) return j; 
                    return {
                        ...j,
                        nub: { x: finalNubX, y: finalNubY },
                        delta: { x: dx_from_visualBase, y: dy_from_visualBase },
                    };
                });
            }
        }
    });
  }, [joystick, getSVGCoordinates, JOYSTICK_BASE_RADIUS, JOYSTICK_MAX_DELTA_RATIO]);


  const handleTouchEndOrCancel = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    Array.from(e.changedTouches).forEach(touch => {
        if (joystick.active && joystick.touchId === touch.identifier) {
            setJoystick({
                active: false,
                touchId: null,
                anchorPoint: null,
                visualBase: null,
                nub: null,
                delta: null,
            });
        }
        if (isTouchThrusting && thrustTouchId === touch.identifier) {
            setIsTouchThrusting(false);
            setThrustTouchId(null);
        }
    });
  }, [joystick.active, joystick.touchId, isTouchThrusting, thrustTouchId]);


  useEffect(() => {
    if (gameState !== GameState.Playing) return;

    const gameLoop = () => {
      setPlayer(p => {
        let newVx = p.velocityX;
        let newVy = p.velocityY;
        let newAngle = p.angle;
        let isActuallyThrustingVisual = false;

        let joystickTookOverRotation = false;
        if (joystick.active && joystick.delta && joystick.visualBase) {
          const deltaX = joystick.delta.x;
          const deltaY = joystick.delta.y;
          const distFromBase = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const deadZoneThreshold = JOYSTICK_BASE_RADIUS * JOYSTICK_DEAD_ZONE_RATIO;

          if (distFromBase > deadZoneThreshold) {
            newAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
            joystickTookOverRotation = true;
          }
        }
        
        if (!joystickTookOverRotation) {
            if (keysPressed[KEY_BINDINGS.ROTATE_LEFT]) {
                newAngle -= PLAYER_ROTATION_SPEED;
            }
            if (keysPressed[KEY_BINDINGS.ROTATE_RIGHT]) {
                newAngle += PLAYER_ROTATION_SPEED;
            }
        }
        
        const shouldThrust = isTouchThrusting || keysPressed[KEY_BINDINGS.THRUST];
        
        if (shouldThrust) {
            isActuallyThrustingVisual = true;
            const thrustAngleRad = degToRad(newAngle - 90);
            newVx += PLAYER_THRUST * Math.cos(thrustAngleRad);
            newVy += PLAYER_THRUST * Math.sin(thrustAngleRad);
        }
        
        const speed = Math.sqrt(newVx * newVx + newVy * newVy);
        if (speed > PLAYER_MAX_SPEED) {
          newVx = (newVx / speed) * PLAYER_MAX_SPEED;
          newVy = (newVy / speed) * PLAYER_MAX_SPEED;
        }

        newVx *= PLAYER_DRAG;
        newVy *= PLAYER_DRAG;
        
        const newP = {
          ...p,
          x: p.x + newVx,
          y: p.y + newVy,
          velocityX: newVx,
          velocityY: newVy,
          angle: (newAngle % 360 + 360) % 360,
          isThrusting: isActuallyThrustingVisual,
          invincibleTimer: Math.max(0, p.invincibleTimer - 1)
        };
        wrapScreen(newP, dimensions.width, dimensions.height);
        return newP;
      });

      if (bulletCooldownTimer === 0) {
        setBulletCooldownTimer(BULLET_COOLDOWN);
        setBullets(prev => {
          const bulletAngleRad = degToRad(player.angle - 90);
          const newBullet: Bullet = {
            id: generateId(),
            x: player.x + (PLAYER_SIZE * 0.7) * Math.cos(bulletAngleRad),
            y: player.y + (PLAYER_SIZE * 0.7) * Math.sin(bulletAngleRad),
            velocityX: BULLET_SPEED * Math.cos(bulletAngleRad) + player.velocityX * 0.5,
            velocityY: BULLET_SPEED * Math.sin(bulletAngleRad) + player.velocityY * 0.5,
            angle: player.angle,
            radius: BULLET_RADIUS,
            life: BULLET_LIFESPAN,
          };
          return [...prev, newBullet];
        });
      }
      setBulletCooldownTimer(prev => Math.max(0, prev -1));

      setBullets(prevBullets =>
        prevBullets
          .map(b => ({ ...b, x: b.x + b.velocityX, y: b.y + b.velocityY, life: b.life - 1 }))
          .filter(b => b.life > 0 && b.x > -b.radius && b.x < dimensions.width + b.radius && b.y > -b.radius && b.y < dimensions.height + b.radius)
      );
      
      setAsteroids(prevAsteroids =>
        prevAsteroids.map(a => {
          const newA = { ...a, x: a.x + a.velocityX, y: a.y + a.velocityY, angle: (a.angle + a.rotationSpeed + 360) % 360 };
          wrapScreen(newA, dimensions.width, dimensions.height);
          return newA;
        })
      );

      const newAsteroidsFromCollisions: Asteroid[] = [];
      const newlySpawnedHearts: HeartPowerUp[] = [];
      const destroyedAsteroidIds: string[] = [];
      const destroyedBulletIds: string[] = [];

      bullets.forEach(bullet => {
        asteroids.forEach(asteroid => {
          if (checkCollision(bullet, asteroid)) {
            destroyedBulletIds.push(bullet.id);
            if (!destroyedAsteroidIds.includes(asteroid.id)) {
              destroyedAsteroidIds.push(asteroid.id);
              setScore(s => s + ASTEROID_SIZES[asteroid.size].score);

              if (asteroid.size === 1 && Math.random() < HEART_DROP_CHANCE) {
                newlySpawnedHearts.push({
                  id: generateId(),
                  x: asteroid.x,
                  y: asteroid.y,
                  velocityX: 0,
                  velocityY: 0,
                  angle: 0,
                  radius: HEART_RADIUS,
                  life: HEART_LIFESPAN,
                });
              } else if (asteroid.size > 1) {
                const childSize = asteroid.size - 1;
                const childCount = ASTEROID_SIZES[asteroid.size].childCount;
                for (let i = 0; i < childCount; i++) {
                  const randomAngle = Math.random() * 2 * Math.PI;
                  const kickSpeed = ASTEROID_SIZES[childSize].minSpeed * 0.5;
                  const newVelX = asteroid.velocityX * 0.8 + Math.cos(randomAngle) * kickSpeed;
                  const newVelY = asteroid.velocityY * 0.8 + Math.sin(randomAngle) * kickSpeed;
                  newAsteroidsFromCollisions.push(createAsteroid(childSize, dimensions.width, dimensions.height, asteroid.x, asteroid.y, newVelX, newVelY));
                }
              }
            }
          }
        });
      });

      setBullets(prev => prev.filter(b => !destroyedBulletIds.includes(b.id)));
      
      if (player.invincibleTimer === 0) {
        asteroids.forEach(asteroid => {
          if (!destroyedAsteroidIds.includes(asteroid.id) && checkCollision(player, asteroid)) {
            destroyedAsteroidIds.push(asteroid.id);
            // Player collided with asteroid
            if (asteroid.size === 1 && Math.random() < HEART_DROP_CHANCE) {
                newlySpawnedHearts.push({
                  id: generateId(),
                  x: asteroid.x,
                  y: asteroid.y,
                  velocityX: 0,
                  velocityY: 0,
                  angle: 0,
                  radius: HEART_RADIUS,
                  life: HEART_LIFESPAN,
                });
            } else if (asteroid.size > 1) {
                const childSize = asteroid.size - 1;
                const childCount = ASTEROID_SIZES[asteroid.size].childCount;
                for (let i = 0; i < childCount; i++) {
                    const randomAngle = Math.random() * 2 * Math.PI;
                    const kickSpeed = ASTEROID_SIZES[childSize].minSpeed * 0.5;
                    const newVelX = asteroid.velocityX * 0.8 + Math.cos(randomAngle) * kickSpeed;
                    const newVelY = asteroid.velocityY * 0.8 + Math.sin(randomAngle) * kickSpeed;
                    newAsteroidsFromCollisions.push(createAsteroid(childSize, dimensions.width, dimensions.height, asteroid.x, asteroid.y, newVelX, newVelY));
                }
            }

            setLives(l => {
              const newLives = l - 1;
              if (newLives <= 0) {
                setGameState(GameState.GameOver);
                setJoystick({active: false, touchId: null, anchorPoint: null, visualBase: null, nub: null, delta: null});
                setIsTouchThrusting(false);
                setThrustTouchId(null);
                return 0;
              } else {
                resetPlayer(); 
                return newLives;
              }
            });
          }
        });
      }
      
      setAsteroids(prev => [...prev.filter(a => !destroyedAsteroidIds.includes(a.id)), ...newAsteroidsFromCollisions]);
      
      setHearts(prevHearts => {
        const updatedAndNonExpiredHearts = prevHearts
          .map(h => ({ ...h, life: h.life - 1 }))
          .filter(h => h.life > 0);

        const remainingHeartsAfterCollection: HeartPowerUp[] = [];
        for (const heart of updatedAndNonExpiredHearts) {
          if (checkCollision(player, heart)) {
            setLives(l => Math.min(l + 1, MAX_LIVES));
          } else {
            remainingHeartsAfterCollection.push(heart);
          }
        }
        return [...remainingHeartsAfterCollection, ...newlySpawnedHearts];
      });

      if (gameState === GameState.Playing && asteroids.filter(a => !destroyedAsteroidIds.includes(a.id)).length === 0 && newAsteroidsFromCollisions.length === 0) {
          setCurrentWave(w => {
              const nextWave = w + 1;
              const numAsteroids = Math.min(INITIAL_ASTEROID_COUNT + (nextWave -1) * NEW_WAVE_ASTEROID_INCREMENT, MAX_ASTEROIDS_PER_WAVE_BASE + (nextWave-1));
              spawnAsteroids(numAsteroids);
              setPlayer(p => ({...p, invincibleTimer: PLAYER_INVINCIBILITY_DURATION / 2}));
              return nextWave;
          });
      }

    };

    const animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    gameState, 
    player, 
    asteroids, 
    bullets, 
    hearts,
    bulletCooldownTimer, 
    spawnAsteroids, 
    resetPlayer, 
    joystick, 
    isTouchThrusting,
    keysPressed, // Added keysPressed to dependency array
    PLAYER_THRUST, PLAYER_MAX_SPEED, PLAYER_DRAG, PLAYER_ROTATION_SPEED, // Added PLAYER_ROTATION_SPEED
    JOYSTICK_BASE_RADIUS, JOYSTICK_DEAD_ZONE_RATIO, 
    BULLET_COOLDOWN, BULLET_LIFESPAN, BULLET_RADIUS, BULLET_SPEED, PLAYER_SIZE,
    ASTEROID_SIZES,
    INITIAL_ASTEROID_COUNT, NEW_WAVE_ASTEROID_INCREMENT, MAX_ASTEROIDS_PER_WAVE_BASE, PLAYER_INVINCIBILITY_DURATION,
    HEART_DROP_CHANCE, HEART_LIFESPAN, HEART_RADIUS, MAX_LIVES, KEY_BINDINGS, // Added KEY_BINDINGS for completeness though it's const
    dimensions
  ]); 

  const BORDER_COLOR_CLASS = TEXT_COLOR === "text-lime-400" ? "border-lime-600" : "border-amber-600";

  return (
    <div 
         ref={mainContainerRef}
         className={`fixed inset-x-0 top-0 bottom-0 flex items-center justify-center bg-black ${TEXT_COLOR} font-dos select-none overflow-hidden touch-none py-4`}
         aria-label="Retro Asteroids Game" role="application"
         onTouchStart={handleTouchStart}
         onTouchMove={handleTouchMove}
         onTouchEnd={handleTouchEndOrCancel}
         onTouchCancel={handleTouchEndOrCancel}
    >
      <svg
        ref={gameAreaRef}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className={`${TEXT_COLOR} bg-black border-2 ${BORDER_COLOR_CLASS} max-w-full max-h-full w-auto h-auto`}
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="optimizeSpeed" 
        aria-hidden="true"
      >
        <rect width="100%" height="100%" fill="black" />
        {gameState === GameState.Playing && <PlayerShip player={player} />}
        {asteroids.map(asteroid => (
          <AsteroidObject key={asteroid.id} asteroid={asteroid} />
        ))}
        {bullets.map(bullet => (
          <BulletObject key={bullet.id} bullet={bullet} />
        ))}
        {hearts.map(heart => (
          <HeartPowerUpObject key={heart.id} heart={heart} />
        ))}
        {gameState === GameState.Playing && joystick.active && joystick.visualBase && joystick.nub && (
          <VirtualJoystick
            basePosition={joystick.visualBase} 
            nubPosition={joystick.nub}
            isActive={joystick.active}
            baseRadius={JOYSTICK_BASE_RADIUS}
            nubRadius={JOYSTICK_NUB_RADIUS}
          />
        )}
        <GameUI score={score} lives={lives} gameState={gameState} wave={currentWave} />
      </svg>
    </div>
  );
};

export default App;