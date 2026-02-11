import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBuMG2UPPluKaw_7m2resHa9yYcCAsc5o0",
  authDomain: "restaurante-452a3.firebaseapp.com",
  databaseURL: "https://restaurante-452a3-default-rtdb.firebaseio.com",
  projectId: "restaurante-452a3",
  storageBucket: "restaurante-452a3.firebasestorage.app",
  messagingSenderId: "1046112281296",
  appId: "1:1046112281296:web:c94ba2c656add96aac34d5",
  measurementId: "G-HWZF6DH15C"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
