# This or That

A live "this or that" party game. One person hosts, everyone else joins with a
4-letter code, and the group answers a round of either/or questions together —
each with a 30 second timer, a live percentage tally, and a final recap table.

## How it works

- **Host**: enters a name, clicks "Host a Game", gets a 4-letter code, shares it.
- **Players**: enter the code + a name to join the lobby.
- **Host** clicks "Start Game" once everyone's in.
- Each question is open for 30 seconds, or until everyone has answered — whichever
  comes first — then a percentage tally is shown for a few seconds before moving on.
- After the last question, everyone sees a recap: every question, both answers,
  and the final percentage split for each.

The host's browser tab drives the shared timer/phase transitions (via Firebase
Realtime Database), so keep the host tab open until the game finishes. Game
state, not the questions themselves, lives in Firebase — the question list is
bundled into the app (`src/questions.ts`), so edit that file to change or add
questions.

## One-time Firebase setup (required before this will work)

This repo already has the Firebase project's client config wired in
(`src/firebase.ts`), but two things need to be turned on in the Firebase
console for project **happy-hour-arcade** — I don't have credentials to do
this for you:

1. **Enable Anonymous Authentication**: Firebase console → Build →
   Authentication → Sign-in method → enable "Anonymous". The app silently
   signs each visitor in anonymously so the database rules below can require
   `auth != null` instead of being wide open to the internet.
2. **Publish the database rules**: Firebase console → Build → Realtime
   Database → Rules → paste in the contents of [`database.rules.json`](database.rules.json)
   → Publish.

Without step 1, sign-in will fail and nothing will read/write. Without step 2,
the database's default rules (locked down) will reject every read/write.

## Local development

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds the app with Vite and
publishes `dist/` to GitHub Pages on every push to `main`. In the repo's
Settings → Pages, set the source to "GitHub Actions" (one-time setup).
