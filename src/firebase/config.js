import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiVlCLeQf-iDM-NO5NI7KHWKiGvQbIKWM",
  authDomain: "lalaindex-c561b.firebaseapp.com",
  projectId: "lalaindex-c561b",
  storageBucket: "lalaindex-c561b.firebasestorage.app",
  messagingSenderId: "172749117063",
  appId: "1:172749117063:web:b0b53c490ca9dd3ca48a22",
  measurementId: "G-MMFFSNP6M8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);