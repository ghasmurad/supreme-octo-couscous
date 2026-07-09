/*
  Optional real-time mode.

  To let everyone join from separate devices, create a Firebase project,
  enable Realtime Database, then paste your web app config below.

  Leave this as null for local demo mode. Local demo mode works in one browser
  and is good for testing, but it does not sync across everyone’s devices.
*/
window.HHA_FIREBASE_CONFIG = null;

// Example shape:
// window.HHA_FIREBASE_CONFIG = {
//   apiKey: "...",
//   authDomain: "your-project.firebaseapp.com",
//   databaseURL: "https://your-project-default-rtdb.firebaseio.com",
//   projectId: "your-project",
//   storageBucket: "your-project.appspot.com",
//   messagingSenderId: "...",
//   appId: "..."
// };
