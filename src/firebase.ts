import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCm9OGrVLCH4ofH5gShc2wgPs_vRJBKa88',
  authDomain: 'happy-hour-arcade.firebaseapp.com',
  databaseURL: 'https://happy-hour-arcade-default-rtdb.firebaseio.com',
  projectId: 'happy-hour-arcade',
  storageBucket: 'happy-hour-arcade.firebasestorage.app',
  messagingSenderId: '804367537319',
  appId: '1:804367537319:web:fe0484d648642828bdf782',
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

let readyResolve: () => void;
export const authReady = new Promise<void>((resolve) => {
  readyResolve = resolve;
});

onAuthStateChanged(auth, (user) => {
  if (user) readyResolve();
});

signInAnonymously(auth).catch((err) => {
  console.error('Anonymous sign-in failed', err);
});
