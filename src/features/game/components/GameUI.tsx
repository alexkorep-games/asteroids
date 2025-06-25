
import React from 'react';
import { GameState } from '../state/types';
import { TEXT_COLOR, KEY_BINDINGS } from '../../../constants';

interface GameUIProps {
  score: number;
  lives: number;
  gameState: GameState;
  wave: number;
}

const GameUI: React.FC<GameUIProps> = ({ score, lives, gameState, wave }) => {
  const startGameKeyDisplay = KEY_BINDINGS.START_GAME === " " ? "SPACE" : KEY_BINDINGS.START_GAME.toUpperCase();
  return (
    <foreignObject x="0" y="0" width="100%" height="100%">
      <div className={`w-full h-full flex flex-col items-center justify-center pointer-events-none font-dos ${TEXT_COLOR} p-4`}>
        <div className="absolute top-4 left-4 text-lg sm:text-2xl">
          SCORE: {score}
        </div>
        <div className="absolute top-4 right-4 text-lg sm:text-2xl">
          LIVES: {Array(lives > 0 ? lives : 0).fill('♥').join(' ')}
        </div>
        <div className="absolute top-10 left-4 text-md sm:text-xl">
          WAVE: {wave}
        </div>

        {gameState === GameState.StartScreen && (
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl mb-4">ASTEROIDS</h1>
            <p className="text-xl sm:text-3xl">PRESS '{startGameKeyDisplay}' OR TOUCH SCREEN TO START</p>
            <p className="text-lg sm:text-xl mt-8">TOUCH CONTROLS (MOBILE):</p>
            <p className="text-md sm:text-lg">LEFT SCREEN: TAP & HOLD TO THRUST</p>
            <p className="text-md sm:text-lg">RIGHT SCREEN: DRAG TO ROTATE SHIP</p>
            <p className="text-md sm:text-lg mt-4">KEYBOARD CONTROLS (DESKTOP):</p>
            <p className="text-md sm:text-lg">ARROW KEYS: ROTATE & THRUST</p>
            <p className="text-md sm:text-lg mt-4">SHIP SHOOTS AUTOMATICALLY</p>
          </div>
        )}

        {gameState === GameState.GameOver && (
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl mb-4">GAME OVER</h1>
            <p className="text-xl sm:text-3xl">FINAL SCORE: {score}</p>
            <p className="text-xl sm:text-3xl mt-4">PRESS '{startGameKeyDisplay}' OR TOUCH SCREEN TO RESTART</p>
          </div>
        )}
      </div>
    </foreignObject>
  );
};

export default GameUI;
