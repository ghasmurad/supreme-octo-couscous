(() => {
  "use strict";

  const $app = document.getElementById("app");
  const CONFIG = window.HHA_CONFIG || {};
  const EVENT_ID = sanitizeEventId(CONFIG.eventId || "happy-hour-main");
  const STORAGE_KEY = `hha_player_${EVENT_ID}`;
  const HOST_KEY = `hha_host_${EVENT_ID}`;
  const TEAM_IDS = ["A", "B", "C"];
  const AVATARS = ["✨", "🚀", "🎯", "⚡", "🌟", "🧠", "🎬", "☕", "🍕", "🧩", "🏆", "😎"];

  const QUESTIONS = {
    majority: [
      { q: "Coffee or tea?", options: ["Coffee", "Tea"] },
      { q: "Beach or mountains?", options: ["Beach", "Mountains"] },
      { q: "Early bird or night owl?", options: ["Early bird", "Night owl"] },
      { q: "Sweet or salty?", options: ["Sweet", "Salty"] },
      { q: "Texting or calling?", options: ["Texting", "Calling"] },
      { q: "Comedy or drama?", options: ["Comedy", "Drama"] },
      { q: "Work from a beach house or a mountain cabin?", options: ["Beach house", "Mountain cabin"] },
      { q: "Give up email or give up Teams?", options: ["Email", "Teams"] }
    ],
    trivia: [
      { q: "What TV show is set in Scranton, Pennsylvania?", a: "The Office" },
      { q: "What show has a coffee shop called Central Perk?", a: "Friends" },
      { q: "What movie features the line “I’ll be back”?", a: "The Terminator" },
      { q: "What movie features the song “Let It Go”?", a: "Frozen" },
      { q: "What show features the phrase “Winter is coming”?", a: "Game of Thrones" },
      { q: "What movie has a wizarding school called Hogwarts?", a: "Harry Potter" }
    ],
    emoji: [
      { q: "🧙‍♂️💍🗻", a: "Lord of the Rings" },
      { q: "🐠🔎🌊", a: "Finding Nemo" },
      { q: "🚢🧊💔", a: "Titanic" },
      { q: "🦁👑", a: "The Lion King" },
      { q: "🦖🏝️", a: "Jurassic Park" },
      { q: "👨‍💼📄🏢", a: "The Office" },
      { q: "🧪👨‍🔬💰", a: "Breaking Bad" },
      { q: "📅😵‍💫📞", a: "Too many meetings" },
      { q: "🔥🧯", a: "Putting out fires" }
    ],
    superlatives: [
      { q: "Who is most likely to win trivia night?" },
      { q: "Who is most likely to have the best snacks?" },
      { q: "Who is most likely to recommend a great show?" },
      { q: "Who is most likely to survive a zombie apocalypse?" },
      { q: "Who is most likely to send the perfect GIF?" },
      { q: "Who is most likely to become a food critic?" }
    ],
    final: [
      { q: "Final bonus: which team can guess the host’s favorite show/movie?", a: "Host decides" },
      { q: "Final bonus: name one thing someone shared during intros.", a: "Host decides" },
      { q: "Final bonus: what was the closest Majority Rules question tonight?", a: "Host decides" }
    ]
  };

  const GAME_LABELS = {
    idle: "Ready",
    intros: "Fun Intros",
    majority: "Majority Rules",
    trivia: "Team Trivia",
    emoji: "Guess the Emoji",
    superlatives: "Superlatives",
    final: "Final Bonus"
  };

  let db = null;
  let rootRef = null;
  let state = null;
  let players = {};
  let answers = {};
  let teamAnswers = {};
  let currentPlayerId = localStorage.getItem(STORAGE_KEY) || null;
  let hostUnlocked = localStorage.getItem(HOST_KEY) === "true";
  let modal = null;
  let toastTimer = null;
  let renderTimer = null;
  let renderQueued = false;
  let renderPending = false;
  let connected = false;
  const inFlight = new Set();

  document.addEventListener("DOMContentLoaded", boot);

  async function boot() {
    try {
      if (!isConfigReady(CONFIG.firebase)) {
        renderSetupMissing();
        return;
      }
      if (!window.firebase || !window.firebase.database) {
        renderFatal("Firebase scripts did not load. Check your internet connection or CDN access.");
        return;
      }
      window.firebase.initializeApp(CONFIG.firebase);
      db = window.firebase.database();
      rootRef = db.ref(`events/${EVENT_ID}`);
      await ensureEventState();
      attachRealtimeListeners();
      attachEventHandlers();
      attachEditProtection();
      renderTimer = window.setInterval(() => scheduleRender(), 1000);
    } catch (err) {
      console.error(err);
      renderFatal(err.message || "The app could not start.");
    }
  }

  function isConfigReady(firebaseConfig) {
    if (!firebaseConfig) return false;
    const required = ["apiKey", "authDomain", "databaseURL", "projectId", "appId"];
    return required.every((key) => firebaseConfig[key] && !String(firebaseConfig[key]).includes("PASTE_"));
  }

  async function ensureEventState() {
    const snap = await rootRef.child("state").once("value");
    if (!snap.exists()) {
      await rootRef.child("state").set(defaultState());
    }
  }

  function attachRealtimeListeners() {
    rootRef.child("state").on("value", (snap) => { state = snap.val() || defaultState(); scheduleRender(); });
    rootRef.child("players").on("value", (snap) => { players = snap.val() || {}; scheduleRender(); });
    rootRef.child("answers").on("value", (snap) => { answers = snap.val() || {}; scheduleRender(); });
    rootRef.child("teamAnswers").on("value", (snap) => { teamAnswers = snap.val() || {}; scheduleRender(); });
    db.ref(".info/connected").on("value", (snap) => { connected = snap.val() === true; scheduleRender(); });
  }

  function attachEventHandlers() {
    document.addEventListener("submit", async (event) => {
      const form = event.target.closest("form[data-action]");
      if (!form) return;
      event.preventDefault();
      await handleAction(form.dataset.action, form);
    });

    document.addEventListener("click", async (event) => {
      const el = event.target.closest("[data-action]");
      if (!el || el.tagName === "FORM") return;
      event.preventDefault();
      await handleAction(el.dataset.action, el);
    });
  }

  async function handleAction(action, el) {
    try {
      switch (action) {
        case "saveProfile": return saveProfile(el);
        case "selectTeam": return selectTeam(el.dataset.team);
        case "openHost": modal = "host"; return render(true);
        case "closeModal": modal = null; return render(true);
        case "unlockHost": return unlockHost(el);
        case "copyLink": return copyLink();
        case "signOut": return signOut();
        case "startGame": return startGame(el.dataset.game);
        case "advancePhase": return advancePhase();
        case "reveal": return setPhase("reveal");
        case "nextQuestion": return nextQuestion();
        case "submitMajorityAnswer": return submitMajority("answer", el.dataset.value);
        case "submitMajorityPrediction": return submitMajority("prediction", el.dataset.value);
        case "submitTeamAnswer": return submitTeamAnswer(el);
        case "submitSuperVote": return submitSuperVote(el.dataset.player);
        case "awardMajority": return guardOnce("awardMajority", awardMajorityPoints);
        case "awardTeam": return guardOnce(`awardTeam:${el.dataset.team}`, () => awardTeam(el.dataset.team, Number(el.dataset.points || 0)));
        case "awardSuper": return guardOnce("awardSuper", awardSuperlative);
        case "adjustScore": return adjustScore(el.dataset.team, Number(el.dataset.delta || 0));
        case "resetRound": return resetRound();
        case "resetEvent": return resetEvent();
        case "updateTeamNames": return updateTeamNames(el);
        case "nextIntro": return moveIntro(1);
        case "prevIntro": return moveIntro(-1);
        case "startTimer": return startTimer(Number(el.dataset.seconds || 45));
        case "confetti": return confetti();
        case "reassignPlayer": return reassignPlayer(el.dataset.player, el.dataset.team);
        case "removePlayer": return removePlayer(el.dataset.player);
        case "switchTeam": return signOut();
        default: return null;
      }
    } catch (err) {
      console.error(err);
      toast(err.message || "Something went wrong.");
    }
  }

  function defaultState() {
    const now = Date.now();
    return {
      initializedAt: now,
      updatedAt: now,
      teams: {
        A: { name: "Team Navy", score: 0 },
        B: { name: "Team Blue", score: 0 },
        C: { name: "Team Spark", score: 0 }
      },
      current: {
        type: "idle",
        phase: "idle",
        index: 0,
        roundId: newRoundId(),
        awarded: false,
        timerEnd: null,
        introOrder: [],
        introIndex: 0
      }
    };
  }

  function currentPlayer() {
    return currentPlayerId ? players[currentPlayerId] : null;
  }

  function allPlayers() {
    return Object.entries(players || {})
      .filter(([, p]) => p && p.name)
      .map(([id, p]) => ({ id, ...p }))
      .sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0));
  }

  function playerTeam() {
    const p = currentPlayer();
    return p && p.team ? p.team : null;
  }

  function currentAnswers() {
    return answers?.[state?.current?.roundId] || {};
  }

  function currentTeamAnswers() {
    return teamAnswers?.[state?.current?.roundId] || {};
  }

  function getQuestion() {
    const type = state?.current?.type || "idle";
    const bank = QUESTIONS[type] || [];
    return bank[state?.current?.index || 0] || bank[0] || null;
  }

  function scheduleRender(force = false) {
    if (force) {
      render(true);
      return;
    }
    if (renderQueued) return;
    renderQueued = true;
    window.requestAnimationFrame(() => {
      renderQueued = false;
      render(false);
    });
  }

  function render(force = false) {
    if (!state) return;
    if (!force && isUserEditing()) {
      renderPending = true;
      return;
    }
    renderPending = false;
    const p = currentPlayer();
    const view = !p?.name ? "join" : !p?.team ? "team" : "play";
    $app.innerHTML = `
      ${renderHeader(view)}
      <main class="page">
        ${renderProgress(view)}
        ${view === "join" ? renderJoin() : view === "team" ? renderTeamSelect() : renderPlay()}
        ${hostUnlocked ? renderHostDock() : ""}
      </main>
      ${modal === "host" ? renderHostModal() : ""}
    `;
  }

  function attachEditProtection() {
    document.addEventListener("focusout", (event) => {
      if (!$app.contains(event.target) || !isEditableElement(event.target)) return;
      window.setTimeout(() => {
        if (renderPending && !isUserEditing()) scheduleRender(true);
      }, 250);
    });
  }

  function isUserEditing() {
    const el = document.activeElement;
    return isEditableElement(el) && $app.contains(el);
  }

  function isEditableElement(el) {
    return Boolean(el && (
      el.matches?.("input, textarea, select") ||
      el.isContentEditable
    ));
  }

  function renderHeader(view) {
    const p = currentPlayer();
    const team = p?.team ? state.teams[p.team]?.name : "No team yet";
    const count = allPlayers().length;
    return `
      <header class="header">
        <div class="header-inner">
          <div class="brand">
            <div class="logo" aria-hidden="true">🎯</div>
            <div>
              <div class="brand-title">Team Happy Hour</div>
              <div class="brand-subtitle">${p?.name ? `${escapeHTML(p.name)} · ${escapeHTML(team)}` : "Name → Team → Play"}</div>
            </div>
          </div>
          <div class="header-actions">
            <span class="pill ${connected ? "pill-live" : "pill-warn"}">${connected ? "● Live" : "○ Reconnecting…"}</span>
            <span class="pill">${count} joined</span>
            <span class="pill">${escapeHTML(GAME_LABELS[state.current.type] || "Ready")}</span>
            ${p?.name ? `<button class="btn" data-action="switchTeam">Not you?</button>` : ""}
            <button class="btn" data-action="copyLink">Copy link</button>
            <button class="btn ${hostUnlocked ? "btn-primary" : ""}" data-action="openHost">Host</button>
          </div>
        </div>
      </header>
    `;
  }

  function renderProgress(view) {
    const active = { join: 0, team: 1, play: 2 }[view];
    const labels = ["Add name", "Select team", "Play games"];
    return `
      <section class="progress-strip" aria-label="Game setup progress">
        ${labels.map((label, index) => `
          <div class="step-chip ${index === active ? "active" : ""}">
            <strong>${String(index + 1).padStart(2, "0")} ${label}</strong>
            <span>${index < active ? "Complete" : index === active ? "Now" : "Next"}</span>
          </div>
        `).join("")}
      </section>
    `;
  }

  function renderJoin() {
    const p = currentPlayer() || {};
    const joined = allPlayers().length;
    return `
      <section class="hero">
        <div>
          <div class="kicker">Happy hour game board</div>
          <h1 class="h1">Start simple. Play fast.</h1>
          <p class="lead">Add your name, pick a team, and answer from your own device. The host controls the games and the shared screen keeps score.</p>
          <form class="card card-pad form-grid" data-action="saveProfile" style="max-width: 680px; margin-top: 32px;">
            <div class="field">
              <label class="label" for="name">Your name</label>
              <input id="name" name="name" class="input" required maxlength="40" autocomplete="name" placeholder="e.g., Jordan" value="${escapeAttr(p.name || "")}" />
            </div>
            <div class="field">
              <label class="label" for="avatar">Avatar</label>
              <select id="avatar" name="avatar" class="select">
                ${AVATARS.map(a => `<option value="${a}" ${p.avatar === a ? "selected" : ""}>${a}</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <label class="label" for="show">Favorite show / comfort rewatch</label>
              <input id="show" name="show" class="input" maxlength="80" placeholder="Optional, but useful for intros" value="${escapeAttr(p.show || "")}" />
            </div>
            <div class="field">
              <label class="label" for="fact">One fun fact or harmless hot take</label>
              <textarea id="fact" name="fact" class="textarea" maxlength="180" placeholder="Optional — the host can use this for the final bonus.">${escapeHTML(p.fact || "")}</textarea>
            </div>
            <button class="btn btn-primary btn-large" type="submit">Continue to teams</button>
          </form>
        </div>
        <aside class="hero-panel">
          <div>
            <div class="kicker" style="color: rgba(255,255,255,.72);">Tonight</div>
            <div class="metric">${joined}</div>
            <p>${joined === 1 ? "Person joined so far" : "People joined so far"} · three teams, quick rounds, one live scoreboard.</p>
          </div>
          <span class="pill pill-dark">Majority + Trivia + Emoji + Superlatives</span>
        </aside>
      </section>
    `;
  }

  function renderTeamSelect() {
    const p = currentPlayer();
    return `
      <section>
        <div class="kicker">Team select</div>
        <h1 class="h1">Choose your team.</h1>
        <p class="lead">Pick any team. The host can balance teams if needed.</p>
        <div class="teams-grid">
          ${TEAM_IDS.map(teamId => renderTeamCard(teamId, p?.team === teamId, true)).join("")}
        </div>
      </section>
    `;
  }

  function renderTeamCard(teamId, selected = false, choose = false) {
    const team = state.teams[teamId];
    const members = allPlayers().filter(p => p.team === teamId);
    return `
      <article class="team-card ${selected ? "selected" : ""}">
        <div class="team-head">
          <div>
            <h2 class="team-name">${escapeHTML(team.name)}</h2>
            <span class="pill">${members.length} players</span>
          </div>
          <div class="team-score">${Number(team.score || 0)}</div>
        </div>
        <div class="member-list" aria-label="${escapeAttr(team.name)} members">
          ${members.length ? members.map(memberToken).join("") : `<span class="help">No one yet.</span>`}
        </div>
        ${choose ? `<button class="btn ${selected ? "btn-success" : "btn-primary"} btn-block" data-action="selectTeam" data-team="${teamId}">${selected ? "Selected" : `Join ${escapeHTML(team.name)}`}</button>` : ""}
      </article>
    `;
  }

  function renderPlay() {
    return `
      <section class="game-layout">
        <div>${renderCurrentGame()}</div>
        <aside class="side-panel">
          ${renderScoreboard()}
          ${renderContext()}
        </aside>
      </section>
    `;
  }

  function renderCurrentGame() {
    const type = state.current.type;
    if (type === "idle") return renderIdleGame();
    if (type === "intros") return renderIntros();
    if (type === "majority") return renderMajority();
    if (type === "trivia" || type === "emoji" || type === "final") return renderTeamQuestion(type);
    if (type === "superlatives") return renderSuperlatives();
    return renderIdleGame();
  }

  function renderIdleGame() {
    return `
      <div class="game-card">
        <div class="game-top">
          <h2 class="game-title">Ready to play</h2>
          <span class="pill">Waiting for host</span>
        </div>
        <div class="game-body">
          <h3 class="question">You’re in. The host will start the first game.</h3>
          <p class="lead">Keep this page open while the host screen-shares the game board.</p>
        </div>
        <div class="game-footer">
          <span class="help">Current team: ${escapeHTML(state.teams[playerTeam()]?.name || "—")}</span>
          <button class="btn" data-action="signOut">Change name/team</button>
        </div>
      </div>
    `;
  }

  function renderIntros() {
    const order = state.current.introOrder || [];
    const index = Math.min(state.current.introIndex || 0, Math.max(order.length - 1, 0));
    const person = players[order[index]] || null;
    const remaining = timerRemaining();
    return `
      <div class="game-card">
        <div class="game-top">
          <h2 class="game-title">Fun Intros</h2>
          <span class="pill">${order.length ? `${index + 1} / ${order.length}` : "No players"}</span>
        </div>
        <div class="game-body">
          ${person ? `
            <div class="kicker">Up next</div>
            <h3 class="question">${escapeHTML(person.avatar || "✨")} ${escapeHTML(person.name)}</h3>
            <div class="stats-grid">
              <div class="stat"><b>${remaining ?? 45}</b><span>seconds</span></div>
              <div class="stat"><b>${escapeHTML(person.show ? "✓" : "—")}</b><span>favorite show</span></div>
              <div class="stat"><b>${escapeHTML(person.fact ? "✓" : "—")}</b><span>fun fact</span></div>
            </div>
            ${person.show ? `<div class="submitted-state">Favorite show: ${escapeHTML(person.show)}</div>` : ""}
            ${person.fact ? `<div class="submitted-state">Fun fact: ${escapeHTML(person.fact)}</div>` : ""}
          ` : `
            <h3 class="question">No one has joined yet.</h3>
          `}
        </div>
        <div class="game-footer">
          <span class="help">45 seconds per person keeps intros moving.</span>
          ${hostUnlocked ? `<div class="controls"><button class="btn" data-action="prevIntro">Previous</button><button class="btn btn-primary" data-action="startTimer" data-seconds="45">Start 45s</button><button class="btn" data-action="nextIntro">Next</button></div>` : ""}
        </div>
      </div>
    `;
  }

  function renderMajority() {
    const q = getQuestion();
    const phase = state.current.phase;
    const my = currentAnswers()[currentPlayerId] || {};
    const playerCount = allPlayers().length;
    const answeredCount = Object.values(currentAnswers()).filter(a => a.answer).length;
    const predictedCount = Object.values(currentAnswers()).filter(a => a.prediction).length;
    return `
      <div class="game-card">
        <div class="game-top">
          <h2 class="game-title">Majority Rules</h2>
          <span class="pill">${phase === "answer" ? `${answeredCount}/${playerCount} answered` : phase === "predict" ? `${predictedCount}/${playerCount} predicted` : "Reveal"}</span>
        </div>
        <div class="game-body">
          ${phase === "answer" ? renderMajorityAnswer(q, my) : phase === "predict" ? renderMajorityPredict(q, my) : renderMajorityReveal(q)}
        </div>
        <div class="game-footer">
          <span class="help">Question ${state.current.index + 1} of ${QUESTIONS.majority.length}</span>
          ${hostUnlocked ? hostPhaseButtons() : ""}
        </div>
      </div>
    `;
  }

  function renderMajorityAnswer(q, my) {
    if (my.answer) {
      return `<h3 class="question">${escapeHTML(q.q)}</h3><div class="submitted-state">Locked in: ${escapeHTML(my.answer)}. Next, you’ll predict what the group picked.</div>`;
    }
    return `
      <div class="kicker">Answer honestly</div>
      <h3 class="question">${escapeHTML(q.q)}</h3>
      <div class="answer-grid">
        ${q.options.map(opt => `<button class="answer-option" data-action="submitMajorityAnswer" data-value="${escapeAttr(opt)}">${escapeHTML(opt)}</button>`).join("")}
      </div>
    `;
  }

  function renderMajorityPredict(q, my) {
    if (my.prediction) {
      return `<h3 class="question">${escapeHTML(q.q)}</h3><div class="submitted-state">Prediction locked: most people picked ${escapeHTML(my.prediction)}.</div>`;
    }
    return `
      <div class="kicker">Predict the group</div>
      <h3 class="question">What did most people pick?</h3>
      <div class="answer-grid">
        ${q.options.map(opt => `<button class="answer-option" data-action="submitMajorityPrediction" data-value="${escapeAttr(opt)}">${escapeHTML(opt)}</button>`).join("")}
      </div>
    `;
  }

  function renderMajorityReveal(q) {
    const summary = majoritySummary(q);
    return `
      <div class="kicker">Reveal</div>
      <h3 class="question">Majority: ${escapeHTML(summary.majority || "No answers yet")}</h3>
      <div class="result-bars">
        ${q.options.map(opt => `
          <div class="result-bar">
            <div class="result-label"><span>${escapeHTML(opt)}</span><span>${summary.counts[opt] || 0}</span></div>
            <div class="bar-track"><div class="bar-fill" style="width:${summary.percent[opt] || 0}%"></div></div>
          </div>
        `).join("")}
      </div>
      <div class="stats-grid">
        ${TEAM_IDS.map(teamId => {
          const r = summary.respondentsByTeam[teamId] || 0;
          const c = summary.correctByTeam[teamId] || 0;
          const pct = r ? Math.round((c / r) * 100) : 0;
          return `<div class="stat"><b>${r ? `${pct}%` : "—"}</b><span>${escapeHTML(state.teams[teamId].name)} · ${c}/${r} correct</span></div>`;
        }).join("")}
      </div>
      <p class="help">3 points to any team where more than half the team correctly predicted the room's majority, plus a +2 bonus for the single most accurate team.</p>
      ${summary.tied ? `<div class="submitted-state">Tied for most accurate — no bonus this round.</div>` : ""}
      ${state.current.awarded ? `<div class="submitted-state">Points awarded.</div>` : hostUnlocked ? `<button class="btn btn-primary btn-large" data-action="awardMajority">Award majority points</button>` : ""}
    `;
  }

  function renderTeamQuestion(type) {
    const q = getQuestion();
    const phase = state.current.phase;
    const teamId = playerTeam();
    const teamMap = currentTeamAnswers();
    const mine = teamId ? teamMap[teamId] : null;
    const isEmoji = type === "emoji";
    const points = type === "final" ? 5 : 2;
    return `
      <div class="game-card">
        <div class="game-top">
          <h2 class="game-title">${escapeHTML(GAME_LABELS[type])}</h2>
          <span class="pill">${Object.keys(teamMap).length}/${TEAM_IDS.length} teams submitted</span>
        </div>
        <div class="game-body">
          <div class="kicker">Team answer · ${points} points</div>
          <h3 class="question ${isEmoji ? "emoji-question" : ""}">${escapeHTML(q.q)}</h3>
          ${phase === "reveal" ? renderTeamReveal(q, points) : renderTeamAnswerForm(mine)}
        </div>
        <div class="game-footer">
          <span class="help">${type === "final" ? "Pick one final bonus question to close the event — no need to cycle through all of them." : "One answer per team. Last submission before reveal counts."}</span>
          ${hostUnlocked ? hostPhaseButtons() : ""}
        </div>
      </div>
    `;
  }

  function renderTeamAnswerForm(mine) {
    return `
      ${mine?.answer ? `<div class="submitted-state">Your team submitted: ${escapeHTML(mine.answer)}</div>` : ""}
      <form class="form-grid" data-action="submitTeamAnswer">
        <div class="field">
          <label class="label" for="teamAnswer">Team answer</label>
          <input id="teamAnswer" name="answer" class="input" maxlength="80" placeholder="Type your team’s final answer" value="${escapeAttr(mine?.answer || "")}" required />
        </div>
        <button class="btn btn-primary btn-large" type="submit">Submit team answer</button>
      </form>
    `;
  }

  function renderTeamReveal(q, points) {
    const teamMap = currentTeamAnswers();
    return `
      <div class="submitted-state">Correct answer: ${escapeHTML(q.a || "Host decides")}</div>
      <div class="answer-list">
        ${TEAM_IDS.map(teamId => {
          const item = teamMap[teamId];
          return `<div class="answer-line"><div><b>${escapeHTML(state.teams[teamId].name)}</b><br><span>${escapeHTML(item?.answer || "No answer")}</span></div>${hostUnlocked ? `<button class="btn btn-success" data-action="awardTeam" data-team="${teamId}" data-points="${points}">+${points}</button>` : ""}</div>`;
        }).join("")}
      </div>
    `;
  }

  function renderSuperlatives() {
    const q = getQuestion();
    const phase = state.current.phase;
    const my = currentAnswers()[currentPlayerId] || {};
    const people = allPlayers();
    const count = Object.values(currentAnswers()).filter(a => a.vote).length;
    return `
      <div class="game-card">
        <div class="game-top">
          <h2 class="game-title">Superlatives</h2>
          <span class="pill">${count}/${people.length} voted</span>
        </div>
        <div class="game-body">
          ${phase === "reveal" ? renderSuperReveal(q) : `
            <div class="kicker">Vote for someone</div>
            <h3 class="question">${escapeHTML(q.q)}</h3>
            ${my.vote ? `<div class="submitted-state">Vote locked for ${escapeHTML(players[my.vote]?.name || "someone")}.</div>` : `<div class="answer-grid">${people.map(p => `<button class="answer-option" data-action="submitSuperVote" data-player="${p.id}">${escapeHTML(p.avatar || "✨")} ${escapeHTML(p.name)}</button>`).join("")}</div>`}
          `}
        </div>
        <div class="game-footer">
          <span class="help">Keep it fun and positive.</span>
          ${hostUnlocked ? hostPhaseButtons() : ""}
        </div>
      </div>
    `;
  }

  function renderSuperReveal(q) {
    const summary = superSummary();
    return `
      <div class="kicker">Winner</div>
      <h3 class="question">${summary.winner ? `${escapeHTML(players[summary.winner]?.avatar || "✨")} ${escapeHTML(players[summary.winner]?.name || "Winner")}` : "No votes yet"}</h3>
      <p class="lead">${escapeHTML(q.q)}</p>
      <div class="answer-list">
        ${summary.ranked.map(([id, count]) => `<div class="answer-line"><b>${escapeHTML(players[id]?.name || "Unknown")}</b><span>${count} votes</span></div>`).join("") || `<div class="answer-line"><b>No votes</b><span>—</span></div>`}
      </div>
      ${state.current.awarded ? `<div class="submitted-state">Points awarded.</div>` : hostUnlocked && summary.winner ? `<button class="btn btn-primary btn-large" data-action="awardSuper">Award winner’s team +2</button>` : ""}
    `;
  }

  function renderScoreboard() {
    return `
      <section class="scoreboard" aria-label="Scoreboard">
        ${TEAM_IDS.map(teamId => `
          <div class="score-row">
            <strong>${escapeHTML(state.teams[teamId].name)}</strong>
            <span>${Number(state.teams[teamId].score || 0)}</span>
          </div>
        `).join("")}
      </section>
    `;
  }

  function renderContext() {
    const type = state.current.type;
    const phase = state.current.phase;
    const q = getQuestion();
    const playerCount = allPlayers().length;
    return `
      <section class="context-card">
        <h3>What’s happening</h3>
        <p>${contextCopy(type, phase)}</p>
      </section>
      <section class="context-card">
        <h3>Current round</h3>
        <p>${q ? escapeHTML(q.q) : "The host has not started a game yet."}</p>
        <div style="margin-top: 16px;"><span class="pill">${playerCount} players</span> <span class="pill">${escapeHTML(phase)}</span></div>
      </section>
    `;
  }

  function contextCopy(type, phase) {
    if (type === "idle") return "Waiting for the host to start the first game.";
    if (type === "intros") return "The host is moving through intros one person at a time.";
    if (type === "majority" && phase === "answer") return "Answer honestly first. Results stay hidden until everyone predicts the majority.";
    if (type === "majority" && phase === "predict") return "Now predict what the group picked. Correct predictions earn team points.";
    if (type === "majority") return "The actual majority and correct predictors are visible.";
    if (phase === "reveal") return "The host decides which teams get points and moves to the next question.";
    return "Discuss with your team and submit one final answer.";
  }

  function renderHostModal() {
    return `
      <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="hostTitle">
        <div class="modal">
          <h2 id="hostTitle">Host access</h2>
          <p>Unlock game controls for this browser.</p>
          <form class="form-grid" data-action="unlockHost">
            <div class="field">
              <label class="label" for="hostPassword">Password</label>
              <input id="hostPassword" name="password" type="password" class="input" autocomplete="current-password" required />
            </div>
            <div class="controls">
              <button class="btn btn-primary" type="submit">Unlock host controls</button>
              <button class="btn" data-action="closeModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function renderHostDock() {
    return `
      <section class="host-dock" aria-label="Host controls">
        <div class="host-head">
          <h2>Host controls</h2>
          <div class="controls"><button class="btn btn-ghost pill-dark" data-action="confetti">Confetti</button><button class="btn btn-ghost pill-dark" data-action="resetRound">Reset round</button></div>
        </div>
        <div class="host-body">
          <div class="host-section">
            <h3>Start a game</h3>
            <div class="control-grid">
              ${["intros", "majority", "trivia", "emoji", "superlatives", "final"].map(type => `<button class="btn ${state.current.type === type ? "btn-primary" : ""}" data-action="startGame" data-game="${type}">${escapeHTML(GAME_LABELS[type])}</button>`).join("")}
            </div>
          </div>
          <div class="host-section">
            <h3>Round controls</h3>
            <div class="controls">
              ${hostPhaseButtons()}
              <button class="btn" data-action="nextQuestion">Next question</button>
              <button class="btn" data-action="startTimer" data-seconds="60">Start 60s</button>
            </div>
          </div>
          <div class="host-section">
            <h3>Scores</h3>
            <div class="control-grid">
              ${TEAM_IDS.map(teamId => `
                <div class="card card-pad">
                  <strong style="color:var(--tz-color-primary)">${escapeHTML(state.teams[teamId].name)}</strong>
                  <div class="controls" style="margin-top:10px"><button class="btn" data-action="adjustScore" data-team="${teamId}" data-delta="-1">−1</button><button class="btn" data-action="adjustScore" data-team="${teamId}" data-delta="1">+1</button><button class="btn" data-action="adjustScore" data-team="${teamId}" data-delta="5">+5</button></div>
                </div>`).join("")}
            </div>
          </div>
          <div class="host-section">
            <h3>Players</h3>
            <div class="answer-list">
              ${allPlayers().length ? allPlayers().map(pl => `
                <div class="answer-line">
                  <div><b>${escapeHTML(pl.avatar || "✨")} ${escapeHTML(pl.name)}</b><br><span>${pl.team ? escapeHTML(state.teams[pl.team]?.name || pl.team) : "No team yet"}</span></div>
                  <div class="controls">
                    ${TEAM_IDS.filter(t => t !== pl.team).map(t => `<button class="btn" data-action="reassignPlayer" data-player="${pl.id}" data-team="${t}">→ ${escapeHTML(state.teams[t].name)}</button>`).join("")}
                    <button class="btn btn-danger" data-action="removePlayer" data-player="${pl.id}">Remove</button>
                  </div>
                </div>
              `).join("") : `<div class="answer-line"><b>No one has joined yet.</b></div>`}
            </div>
          </div>
          <div class="host-section">
            <h3>Team names</h3>
            <form class="control-grid" data-action="updateTeamNames">
              ${TEAM_IDS.map(teamId => `<input class="small-input" name="team_${teamId}" value="${escapeAttr(state.teams[teamId].name)}" aria-label="Team ${teamId} name" />`).join("")}
              <button class="btn btn-primary" type="submit">Save team names</button>
            </form>
          </div>
          <div class="host-section">
            <h3>Danger zone</h3>
            <button class="btn btn-danger" data-action="resetEvent">Reset entire event</button>
          </div>
        </div>
      </section>
    `;
  }

  function hostPhaseButtons() {
    const type = state.current.type;
    if (type === "idle") return "";
    if (type === "intros") {
      return `<div class="controls"><button class="btn" data-action="prevIntro">Previous intro</button><button class="btn btn-primary" data-action="startTimer" data-seconds="45">Start 45s</button><button class="btn" data-action="nextIntro">Next intro</button></div>`;
    }
    if (type === "majority") {
      if (state.current.phase === "answer") return `<button class="btn btn-primary" data-action="advancePhase">Start predictions</button>`;
      if (state.current.phase === "predict") return `<button class="btn btn-primary" data-action="reveal">Reveal results</button>`;
      return `<button class="btn btn-primary" data-action="nextQuestion">Next question</button>`;
    }
    if (state.current.phase !== "reveal") return `<button class="btn btn-primary" data-action="reveal">Reveal answer</button>`;
    return `<button class="btn btn-primary" data-action="nextQuestion">Next question</button>`;
  }

  async function saveProfile(form) {
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    if (!name) throw new Error("Add your name first.");
    if (!currentPlayerId) {
      currentPlayerId = `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(STORAGE_KEY, currentPlayerId);
    }
    const existing = players[currentPlayerId] || {};
    await rootRef.child(`players/${currentPlayerId}`).update({
      name,
      avatar: String(fd.get("avatar") || "✨"),
      show: String(fd.get("show") || "").trim(),
      fact: String(fd.get("fact") || "").trim(),
      team: existing.team || null,
      joinedAt: existing.joinedAt || Date.now(),
      updatedAt: Date.now(),
      active: true
    });
    toast("Profile saved.");
  }

  async function selectTeam(teamId) {
    requirePlayer();
    if (!TEAM_IDS.includes(teamId)) throw new Error("Choose a valid team.");
    await rootRef.child(`players/${currentPlayerId}`).update({ team: teamId, updatedAt: Date.now() });
    toast(`Joined ${state.teams[teamId].name}.`);
  }

  async function reassignPlayer(playerId, teamId) {
    requireHost();
    if (!playerId || !players[playerId]) throw new Error("Player not found.");
    if (!TEAM_IDS.includes(teamId)) throw new Error("Choose a valid team.");
    await rootRef.child(`players/${playerId}`).update({ team: teamId, updatedAt: Date.now() });
    toast(`Moved ${players[playerId].name} to ${state.teams[teamId].name}.`);
  }

  async function removePlayer(playerId) {
    requireHost();
    if (!playerId || !players[playerId]) throw new Error("Player not found.");
    const name = players[playerId].name;
    const ok = window.confirm(`Remove ${name} from this event?`);
    if (!ok) return;
    await rootRef.child(`players/${playerId}`).remove();
    toast(`${name} removed.`);
  }

  async function unlockHost(form) {
    const password = String(new FormData(form).get("password") || "");
    const hash = await sha256(password);
    if (hash !== CONFIG.hostPasswordHash) throw new Error("Incorrect host password.");
    hostUnlocked = true;
    localStorage.setItem(HOST_KEY, "true");
    modal = null;
    toast("Host controls unlocked.");
    render(true);
  }

  async function startGame(type) {
    requireHost();
    const roundId = newRoundId();
    const next = {
      type,
      phase: type === "intros" ? "present" : "answer",
      index: 0,
      roundId,
      awarded: false,
      timerEnd: null,
      introOrder: type === "intros" ? shuffle(allPlayers().map(p => p.id)) : [],
      introIndex: 0
    };
    await rootRef.child("state/current").set(next);
    await rootRef.child(`answers/${roundId}`).remove();
    await rootRef.child(`teamAnswers/${roundId}`).remove();
    toast(`${GAME_LABELS[type]} started.`);
  }

  async function advancePhase() {
    requireHost();
    const type = state.current.type;
    if (type === "majority" && state.current.phase === "answer") return setPhase("predict");
    return setPhase("reveal");
  }

  async function setPhase(phase) {
    requireHost();
    await rootRef.child("state/current").update({ phase, timerEnd: null, updatedAt: Date.now() });
  }

  async function nextQuestion() {
    requireHost();
    const type = state.current.type;
    if (type === "intros") return moveIntro(1);
    const bank = QUESTIONS[type] || [];
    const nextIndex = ((state.current.index || 0) + 1) % Math.max(bank.length, 1);
    const roundId = newRoundId();
    await rootRef.child("state/current").update({
      index: nextIndex,
      roundId,
      phase: "answer",
      awarded: false,
      timerEnd: null,
      updatedAt: Date.now()
    });
    await rootRef.child(`answers/${roundId}`).remove();
    await rootRef.child(`teamAnswers/${roundId}`).remove();
  }

  async function resetRound() {
    requireHost();
    const roundId = newRoundId();
    await rootRef.child("state/current").update({
      roundId,
      phase: state.current.type === "intros" ? "present" : "answer",
      awarded: false,
      timerEnd: null,
      updatedAt: Date.now()
    });
    toast("Round reset.");
  }

  async function submitMajority(field, value) {
    requirePlayer();
    if (state.current.type !== "majority") throw new Error("Majority Rules is not active.");
    if (field === "answer" && state.current.phase !== "answer") throw new Error("Answering is closed.");
    if (field === "prediction" && state.current.phase !== "predict") throw new Error("Prediction is not open yet.");
    const p = currentPlayer();
    await rootRef.child(`answers/${state.current.roundId}/${currentPlayerId}`).update({
      [field]: value,
      name: p.name,
      team: p.team,
      avatar: p.avatar || "✨",
      updatedAt: Date.now()
    });
    toast(field === "answer" ? "Answer locked." : "Prediction locked.");
  }

  async function submitTeamAnswer(form) {
    requirePlayer();
    if (!["trivia", "emoji", "final"].includes(state.current.type)) throw new Error("Team answers are not open.");
    if (state.current.phase === "reveal") throw new Error("This round is already revealed.");
    const p = currentPlayer();
    if (!p.team) throw new Error("Pick a team first.");
    const answer = String(new FormData(form).get("answer") || "").trim();
    if (!answer) throw new Error("Type an answer first.");
    await rootRef.child(`teamAnswers/${state.current.roundId}/${p.team}`).set({
      answer,
      submittedBy: p.name,
      submittedById: currentPlayerId,
      updatedAt: Date.now()
    });
    toast("Team answer submitted.");
  }

  async function submitSuperVote(playerId) {
    requirePlayer();
    if (state.current.type !== "superlatives" || state.current.phase !== "answer") throw new Error("Voting is not open.");
    if (!players[playerId]) throw new Error("Player not found.");
    const p = currentPlayer();
    await rootRef.child(`answers/${state.current.roundId}/${currentPlayerId}`).set({
      vote: playerId,
      name: p.name,
      team: p.team,
      updatedAt: Date.now()
    });
    toast("Vote locked.");
  }

  async function awardMajorityPoints() {
    requireHost();
    const q = getQuestion();
    const roundId = state.current.roundId;
    const awardResult = await rootRef.child("state/current").transaction((current) => {
      if (!current || current.roundId !== roundId || current.awarded) return current;
      current.awarded = true;
      return current;
    });
    if (!awardResult.committed || !awardResult.snapshot.val()?.awarded) return;
    // Recompute from the answers as of award time. If another host click already
    // won the transaction above, we return early and never double-apply points.
    const summary = majoritySummary(q);
    await Promise.all(TEAM_IDS.map((teamId) =>
      rootRef.child(`state/teams/${teamId}/score`).transaction((score) => {
        const base = summary.baseByTeam[teamId] || 0;
        const bonus = summary.bonusTeam === teamId ? 2 : 0;
        return Number(score || 0) + base + bonus;
      })
    ));
    confetti();
  }

  async function awardTeam(teamId, points) {
    requireHost();
    if (!TEAM_IDS.includes(teamId)) return;
    await adjustScore(teamId, points);
    toast(`${state.teams[teamId].name} +${points}.`);
  }

  async function awardSuperlative() {
    requireHost();
    const roundId = state.current.roundId;
    const awardResult = await rootRef.child("state/current").transaction((current) => {
      if (!current || current.roundId !== roundId || current.awarded) return current;
      current.awarded = true;
      return current;
    });
    if (!awardResult.committed || !awardResult.snapshot.val()?.awarded) return;
    const summary = superSummary();
    if (!summary.winner) return;
    const winner = players[summary.winner];
    if (!winner?.team) return;
    await rootRef.child(`state/teams/${winner.team}/score`).transaction((score) => Number(score || 0) + 2);
    confetti();
  }

  async function adjustScore(teamId, delta) {
    requireHost();
    if (!TEAM_IDS.includes(teamId)) return;
    await rootRef.child(`state/teams/${teamId}/score`).transaction((score) => Number(score || 0) + Number(delta));
  }

  async function updateTeamNames(form) {
    requireHost();
    const fd = new FormData(form);
    const updates = {};
    TEAM_IDS.forEach(teamId => {
      const name = String(fd.get(`team_${teamId}`) || "").trim() || `Team ${teamId}`;
      updates[`state/teams/${teamId}/name`] = name;
    });
    await rootRef.update(updates);
    toast("Team names saved.");
  }

  async function moveIntro(delta) {
    requireHost();
    const order = state.current.introOrder || [];
    const max = Math.max(order.length - 1, 0);
    const next = Math.max(0, Math.min(max, (state.current.introIndex || 0) + delta));
    await rootRef.child("state/current").update({ introIndex: next, timerEnd: null, updatedAt: Date.now() });
  }

  async function startTimer(seconds) {
    requireHost();
    await rootRef.child("state/current/timerEnd").set(Date.now() + seconds * 1000);
  }

  async function resetEvent() {
    requireHost();
    const ok = window.confirm("Reset scores, players, and current game? This cannot be undone.");
    if (!ok) return;
    await rootRef.set({ state: defaultState(), players: null, answers: null, teamAnswers: null });
    localStorage.removeItem(STORAGE_KEY);
    currentPlayerId = null;
    toast("Event reset.");
  }

  async function signOut() {
    if (currentPlayerId) await rootRef.child(`players/${currentPlayerId}`).remove();
    localStorage.removeItem(STORAGE_KEY);
    currentPlayerId = null;
    toast("Profile removed on this device.");
  }

  function majoritySummary(q) {
    const vals = Object.values(currentAnswers());
    const counts = Object.fromEntries(q.options.map(opt => [opt, 0]));
    vals.forEach(item => { if (item.answer in counts) counts[item.answer] += 1; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    let majority = q.options[0];
    q.options.forEach(opt => { if ((counts[opt] || 0) > (counts[majority] || 0)) majority = opt; });
    const percent = Object.fromEntries(q.options.map(opt => [opt, total ? Math.round((counts[opt] || 0) / total * 100) : 0]));

    // Score by each team's prediction ACCURACY, not raw headcount — otherwise a
    // bigger team automatically racks up more "correct" hits than a smaller,
    // equally (or more) accurate team just by having more members.
    const respondentsByTeam = { A: 0, B: 0, C: 0 };
    const correctByTeam = { A: 0, B: 0, C: 0 };
    vals.forEach(item => {
      if (!TEAM_IDS.includes(item.team) || !item.prediction) return;
      respondentsByTeam[item.team] += 1;
      if (item.prediction === majority) correctByTeam[item.team] += 1;
    });
    const pctByTeam = {};
    TEAM_IDS.forEach(teamId => {
      pctByTeam[teamId] = respondentsByTeam[teamId] ? correctByTeam[teamId] / respondentsByTeam[teamId] : 0;
    });
    const baseByTeam = {};
    TEAM_IDS.forEach(teamId => {
      baseByTeam[teamId] = respondentsByTeam[teamId] > 0 && pctByTeam[teamId] > 0.5 ? 3 : 0;
    });

    let bonusTeam = null;
    let bonusScore = -1;
    let tied = false;
    TEAM_IDS.forEach(teamId => {
      if (respondentsByTeam[teamId] === 0) return;
      if (pctByTeam[teamId] > bonusScore) { bonusScore = pctByTeam[teamId]; bonusTeam = teamId; tied = false; }
      else if (pctByTeam[teamId] === bonusScore) { bonusTeam = null; tied = true; }
    });
    if (bonusScore <= 0) bonusTeam = null;

    return { counts, total, percent, majority: total ? majority : null, correctByTeam, respondentsByTeam, pctByTeam, baseByTeam, bonusTeam, tied };
  }

  function superSummary() {
    const voteCounts = {};
    Object.values(currentAnswers()).forEach(item => {
      if (item.vote) voteCounts[item.vote] = (voteCounts[item.vote] || 0) + 1;
    });
    const ranked = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);
    return { ranked, winner: ranked[0]?.[0] || null };
  }

  function renderSetupMissing() {
    $app.innerHTML = `
      <main class="page">
        <section class="empty-state" style="margin-top: 8vh; text-align:left;">
          <div class="kicker">Firebase setup required</div>
          <h2>This build is multiplayer-only.</h2>
          <p>Paste your Firebase Web App config into <span class="code">firebase-config.js</span>, enable Realtime Database, then redeploy to GitHub Pages.</p>
          <div class="error-panel">The app intentionally uses Firebase only for live multiplayer. Everyone uses the same event link.</div>
        </section>
      </main>
    `;
  }

  function renderFatal(message) {
    $app.innerHTML = `<main class="page"><section class="empty-state" style="margin-top:8vh"><h2>Could not load the game.</h2><p>${escapeHTML(message)}</p></section></main>`;
  }

  function requireHost() {
    if (!hostUnlocked) throw new Error("Unlock host controls first.");
  }

  async function guardOnce(key, fn) {
    if (inFlight.has(key)) return;
    inFlight.add(key);
    try {
      await fn();
    } finally {
      inFlight.delete(key);
    }
  }

  function requirePlayer() {
    if (!currentPlayerId || !currentPlayer()) throw new Error("Add your name first.");
  }

  function timerRemaining() {
    const end = state?.current?.timerEnd;
    if (!end) return null;
    return Math.max(0, Math.ceil((end - Date.now()) / 1000));
  }

  function memberToken(p) {
    return `<span class="member-token"><span class="avatar">${escapeHTML(p.avatar || "✨")}</span>${escapeHTML(p.name)}</span>`;
  }

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => toast("Link copied."), () => toast("Copy failed."));
  }

  function toast(message) {
    clearTimeout(toastTimer);
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.textContent = message;
    document.body.appendChild(el);
    toastTimer = setTimeout(() => el.remove(), 2400);
  }

  function confetti() {
    const bits = ["●", "■", "▲", "◆", "✦"];
    for (let i = 0; i < 70; i++) {
      const el = document.createElement("div");
      el.className = "confetti";
      el.textContent = bits[Math.floor(Math.random() * bits.length)];
      el.style.left = `${Math.random() * 100}vw`;
      el.style.color = ["#173862", "#24527D", "#2E7D55", "#AD6B11", "#1D252D"][Math.floor(Math.random() * 5)];
      el.style.animationDelay = `${Math.random() * .45}s`;
      el.style.fontSize = `${12 + Math.random() * 18}px`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2500);
    }
  }

  function newRoundId() {
    return `r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function sanitizeEventId(input) {
    return String(input).toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-").slice(0, 80) || "happy-hour-main";
  }

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>'"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[ch]));
  }

  function escapeAttr(value) {
    return escapeHTML(value).replace(/`/g, "&#96;");
  }
})();
