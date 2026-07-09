/*
  Firebase config
  1) Create a Firebase project.
  2) Add a Web App.
  3) Enable Realtime Database.
  4) Paste your Firebase web config below.

  This app is intentionally single-event: no room screen, no room codes.
  Everyone who visits this GitHub Pages URL joins the same eventId below.
*/
window.HHA_CONFIG = {
  eventId: "happy-hour-main",
  hostPasswordHash: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", // password123
  firebase: {
    apiKey: "PASTE_API_KEY_HERE",
    authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://PASTE_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "PASTE_PROJECT_ID",
    storageBucket: "PASTE_PROJECT_ID.appspot.com",
    messagingSenderId: "PASTE_SENDER_ID",
    appId: "PASTE_APP_ID"
  }
};
