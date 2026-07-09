const ADMIN_PASSWORD = 'password123';
const ROOM_KEY = 'hha_room_code';
const ROLE_KEY = 'hha_role';
const PLAYER_ID_KEY = 'hha_player_id';
const SOUND_KEY = 'hha_sound';
const HOST_UNLOCK_KEY = 'hha_host_unlocked';

const TEAM_COLORS = {
  team1: '#ff4d8d',
  team2: '#57e2e5',
  team3: '#b8ff5c'
};
const TEAM_EMOJIS = {
  team1: '🍓',
  team2: '🧊',
  team3: '⚡'
};
const AVATARS = ['🦄','🦊','🐼','🐯','🐸','🐙','🦁','🐵','🐧','🦉','🦖','🐝','🌮','🍕','🚀','🎧','🎮','✨','🔥','🌈'];

const MAJORITY_QUESTIONS = [
  { id: 'maj-01', prompt: 'Coffee or tea?', options: ['Coffee', 'Tea'] },
  { id: 'maj-02', prompt: 'Beach or mountains?', options: ['Beach', 'Mountains'] },
  { id: 'maj-03', prompt: 'Early bird or night owl?', options: ['Early bird', 'Night owl'] },
  { id: 'maj-04', prompt: 'Sweet or salty?', options: ['Sweet', 'Salty'] },
  { id: 'maj-05', prompt: 'Texting or calling?', options: ['Texting', 'Calling'] },
  { id: 'maj-06', prompt: 'Comedy or drama?', options: ['Comedy', 'Drama'] },
  { id: 'maj-07', prompt: 'Cook at home or order in?', options: ['Cook at home', 'Order in'] },
  { id: 'maj-08', prompt: 'Work from a beach house or a mountain cabin?', options: ['Beach house', 'Mountain cabin'] },
  { id: 'maj-09', prompt: 'Camera always on or first to speak in every meeting?', options: ['Camera always on', 'First to speak'] },
  { id: 'maj-10', prompt: 'Give up email or give up Teams/Slack?', options: ['Give up email', 'Give up Teams/Slack'] }
];

const TRIVIA_QUESTIONS = [
  { id: 'tri-01', category: 'TV', prompt: 'What show has the line “We were on a break”?', answer: 'Friends' },
  { id: 'tri-02', category: 'TV', prompt: 'What show is set in Scranton, Pennsylvania?', answer: 'The Office' },
  { id: 'tri-03', category: 'TV', prompt: 'What TV family lives at 742 Evergreen Terrace?', answer: 'The Simpsons' },
  { id: 'tri-04', category: 'TV', prompt: 'What show features the character Ted Lasso?', answer: 'Ted Lasso' },
  { id: 'tri-05', category: 'Movies', prompt: 'What movie features the line “I’ll be back”?', answer: 'The Terminator' },
  { id: 'tri-06', category: 'Movies', prompt: 'What movie has the quote “May the Force be with you”?', answer: 'Star Wars' },
  { id: 'tri-07', category: 'Movies', prompt: 'What movie features a character named Jack Sparrow?', answer: 'Pirates of the Caribbean' },
  { id: 'tri-08', category: 'Movies', prompt: 'What movie is about a clownfish searching for his son?', answer: 'Finding Nemo' },
  { id: 'tri-09', category: 'Movies', prompt: 'What movie features the song “Let It Go”?', answer: 'Frozen' },
  { id: 'tri-10', category: 'Movies', prompt: 'What movie has a wizarding school called Hogwarts?', answer: 'Harry Potter' }
];

const EMOJI_QUESTIONS = [
  { id: 'emo-01', puzzle: '🧙‍♂️💍🗻', answer: 'Lord of the Rings', hint: 'One ring to rule them all.' },
  { id: 'emo-02', puzzle: '🐠🔎🌊', answer: 'Finding Nemo', hint: 'A very worried dad.' },
  { id: 'emo-03', puzzle: '🚢🧊💔', answer: 'Titanic', hint: 'Never let go.' },
  { id: 'emo-04', puzzle: '🦁👑', answer: 'The Lion King', hint: 'Circle of life.' },
  { id: 'emo-05', puzzle: '🕷️👨🏙️', answer: 'Spider-Man', hint: 'Friendly neighborhood hero.' },
  { id: 'emo-06', puzzle: '🦖🏝️', answer: 'Jurassic Park', hint: 'Dinosaurs on an island.' },
  { id: 'emo-07', puzzle: '👽🚲🌕', answer: 'E.T.', hint: 'Phone home.' },
  { id: 'emo-08', puzzle: '🧑‍🍳🐀🍝', answer: 'Ratatouille', hint: 'Tiny chef, big flavor.' },
  { id: 'emo-09', puzzle: '👨‍💼📄🏢', answer: 'The Office', hint: 'Paper company chaos.' },
  { id: 'emo-10', puzzle: '📅😵‍💫📞', answer: 'Too many meetings', hint: 'Your calendar is the villain.' },
  { id: 'emo-11', puzzle: '🧠💡🚀', answer: 'Big idea', hint: 'Brainstorm energy.' },
  { id: 'emo-12', puzzle: '🔥🧯', answer: 'Putting out fires', hint: 'A very normal workday.' }
];

const SUPERLATIVE_PROMPTS = [
  { id: 'sup-01', prompt: 'Who is most likely to have 47 browser tabs open?' },
  { id: 'sup-02', prompt: 'Who is most likely to win trivia night?' },
  { id: 'sup-03', prompt: 'Who is most likely to have the best snacks?' },
  { id: 'sup-04', prompt: 'Who is most likely to survive a zombie apocalypse?' },
  { id: 'sup-05', prompt: 'Who is most likely to send the perfect GIF in chat?' },
  { id: 'sup-06', prompt: 'Who is most likely to have the best vacation recommendations?' },
  { id: 'sup-07', prompt: 'Who is most likely to become a food critic?' },
  { id: 'sup-08', prompt: 'Who is most likely to accidentally become famous?' }
];

const INTRO_PROMPTS = [
  'What show do you always recommend?',
  'What is your current comfort show?',
  'What movie have you watched way too many times?',
  'What food opinion will you defend forever?',
  'What is a random hobby people might not know about?',
  'What harmless hot take do you stand by?',
  'What is one thing people should ask you about next time?',
  'What is something you are looking forward to outside work?'
];

const GAME_META = {
  intros: { name: 'Fun Intros', emoji: '🎤', description: 'Randomized intro order, prompts, and a 45-second spotlight timer.' },
  majority: { name: 'Majority Rules', emoji: '📊', description: 'Players answer honestly, then predict the room majority.' },
  trivia: { name: 'Team Trivia', emoji: '🧠', description: 'Teams discuss and submit one answer. Host awards points.' },
  emoji: { name: 'Guess the Emoji', emoji: '🎬', description: 'Emoji puzzles with optional hints and host scoring.' },
  superlatives: { name: 'Team Superlatives', emoji: '🏆', description: 'Everyone votes for the person who fits the prompt.' },
  final: { name: 'Final Bonus', emoji: '⚡', description: 'Use intro facts for a dramatic “Who said that?” finale.' }
};

const app = document.getElementById('app');
const roomPill = document.getElementById('roomPill');
const connectionStatus = document.getElementById('connectionStatus');

let store = null;
let unsubscribe = null;
let tickTimer = null;
let state = {
  room: null,
  roomCode: new URLSearchParams(location.search).get('room') || localStorage.getItem(ROOM_KEY) || '',
  role: new URLSearchParams(location.search).get('role') || localStorage.getItem(ROLE_KEY) || '',
  playerId: localStorage.getItem(PLAYER_ID_KEY) || makeId('p'),
  hostUnlocked: sessionStorage.getItem(HOST_UNLOCK_KEY) === 'yes',
  activeHostTab: 'setup',
  soundOn: localStorage.getItem(SOUND_KEY) === 'yes',
  selectedGame: 'majority',
  loading: true,
  modalOpen: false
};
localStorage.setItem(PLAYER_ID_KEY, state.playerId);

init();

async function init() {
  store = await createStore();
  connectionStatus.textContent = store.label;
  updateSoundButton();
  if (state.roomCode) await subscribeToRoom(state.roomCode);
  render();
  document.addEventListener('click', handleClick);
  document.addEventListener('submit', handleSubmit);
  document.addEventListener('change', handleChange);
  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(location.search);
    state.roomCode = params.get('room') || '';
    state.role = params.get('role') || '';
    subscribeToRoom(state.roomCode);
  });
  startTicker();
}

async function createStore() {
  if (window.HHA_FIREBASE_CONFIG && window.HHA_FIREBASE_CONFIG.databaseURL) {
    try {
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
      const { getDatabase, ref, onValue, get, set, update, remove } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js');
      const fbApp = initializeApp(window.HHA_FIREBASE_CONFIG);
      const db = getDatabase(fbApp);
      return {
        mode: 'firebase',
        label: 'Real-time Firebase mode',
        async getRoom(code) {
          const snap = await get(ref(db, `rooms/${code}`));
          return snap.exists() ? snap.val() : null;
        },
        async setRoom(code, room) { await set(ref(db, `rooms/${code}`), room); },
        async setPath(code, path, value) { await set(ref(db, `rooms/${code}/${path.join('/')}`), value); },
        async updatePath(code, path, patch) { await update(ref(db, `rooms/${code}/${path.join('/')}`), patch); },
        async removePath(code, path) { await remove(ref(db, `rooms/${code}/${path.join('/')}`)); },
        subscribeRoom(code, cb) {
          const roomRef = ref(db, `rooms/${code}`);
          const off = onValue(roomRef, snap => cb(snap.exists() ? snap.val() : null));
          return () => off();
        }
      };
    } catch (err) {
      console.error(err);
      return new LocalStore('Firebase failed, local demo mode');
    }
  }
  return new LocalStore('Local demo mode');
}

