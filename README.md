# Team Happy Hour — Production Multiplayer Build

A single-event, GitHub Pages-ready happy hour game board.

Flow: **Name → Team → Play**.

No rooms. No room codes. Everyone who opens the same GitHub Pages URL joins the same event.

## Included games

- Fun Intros with a 45-second timer
- Majority Rules: personal answer → predict majority → reveal → auto-score
- Team Trivia: one answer per team → host awards points
- Guess the Emoji: one answer per team → host awards points
- Superlatives: everyone votes → host reveals winner → award points
- Final Bonus: host-decided high-stakes question

## Files

- `index.html` — app shell
- `style.css` — TRANZACT-inspired visual system
- `app.js` — Firebase multiplayer app logic
- `firebase-config.js` — paste your Firebase web config here
- `firebase-rules.json` — starter Realtime Database rules

## 1. Firebase setup

1. Open Firebase Console.
2. Create a project.
3. Add a Web App.
4. Copy the Firebase config object.
5. Enable **Realtime Database**.
6. Paste your Firebase config into `firebase-config.js`.

Keep the format like this:

```js
window.HHA_CONFIG = {
  eventId: "happy-hour-main",
  hostPasswordHash: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
  firebase: {
    apiKey: "...",
    authDomain: "...firebaseapp.com",
    databaseURL: "https://...-default-rtdb.firebaseio.com",
    projectId: "...",
    storageBucket: "...appspot.com",
    messagingSenderId: "...",
    appId: "..."
  }
};
```

Host password is `password123`.

> Note: the password is a convenience gate for a static internal event page, not enterprise authentication. It hides controls from normal participants but is not a true security boundary.

## 2. Realtime Database rules

For the event, you can paste the contents of `firebase-rules.json` into:

**Firebase Console → Realtime Database → Rules**

For a one-time internal event, these rules allow shared read/write access to the event path only:

`events/happy-hour-main`

After the event, turn access off:

```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

## 3. Deploy on GitHub Pages

1. Create a GitHub repo.
2. Upload all files in this folder to the repo root.
3. Go to **Settings → Pages**.
4. Source: **Deploy from a branch**.
5. Branch: `main`, folder: `/root`.
6. Save and wait for the Pages URL.

## 4. Test

Open the GitHub Pages link in two browser windows:

1. Window 1: Add a player name and team.
2. Window 2: Add another player.
3. Click **Host**, enter `password123`, and start Majority Rules.
4. Submit answers from both windows.
5. Confirm the reveal and scoreboard update live.

## Design notes

The design follows a structured dashboard approach while staying simple for a happy hour: clear header, dominant current task, persistent scoreboard, progressive disclosure, strong status states, and minimal actions for players.

The theme uses TRANZACT-inspired navy, white, gray, and blue tokens with restrained motion and accessible focus states.
