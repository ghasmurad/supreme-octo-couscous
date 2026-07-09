# Team Happy Hour — Production Multiplayer Build

A single-event, GitHub Pages-ready happy hour game board.

Flow: **Name → Team → Play**.

No rooms. No room codes. Everyone who opens the same GitHub Pages URL joins the same event.

## Included games

- Fun Intros with a 45-second timer
- Majority Rules: personal answer → predict majority → reveal → auto-score (scored by each team's prediction *accuracy*, so team size doesn't skew results)
- Team Trivia: one answer per team → host awards points
- Guess the Emoji: one answer per team → host awards points
- Superlatives: everyone votes → host reveals winner → award points
- Final Bonus: **one** host-picked high-stakes question to close the event — the bank has 3 options so you can choose whichever fits the room, not a set to play through

## Suggested run of show (~55–65 min)

Question banks are intentionally deeper than one event needs, so you have room to skip. A reasonable pass for a ~1-hour happy hour with 15–25 people:

| Segment | Suggested count | Time |
|---|---|---|
| Fun Intros | everyone | ~45s × player count |
| Majority Rules | 4–5 of 8 questions | ~10 min |
| Team Trivia | 4 of 6 questions | ~6 min |
| Guess the Emoji | 5 of 9 questions | ~6 min |
| Superlatives | 4 of 6 prompts | ~8 min |
| Final Bonus | 1 question | ~3 min |

The host isn't required to exhaust a bank — click **Next question** to skip ahead at any point.

## Files

- `index.html` — app shell
- `style.css` — TRANZACT visual system (navy/white/blue tokens, editorial 0px radii)
- `app.js` — Firebase multiplayer app logic
- `firebase-config.js` — paste your Firebase web config here
- `firebase-rules.json` — starter Realtime Database rules

## 1. Firebase setup

1. Open Firebase Console.
2. Create a project **for this event** — don't reuse another event's project. Each deployment of this template needs its own Firebase project, or unrelated events will read and write into the same database.
3. Add a Web App.
4. Copy the Firebase config object.
5. Enable **Realtime Database**.
6. Paste your Firebase config into `firebase-config.js`, replacing every `PASTE_...` placeholder. All seven fields are required — **`databaseURL` is easy to miss** because the Firebase console doesn't always show it in the same "Web app config" snippet as the others; find it at the top of Realtime Database → Data. If it's missing, the app will get stuck on "Firebase setup required" even though everything else looks filled in.

Keep the format like this:

```js
window.HHA_CONFIG = {
  eventId: "happy-hour-main",
  hostPasswordHash: "...",
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

### 1b. Change the host password before your event

The default password is `password123`, and its hash is checked into this repo in plain sight — anyone who finds this template on GitHub already knows it. That's fine for hiding the host dock from casual players, but you should still set your own before a real event. Generate a new hash by running this in any browser's console (or in this app's console, once deployed):

```js
crypto.subtle.digest("SHA-256", new TextEncoder().encode("your-new-password"))
  .then(buf => console.log(Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("")));
```

Paste the printed hash into `hostPasswordHash` in `firebase-config.js`.

> **What this password does and doesn't protect:** it hides the host controls from the UI for casual participants. It is **not** a real access boundary — the Realtime Database rules below allow open read/write to the whole event path, so anyone who opens browser devtools and talks to the Firebase SDK or REST API directly can write to the event without ever entering the password. That's an acceptable tradeoff for a low-stakes internal happy hour with no real accounts; it is not appropriate for anything where score/data integrity actually matters. Don't deploy this as-is for anything higher-stakes without adding real Firebase Authentication and rules that check it.

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

Note: GitHub Pages on the free tier requires a public repo. Don't commit a filled-in `firebase-config.js` with real credentials for one event into a repo you plan to reuse or share as a template for others — reset it to placeholders (as shipped) between events.

## 4. Test

Open the GitHub Pages link in two browser windows:

1. Window 1: Add a player name and team.
2. Window 2: Add another player.
3. Click **Host**, enter your host password, and start Majority Rules.
4. Submit answers from both windows.
5. Confirm the reveal and scoreboard update live, and that the header's connection pill shows "● Live" in both windows.

If a player joined the wrong team, or someone needs to be removed (joke names, accidental duplicate joins), the host dock has a **Players** panel to reassign or remove anyone without asking them to rejoin.

## Design notes

The design follows a structured dashboard approach while staying simple for a happy hour: clear header, dominant current task, persistent scoreboard, progressive disclosure, strong status states, and minimal actions for players.

The theme uses TRANZACT navy, white, gray, and blue tokens with restrained motion and accessible focus states.
