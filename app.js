(() => {
  const HOST_PASSWORD = 'password123';
  const DATA_ROOT = 'happyHourLiteSingleEvent';
  const PLAYER_KEY = 'hha_lite_player_id';
  const HOST_KEY = 'hha_lite_host_unlocked';
  const SOUND_KEY = 'hha_lite_sound';

  const emojis = ['🎈','🎯','🍕','🦄','🚀','🌮','🐸','✨','🍩','🎧','🧃','🧠','🪩','🔥','🐙','🌟','🍿','🕺'];

  const banks = {
    majority: [
      { q: 'Coffee or tea?', options: ['Coffee', 'Tea'] },
      { q: 'Beach or mountains?', options: ['Beach', 'Mountains'] },
      { q: 'Early bird or night owl?', options: ['Early bird', 'Night owl'] },
      { q: 'Sweet or salty?', options: ['Sweet', 'Salty'] },
      { q: 'Texting or calling?', options: ['Texting', 'Calling'] },
      { q: 'Comedy or drama?', options: ['Comedy', 'Drama'] },
      { q: 'Cook at home or order in?', options: ['Cook at home', 'Order in'] },
      { q: 'Beach house or mountain cabin?', options: ['Beach house', 'Mountain cabin'] },
      { q: 'Give up email or Teams/Slack?', options: ['Email', 'Teams/Slack'] },
      { q: 'Every meeting 15 minutes or every meeting has snacks?', options: ['15 minutes', 'Snacks'] }
    ],
    trivia: [
      { q: 'What show is set in Scranton, Pennsylvania?', answer: 'The Office' },
      { q: 'What movie features the line “May the Force be with you”?', answer: 'Star Wars' },
      { q: 'What show has a coffee shop called Central Perk?', answer: 'Friends' },
      { q: 'What movie features a wizarding school called Hogwarts?', answer: 'Harry Potter' },
      { q: 'What movie is about a clownfish searching for his son?', answer: 'Finding Nemo' },
      { q: 'What show features the phrase “Winter is coming”?', answer: 'Game of Thrones' },
      { q: 'What movie features the song “Let It Go”?', answer: 'Frozen' },
      { q: 'What movie has a character named Jack Sparrow?', answer: 'Pirates of the Caribbean' }
    ],
    emoji: [
      { q: '🧙‍♂️💍🗻', answer: 'Lord of the Rings' },
      { q: '🐠🔎🌊', answer: 'Finding Nemo' },
      { q: '🚢🧊💔', answer: 'Titanic' },
      { q: '🦁👑', answer: 'The Lion King' },
      { q: '🕷️👨🏙️', answer: 'Spider-Man' },
      { q: '🦖🏝️', answer: 'Jurassic Park' },
      { q: '👨‍💼📄🏢', answer: 'The Office' },
      { q: '🧪👨‍🔬💰', answer: 'Breaking Bad' },
      { q: '📅😵‍💫📞', answer: 'Too many meetings' },
      { q: '🔥🧯', answer: 'Putting out fires' }
    ],
    superlatives: [
      'Who is most likely to win trivia night?',
      'Who is most likely to have the best snacks?',
      'Who is most likely to recommend a great show?',
      'Who is most likely to survive a zombie apocalypse?',
      'Who is most likely to send the perfect GIF?',
      'Who is most likely to have the best vacation tips?',
      'Who is most likely to become a food critic?',
      'Who is most likely to have 47 browser tabs open?'
    ],
    final: [
      { q: 'Final bonus: Name the movie/show from this emoji: 🧑‍🍳🐀🍝', answer: 'Ratatouille' },
      { q: 'Final bonus: What show has the line “We were on a break”?', answer: 'Friends' },
      { q: 'Final bonus: Name one person on your team who had the funniest answer today.', answer: 'Host choice' }
    ]
  };

  function defaultState(){
    return {
      teams: {
        red: { name: 'Team Salsa', score: 0, color: 'pink' },
        blue: { name: 'Team Spark', score: 0, color: 'blue' },
        green: { name: 'Team Guac', score: 0, color: 'green' }
      },
      players: {},
      game: { type: 'lobby', phase: 'idle', index: 0, locked: false, revealed: false },
      majority: { answers: {}, predictions: {}, scoredKey: '' },
      teamAnswers: {},
      votes: {},
      custom: { question: '', answer: '' },
      updatedAt: Date.now()
    };
  }

  const $ = (sel) => document.querySelector(sel);
  const app = $('#app');
  const toastEl = $('#toast');
  let state = defaultState();
  let store = null;
  let playerId = localStorage.getItem(PLAYER_KEY) || makeId();
  localStorage.setItem(PLAYER_KEY, playerId);
  let hostUnlocked = localStorage.getItem(HOST_KEY) === '1';
  let soundOn = localStorage.getItem(SOUND_KEY) === '1';
  let adminHidden = false;

  async function init(){
    store = createStore();
    await store.init();
    store.subscribe((next) => {
      state = normalizeState(next);
      render();
    });
    bindChrome();
    render();
  }

  function createStore(){
    const cfg = window.HHA_FIREBASE_CONFIG;
    const hasFirebase = cfg && cfg.databaseURL && window.firebase && window.firebase.database;
    if (hasFirebase) return new FirebaseStore(cfg);
    return new LocalStore();
  }

  class FirebaseStore {
    constructor(config){
      this.app = window.firebase.apps.length ? window.firebase.app() : window.firebase.initializeApp(config);
      this.db = window.firebase.database();
      this.root = this.db.ref(DATA_ROOT);
      $('#modeLabel').textContent = 'Live mode';
    }
    async init(){
      const snap = await this.root.get();
      if (!snap.exists()) await this.root.set(defaultState());
    }
    subscribe(cb){ this.root.on('value', (snap) => cb(snap.val() || defaultState())); }
    update(path, value){ return this.root.child(path).set(value); }
    updateMany(updates){ updates.updatedAt = Date.now(); return this.root.update(updates); }
    reset(){ return this.root.set(defaultState()); }
  }

  class LocalStore {
    constructor(){
      this.key = DATA_ROOT;
      $('#modeLabel').textContent = 'Local demo mode';
      window.addEventListener('storage', (e) => {
        if (e.key === this.key && this.cb) this.cb(this.read());
      });
    }
    async init(){ if (!localStorage.getItem(this.key)) this.write(defaultState()); }
    subscribe(cb){ this.cb = cb; cb(this.read()); }
    update(path, value){
      const s = this.read();
      setByPath(s, path.split('/'), value);
      s.updatedAt = Date.now();
      this.write(s);
      if (this.cb) this.cb(s);
    }
    updateMany(updates){
      const s = this.read();
      Object.entries(updates).forEach(([path, value]) => setByPath(s, path.split('/'), value));
      s.updatedAt = Date.now();
      this.write(s);
      if (this.cb) this.cb(s);
    }
    reset(){ const s = defaultState(); this.write(s); if (this.cb) this.cb(s); }
    read(){ try { return JSON.parse(localStorage.getItem(this.key)) || defaultState(); } catch { return defaultState(); } }
    write(s){ localStorage.setItem(this.key, JSON.stringify(s)); }
  }

  function normalizeState(s){
    const d = defaultState();
    return {
      ...d,
      ...s,
      teams: { ...d.teams, ...(s.teams || {}) },
      players: s.players || {},
      game: { ...d.game, ...(s.game || {}) },
      majority: { ...d.majority, ...(s.majority || {}) },
      teamAnswers: s.teamAnswers || {},
      votes: s.votes || {},
      custom: { ...d.custom, ...(s.custom || {}) }
    };
  }

  function bindChrome(){
    $('#hostBtn').addEventListener('click', () => {
      if (hostUnlocked) { adminHidden = !adminHidden; document.body.classList.toggle('hide-admin', adminHidden); $('#showAdminBtn').classList.toggle('hidden', !adminHidden); return; }
      $('#hostModal').classList.remove('hidden');
      $('#hostPassword').focus();
    });
    $('#showAdminBtn').addEventListener('click', () => { adminHidden = false; document.body.classList.remove('hide-admin'); $('#showAdminBtn').classList.add('hidden'); });
    $('#cancelHostBtn').addEventListener('click', () => $('#hostModal').classList.add('hidden'));
    $('#unlockHostBtn').addEventListener('click', unlockHost);
    $('#hostPassword').addEventListener('keydown', (e) => { if (e.key === 'Enter') unlockHost(); });
    $('#copyLinkBtn').addEventListener('click', async () => { await navigator.clipboard.writeText(location.href.split('#')[0]); toast('Link copied'); });
    $('#soundBtn').addEventListener('click', () => { soundOn = !soundOn; localStorage.setItem(SOUND_KEY, soundOn ? '1' : '0'); $('#soundBtn').textContent = `Sound: ${soundOn ? 'On' : 'Off'}`; beep(); });
    $('#soundBtn').textContent = `Sound: ${soundOn ? 'On' : 'Off'}`;
  }

  function unlockHost(){
    if ($('#hostPassword').value === HOST_PASSWORD) {
      hostUnlocked = true;
      localStorage.setItem(HOST_KEY, '1');
      $('#hostModal').classList.add('hidden');
      $('#hostBtn').textContent = 'Hide Host';
      render();
    } else toast('Wrong password');
  }

  function render(){
    $('#hostBtn').textContent = hostUnlocked ? (adminHidden ? 'Show Host' : 'Hide Host') : 'Host';
    const me = state.players[playerId];
    if (!me) return renderName();
    if (!me.team) return renderTeamSelect(me);
    renderGame(me);
    if (hostUnlocked) renderHostPanel();
  }

  function renderName(){
    app.innerHTML = `
      <section class="hero card">
        <div style="font-size:54px">🎊</div>
        <h2>Ready to play?</h2>
        <p>Enter your name. Then pick a team. That’s it.</p>
        <div class="row" style="margin-top:22px">
          <input class="big-input" id="nameInput" maxlength="28" placeholder="Your name" />
          <button class="primary-btn" id="nameNext">Next</button>
        </div>
      </section>`;
    $('#nameNext').addEventListener('click', saveName);
    $('#nameInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') saveName(); });
  }

  function saveName(){
    const name = $('#nameInput').value.trim();
    if (!name) return toast('Add your name first');
    const emoji = emojis[Math.floor(Math.random()*emojis.length)];
    store.update(`players/${playerId}`, { id: playerId, name, emoji, team: '', joinedAt: Date.now() });
  }

  function renderTeamSelect(me){
    const counts = teamCounts();
    app.innerHTML = `
      <section class="card">
        <div class="game-title"><div><h2>Pick your team</h2><p class="muted">Hi ${esc(me.name)} — choose one team and you’re in.</p></div></div>
        <div class="grid teams">
          ${Object.entries(state.teams).map(([id,t]) => `
            <button class="team-btn" data-team="${id}">
              <strong>${esc(t.name)}</strong>
              <span>${counts[id] || 0} players</span>
            </button>`).join('')}
        </div>
      </section>`;
    app.querySelectorAll('[data-team]').forEach(btn => btn.addEventListener('click', () => store.update(`players/${playerId}/team`, btn.dataset.team)));
  }

  function renderGame(me){
    app.innerHTML = `
      ${scoreboardHtml()}
      ${gameHtml(me)}
      ${hostUnlocked ? '<div id="hostMount"></div>' : ''}`;
    bindGameEvents(me);
  }

  function scoreboardHtml(){
    const counts = teamCounts();
    return `<section class="grid scoreboard">
      ${Object.entries(state.teams).map(([id,t]) => `
        <div class="card team-card">
          <h3>${esc(t.name)}</h3>
          <div class="score">${t.score || 0}</div>
          <div class="muted">${counts[id] || 0} players</div>
          <div class="player-list">${teamPlayers(id).map(p => `<span class="chip ${p.id===playerId?'me':''}">${p.emoji || '🎈'} ${esc(p.name)}</span>`).join('') || '<span class="muted">No one yet</span>'}</div>
        </div>`).join('')}
    </section>`;
  }

  function gameHtml(me){
    switch(state.game.type){
      case 'majority': return majorityHtml(me);
      case 'trivia': return teamAnswerHtml('Team Trivia', currentItem('trivia'), me, 2);
      case 'emoji': return teamAnswerHtml('Guess the Emoji', currentItem('emoji'), me, 2, true);
      case 'superlatives': return superlativesHtml(me);
      case 'final': return teamAnswerHtml('Final Bonus', currentItem('final'), me, 5);
      default: return lobbyHtml(me);
    }
  }

  function lobbyHtml(me){
    return `<section class="card hero" style="margin-top:18px">
      <div style="font-size:58px">${me.emoji || '🎉'}</div>
      <h2>You’re in.</h2>
      <p>You’re on <strong>${esc(state.teams[me.team]?.name || 'a team')}</strong>. Wait for the host to start the first game.</p>
      <button class="secondary-btn" id="changeTeam">Change team</button>
    </section>`;
  }

  function majorityHtml(me){
    const item = currentItem('majority');
    const phase = state.game.phase;
    const answers = state.majority.answers || {};
    const predictions = state.majority.predictions || {};
    const answered = answers[playerId];
    const predicted = predictions[playerId];
    if (phase === 'predict') {
      return `<section class="card">
        <div class="game-title"><h2>Majority Rules</h2><span class="pill">Step 2 of 2</span></div>
        <p class="muted" style="text-align:center">Now guess what most people picked.</p>
        <div class="question">${esc(item.q)}</div>
        ${predicted ? `<div class="submitted">Prediction locked: ${esc(predicted)}</div>` : optionButtons(item.options, 'prediction')}
      </section>`;
    }
    if (phase === 'reveal') {
      return `<section class="card">
        <div class="game-title"><h2>Majority Rules</h2><span class="pill green">Results</span></div>
        <div class="question">${esc(item.q)}</div>
        ${majorityResultsHtml(item)}
      </section>`;
    }
    return `<section class="card">
      <div class="game-title"><h2>Majority Rules</h2><span class="pill">Step 1 of 2</span></div>
      <p class="muted" style="text-align:center">Answer honestly first. The results stay hidden.</p>
      <div class="question">${esc(item.q)}</div>
      ${answered ? `<div class="submitted">Answer locked: ${esc(answered)}</div>` : optionButtons(item.options, 'answer')}
    </section>`;
  }

  function optionButtons(options, kind){
    return `<div class="options">${options.map(o => `<button class="option" data-${kind}="${escAttr(o)}">${esc(o)}</button>`).join('')}</div>`;
  }

  function majorityResultsHtml(item){
    const counts = Object.fromEntries(item.options.map(o => [o, 0]));
    Object.values(state.majority.answers || {}).forEach(v => { if (counts[v] !== undefined) counts[v]++; });
    const max = Math.max(1, ...Object.values(counts));
    const majority = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0] || item.options[0];
    const teamCorrect = { red:0, blue:0, green:0 };
    Object.entries(state.majority.predictions || {}).forEach(([pid,pred]) => {
      const p = state.players[pid];
      if (p?.team && pred === majority) teamCorrect[p.team] = (teamCorrect[p.team] || 0) + 1;
    });
    return `
      <div class="winner">Majority picked: ${esc(majority)}</div>
      <div style="margin:18px 0">${Object.entries(counts).map(([opt,count]) => `
        <div class="result-row"><strong>${esc(opt)}</strong><div class="bar"><div class="bar-fill" style="width:${Math.round((count/max)*100)}%"></div></div><strong>${count}</strong></div>`).join('')}</div>
      <div class="grid teams">
        ${Object.entries(state.teams).map(([id,t]) => `<div class="team-answer"><strong>${esc(t.name)}</strong><br><span class="muted">${teamCorrect[id] || 0} correct predictions</span></div>`).join('')}
      </div>`;
  }

  function teamAnswerHtml(title, item, me, points, emojiMode=false){
    const phase = state.game.phase;
    const teamId = me.team;
    const submitted = state.teamAnswers?.[teamId]?.text || '';
    const revealed = phase === 'reveal';
    return `<section class="card">
      <div class="game-title"><h2>${esc(title)}</h2><span class="pill">${points} pts</span></div>
      <div class="question ${emojiMode ? 'emoji-question' : ''}">${esc(item.q)}</div>
      ${!revealed ? `
        <p class="muted" style="text-align:center">Discuss with your team. One answer per team.</p>
        <div class="row">
          <input class="answer-input" id="teamAnswerInput" placeholder="Type your team's answer" value="${escAttr(submitted)}" />
          <button class="primary-btn" id="submitTeamAnswer">Submit</button>
        </div>
        ${submitted ? `<div class="submitted" style="margin-top:16px">${esc(state.teams[teamId]?.name)} submitted: ${esc(submitted)}</div>` : ''}
      ` : `
        <div class="winner">Correct answer: ${esc(item.answer)}</div>
        <div style="margin-top:16px">${Object.entries(state.teams).map(([id,t]) => `<div class="team-answer"><strong>${esc(t.name)}</strong>: ${esc(state.teamAnswers?.[id]?.text || 'No answer')}</div>`).join('')}</div>
      `}
    </section>`;
  }

  function superlativesHtml(me){
    const prompt = currentItem('superlatives');
    const phase = state.game.phase;
    const myVote = state.votes?.[playerId];
    if (phase === 'reveal') {
      const counts = {};
      Object.values(state.votes || {}).forEach(pid => counts[pid] = (counts[pid] || 0) + 1);
      const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
      const winnerId = sorted[0]?.[0];
      const winner = state.players[winnerId];
      return `<section class="card">
        <div class="game-title"><h2>Team Superlatives</h2><span class="pill green">Results</span></div>
        <div class="question">${esc(prompt)}</div>
        <div class="winner">${winner ? `${winner.emoji || '🎉'} ${esc(winner.name)}` : 'No votes yet'}</div>
        <div style="margin-top:16px">${sorted.map(([pid,count]) => `<div class="team-answer"><strong>${esc(state.players[pid]?.name || 'Unknown')}</strong> — ${count} votes</div>`).join('') || '<p class="muted">No votes submitted.</p>'}</div>
      </section>`;
    }
    const players = Object.values(state.players).filter(p => p.team);
    return `<section class="card">
      <div class="game-title"><h2>Team Superlatives</h2><span class="pill">Vote</span></div>
      <div class="question">${esc(prompt)}</div>
      ${myVote ? `<div class="submitted">Vote locked: ${esc(state.players[myVote]?.name || 'Someone')}</div>` : `
        <div class="grid teams">${players.map(p => `<button class="team-btn" data-vote="${p.id}"><strong>${p.emoji || '🎉'} ${esc(p.name)}</strong><span>${esc(state.teams[p.team]?.name || '')}</span></button>`).join('')}</div>`}
    </section>`;
  }

  function bindGameEvents(me){
    $('#changeTeam')?.addEventListener('click', () => store.update(`players/${playerId}/team`, ''));
    app.querySelectorAll('[data-answer]').forEach(btn => btn.addEventListener('click', () => store.update(`majority/answers/${playerId}`, btn.dataset.answer)));
    app.querySelectorAll('[data-prediction]').forEach(btn => btn.addEventListener('click', () => store.update(`majority/predictions/${playerId}`, btn.dataset.prediction)));
    $('#submitTeamAnswer')?.addEventListener('click', () => {
      const text = $('#teamAnswerInput').value.trim();
      if (!text) return toast('Type an answer first');
      store.update(`teamAnswers/${me.team}`, { text, by: playerId, at: Date.now() });
      toast('Team answer submitted'); beep();
    });
    $('#teamAnswerInput')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#submitTeamAnswer')?.click(); });
    app.querySelectorAll('[data-vote]').forEach(btn => btn.addEventListener('click', () => store.update(`votes/${playerId}`, btn.dataset.vote)));
  }

  function renderHostPanel(){
    const current = state.game.type;
    const phase = state.game.phase;
    const html = `
      <section class="host-panel" id="hostPanel">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center"><h3>Host</h3><button class="tiny-link" id="compactHost">${document.body.classList.contains('host-compact') ? 'Expand' : 'Collapse'}</button></div>
        <div class="host-grid">
          <div class="host-section">
            <h4>Start a game</h4>
            <div class="row">
              ${hostGameBtn('majority','Majority')}
              ${hostGameBtn('trivia','Trivia')}
              ${hostGameBtn('emoji','Emoji')}
              ${hostGameBtn('superlatives','Superlatives')}
              ${hostGameBtn('final','Final')}
              <button class="secondary-btn" data-host="lobby">Lobby</button>
            </div>
            <p class="muted small">No rooms. Everyone on this link plays together.</p>
          </div>
          <div class="host-section">
            <h4>Round controls</h4>
            ${roundControls(current, phase)}
          </div>
          <div class="host-section">
            <h4>Scores</h4>
            ${Object.entries(state.teams).map(([id,t]) => `
              <div class="row" style="justify-content:space-between;margin-bottom:8px">
                <strong>${esc(t.name)}: ${t.score || 0}</strong>
                <span><button class="pill" data-score="${id}:-1">−</button> <button class="pill green" data-score="${id}:1">+</button></span>
              </div>`).join('')}
            <div class="row" style="justify-content:flex-start;margin-top:10px"><button class="danger-btn" id="resetBtn">Reset event</button><button class="secondary-btn" id="confettiBtn">Confetti</button></div>
          </div>
        </div>
      </section>`;
    $('#hostMount').innerHTML = html;
    bindHostEvents();
  }

  function hostGameBtn(type,label){ return `<button class="${state.game.type===type?'primary-btn':'secondary-btn'}" data-host="${type}">${label}</button>`; }

  function roundControls(type, phase){
    if (type === 'majority') {
      const item = currentItem('majority');
      const aCount = Object.keys(state.majority.answers || {}).length;
      const pCount = Object.keys(state.majority.predictions || {}).length;
      return `<p class="muted small">Q${state.game.index+1}: ${esc(item.q)}</p>
        <div class="row" style="justify-content:flex-start">
          <button class="primary-btn" data-step="majority-answer">Answer phase</button>
          <button class="secondary-btn" data-step="majority-predict">Predict phase (${aCount})</button>
          <button class="secondary-btn" data-step="majority-reveal">Reveal + score (${pCount})</button>
          <button class="secondary-btn" data-step="next">Next Q</button>
        </div>`;
    }
    if (['trivia','emoji','final'].includes(type)) {
      const item = currentItem(type);
      return `<p class="muted small">${esc(item.q)}<br>Answer: <strong>${esc(item.answer)}</strong></p>
        <div class="row" style="justify-content:flex-start">
          <button class="primary-btn" data-step="answers">Answer phase</button>
          <button class="secondary-btn" data-step="reveal">Reveal</button>
          <button class="secondary-btn" data-step="next">Next Q</button>
        </div>
        ${phase === 'reveal' ? `<div style="margin-top:10px">${Object.entries(state.teams).map(([id,t]) => `<div class="row" style="justify-content:space-between;margin-bottom:6px"><span>${esc(t.name)}</span><button class="pill green" data-award="${id}:${type==='final'?5:2}">Award ${type==='final'?5:2}</button></div>`).join('')}</div>` : ''}`;
    }
    if (type === 'superlatives') {
      return `<p class="muted small">${esc(currentItem('superlatives'))}</p>
        <div class="row" style="justify-content:flex-start"><button class="primary-btn" data-step="vote">Vote phase</button><button class="secondary-btn" data-step="super-reveal">Reveal + score</button><button class="secondary-btn" data-step="next">Next prompt</button></div>`;
    }
    return `<p class="muted small">Start a game when intros are done.</p>`;
  }

  function bindHostEvents(){
    $('#compactHost')?.addEventListener('click', () => { document.body.classList.toggle('host-compact'); render(); });
    document.querySelectorAll('[data-host]').forEach(btn => btn.addEventListener('click', () => startGame(btn.dataset.host)));
    document.querySelectorAll('[data-score]').forEach(btn => btn.addEventListener('click', () => {
      const [team, delta] = btn.dataset.score.split(':'); addScore(team, Number(delta));
    }));
    document.querySelectorAll('[data-award]').forEach(btn => btn.addEventListener('click', () => {
      const [team, delta] = btn.dataset.award.split(':'); addScore(team, Number(delta)); toast(`Awarded ${delta} points`); beep();
    }));
    document.querySelectorAll('[data-step]').forEach(btn => btn.addEventListener('click', () => hostStep(btn.dataset.step)));
    $('#resetBtn')?.addEventListener('click', () => { if (confirm('Reset the whole event? This clears players, answers, and scores.')) store.reset(); });
    $('#confettiBtn')?.addEventListener('click', confetti);
  }

  function startGame(type){
    if (type === 'lobby') return store.updateMany({ 'game/type': 'lobby', 'game/phase':'idle' });
    const updates = { 'game/type': type, 'game/phase': type === 'superlatives' ? 'vote' : 'answer', 'game/index': 0, teamAnswers: {}, votes: {} };
    if (type === 'majority') { updates['majority/answers'] = {}; updates['majority/predictions'] = {}; updates['majority/scoredKey'] = ''; }
    if (['trivia','emoji','final'].includes(type)) updates.teamAnswers = {};
    store.updateMany(updates);
    beep();
  }

  function hostStep(step){
    if (step === 'majority-answer') return store.updateMany({ 'game/phase':'answer', 'majority/answers': {}, 'majority/predictions': {}, 'majority/scoredKey': '' });
    if (step === 'majority-predict') return store.updateMany({ 'game/phase':'predict', 'majority/predictions': {}, 'majority/scoredKey': '' });
    if (step === 'majority-reveal') return revealMajority();
    if (step === 'answers') return store.updateMany({ 'game/phase':'answer', teamAnswers: {} });
    if (step === 'reveal') return store.updateMany({ 'game/phase':'reveal' });
    if (step === 'vote') return store.updateMany({ 'game/phase':'vote', votes: {} });
    if (step === 'super-reveal') return revealSuperlative();
    if (step === 'next') return nextQuestion();
  }

  function revealMajority(){
    const item = currentItem('majority');
    const counts = Object.fromEntries(item.options.map(o => [o, 0]));
    Object.values(state.majority.answers || {}).forEach(v => { if (counts[v] !== undefined) counts[v]++; });
    const majority = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0] || item.options[0];
    const roundKey = `majority-${state.game.index}`;
    const updates = { 'game/phase':'reveal', 'majority/scoredKey': roundKey };
    if (state.majority.scoredKey !== roundKey) {
      Object.entries(state.majority.predictions || {}).forEach(([pid,pred]) => {
        const p = state.players[pid];
        if (p?.team && pred === majority) {
          const cur = state.teams[p.team]?.score || 0;
          updates[`teams/${p.team}/score`] = (updates[`teams/${p.team}/score`] ?? cur) + 1;
        }
      });
    }
    store.updateMany(updates);
    confetti(); beep();
  }

  function revealSuperlative(){
    const counts = {};
    Object.values(state.votes || {}).forEach(pid => counts[pid] = (counts[pid] || 0) + 1);
    const winnerId = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0];
    const winner = state.players[winnerId];
    const updates = { 'game/phase':'reveal' };
    if (winner?.team) updates[`teams/${winner.team}/score`] = (state.teams[winner.team]?.score || 0) + 2;
    store.updateMany(updates);
    confetti(); beep();
  }

  function nextQuestion(){
    const type = state.game.type;
    const max = bankLength(type);
    const next = (state.game.index + 1) % max;
    const updates = { 'game/index': next, 'game/phase': type === 'superlatives' ? 'vote' : 'answer' };
    if (type === 'majority') { updates['majority/answers'] = {}; updates['majority/predictions'] = {}; updates['majority/scoredKey'] = ''; }
    if (['trivia','emoji','final'].includes(type)) updates.teamAnswers = {};
    if (type === 'superlatives') updates.votes = {};
    store.updateMany(updates);
  }

  function addScore(team, delta){
    store.update(`teams/${team}/score`, Math.max(0, (state.teams[team]?.score || 0) + delta));
  }

  function currentItem(type){
    const bank = banks[type];
    const idx = Math.max(0, Math.min(state.game.index || 0, bank.length - 1));
    return bank[idx];
  }
  function bankLength(type){ return banks[type]?.length || 1; }
  function teamCounts(){
    const counts = { red:0, blue:0, green:0 };
    Object.values(state.players || {}).forEach(p => { if (p.team) counts[p.team] = (counts[p.team] || 0) + 1; });
    return counts;
  }
  function teamPlayers(team){ return Object.values(state.players || {}).filter(p => p.team === team).sort((a,b)=>(a.joinedAt||0)-(b.joinedAt||0)); }

  function setByPath(obj, parts, value){
    let cur = obj;
    for (let i=0; i<parts.length-1; i++) {
      if (parts[i] === '') continue;
      if (!cur[parts[i]] || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length-1]] = value;
  }
  function makeId(){ return 'p_' + Math.random().toString(36).slice(2) + Date.now().toString(36); }
  function esc(s){ return String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function escAttr(s){ return esc(s).replace(/`/g,'&#96;'); }
  function toast(msg){
    toastEl.textContent = msg;
    toastEl.classList.remove('hidden');
    setTimeout(() => toastEl.classList.add('hidden'), 1800);
  }
  function beep(){
    if (!soundOn) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 620; gain.gain.value = 0.06; osc.start();
      setTimeout(() => { osc.stop(); ctx.close(); }, 90);
    } catch {}
  }
  function confetti(){
    const c = $('#confetti');
    c.innerHTML = '';
    for (let i=0;i<90;i++) {
      const piece = document.createElement('i');
      piece.style.left = Math.random()*100 + 'vw';
      piece.style.background = ['#ffcf4a','#ff5fb7','#75c7ff','#55e6a5','#ffffff'][Math.floor(Math.random()*5)];
      piece.style.animationDelay = Math.random()*0.35 + 's';
      piece.style.transform = `rotate(${Math.random()*180}deg)`;
      c.appendChild(piece);
    }
    setTimeout(() => c.innerHTML = '', 2200);
  }

  init().catch((err) => {
    console.error(err);
    if (app) {
      app.innerHTML = `<section class="card hero"><div style="font-size:54px">⚠️</div><h2>Couldn’t start the game</h2><p class="muted">Refresh the page. If this keeps happening, check the browser console for the error.</p></section>`;
    }
  });
})();
