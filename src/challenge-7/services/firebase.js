import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWCaUHpI8_qzqhzWeAxLcSZ35WYBQwwec",
  authDomain: "challenge7-app.firebaseapp.com",
  projectId: "challenge7-app",
  storageBucket: "challenge7-app.firebasestorage.app",
  messagingSenderId: "22201719551",
  appId: "1:22201719551:web:609288194f4a9bde6e4aca",
  measurementId: "G-ZM9T128RKP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);