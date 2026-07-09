# Happy Hour Lite

A simplified one-event virtual happy hour game app.

## Flow

1. Add your name
2. Pick a team
3. Host starts games in order

No room codes, no info cards, no setup flow for players.

## Host

Click **Host** and enter:

`password123`

The host can start games, advance rounds, reveal results, and adjust scores.

## Live multi-device mode

GitHub Pages is static, so live answers across different devices need Firebase Realtime Database.

1. Create a Firebase project
2. Enable Realtime Database
3. Set temporary rules for the event:

```json
{
  "rules": {
    "happyHourLiteSingleEvent": {
      ".read": true,
      ".write": true
    }
  }
}
```

4. Paste your Firebase Web App config into `firebase-config.js`
5. Upload all files to GitHub Pages

If `firebase-config.js` is left as `null`, the app runs in local demo mode in one browser.

## Files

- `index.html`
- `app.js`
- `firebase-config.js`
- `README.md`
