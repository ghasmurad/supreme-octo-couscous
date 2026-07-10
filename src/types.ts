export type GameStatus = 'lobby' | 'question' | 'tally' | 'results';

export interface Player {
  name: string;
  joinedAt: number;
}

export interface GameState {
  hostId: string;
  status: GameStatus;
  currentIndex: number;
  phaseEndsAt: number | null;
  createdAt: number;
  players: Record<string, Player>;
  answers?: Record<number, Record<string, 'a' | 'b'>>;
}

export const QUESTION_SECONDS = 30;
export const TALLY_SECONDS = 6;
