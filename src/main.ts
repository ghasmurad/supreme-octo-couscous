import './style.css';
import {
  createGame,
  getPlayerId,
  joinGame,
  runHostClock,
  startGame,
  subscribeGame,
  submitAnswer,
} from './game';
import { QUESTIONS } from './questions';
import { GameState } from './types';

const app = document.getElementById('app')!;

type View = 'home' | 'in-game';

let view: View = 'home';
let code: string | null = null;
let currentState: GameState | null = null;
let unsubscribe: (() => void) | null = null;
let errorMsg = '';
let joining = false;

const playerId = getPlayerId();

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function isHost(state: GameState): boolean {
  return state.hostId === playerId;
}

function shareUrl(gameCode: string): string {
  const url = new URL(window.location.href);
  url.search = `?code=${gameCode}`;
  return url.toString();
}

// ---------- rendering ----------

function render(): void {
  if (view === 'home' || !currentState) {
    renderHome();
    return;
  }
  switch (currentState.status) {
    case 'lobby':
      renderLobby(currentState);
      break;
    case 'question':
      renderQuestion(currentState);
      break;
    case 'tally':
      renderTally(currentState);
      break;
    case 'results':
      renderResults(currentState);
      break;
  }
}

function renderHome(): void {
  const params = new URLSearchParams(window.location.search);
  const prefillCode = params.get('code')?.toUpperCase() ?? '';

  app.innerHTML = `
    <div class="screen">
      <h1 class="title">This or That</h1>
      <p class="subtitle">Pick a side. See where the room lands.</p>
      <div class="card">
        <div class="field">
          <label for="name-input">Your name</label>
          <input id="name-input" type="text" maxlength="24" placeholder="e.g. Ghassan" autocomplete="off" />
        </div>
        <button id="host-btn" class="btn btn-primary">Host a Game</button>

        <div class="divider">OR JOIN A GAME</div>

        <div class="field">
          <label for="code-input">Game code</label>
          <input id="code-input" type="text" maxlength="4" placeholder="ABCD" autocomplete="off"
            style="text-transform:uppercase;letter-spacing:0.15em;" value="${escapeHtml(prefillCode)}" />
        </div>
        <button id="join-btn" class="btn btn-secondary">Join Game</button>
        ${errorMsg ? `<div class="error">${escapeHtml(errorMsg)}</div>` : ''}
      </div>
    </div>
  `;

  const nameInput = document.getElementById('name-input') as HTMLInputElement;
  const codeInput = document.getElementById('code-input') as HTMLInputElement;
  const hostBtn = document.getElementById('host-btn') as HTMLButtonElement;
  const joinBtn = document.getElementById('join-btn') as HTMLButtonElement;

  codeInput.addEventListener('input', () => {
    codeInput.value = codeInput.value.toUpperCase().replace(/[^A-Z]/g, '');
  });

  hostBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    if (!name) {
      errorMsg = 'Enter your name first.';
      render();
      return;
    }
    if (joining) return;
    joining = true;
    hostBtn.disabled = true;
    hostBtn.textContent = 'Creating...';
    try {
      const newCode = await createGame(name);
      enterGame(newCode);
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : 'Something went wrong.';
      joining = false;
      render();
    }
  });

  joinBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const gameCode = codeInput.value.trim().toUpperCase();
    if (!name) {
      errorMsg = 'Enter your name first.';
      render();
      return;
    }
    if (gameCode.length !== 4) {
      errorMsg = 'Enter the 4-letter game code.';
      render();
      return;
    }
    if (joining) return;
    joining = true;
    joinBtn.disabled = true;
    joinBtn.textContent = 'Joining...';
    try {
      await joinGame(gameCode, name);
      enterGame(gameCode);
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : 'Something went wrong.';
      joining = false;
      render();
    }
  });
}

function renderLobby(state: GameState): void {
  const players = Object.entries(state.players).sort((a, b) => a[1].joinedAt - b[1].joinedAt);
  const host = isHost(state);

  app.innerHTML = `
    <div class="screen">
      <h1 class="title">This or That</h1>
      <div class="card">
        <div class="code-display">${escapeHtml(code ?? '')}</div>
        <div class="share-hint">Share this code, or send:<br />${escapeHtml(shareUrl(code ?? ''))}</div>
        <ul class="player-list">
          ${players
            .map(
              ([id, p]) =>
                `<li class="player-chip${id === state.hostId ? ' is-host' : ''}">${escapeHtml(p.name)}</li>`,
            )
            .join('')}
        </ul>
        ${
          host
            ? `<button id="start-btn" class="btn btn-primary">Start Game</button>`
            : `<p class="waiting">Waiting for the host to start the game...</p>`
        }
      </div>
    </div>
  `;

  if (host) {
    document.getElementById('start-btn')!.addEventListener('click', () => {
      void startGame(code!);
    });
  }
}