class LocalStore {
  constructor(label = 'Local demo mode') {
    this.mode = 'local';
    this.label = label;
    this.bc = 'BroadcastChannel' in window ? new BroadcastChannel('hha_rooms') : null;
  }
  key(code) { return `hha_room_${code}`; }
  async getRoom(code) { return readJson(this.key(code)); }
  async setRoom(code, room) {
    localStorage.setItem(this.key(code), JSON.stringify(room));
    this.broadcast(code);
  }
  async setPath(code, path, value) {
    const room = await this.getRoom(code) || createDefaultRoom(code);
    setDeep(room, path, value);
    await this.setRoom(code, room);
  }
  async updatePath(code, path, patch) {
    const room = await this.getRoom(code) || createDefaultRoom(code);
    const target = getDeep(room, path) || {};
    setDeep(room, path, { ...target, ...patch });
    await this.setRoom(code, room);
  }
  async removePath(code, path) {
    const room = await this.getRoom(code) || createDefaultRoom(code);
    removeDeep(room, path);
    await this.setRoom(code, room);
  }
  subscribeRoom(code, cb) {
    const emit = () => cb(readJson(this.key(code)));
    emit();
    const storageHandler = (e) => { if (e.key === this.key(code)) emit(); };
    const bcHandler = (e) => { if (e.data === code) emit(); };
    window.addEventListener('storage', storageHandler);
    this.bc?.addEventListener('message', bcHandler);
    return () => {
      window.removeEventListener('storage', storageHandler);
      this.bc?.removeEventListener('message', bcHandler);
    };
  }
  broadcast(code) { this.bc?.postMessage(code); window.dispatchEvent(new StorageEvent('storage', { key: this.key(code) })); }
}

function createDefaultRoom(code) {
  return {
    code,
    createdAt: Date.now(),
    phase: 'lobby',
    currentRound: null,
    intro: { order: [], index: 0, prompt: INTRO_PROMPTS[0], completed: {} },
    players: {},
    teams: {
      team1: { id: 'team1', name: 'Team Strawberry', score: 0, color: TEAM_COLORS.team1, emoji: TEAM_EMOJIS.team1 },
      team2: { id: 'team2', name: 'Team Icebreakers', score: 0, color: TEAM_COLORS.team2, emoji: TEAM_EMOJIS.team2 },
      team3: { id: 'team3', name: 'Team Lightning', score: 0, color: TEAM_COLORS.team3, emoji: TEAM_EMOJIS.team3 }
    },
    answers: {},
    predictions: {},
    teamAnswers: {},
    votes: {},
    settings: { introSeconds: 45, questionSeconds: 45, teamSeconds: 60 },
    history: []
  };
}

async function subscribeToRoom(code) {
  if (unsubscribe) unsubscribe();
  state.roomCode = code || '';
  localStorage.setItem(ROOM_KEY, state.roomCode);
  roomPill.textContent = state.roomCode ? `Room ${state.roomCode}` : 'No room';
  if (!code) { state.room = null; render(); return; }
  unsubscribe = store.subscribeRoom(code, room => {
    state.room = room;
    render();
  });
}

