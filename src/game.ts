import { get, onValue, ref, set, update } from 'firebase/database';
import { db, authReady } from './firebase';
import { QUESTIONS } from './questions';
import { GameState, QUESTION_SECONDS, TALLY_SECONDS } from './types';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I/O to avoid confusion

function randomCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export function getPlayerId(): string {
  const key = 'tot_player_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export async function createGame(name: string): Promise<string> {
  await authReady;
  const playerId = getPlayerId();
  let code = randomCode();
  for (let attempts = 0; attempts < 10; attempts++) {
    const snap = await get(ref(db, `games/${code}`));
    if (!snap.exists()) break;
    code = randomCode();
  }

  const state: GameState = {
    hostId: playerId,
    status: 'lobby',
    currentIndex: 0,
    phaseEndsAt: null,
    createdAt: Date.now(),
    players: {
      [playerId]: { name, joinedAt: Date.now() },
    },
  };
  await set(ref(db, `games/${code}`), state);
  return code;
}

export async function joinGame(code: string, name: string): Promise<void> {
  await authReady;
  const playerId = getPlayerId();
  const gameRef = ref(db, `games/${code}`);
  const snap = await get(gameRef);
  if (!snap.exists()) {
    throw new Error('Game not found. Check the code and try again.');
  }
  const state = snap.val() as GameState;
  if (state.status !== 'lobby') {
    throw new Error('This game has already started.');
  }
  await update(ref(db, `games/${code}/players/${playerId}`), {
    name,
    joinedAt: Date.now(),
  });
}

export function subscribeGame(code: string, cb: (state: GameState | null) => void): () => void {
  const gameRef = ref(db, `games/${code}`);
  const unsub = onValue(gameRef, (snap) => {
    cb(snap.exists() ? (snap.val() as GameState) : null);
  });
  return unsub;
}

export async function startGame(code: string): Promise<void> {
  await update(ref(db, `games/${code}`), {
    status: 'question',
    currentIndex: 0,
    phaseEndsAt: Date.now() + QUESTION_SECONDS * 1000,
  });
}

export async function submitAnswer(
  code: string,
  questionIndex: number,
  choice: 'a' | 'b',
): Promise<void> {
  const playerId = getPlayerId();
  await set(ref(db, `games/${code}/answers/${questionIndex}/${playerId}`), choice);
}

/**
 * Host-only: advances the shared game phase once the answer window closes
 * (time's up or everyone answered) and again once the tally has been shown
 * long enough. Only the host client runs this to avoid write races. A lock
 * prevents firing a second transition while one is still in flight (this
 * function is polled on an interval, not just on each snapshot).
 */
let transitioning = false;

export async function runHostClock(code: string, state: GameState): Promise<void> {
  if (transitioning) return;
  const playerCount = Object.keys(state.players).length;
  const now = Date.now();
  const timeUp = state.phaseEndsAt !== null && now >= state.phaseEndsAt;

  if (state.status === 'question') {
    const answered = Object.keys(state.answers?.[state.currentIndex] ?? {}).length;
    const everyoneAnswered = playerCount > 0 && answered >= playerCount;
    if (timeUp || everyoneAnswered) {
      transitioning = true;
      await update(ref(db, `games/${code}`), {
        status: 'tally',
        phaseEndsAt: Date.now() + TALLY_SECONDS * 1000,
      });
      transitioning = false;
    }
  } else if (state.status === 'tally' && timeUp) {
    const isLast = state.currentIndex >= QUESTIONS.length - 1;
    transitioning = true;
    if (isLast) {
      await update(ref(db, `games/${code}`), { status: 'results', phaseEndsAt: null });
    } else {
      await update(ref(db, `games/${code}`), {
        status: 'question',
        currentIndex: state.currentIndex + 1,
        phaseEndsAt: Date.now() + QUESTION_SECONDS * 1000,
      });
    }
    transitioning = false;
  }
}