function renderQuestion(state: GameState): void {
  const q = QUESTIONS[state.currentIndex];
  const myAnswer = state.answers?.[state.currentIndex]?.[playerId];
  const answeredCount = Object.keys(state.answers?.[state.currentIndex] ?? {}).length;
  const totalPlayers = Object.keys(state.players).length;

  app.innerHTML = `
    <div class="screen">
      <div class="card">
        <div class="progress-row">
          <span class="q-count">Question ${state.currentIndex + 1} / ${QUESTIONS.length}</span>
          <span class="timer" id="timer">--</span>
        </div>
        <p class="question-text">This... or that?</p>
        <div class="choices">
          <button class="choice-btn a${myAnswer === 'a' ? ' selected' : ''}" id="choice-a" ${myAnswer ? 'disabled' : ''}>
            ${escapeHtml(q.a)}
          </button>
          <button class="choice-btn b${myAnswer === 'b' ? ' selected' : ''}" id="choice-b" ${myAnswer ? 'disabled' : ''}>
            ${escapeHtml(q.b)}
          </button>
        </div>
        <p class="answered-count">${answeredCount} / ${totalPlayers} answered${myAnswer ? ' — waiting on the rest' : ''}</p>
      </div>
    </div>
  `;

  if (!myAnswer) {
    document.getElementById('choice-a')!.addEventListener('click', () => {
      submitAnswer(code!, state.currentIndex, 'a');
    });
    document.getElementById('choice-b')!.addEventListener('click', () => {
      submitAnswer(code!, state.currentIndex, 'b');
    });
  }

  updateTimerText(state);
}

function renderTally(state: GameState): void {
  const q = QUESTIONS[state.currentIndex];
  const answers = state.answers?.[state.currentIndex] ?? {};
  const countA = Object.values(answers).filter((v) => v === 'a').length;
  const countB = Object.values(answers).filter((v) => v === 'b').length;
  const total = countA + countB;
  const pctA = total ? Math.round((countA / total) * 100) : 0;
  const pctB = total ? 100 - pctA : 0;

  app.innerHTML = `
    <div class="screen">
      <div class="card">
        <div class="progress-row">
          <span class="q-count">Question ${state.currentIndex + 1} / ${QUESTIONS.length}</span>
          <span class="timer" id="timer">--</span>
        </div>
        <p class="question-text">This... or that?</p>

        <div class="tally-row">
          <div class="tally-label">
            <span>${escapeHtml(q.a)}</span>
            <span class="tally-pct">${pctA}%</span>
          </div>
          <div class="tally-bar-track">
            <div class="tally-bar-fill a" id="bar-a" style="width:0%"></div>
          </div>
          <div class="tally-votes">${countA} vote${countA === 1 ? '' : 's'}</div>
        </div>

        <div class="tally-row">
          <div class="tally-label">
            <span>${escapeHtml(q.b)}</span>
            <span class="tally-pct">${pctB}%</span>
          </div>
          <div class="tally-bar-track">
            <div class="tally-bar-fill b" id="bar-b" style="width:0%"></div>
          </div>
          <div class="tally-votes">${countB} vote${countB === 1 ? '' : 's'}</div>
        </div>

        <p class="next-hint">${state.currentIndex + 1 >= QUESTIONS.length ? 'Final results coming up...' : 'Next question coming up...'}</p>
      </div>
    </div>
  `;

  updateTimerText(state);

  requestAnimationFrame(() => {
    const barA = document.getElementById('bar-a');
    const barB = document.getElementById('bar-b');
    if (barA) barA.style.width = `${pctA}%`;
    if (barB) barB.style.width = `${pctB}%`;
  });
}

function renderResults(state: GameState): void {
  const rows = QUESTIONS.map((q, i) => {
    const answers = state.answers?.[i] ?? {};
    const countA = Object.values(answers).filter((v) => v === 'a').length;
    const countB = Object.values(answers).filter((v) => v === 'b').length;
    const total = countA + countB;
    const pctA = total ? Math.round((countA / total) * 100) : 0;
    const pctB = total ? 100 - pctA : 0;
    return { q, pctA, pctB };
  });

  app.innerHTML = `
    <div class="screen results-screen">
      <h1 class="title">Final Results</h1>
      <div class="card">
        <table class="results-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer 1</th>
              <th>Answer 2</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r) => `
              <tr>
                <td class="results-q">${escapeHtml(r.q.a)} <span style="color:var(--text-dim)">vs</span> ${escapeHtml(r.q.b)}</td>
                <td>
                  <div class="results-answer${r.pctA >= r.pctB ? ' winner' : ''}">${escapeHtml(r.q.a)}</div>
                  <div class="results-pct a-color">${r.pctA}%</div>
                </td>
                <td>
                  <div class="results-answer${r.pctB > r.pctA ? ' winner' : ''}">${escapeHtml(r.q.b)}</div>
                  <div class="results-pct b-color">${r.pctB}%</div>
                </td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
        <button id="home-btn" class="btn btn-secondary" style="margin-top:20px;">Back to Home</button>
      </div>
    </div>
  `;

  document.getElementById('home-btn')!.addEventListener('click', () => {
    window.location.href = window.location.pathname;
  });
}

function updateTimerText(state: GameState): void {
  const el = document.getElementById('timer');
  if (!el || state.phaseEndsAt === null) return;
  const remaining = Math.max(0, Math.ceil((state.phaseEndsAt - Date.now()) / 1000));
  el.textContent = String(remaining);
  el.classList.toggle('low', remaining <= 5);
}

// ---------- game entry / subscription ----------

function enterGame(gameCode: string): void {
  code = gameCode;
  view = 'in-game';
  errorMsg = '';
  joining = false;
  if (unsubscribe) unsubscribe();
  unsubscribe = subscribeGame(gameCode, (state) => {
    currentState = state;
    render();
  });
}

// ticking loop: keeps the countdown smooth and drives the host's phase clock
// without doing a full re-render every tick.
setInterval(() => {
  if (!currentState || !code) return;
  if (currentState.status === 'question' || currentState.status === 'tally') {
    updateTimerText(currentState);
  }
  if (isHost(currentState)) {
    void runHostClock(code, currentState);
  }
}, 250);

render();