function setRoute(role, roomCode = state.roomCode) {
  state.role = role;
  state.roomCode = roomCode || state.roomCode;
  localStorage.setItem(ROLE_KEY, role || '');
  localStorage.setItem(ROOM_KEY, state.roomCode || '');
  const params = new URLSearchParams();
  if (state.roomCode) params.set('room', state.roomCode);
  if (role) params.set('role', role);
  history.pushState({}, '', `${location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
}

async function ensureRoom(code) {
  let room = await store.getRoom(code);
  if (!room) {
    room = createDefaultRoom(code);
    await store.setRoom(code, room);
  }
  return room;
}

function render() {
  document.body.classList.toggle('display-mode', state.role === 'display');
  roomPill.textContent = state.roomCode ? `Room ${state.roomCode}` : 'No room';
  if (!state.role) return renderHome();
  if (state.role === 'host') return renderHostGate();
  if (state.role === 'display') return renderDisplay();
  if (state.role === 'player') return renderPlayer();
  renderHome();
}

function renderHome() {
  const newCode = randomRoomCode();
  app.innerHTML = `
    <section class="hero">
      <div class="card">
        <span class="kicker">Live game room · GitHub Pages ready</span>
        <h1>Turn the happy hour into a <span class="gradient-text">tiny game show.</span></h1>
        <p class="lead">Players join, pick teams, answer on their own screens, predict the majority, vote on superlatives, and watch the scoreboard move in real time.</p>
        <div class="grid three" style="margin-top:1.2rem">
          ${Object.values(GAME_META).map(g => `<div class="mini-card"><div style="font-size:1.8rem">${g.emoji}</div><strong>${g.name}</strong><p class="helper">${g.description}</p></div>`).join('')}
        </div>
      </div>
      <div class="card stack">
        <h2>Join or host</h2>
        <form class="stack" data-form="join-player">
          <label>Room code<input class="input code" name="room" value="${escapeHtml(state.roomCode || '')}" placeholder="e.g. FLAN42" maxlength="12" /></label>
          <label>Your name<input class="input" name="name" placeholder="Type your name" maxlength="32" /></label>
          <button class="btn big" type="submit">Join as Player</button>
        </form>
        <div class="hr"></div>
        <div class="grid two">
          <button class="ghost" data-action="host-existing">Host Existing Room</button>
          <button class="ghost" data-action="display-existing">Open Display</button>
        </div>
        <button class="success full" data-action="create-room" data-code="${newCode}">Create New Room: <span class="code">${newCode}</span></button>
        <p class="helper">Real-time multi-device play needs Firebase configured in <code>firebase-config.js</code>. Without it, this runs as a local demo in one browser.</p>
      </div>
    </section>
  `;
}

function renderHostGate() {
  if (!state.roomCode) return renderHome();
  if (!state.hostUnlocked) {
    app.innerHTML = `
      <section class="card admin-lock stack">
        <span class="kicker">Host mode</span>
        <h2>Unlock the control room</h2>
        <p>Room <strong class="code">${escapeHtml(state.roomCode)}</strong></p>
        <form class="stack" data-form="unlock-host">
          <label>Host password<input class="input" type="password" name="password" placeholder="Enter password" autofocus /></label>
          <button class="btn" type="submit">Unlock Host Controls</button>
        </form>
      </section>
    `;
    return;
  }
  if (!state.room) {
    app.innerHTML = `<div class="card center stack"><h2>Loading room…</h2><p class="muted">Room ${escapeHtml(state.roomCode)}</p></div>`;
    return;
  }
  renderHost();
}

function renderHost() {
  const room = state.room;
  const tab = state.activeHostTab;
  app.innerHTML = `
    <section class="grid host">
      <aside class="panel stack host-control">
        <div class="row between">
          <div>
            <span class="kicker">Host</span>
            <h2 style="margin:.7rem 0 0">${escapeHtml(room.code)}</h2>
          </div>
          <button class="ghost small" data-action="confetti">Confetti</button>
        </div>
        ${renderScoreboard(room)}
        <div class="grid two">
          <button class="ghost small" data-action="copy-player-link">Copy Player Link</button>
          <button class="ghost small" data-action="copy-display-link">Copy Display Link</button>
        </div>
        <button class="danger small" data-action="reset-room">Reset Room</button>
      </aside>
      <section class="panel">
        <nav class="nav-tabs">
          ${['setup','games','current','scores'].map(t => `<button class="ghost small ${tab===t?'active':''}" data-action="host-tab" data-tab="${t}">${titleCase(t)}</button>`).join('')}
        </nav>
        ${tab === 'setup' ? renderHostSetup(room) : ''}
        ${tab === 'games' ? renderHostGames(room) : ''}
        ${tab === 'current' ? renderHostCurrent(room) : ''}
        ${tab === 'scores' ? renderHostScores(room) : ''}
      </section>
      <aside class="panel stack">
        <h3>Players (${players(room).length})</h3>
        ${renderPlayersByTeam(room, true)}
      </aside>
    </section>
  `;
}

function renderHostSetup(room) {
  return `
    <div class="stage">
      <div class="question-card stack">
        <span class="kicker">Setup</span>
        <h2>Room lobby</h2>
        <p>Send the player link, let everyone add their name, then move them around or let them choose teams.</p>
        <div class="grid two">
          <div class="mini-card stack">
            <h3>Player link</h3>
            <input class="input" readonly value="${escapeHtml(linkFor('player'))}" />
            <button class="ghost" data-action="copy-player-link">Copy Player Link</button>
          </div>
          <div class="mini-card stack">
            <h3>Shared display link</h3>
            <input class="input" readonly value="${escapeHtml(linkFor('display'))}" />
            <button class="ghost" data-action="copy-display-link">Copy Display Link</button>
          </div>
        </div>
      </div>
      <div class="grid three">
        ${Object.values(room.teams).map(team => `
          <div class="mini-card stack" style="--team-color:${team.color}">
            <label>${team.emoji} Team name<input class="input" data-team-name="${team.id}" value="${escapeHtml(team.name)}" /></label>
            <div class="helper">${teamMembers(room, team.id).length} players</div>
          </div>`).join('')}
      </div>
      <button class="success" data-action="save-team-names">Save Team Names</button>
    </div>
  `;
}

function renderHostGames(room) {
  return `
    <div class="stage">
      <div class="question-card stack">
        <span class="kicker">Game select</span>
        <h2>Choose what to run</h2>
        <div class="grid three">
          ${Object.entries(GAME_META).map(([key, g]) => `
            <button class="choice ${state.selectedGame === key ? 'selected' : ''}" data-action="select-game" data-game="${key}">
              <strong>${g.emoji} ${g.name}</strong>
              <span>${g.description}</span>
            </button>
          `).join('')}
        </div>
      </div>
      ${renderGameLauncher(room, state.selectedGame)}
    </div>
  `;
}

function renderGameLauncher(room, game) {
  if (game === 'intros') return renderIntroLauncher(room);
  if (game === 'majority') return renderQuestionBank('Majority Rules', MAJORITY_QUESTIONS, q => `
    <button class="btn small" data-action="start-majority" data-id="${q.id}">Start</button>
  `, q => `<strong>${escapeHtml(q.prompt)}</strong><p class="helper">${q.options.join(' vs ')}</p>`);
  if (game === 'trivia') return renderQuestionBank('Team Trivia', TRIVIA_QUESTIONS, q => `
    <button class="btn small" data-action="start-trivia" data-id="${q.id}">Start</button>
  `, q => `<span class="pill subtle">${q.category}</span><h3>${escapeHtml(q.prompt)}</h3><p class="helper">Answer: ${escapeHtml(q.answer)}</p>`);
  if (game === 'emoji') return renderQuestionBank('Guess the Emoji', EMOJI_QUESTIONS, q => `
    <button class="btn small" data-action="start-emoji" data-id="${q.id}">Start</button>
  `, q => `<div style="font-size:2rem">${q.puzzle}</div><h3>${escapeHtml(q.answer)}</h3><p class="helper">Hint: ${escapeHtml(q.hint)}</p>`);
  if (game === 'superlatives') return renderQuestionBank('Team Superlatives', SUPERLATIVE_PROMPTS, q => `
    <button class="btn small" data-action="start-superlative" data-id="${q.id}">Start</button>
  `, q => `<strong>${escapeHtml(q.prompt)}</strong><p class="helper">Everyone votes for a person.</p>`);
  if (game === 'final') return renderFinalLauncher(room);
  return '';
}

function renderQuestionBank(title, list, actionRenderer, contentRenderer) {
  return `
    <div class="panel stack">
      <div class="row between"><h2>${title}</h2><span class="pill subtle">${list.length} prompts</span></div>
      <div class="grid two">
        ${list.map(q => `
          <div class="mini-card stack">
            <div>${contentRenderer(q)}</div>
            <div class="row end">${actionRenderer(q)}</div>
          </div>`).join('')}
      </div>
    </div>
  `;
}

function renderIntroLauncher(room) {
  const count = players(room).length;
  return `
    <div class="question-card stack">
      <span class="kicker">Fun Intros</span>
      <h2>Randomized intro order</h2>
      <p>Players enter their intro facts on their own screens. The host runs the spotlight timer.</p>
      <div class="grid two">
        <label>Intro prompt<select class="input" id="introPromptSelect">${INTRO_PROMPTS.map(p => `<option value="${escapeAttr(p)}" ${room.intro?.prompt === p ? 'selected' : ''}>${escapeHtml(p)}</option>`).join('')}</select></label>
        <label>Seconds per person<input class="input" id="introSecondsInput" type="number" min="10" max="180" value="${room.settings?.introSeconds || 45}" /></label>
      </div>
      <button class="btn" data-action="start-intros">Start Intros for ${count} Players</button>
    </div>
  `;
}

function renderFinalLauncher(room) {
  const available = players(room).filter(p => p.intro?.fact || p.intro?.hotTake || p.intro?.show);
  return `
    <div class="question-card stack">
      <span class="kicker">Final Bonus</span>
      <h2>Who Said That?</h2>
      <p>The app pulls a submitted intro fact/show/hot take and asks teams to guess the person. Correct team answers get 5 points.</p>
      <div class="pill cool">${available.length} usable intro cards</div>
      <button class="btn" data-action="start-final" ${available.length ? '' : 'disabled'}>Generate Final Bonus Round</button>
      ${available.length ? '' : '<p class="helper">Ask players to fill out their intro card first.</p>'}
    </div>
  `;
}

function renderHostCurrent(room) {
  const r = room.currentRound;
  if (!r) return `<div class="empty-state"><h2>No live round</h2><p>Choose a game from the Games tab to start.</p></div>`;
  if (r.game === 'intros') return renderHostIntroCurrent(room, r);
  if (r.game === 'majority') return renderHostMajorityCurrent(room, r);
  if (r.game === 'trivia' || r.game === 'emoji') return renderHostTeamAnswerCurrent(room, r);
  if (r.game === 'superlatives') return renderHostSuperlativeCurrent(room, r);
  if (r.game === 'final') return renderHostFinalCurrent(room, r);
  return `<div class="empty-state">Unknown round</div>`;
}

function renderHostIntroCurrent(room, r) {
  const order = room.intro?.order || [];
  const currentId = order[room.intro?.index || 0];
  const p = room.players?.[currentId];
  const doneCount = Object.keys(room.intro?.completed || {}).length;
  return `
    <div class="question-card stack center">
      <span class="kicker">${GAME_META.intros.emoji} Fun Intros</span>
      <h2>${doneCount}/${order.length} complete</h2>
      ${p ? renderIntroSpotlight(room, p) : '<p>No one in the intro queue.</p>'}
      ${renderTimer(r)}
      <div class="row center" style="justify-content:center">
        <button class="ghost" data-action="intro-prev">Previous</button>
        <button class="btn" data-action="start-timer" data-seconds="${room.settings?.introSeconds || 45}">Start ${room.settings?.introSeconds || 45}s Timer</button>
        <button class="success" data-action="intro-complete-next">Complete + Next</button>
        <button class="ghost" data-action="intro-next">Next</button>
      </div>
    </div>
  `;
}

function renderHostMajorityCurrent(room, r) {
  const count = players(room).length;
  const answerCount = Object.keys(roundAnswers(room, r.id)).length;
  const predictionCount = Object.keys(roundPredictions(room, r.id)).length;
  const stats = computeMajorityStats(room, r);
  return `
    <div class="question-card stack">
      <span class="kicker">${GAME_META.majority.emoji} Majority Rules · ${phaseLabel(r.phase)}</span>
      <h2 class="question-text">${escapeHtml(r.prompt)}</h2>
      ${renderTimer(r)}
      <div class="grid two">
        <div class="mini-card"><strong>Personal answers</strong><p>${answerCount}/${count} submitted</p>${renderProgress(answerCount, count)}</div>
        <div class="mini-card"><strong>Majority predictions</strong><p>${predictionCount}/${count} submitted</p>${renderProgress(predictionCount, count)}</div>
      </div>
      ${r.phase === 'reveal' ? renderMajorityResults(room, r, stats) : ''}
      <div class="row">
        <button class="btn" data-action="majority-answer-phase">Personal Answer Phase</button>
        <button class="btn" data-action="majority-predict-phase" ${answerCount ? '' : 'disabled'}>Prediction Phase</button>
        <button class="success" data-action="majority-reveal" ${predictionCount ? '' : 'disabled'}>Reveal</button>
        <button class="success" data-action="score-majority" ${r.phase === 'reveal' && !r.scored ? '' : 'disabled'}>Apply Score</button>
        <button class="ghost" data-action="clear-round-inputs">Clear Answers</button>
        <button class="danger" data-action="end-round">End Round</button>
      </div>
    </div>
  `;
}

function renderHostTeamAnswerCurrent(room, r) {
  const teamAnswers = roundTeamAnswers(room, r.id);
  const isEmoji = r.game === 'emoji';
  return `
    <div class="question-card stack">
      <span class="kicker">${isEmoji ? GAME_META.emoji.emoji : GAME_META.trivia.emoji} ${GAME_META[r.game].name} · ${phaseLabel(r.phase)}</span>
      ${isEmoji ? `<div class="emoji-puzzle">${r.puzzle}</div>` : ''}
      <h2 class="question-text">${escapeHtml(r.prompt)}</h2>
      ${r.showHint ? `<div class="pill cool">Hint: ${escapeHtml(r.hint || '')}</div>` : ''}
      ${renderTimer(r)}
      <div class="grid three">
        ${Object.values(room.teams).map(team => {
          const ans = teamAnswers[team.id];
          return `<div class="mini-card stack" style="--team-color:${team.color}">
            <span class="pill">${team.emoji} ${escapeHtml(team.name)}</span>
            <strong>${ans ? escapeHtml(ans.answer || '') : 'Waiting…'}</strong>
            <div class="row">
              <button class="success small" data-action="mark-team-correct" data-team="${team.id}">Correct +2</button>
              <button class="ghost small" data-action="award-team-bonus" data-team="${team.id}">Bonus +1</button>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="mini-card"><strong>Official answer:</strong> ${escapeHtml(r.answer || '')}</div>
      <div class="row">
        <button class="btn" data-action="team-answer-phase">Start Answer Phase</button>
        ${isEmoji ? `<button class="ghost" data-action="show-hint">Show Hint</button>` : ''}
        <button class="success" data-action="team-reveal">Reveal Answer</button>
        <button class="ghost" data-action="clear-round-inputs">Clear Answers</button>
        <button class="danger" data-action="end-round">End Round</button>
      </div>
    </div>
  `;
}

function renderHostSuperlativeCurrent(room, r) {
  const count = players(room).length;
  const votes = roundVotes(room, r.id);
  const voteCount = Object.keys(votes).length;
  const stats = computeVoteStats(room, r);
  return `
    <div class="question-card stack">
      <span class="kicker">${GAME_META.superlatives.emoji} Team Superlatives · ${phaseLabel(r.phase)}</span>
      <h2 class="question-text">${escapeHtml(r.prompt)}</h2>
      <div class="mini-card"><strong>Votes</strong><p>${voteCount}/${count} submitted</p>${renderProgress(voteCount, count)}</div>
      ${r.phase === 'reveal' ? renderSuperlativeResults(room, stats) : ''}
      <div class="row">
        <button class="btn" data-action="superlative-vote-phase">Voting Phase</button>
        <button class="success" data-action="superlative-reveal" ${voteCount ? '' : 'disabled'}>Reveal</button>
        <button class="success" data-action="score-superlative" ${r.phase === 'reveal' && !r.scored ? '' : 'disabled'}>Apply Score</button>
        <button class="ghost" data-action="clear-round-inputs">Clear Votes</button>
        <button class="danger" data-action="end-round">End Round</button>
      </div>
    </div>
  `;
}

function renderHostFinalCurrent(room, r) {
  const teamAnswers = roundTeamAnswers(room, r.id);
  const answerPlayer = room.players?.[r.answerPlayerId];
  return `
    <div class="question-card stack">
      <span class="kicker">${GAME_META.final.emoji} Final Bonus · ${phaseLabel(r.phase)}</span>
      <h2 class="question-text">Who said this?</h2>
      <div class="mini-card"><p style="font-size:1.35rem;color:var(--text);font-weight:900">“${escapeHtml(r.fact)}”</p></div>
      <div class="grid three">
        ${Object.values(room.teams).map(team => {
          const ans = teamAnswers[team.id];
          const guessed = ans ? room.players?.[ans.answer]?.name : '';
          return `<div class="mini-card stack"><span class="pill">${team.emoji} ${escapeHtml(team.name)}</span><strong>${guessed ? escapeHtml(guessed) : 'Waiting…'}</strong></div>`;
        }).join('')}
      </div>
      ${r.phase === 'reveal' ? `<div class="mini-card success"><strong>Correct answer:</strong> ${escapeHtml(answerPlayer?.name || 'Unknown')}</div>` : ''}
      <div class="row">
        <button class="btn" data-action="final-answer-phase">Start Guessing</button>
        <button class="success" data-action="final-reveal">Reveal</button>
        <button class="success" data-action="score-final" ${r.phase === 'reveal' && !r.scored ? '' : 'disabled'}>Apply +5</button>
        <button class="danger" data-action="end-round">End Game</button>
      </div>
    </div>
  `;
}

function renderHostScores(room) {
  return `
    <div class="stage">
      <div class="question-card stack">
        <span class="kicker">Manual scoring</span>
        <h2>Scoreboard override</h2>
        <p>Live games get messy. Use this to fix anything instantly.</p>
        <div class="grid three">
          ${Object.values(room.teams).map(team => `
            <div class="mini-card stack">
              <h3>${team.emoji} ${escapeHtml(team.name)}</h3>
              <div class="score" style="font-size:3rem;font-weight:1000">${team.score || 0}</div>
              <div class="row">
                <button class="ghost small" data-action="add-score" data-team="${team.id}" data-delta="-1">-1</button>
                <button class="success small" data-action="add-score" data-team="${team.id}" data-delta="1">+1</button>
                <button class="success small" data-action="add-score" data-team="${team.id}" data-delta="2">+2</button>
                <button class="success small" data-action="add-score" data-team="${team.id}" data-delta="5">+5</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <button class="danger" data-action="zero-scores">Zero Scores</button>
    </div>
  `;
}

function renderPlayer() {
  const room = state.room;
  if (!state.roomCode) return renderHome();
  if (!room) {
    app.innerHTML = `<div class="card center stack"><h2>Joining room…</h2><p class="muted">${escapeHtml(state.roomCode)}</p></div>`;
    return;
  }
  const me = room.players?.[state.playerId];
  if (!me) return renderPlayerJoin(room);
  app.innerHTML = `
    <section class="grid display">
      <main class="panel stage">
        ${renderPlayerStage(room, me)}
      </main>
      <aside class="panel stack">
        <div class="mini-card stack">
          <span class="kicker">You</span>
          <div class="row"><span class="avatar">${me.avatar}</span><div><strong>${escapeHtml(me.name)}</strong><div class="helper">${escapeHtml(room.teams?.[me.team]?.name || 'No team')}</div></div></div>
          <button class="ghost small" data-action="edit-intro">Edit Intro Card</button>
          <button class="ghost small" data-action="change-team">Change Team</button>
        </div>
        ${renderScoreboard(room)}
      </aside>
    </section>
  `;
}

function renderPlayerJoin(room) {
  const rememberedName = sessionStorage.getItem('hha_join_name') || '';
  app.innerHTML = `
    <section class="card stack" style="max-width:760px;margin:2rem auto">
      <span class="kicker">Room ${escapeHtml(room.code)}</span>
      <h1>Jump in.</h1>
      <form class="stack" data-form="complete-player-join">
        <label>Your name<input class="input" name="name" value="${escapeHtml(rememberedName)}" maxlength="32" placeholder="Type your name" required /></label>
        <label>Avatar<select class="input" name="avatar">${AVATARS.map(a => `<option>${a}</option>`).join('')}</select></label>
        <div class="grid three">
          ${Object.values(room.teams).map(team => `<button type="button" class="team-choice" data-action="choose-join-team" data-team="${team.id}"><strong>${team.emoji} ${escapeHtml(team.name)}</strong><span>${teamMembers(room, team.id).length} players</span></button>`).join('')}
        </div>
        <input type="hidden" name="team" id="joinTeamInput" value="team1" />
        <button class="btn big" type="submit">Join Game</button>
      </form>
    </section>
  `;
}

function renderPlayerStage(room, me) {
  const r = room.currentRound;
  if (!r) {
    return `
      <div class="question-card stack center">
        <span class="kicker">Lobby</span>
        <h2>Waiting for the host to start</h2>
        <p>Fill out your intro card while everyone joins.</p>
        ${renderIntroForm(me)}
      </div>
    `;
  }
  if (r.game === 'intros') return renderPlayerIntro(room, me, r);
  if (r.game === 'majority') return renderPlayerMajority(room, me, r);
  if (r.game === 'trivia' || r.game === 'emoji') return renderPlayerTeamAnswer(room, me, r);
  if (r.game === 'superlatives') return renderPlayerSuperlative(room, me, r);
  if (r.game === 'final') return renderPlayerFinal(room, me, r);
  return `<div class="empty-state">Waiting for host…</div>`;
}

function renderIntroForm(me) {
  return `
    <form class="stack" data-form="save-intro">
      <label>How long have you been here?<input class="input" name="tenure" value="${escapeHtml(me.intro?.tenure || '')}" placeholder="e.g. 6 months, 3 years" /></label>
      <label>Favorite show/movie/comfort rewatch<input class="input" name="show" value="${escapeHtml(me.intro?.show || '')}" placeholder="e.g. The Office" /></label>
      <label>Fun fact or harmless hot take<textarea name="fact" placeholder="e.g. I think pineapple belongs on pizza.">${escapeHtml(me.intro?.fact || '')}</textarea></label>
      <button class="success" type="submit">Save Intro Card</button>
    </form>
  `;
}

function renderPlayerIntro(room, me, r) {
  const order = room.intro?.order || [];
  const currentId = order[room.intro?.index || 0];
  const isMe = currentId === me.id;
  const current = room.players?.[currentId];
  return `
    <div class="question-card stack center">
      <span class="kicker">🎤 Fun Intros</span>
      <h2>${isMe ? 'You’re up!' : current ? `${escapeHtml(current.name)} is up` : 'Intro time'}</h2>
      <p>${escapeHtml(room.intro?.prompt || INTRO_PROMPTS[0])}</p>
      ${current ? renderIntroSpotlight(room, current) : ''}
      ${renderTimer(r)}
      ${isMe ? `<div class="pill hot">Your spotlight. Unmute and go for it.</div>` : `<p class="helper">Listen for one thing you can ask them about later.</p>`}
    </div>
  `;
}

function renderPlayerMajority(room, me, r) {
  const myAnswer = roundAnswers(room, r.id)[me.id]?.answer;
  const myPrediction = roundPredictions(room, r.id)[me.id]?.prediction;
  const stats = computeMajorityStats(room, r);
  return `
    <div class="question-card stack center">
      <span class="kicker">📊 Majority Rules · ${phaseLabel(r.phase)}</span>
      <h2 class="question-text">${escapeHtml(r.prompt)}</h2>
      ${renderTimer(r)}
      ${r.phase === 'answer' ? `
        <p>First: answer honestly. No results yet.</p>
        <div class="grid two">${r.options.map(opt => `<button class="choice ${myAnswer===opt?'selected':''}" data-action="submit-majority-answer" data-value="${escapeAttr(opt)}"><strong>${escapeHtml(opt)}</strong><span>${myAnswer===opt?'Locked in':'Choose this'}</span></button>`).join('')}</div>
      ` : ''}
      ${r.phase === 'predict' ? `
        <p>Now predict what most people picked.</p>
        <div class="grid two">${r.options.map(opt => `<button class="choice ${myPrediction===opt?'selected':''}" data-action="submit-majority-prediction" data-value="${escapeAttr(opt)}"><strong>${escapeHtml(opt)}</strong><span>${myPrediction===opt?'Prediction locked':'Predict majority'}</span></button>`).join('')}</div>
        <p class="helper">Your own answer: <strong>${escapeHtml(myAnswer || 'not submitted')}</strong></p>
      ` : ''}
      ${r.phase === 'reveal' ? renderMajorityResults(room, r, stats) : ''}
      ${r.phase !== 'answer' && r.phase !== 'predict' && r.phase !== 'reveal' ? '<p>Waiting for host…</p>' : ''}
    </div>
  `;
}

function renderPlayerTeamAnswer(room, me, r) {
  const team = room.teams?.[me.team];
  const ans = roundTeamAnswers(room, r.id)[me.team]?.answer || '';
  const isEmoji = r.game === 'emoji';
  return `
    <div class="question-card stack center">
      <span class="kicker">${isEmoji ? '🎬 Guess the Emoji' : '🧠 Team Trivia'} · ${phaseLabel(r.phase)}</span>
      ${isEmoji ? `<div class="emoji-puzzle">${r.puzzle}</div>` : ''}
      <h2 class="question-text">${escapeHtml(r.prompt)}</h2>
      ${r.showHint ? `<span class="pill cool">Hint: ${escapeHtml(r.hint || '')}</span>` : ''}
      ${renderTimer(r)}
      ${r.phase === 'team-answer' ? `
        <p>Talk with ${team?.emoji || ''} <strong>${escapeHtml(team?.name || 'your team')}</strong>. One team answer counts. Anyone can submit/update it until reveal.</p>
        <form class="stack" data-form="submit-team-answer">
          <input class="input" name="answer" value="${escapeHtml(ans)}" placeholder="Type your team’s answer" required />
          <button class="btn big" type="submit">Submit Team Answer</button>
        </form>
      ` : ''}
      ${r.phase === 'reveal' ? `<div class="mini-card"><p>Official answer</p><h2>${escapeHtml(r.answer)}</h2></div>` : ''}
      ${ans && r.phase !== 'reveal' ? `<div class="pill lime">Current team answer: ${escapeHtml(ans)}</div>` : ''}
    </div>
  `;
}

function renderPlayerSuperlative(room, me, r) {
  const myVote = roundVotes(room, r.id)[me.id]?.vote;
  const stats = computeVoteStats(room, r);
  return `
    <div class="question-card stack center">
      <span class="kicker">🏆 Team Superlatives · ${phaseLabel(r.phase)}</span>
      <h2 class="question-text">${escapeHtml(r.prompt)}</h2>
      ${r.phase === 'vote' ? `
        <p>Vote for the person who best fits the prompt.</p>
        <div class="grid three">${players(room).map(p => `<button class="choice ${myVote===p.id?'selected':''}" data-action="submit-superlative-vote" data-player="${p.id}"><strong>${p.avatar} ${escapeHtml(p.name)}</strong><span>${escapeHtml(room.teams?.[p.team]?.name || '')}</span></button>`).join('')}</div>
      ` : ''}
      ${r.phase === 'reveal' ? renderSuperlativeResults(room, stats) : ''}
      ${myVote && r.phase !== 'reveal' ? `<div class="pill lime">Vote locked</div>` : ''}
    </div>
  `;
}

function renderPlayerFinal(room, me, r) {
  const ans = roundTeamAnswers(room, r.id)[me.team]?.answer || '';
  return `
    <div class="question-card stack center">
      <span class="kicker">⚡ Final Bonus</span>
      <h2 class="question-text">Who said this?</h2>
      <div class="mini-card"><p style="font-size:1.35rem;color:var(--text);font-weight:900">“${escapeHtml(r.fact)}”</p></div>
      ${r.phase === 'team-answer' ? `
        <p>Talk with your team and guess the person.</p>
        <form class="stack" data-form="submit-final-answer">
          <select class="input" name="answer" required>
            <option value="">Select a person</option>
            ${players(room).map(p => `<option value="${p.id}" ${ans === p.id ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}
          </select>
          <button class="btn big" type="submit">Submit Final Guess</button>
        </form>
      ` : ''}
      ${r.phase === 'reveal' ? `<div class="mini-card"><p>Correct answer</p><h2>${escapeHtml(room.players?.[r.answerPlayerId]?.name || 'Unknown')}</h2></div>` : ''}
      ${ans && r.phase !== 'reveal' ? `<div class="pill lime">Team guess submitted</div>` : ''}
    </div>
  `;
}

function renderDisplay() {
  const room = state.room;
  if (!state.roomCode) return renderHome();
  if (!room) {
    app.innerHTML = `<div class="card center stack"><h2>Loading display…</h2><p class="muted">${escapeHtml(state.roomCode)}</p></div>`;
    return;
  }
  const r = room.currentRound;
  app.innerHTML = `
    <section class="grid display">
      <main class="question-card stack center" style="min-height:72vh;justify-content:center">
        ${renderDisplayMain(room, r)}
      </main>
      <aside class="panel stack">
        <div class="mini-card center"><span class="kicker">Room</span><h2 class="code">${escapeHtml(room.code)}</h2><p>Join from your phone and play along.</p></div>
        ${renderScoreboard(room)}
        <div class="mini-card"><h3>Players</h3>${renderCompactPlayers(room)}</div>
      </aside>
    </section>
  `;
}

function renderDisplayMain(room, r) {
  if (!r) return `<span class="kicker">Lobby</span><h1 class="display-title">Join the game</h1><p class="lead" style="margin:auto">Pick a team. Fill your intro card. The host will start soon.</p>`;
  if (r.game === 'intros') {
    const currentId = room.intro?.order?.[room.intro?.index || 0];
    const p = room.players?.[currentId];
    return `<span class="kicker">🎤 Fun Intros</span><h1 class="display-title">${p ? escapeHtml(p.name) : 'Intro time'}</h1>${p ? renderIntroSpotlight(room, p) : ''}${renderTimer(r)}`;
  }
  if (r.game === 'majority') {
    const stats = computeMajorityStats(room, r);
    return `<span class="kicker">📊 Majority Rules · ${phaseLabel(r.phase)}</span><h1 class="display-title">${escapeHtml(r.prompt)}</h1>${renderTimer(r)}${r.phase === 'reveal' ? renderMajorityResults(room, r, stats) : renderSubmissionStatus(room, r)}`;
  }
  if (r.game === 'trivia' || r.game === 'emoji') {
    const isEmoji = r.game === 'emoji';
    return `<span class="kicker">${isEmoji ? '🎬 Guess the Emoji' : '🧠 Team Trivia'} · ${phaseLabel(r.phase)}</span>${isEmoji ? `<div class="emoji-puzzle">${r.puzzle}</div>` : ''}<h1 class="display-title">${escapeHtml(r.prompt)}</h1>${r.showHint ? `<span class="pill cool">Hint: ${escapeHtml(r.hint)}</span>` : ''}${renderTimer(r)}${r.phase === 'reveal' ? `<div class="mini-card"><h2>Answer: ${escapeHtml(r.answer)}</h2></div>` : renderSubmissionStatus(room, r)}`;
  }
  if (r.game === 'superlatives') {
    const stats = computeVoteStats(room, r);
    return `<span class="kicker">🏆 Team Superlatives · ${phaseLabel(r.phase)}</span><h1 class="display-title">${escapeHtml(r.prompt)}</h1>${r.phase === 'reveal' ? renderSuperlativeResults(room, stats) : renderSubmissionStatus(room, r)}`;
  }
  if (r.game === 'final') {
    return `<span class="kicker">⚡ Final Bonus</span><h1 class="display-title">Who said this?</h1><div class="mini-card"><p style="font-size:2rem;color:var(--text);font-weight:1000">“${escapeHtml(r.fact)}”</p></div>${r.phase === 'reveal' ? `<h2>Correct answer: ${escapeHtml(room.players?.[r.answerPlayerId]?.name || '')}</h2>` : renderSubmissionStatus(room, r)}`;
  }
  return '<h1>Game on</h1>';
}

function renderSubmissionStatus(room, r) {
  const totalPlayers = players(room).length;
  if (r.game === 'majority') {
    const count = r.phase === 'predict' ? Object.keys(roundPredictions(room, r.id)).length : Object.keys(roundAnswers(room, r.id)).length;
    return `<div class="mini-card"><h2>${count}/${totalPlayers} submitted</h2>${renderProgress(count, totalPlayers)}</div>`;
  }
  if (r.game === 'trivia' || r.game === 'emoji' || r.game === 'final') {
    const count = Object.keys(roundTeamAnswers(room, r.id)).length;
    return `<div class="mini-card"><h2>${count}/3 teams submitted</h2>${renderProgress(count, 3)}</div>`;
  }
  if (r.game === 'superlatives') {
    const count = Object.keys(roundVotes(room, r.id)).length;
    return `<div class="mini-card"><h2>${count}/${totalPlayers} votes submitted</h2>${renderProgress(count, totalPlayers)}</div>`;
  }
  return '';
}

function renderScoreboard(room) {
  return `<div class="scoreboard">${Object.values(room.teams || {}).map(team => `
    <div class="score-card" style="--team-color:${team.color}">
      <header><strong>${team.emoji} ${escapeHtml(team.name)}</strong><span class="pill subtle">${teamMembers(room, team.id).length}</span></header>
      <div class="score">${team.score || 0}</div>
      <div class="members">${teamMembers(room, team.id).map(p => escapeHtml(p.name)).join(', ') || 'No players yet'}</div>
    </div>`).join('')}</div>`;
}

function renderPlayersByTeam(room, hostControls = false) {
  return Object.values(room.teams || {}).map(team => `
    <div class="mini-card stack">
      <div class="row between"><strong>${team.emoji} ${escapeHtml(team.name)}</strong><span class="pill subtle">${teamMembers(room, team.id).length}</span></div>
      <div class="player-list">
        ${teamMembers(room, team.id).map(p => `
          <div class="player-card">
            <div class="player-main"><span class="avatar">${p.avatar}</span><div><div class="player-name">${escapeHtml(p.name)}</div><div class="player-meta">${escapeHtml(p.intro?.show || 'Intro card pending')}</div></div></div>
            ${hostControls ? `<select class="input small" style="width:98px" data-action="move-player" data-player="${p.id}">${Object.values(room.teams).map(t => `<option value="${t.id}" ${p.team===t.id?'selected':''}>${t.emoji}</option>`).join('')}</select>` : ''}
          </div>`).join('') || '<p class="helper">No players yet.</p>'}
      </div>
    </div>`).join('');
}

function renderCompactPlayers(room) {
  const ps = players(room);
  if (!ps.length) return '<p class="helper">No players yet.</p>';
  return `<div class="badge-list">${ps.map(p => `<span class="pill subtle">${p.avatar} ${escapeHtml(p.name)}</span>`).join('')}</div>`;
}

function renderIntroSpotlight(room, p) {
  return `
    <div class="mini-card stack" style="max-width:680px;margin:0 auto">
      <div style="font-size:4rem">${p.avatar}</div>
      <h2>${escapeHtml(p.name)}</h2>
      <div class="grid three">
        <div><span class="pill subtle">Tenure</span><p>${escapeHtml(p.intro?.tenure || 'Mystery')}</p></div>
        <div><span class="pill subtle">Show/Movie</span><p>${escapeHtml(p.intro?.show || 'Mystery')}</p></div>
        <div><span class="pill subtle">Fun fact</span><p>${escapeHtml(p.intro?.fact || 'Ask live!')}</p></div>
      </div>
    </div>
  `;
}

function renderTimer(r) {
  if (!r?.timerEndsAt) return '';
  const remaining = Math.max(0, Math.ceil((r.timerEndsAt - Date.now()) / 1000));
  const total = Math.max(1, r.timerSeconds || remaining || 1);
  const pct = Math.max(0, Math.min(100, (remaining / total) * 100));
  return `<div class="timer-ring" data-timer data-end="${r.timerEndsAt}" data-total="${total}" style="--pct:${pct}%"><strong>${remaining}</strong></div>`;
}

function renderProgress(done, total) {
  const pct = total ? Math.min(100, Math.round(done / total * 100)) : 0;
  return `<div class="progress-bar" title="${done}/${total}"><span style="--w:${pct}%"></span></div>`;
}

function renderMajorityResults(room, r, stats) {
  const total = Math.max(1, Object.values(stats.answerCounts).reduce((a,b)=>a+b,0));
  return `
    <div class="results">
      <div class="row"><span class="pill hot">Majority: ${escapeHtml(stats.majority || 'Tie')}</span><span class="pill cool">${stats.margin <= 2 ? 'Chaos round' : `${stats.margin} vote margin`}</span></div>
      ${r.options.map(opt => {
        const count = stats.answerCounts[opt] || 0;
        const pct = Math.round(count / total * 100);
        return `<div class="result-row"><strong>${escapeHtml(opt)}</strong><div class="bar"><span style="--w:${pct}%"></span></div><span>${count}</span></div>`;
      }).join('')}
      <div class="grid three">
        ${Object.values(room.teams).map(team => `<div class="mini-card"><strong>${team.emoji} ${escapeHtml(team.name)}</strong><p>${stats.correctByTeam[team.id] || 0} correct predictions</p></div>`).join('')}
      </div>
    </div>
  `;
}

function renderSuperlativeResults(room, stats) {
  const total = Math.max(1, Object.values(stats.voteCounts).reduce((a,b)=>a+b,0));
  const rows = Object.entries(stats.voteCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return `
    <div class="results">
      <div class="row"><span class="pill hot">Winner: ${escapeHtml(stats.winner?.name || 'Tie')}</span>${stats.winner ? `<span class="pill cool">${escapeHtml(state.room?.teams?.[stats.winner.team]?.name || '')}</span>` : ''}</div>
      ${rows.map(([pid, count]) => {
        const p = room.players?.[pid];
        const pct = Math.round(count / total * 100);
        return `<div class="result-row"><strong>${p ? `${p.avatar} ${escapeHtml(p.name)}` : 'Unknown'}</strong><div class="bar"><span style="--w:${pct}%"></span></div><span>${count}</span></div>`;
      }).join('') || '<p>No votes.</p>'}
    </div>
  `;
}

async function handleClick(e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;

  if (action === 'go-home') { e.preventDefault(); await leaveToHome(); }
  if (action === 'copy-link') return copyText(location.href);
  if (action === 'copy-player-link') return copyText(linkFor('player'));
  if (action === 'copy-display-link') return copyText(linkFor('display'));
  if (action === 'toggle-sound') return toggleSound();
  if (action === 'confetti') return fireConfetti();
  if (action === 'close-modal') return closeModal();

  if (action === 'create-room') {
    const code = el.dataset.code || randomRoomCode();
    await ensureRoom(code);
    await subscribeToRoom(code);
    setRoute('host', code);
    render();
  }
  if (action === 'host-existing') return promptRoomThen('host');
  if (action === 'display-existing') return promptRoomThen('display');
  if (action === 'choose-join-team') {
    document.querySelectorAll('.team-choice').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('joinTeamInput').value = el.dataset.team;
  }
  if (action === 'edit-intro') return openModal(`<h2>Edit Intro Card</h2>${renderIntroForm(currentPlayer())}`);
  if (action === 'change-team') return openTeamModal();
  if (action === 'select-team') return updatePlayer({ team: el.dataset.team });
  if (action === 'host-tab') { state.activeHostTab = el.dataset.tab; render(); }
  if (action === 'select-game') { state.selectedGame = el.dataset.game; render(); }
  if (action === 'reset-room') return confirmAction('Reset the room, players, answers, and scores?', async () => { await store.setRoom(state.roomCode, createDefaultRoom(state.roomCode)); toast('Room reset'); });
  if (action === 'save-team-names') return saveTeamNames();
  if (action === 'start-intros') return startIntros();
  if (action === 'intro-next') return moveIntro(1, false);
  if (action === 'intro-prev') return moveIntro(-1, false);
  if (action === 'intro-complete-next') return moveIntro(1, true);
  if (action === 'start-timer') return startTimer(Number(el.dataset.seconds || 45));
  if (action === 'start-majority') return startMajority(el.dataset.id);
  if (action === 'majority-answer-phase') return patchRound({ phase: 'answer' }, state.room.settings?.questionSeconds || 45);
  if (action === 'majority-predict-phase') return patchRound({ phase: 'predict' }, state.room.settings?.questionSeconds || 45);
  if (action === 'majority-reveal') return patchRound({ phase: 'reveal', timerEndsAt: null });
  if (action === 'score-majority') return scoreMajority();
  if (action === 'submit-majority-answer') return submitMajorityAnswer(el.dataset.value);
  if (action === 'submit-majority-prediction') return submitMajorityPrediction(el.dataset.value);
  if (action === 'start-trivia') return startTeamQuestion('trivia', el.dataset.id);
  if (action === 'start-emoji') return startTeamQuestion('emoji', el.dataset.id);
  if (action === 'team-answer-phase') return patchRound({ phase: 'team-answer' }, state.room.settings?.teamSeconds || 60);
  if (action === 'show-hint') return patchRound({ showHint: true });
  if (action === 'team-reveal') return patchRound({ phase: 'reveal', timerEndsAt: null });
  if (action === 'mark-team-correct') return addScore(el.dataset.team, 2, `${state.room.teams[el.dataset.team].name} correct`);
  if (action === 'award-team-bonus') return addScore(el.dataset.team, 1, `${state.room.teams[el.dataset.team].name} bonus`);
  if (action === 'start-superlative') return startSuperlative(el.dataset.id);
  if (action === 'submit-superlative-vote') return submitSuperlativeVote(el.dataset.player);
  if (action === 'superlative-vote-phase') return patchRound({ phase: 'vote' });
  if (action === 'superlative-reveal') return patchRound({ phase: 'reveal' });
  if (action === 'score-superlative') return scoreSuperlative();
  if (action === 'start-final') return startFinal();
  if (action === 'final-answer-phase') return patchRound({ phase: 'team-answer' });
  if (action === 'final-reveal') return patchRound({ phase: 'reveal' });
  if (action === 'score-final') return scoreFinal();
  if (action === 'clear-round-inputs') return clearRoundInputs();
  if (action === 'end-round') return endRound();
  if (action === 'add-score') return addScore(el.dataset.team, Number(el.dataset.delta || 0));
  if (action === 'zero-scores') return zeroScores();
}

async function handleSubmit(e) {
  const form = e.target.closest('form[data-form]');
  if (!form) return;
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const formName = form.dataset.form;

  if (formName === 'join-player') {
    const code = normalizeRoom(data.room || randomRoomCode());
    sessionStorage.setItem('hha_join_name', data.name || '');
    await ensureRoom(code);
    await subscribeToRoom(code);
    setRoute('player', code);
    render();
    return;
  }
  if (formName === 'unlock-host') {
    if (data.password === ADMIN_PASSWORD) {
      state.hostUnlocked = true;
      sessionStorage.setItem(HOST_UNLOCK_KEY, 'yes');
      await ensureRoom(state.roomCode);
      await subscribeToRoom(state.roomCode);
      toast('Host controls unlocked');
      render();
    } else toast('Wrong password');
    return;
  }
  if (formName === 'complete-player-join') {
    const player = {
      id: state.playerId,
      name: clean(data.name) || 'Player',
      avatar: data.avatar || AVATARS[0],
      team: data.team || 'team1',
      joinedAt: Date.now(),
      intro: {}
    };
    await store.setPath(state.roomCode, ['players', state.playerId], player);
    toast(`Welcome, ${player.name}`);
    render();
    return;
  }
  if (formName === 'save-intro') {
    await updatePlayer({ intro: { tenure: clean(data.tenure), show: clean(data.show), fact: clean(data.fact) } });
    closeModal();
    toast('Intro card saved');
    return;
  }
  if (formName === 'submit-team-answer') {
    const me = currentPlayer();
    const r = state.room.currentRound;
    if (!me || !r) return;
    await store.setPath(state.roomCode, ['teamAnswers', r.id, me.team], { team: me.team, answer: clean(data.answer), by: me.id, at: Date.now() });
    toast('Team answer submitted');
    return;
  }
  if (formName === 'submit-final-answer') {
    const me = currentPlayer();
    const r = state.room.currentRound;
    if (!me || !r) return;
    await store.setPath(state.roomCode, ['teamAnswers', r.id, me.team], { team: me.team, answer: data.answer, by: me.id, at: Date.now() });
    toast('Final guess submitted');
    return;
  }
}

async function handleChange(e) {
  const el = e.target;
  if (el.dataset.action === 'move-player') {
    await store.setPath(state.roomCode, ['players', el.dataset.player, 'team'], el.value);
  }
}

async function promptRoomThen(role) {
  const code = normalizeRoom(prompt('Room code?', state.roomCode || randomRoomCode()) || '');
  if (!code) return;
  await ensureRoom(code);
  await subscribeToRoom(code);
  setRoute(role, code);
  render();
}

async function leaveToHome() {
  if (unsubscribe) unsubscribe();
  state.role = '';
  state.room = null;
  localStorage.removeItem(ROLE_KEY);
  history.pushState({}, '', location.pathname);
  render();
}

async function updatePlayer(patch) {
  const me = currentPlayer();
  if (!me) return;
  await store.updatePath(state.roomCode, ['players', me.id], patch);
}

function currentPlayer() {
  return state.room?.players?.[state.playerId] || null;
}

async function saveTeamNames() {
  const updates = {};
  document.querySelectorAll('[data-team-name]').forEach(input => {
    const id = input.dataset.teamName;
    updates[id] = { ...state.room.teams[id], name: clean(input.value) || state.room.teams[id].name };
  });
  await store.setPath(state.roomCode, ['teams'], updates);
  toast('Team names saved');
}

async function startIntros() {
  const room = state.room;
  const prompt = document.getElementById('introPromptSelect')?.value || room.intro?.prompt || INTRO_PROMPTS[0];
  const seconds = Number(document.getElementById('introSecondsInput')?.value || 45);
  const order = shuffle(players(room).map(p => p.id));
  const currentRound = { id: makeId('intro'), game: 'intros', phase: 'spotlight', prompt, timerSeconds: seconds, timerEndsAt: null, startedAt: Date.now() };
  await store.updatePath(state.roomCode, [], { currentRound, phase: 'game' });
  await store.updatePath(state.roomCode, ['intro'], { order, index: 0, prompt, completed: {} });
  await store.updatePath(state.roomCode, ['settings'], { ...room.settings, introSeconds: seconds });
  state.activeHostTab = 'current';
  toast('Intros started');
}

async function moveIntro(delta, markComplete) {
  const room = state.room;
  const intro = room.intro || { order: [], index: 0, completed: {} };
  const currentId = intro.order?.[intro.index || 0];
  const completed = { ...(intro.completed || {}) };
  if (markComplete && currentId) completed[currentId] = true;
  const nextIndex = Math.max(0, Math.min((intro.order?.length || 1) - 1, (intro.index || 0) + delta));
  await store.updatePath(state.roomCode, ['intro'], { ...intro, completed, index: nextIndex });
  await patchRound({ timerEndsAt: null });
}

async function startTimer(seconds) {
  const timerSeconds = Number(seconds || 45);
  await patchRound({ timerSeconds, timerEndsAt: Date.now() + timerSeconds * 1000 });
  beep(660, 0.05);
}

async function startMajority(id) {
  const q = MAJORITY_QUESTIONS.find(x => x.id === id);
  if (!q) return;
  const seconds = state.room.settings?.questionSeconds || 45;
  const currentRound = { ...q, game: 'majority', phase: 'answer', startedAt: Date.now(), timerSeconds: seconds, timerEndsAt: Date.now() + seconds * 1000, scored: false };
  await store.updatePath(state.roomCode, [], { currentRound, phase: 'game' });
  state.activeHostTab = 'current';
  toast('Majority question started');
}

async function submitMajorityAnswer(value) {
  const me = currentPlayer();
  const r = state.room.currentRound;
  if (!me || !r || r.phase !== 'answer') return;
  await store.setPath(state.roomCode, ['answers', r.id, me.id], { answer: value, team: me.team, at: Date.now() });
  beep(540, 0.04);
}

async function submitMajorityPrediction(value) {
  const me = currentPlayer();
  const r = state.room.currentRound;
  if (!me || !r || r.phase !== 'predict') return;
  await store.setPath(state.roomCode, ['predictions', r.id, me.id], { prediction: value, team: me.team, at: Date.now() });
  beep(620, 0.04);
}

async function scoreMajority() {
  const room = state.room;
  const r = room.currentRound;
  if (!r || r.scored) return;
  const stats = computeMajorityStats(room, r);
  const patches = {};
  const maxCorrect = Math.max(0, ...Object.values(stats.correctByTeam));
  for (const team of Object.values(room.teams)) {
    let delta = stats.correctByTeam[team.id] || 0;
    if (delta > 0 && delta === maxCorrect) delta += 2;
    if (stats.margin <= 2 && delta > 0) delta += 1;
    patches[team.id] = { ...team, score: (team.score || 0) + delta };
  }
  await store.setPath(state.roomCode, ['teams'], patches);
  await patchRound({ scored: true });
  fireConfetti();
  toast('Majority scores applied');
}

async function startTeamQuestion(game, id) {
  const bank = game === 'emoji' ? EMOJI_QUESTIONS : TRIVIA_QUESTIONS;
  const q = bank.find(x => x.id === id);
  if (!q) return;
  const seconds = state.room.settings?.teamSeconds || 60;
  const currentRound = {
    id: q.id,
    game,
    phase: 'team-answer',
    prompt: game === 'emoji' ? 'Decode the emoji puzzle' : q.prompt,
    puzzle: q.puzzle || '',
    hint: q.hint || '',
    answer: q.answer,
    showHint: false,
    startedAt: Date.now(),
    timerSeconds: seconds,
    timerEndsAt: Date.now() + seconds * 1000,
    scored: false
  };
  await store.updatePath(state.roomCode, [], { currentRound, phase: 'game' });
  state.activeHostTab = 'current';
  toast(`${GAME_META[game].name} started`);
}

async function startSuperlative(id) {
  const q = SUPERLATIVE_PROMPTS.find(x => x.id === id);
  if (!q) return;
  const currentRound = { ...q, game: 'superlatives', phase: 'vote', startedAt: Date.now(), scored: false };
  await store.updatePath(state.roomCode, [], { currentRound, phase: 'game' });
  state.activeHostTab = 'current';
  toast('Superlative voting started');
}

async function submitSuperlativeVote(playerId) {
  const me = currentPlayer();
  const r = state.room.currentRound;
  if (!me || !r || r.phase !== 'vote') return;
  await store.setPath(state.roomCode, ['votes', r.id, me.id], { vote: playerId, team: me.team, at: Date.now() });
  beep(580, 0.04);
}

async function scoreSuperlative() {
  const room = state.room;
  const r = room.currentRound;
  if (!r || r.scored) return;
  const stats = computeVoteStats(room, r);
  if (!stats.winner) return;
  const teamUpdates = structuredCloneSafe(room.teams);
  teamUpdates[stats.winner.team].score = (teamUpdates[stats.winner.team].score || 0) + 2;
  Object.values(roundVotes(room, r.id)).forEach(v => {
    if (v.vote === stats.winner.id && teamUpdates[v.team]) teamUpdates[v.team].score = (teamUpdates[v.team].score || 0) + 1;
  });
  await store.setPath(state.roomCode, ['teams'], teamUpdates);
  await patchRound({ scored: true });
  fireConfetti();
  toast('Superlative scores applied');
}

async function startFinal() {
  const candidates = players(state.room).flatMap(p => {
    const items = [];
    if (p.intro?.fact) items.push({ p, fact: p.intro.fact });
    if (p.intro?.show) items.push({ p, fact: `My favorite show/movie/comfort rewatch is: ${p.intro.show}` });
    if (p.intro?.tenure) items.push({ p, fact: `I have been here for: ${p.intro.tenure}` });
    return items;
  });
  if (!candidates.length) return toast('No intro facts yet');
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  const currentRound = { id: makeId('final'), game: 'final', phase: 'team-answer', fact: pick.fact, answerPlayerId: pick.p.id, startedAt: Date.now(), scored: false };
  await store.updatePath(state.roomCode, [], { currentRound, phase: 'game' });
  state.activeHostTab = 'current';
  toast('Final bonus started');
}

async function scoreFinal() {
  const room = state.room;
  const r = room.currentRound;
  if (!r || r.scored) return;
  const teamUpdates = structuredCloneSafe(room.teams);
  Object.values(roundTeamAnswers(room, r.id)).forEach(ans => {
    if (ans.answer === r.answerPlayerId && teamUpdates[ans.team]) teamUpdates[ans.team].score = (teamUpdates[ans.team].score || 0) + 5;
  });
  await store.setPath(state.roomCode, ['teams'], teamUpdates);
  await patchRound({ scored: true });
  fireConfetti();
  toast('Final scores applied');
}

async function patchRound(patch, timerSeconds = null) {
  const r = state.room?.currentRound;
  if (!r) return;
  const next = { ...r, ...patch };
  if (timerSeconds) {
    next.timerSeconds = timerSeconds;
    next.timerEndsAt = Date.now() + timerSeconds * 1000;
  }
  await store.setPath(state.roomCode, ['currentRound'], next);
}

async function clearRoundInputs() {
  const r = state.room?.currentRound;
  if (!r) return;
  await store.removePath(state.roomCode, ['answers', r.id]);
  await store.removePath(state.roomCode, ['predictions', r.id]);
  await store.removePath(state.roomCode, ['teamAnswers', r.id]);
  await store.removePath(state.roomCode, ['votes', r.id]);
  toast('Round inputs cleared');
}

async function endRound() {
  await store.updatePath(state.roomCode, [], { currentRound: null, phase: 'lobby' });
  toast('Round ended');
}

async function addScore(teamId, delta, note = '') {
  const team = state.room.teams?.[teamId];
  if (!team) return;
  await store.setPath(state.roomCode, ['teams', teamId, 'score'], (team.score || 0) + Number(delta || 0));
  if (Number(delta) > 0) beep(760, 0.05);
  toast(note || `${team.name} ${delta >= 0 ? '+' : ''}${delta}`);
}

async function zeroScores() {
  const teams = structuredCloneSafe(state.room.teams);
  Object.values(teams).forEach(t => t.score = 0);
  await store.setPath(state.roomCode, ['teams'], teams);
  toast('Scores reset');
}

function computeMajorityStats(room, r) {
  const answers = roundAnswers(room, r.id);
  const predictions = roundPredictions(room, r.id);
  const answerCounts = Object.fromEntries((r.options || []).map(o => [o, 0]));
  Object.values(answers).forEach(a => { answerCounts[a.answer] = (answerCounts[a.answer] || 0) + 1; });
  const sorted = Object.entries(answerCounts).sort((a,b)=>b[1]-a[1]);
  const majority = sorted.length && sorted[0][1] !== sorted[1]?.[1] ? sorted[0][0] : 'Tie';
  const margin = sorted.length > 1 ? Math.abs(sorted[0][1] - sorted[1][1]) : sorted[0]?.[1] || 0;
  const correctByTeam = { team1: 0, team2: 0, team3: 0 };
  Object.values(predictions).forEach(p => {
    if (majority !== 'Tie' && p.prediction === majority) correctByTeam[p.team] = (correctByTeam[p.team] || 0) + 1;
  });
  return { answerCounts, majority, margin, correctByTeam };
}

function computeVoteStats(room, r) {
  const votes = roundVotes(room, r.id);
  const voteCounts = {};
  Object.values(votes).forEach(v => { voteCounts[v.vote] = (voteCounts[v.vote] || 0) + 1; });
  const sorted = Object.entries(voteCounts).sort((a,b)=>b[1]-a[1]);
  const winnerId = sorted.length && sorted[0][1] !== sorted[1]?.[1] ? sorted[0][0] : sorted[0]?.[0];
  return { voteCounts, winner: winnerId ? room.players?.[winnerId] : null };
}

function roundAnswers(room, id) { return room.answers?.[id] || {}; }
function roundPredictions(room, id) { return room.predictions?.[id] || {}; }
function roundTeamAnswers(room, id) { return room.teamAnswers?.[id] || {}; }
function roundVotes(room, id) { return room.votes?.[id] || {}; }
function players(room) { return Object.values(room?.players || {}).sort((a,b)=>(a.joinedAt||0)-(b.joinedAt||0)); }
function teamMembers(room, teamId) { return players(room).filter(p => p.team === teamId); }

function openTeamModal() {
  const room = state.room;
  openModal(`
    <h2>Change team</h2>
    <div class="grid three">
      ${Object.values(room.teams).map(team => `<button class="team-choice" data-action="select-team" data-team="${team.id}"><strong>${team.emoji} ${escapeHtml(team.name)}</strong><span>${teamMembers(room, team.id).length} players</span></button>`).join('')}
    </div>
  `);
}

function openModal(html) {
  closeModal();
  const tpl = document.getElementById('modalTemplate');
  const node = tpl.content.cloneNode(true);
  node.querySelector('.modal-content').innerHTML = html;
  document.body.appendChild(node);
  state.modalOpen = true;
}
function closeModal() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.remove());
  state.modalOpen = false;
}

function startTicker() {
  clearInterval(tickTimer);
  tickTimer = setInterval(() => {
    document.querySelectorAll('[data-timer]').forEach(el => {
      const end = Number(el.dataset.end);
      const total = Number(el.dataset.total || 1);
      const remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      el.style.setProperty('--pct', `${Math.max(0, Math.min(100, (remaining / total) * 100))}%`);
      const strong = el.querySelector('strong');
      if (strong) strong.textContent = remaining;
      if (remaining === 0) el.classList.add('done');
    });
  }, 350);
}

function fireConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.scale(dpr, dpr);
  const pieces = Array.from({ length: 160 }, () => ({
    x: Math.random() * innerWidth,
    y: -20 - Math.random() * innerHeight * .35,
    s: 5 + Math.random() * 9,
    r: Math.random() * Math.PI,
    vx: -2 + Math.random() * 4,
    vy: 4 + Math.random() * 7,
    color: ['#ff4d8d','#ffbf47','#57e2e5','#b8ff5c','#8b5cf6'][Math.floor(Math.random()*5)]
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0,0,innerWidth,innerHeight);
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.r += .08;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.s/2, -p.s/2, p.s, p.s * .55);
      ctx.restore();
    });
    frame++;
    if (frame < 170) requestAnimationFrame(draw); else ctx.clearRect(0,0,innerWidth,innerHeight);
  }
  draw();
  beep(880, .08);
  setTimeout(() => beep(660, .08), 90);
}

function beep(freq = 440, duration = .08) {
  if (!state.soundOn) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.value = .045;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => { osc.stop(); ctx.close(); }, duration * 1000);
  } catch {}
}

