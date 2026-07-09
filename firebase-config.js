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
    apiKey: "AIzaSyCm9OGrVLCH4ofH5gShc2wgPs_vRJBKa88",
    authDomain: "happy-hour-arcade.firebaseapp.com",
    databaseURL: "https://
happy-hour-arcade-default-rtdb.firebaseio.com",
    projectId: "happy-hour-arcade",
    storageBucket: "happy-hour-arcade.firebasestorage.app",
    messagingSenderId: "804367537319",
    appId: "1:804367537319:web:fe0484d648642828bdf782"
  }
};
