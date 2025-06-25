import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GameUI from './GameUI';
import { GameState } from '../state/types';
import { KEY_BINDINGS } from '../../../constants';

describe('GameUI', () => {
  it('should render the score and lives', () => {
    render(<GameUI score={100} lives={3} gameState={GameState.Playing} wave={1} />);
    expect(screen.getByText('SCORE: 100')).toBeInTheDocument();
    expect(screen.getByText('LIVES: ♥ ♥ ♥')).toBeInTheDocument();
  });

  it('should render the start screen', () => {
    render(<GameUI score={0} lives={3} gameState={GameState.StartScreen} wave={1} />);
    expect(screen.getByText('ASTEROIDS')).toBeInTheDocument();
    expect(screen.getByText(`PRESS '${KEY_BINDINGS.START_GAME === ' ' ? 'SPACE' : KEY_BINDINGS.START_GAME.toUpperCase()}' OR TOUCH SCREEN TO START`)).toBeInTheDocument();
  });

  it('should render the game over screen', () => {
    render(<GameUI score={500} lives={0} gameState={GameState.GameOver} wave={3} />);
    expect(screen.getByText('GAME OVER')).toBeInTheDocument();
    expect(screen.getByText('FINAL SCORE: 500')).toBeInTheDocument();
  });
});