function toggleSound() {
  state.soundOn = !state.soundOn;
  localStorage.setItem(SOUND_KEY, state.soundOn ? 'yes' : 'no');
  updateSoundButton();
  if (state.soundOn) beep(660, .05);
}
function updateSoundButton() { document.querySelectorAll('[data-action="toggle-sound"]').forEach(b => b.textContent = `Sound: ${state.soundOn ? 'On' : 'Off'}`); }

function linkFor(role) {
  const url = new URL(location.href);
  url.search = '';
  url.searchParams.set('room', state.roomCode || '');
  url.searchParams.set('role', role);
  return url.toString();
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast('Copied'); }
  catch { prompt('Copy this link:', text); }
}
function toast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}
function confirmAction(message, fn) { if (confirm(message)) fn(); }

function randomRoomCode() { return ['FLAN','FUN','POD','TEAM','VIBE'][Math.floor(Math.random()*5)] + Math.floor(100 + Math.random()*900); }
function normalizeRoom(code) { return String(code || '').trim().replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 12); }
function makeId(prefix='id') { return `${prefix}_${Math.random().toString(36).slice(2,10)}${Date.now().toString(36).slice(-4)}`; }
function clean(v) { return String(v || '').trim().slice(0, 300); }
function titleCase(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function phaseLabel(phase) {
  return ({ answer: 'Answer', predict: 'Predict', reveal: 'Reveal', vote: 'Vote', 'team-answer': 'Answer', spotlight: 'Spotlight' })[phase] || 'Waiting';
}
function shuffle(arr) { return [...arr].sort(() => Math.random() - .5); }
function readJson(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } }
function setDeep(obj, path, value) {
  if (!path.length) return Object.assign(obj, value);
  let cur = obj;
  path.slice(0, -1).forEach(k => { if (!cur[k] || typeof cur[k] !== 'object') cur[k] = {}; cur = cur[k]; });
  cur[path[path.length - 1]] = value;
}
function getDeep(obj, path) { return path.reduce((acc, k) => acc?.[k], obj); }
function removeDeep(obj, path) {
  const parent = getDeep(obj, path.slice(0, -1));
  if (parent) delete parent[path[path.length - 1]];
}
function structuredCloneSafe(obj) { return JSON.parse(JSON.stringify(obj || {})); }
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]));
}
function escapeAttr(str) { return escapeHtml(str).replace(/`/g, '&#96;'); }
