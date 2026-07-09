/*
  Firebase config
  1) Create a Firebase project.
  2) Add a Web App.
  3) Enable Realtime Database.
  4) Paste your Firebase web config below — all five fields marked PASTE_ below
     are required. In particular, don't forget databaseURL: it's easy to miss
     when copying from the Firebase console because it's not always shown in
     the same "Web app config" snippet as the other fields (find it in
     Realtime Database > Data, at the top of the page).

  This app is intentionally single-event: no room screen, no room codes.
  Everyone who visits this GitHub Pages URL joins the same eventId below.

  IMPORTANT: change hostPasswordHash before your event — see README section 1b.
  Do not commit a real project's config into a shared/public template repo.
  Every deployment of this file should point at that event's own Firebase
  project, or different events will collide in the same database.
*/
window.HHA_CONFIG = {
  eventId: "happy-hour-main",
  hostPasswordHash: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", // default: password123 — CHANGE THIS
  firebase: {
    apiKey: "AIzaSyCm9OGrVLCH4ofH5gShc2wgPs_vRJBKa88",
    authDomain: "happy-hour-arcade.firebaseapp.com",
    databaseURL: "https://happy-hour-arcade-default-rtdb.firebaseio.com",
    projectId: "happy-hour-arcade",
    storageBucket: "happy-hour-arcade.firebasestorage.app",
    messagingSenderId: "804367537319",
    appId: "1:804367537319:web:fe0484d648642828bdf782"
  }
};
