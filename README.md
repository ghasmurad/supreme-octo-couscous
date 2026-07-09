# Happy Hour Arcade

A GitHub Pages-ready virtual happy hour game room with player, host, and shared-display modes.

## What is included

### V1 MVP
- Join room
- Add your name and avatar
- Select a team
- Host dashboard
- Shared display mode for screen-sharing
- Live scoreboard
- Majority Rules
- Team Trivia
- Guess the Emoji

### V2 additions
- Fun intro cards
- Randomized intro order
- 45-second intro timer
- Team Superlatives
- Final Bonus: “Who Said That?” using submitted intro facts
- Confetti
- Sound toggle
- Team name editing
- Manual score override

## Files

- `index.html` — main app
- `style.css` — visual styling
- `app.js` — game logic
- `firebase-config.js` — optional real-time config

## GitHub Pages setup

1. Create a new GitHub repository.
2. Upload all four files into the root of the repository.
3. Go to **Settings → Pages**.
4. Set source to **Deploy from a branch**.
5. Select branch `main` and folder `/root`.
6. Save.

Your site will publish at something like:

`https://YOUR-USERNAME.github.io/YOUR-REPO/`

## Real-time multiplayer setup

GitHub Pages is static, so it cannot sync answers across 18 separate devices by itself. To make this fully live, use Firebase Realtime Database.

### Firebase steps

1. Go to Firebase Console.
2. Create a project.
3. Add a Web App.
4. Copy the Firebase config object.
5. Enable **Realtime Database**.
6. Paste your config into `firebase-config.js` by replacing:

```js
window.HHA_FIREBASE_CONFIG = null;
```

with your real config object.

### Temporary event rules

For a one-off internal happy hour, you can use permissive temporary rules during the event:

```json
{
  "rules": {
    "rooms": {
      "$room": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

After the event, lock the rules back down or delete the Firebase project/database.

## How to run the event

1. Open the site.
2. Click **Create New Room**.
3. Enter host password: `password123`.
4. Copy the **Player Link** and send it to everyone.
5. Open the **Display Link** and screen-share it.
6. Let everyone join, choose teams, and fill out intro cards.
7. Use the host dashboard to start games and score rounds.

## Important security note

The host password is client-side only. It hides the admin controls from casual participants, but it is not real authentication. For this internal happy hour use case, that is usually fine. Do not use this for sensitive data.
