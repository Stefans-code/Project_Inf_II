// Importa le funzioni necessarie dall'SDK di Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// La configurazione del tuo progetto Firebase (Recuperata dallo screenshot)
const firebaseConfig = {
  apiKey: "AIzaSyB7uobcwkddALN0mK4ByQKBWyLM8DCoILI",
  authDomain: "geoquiz-progetto.firebaseapp.com",
  projectId: "geoquiz-progetto",
  storageBucket: "geoquiz-progetto.firebasestorage.app",
  messagingSenderId: "625641051864",
  appId: "1:625641051864:web:c866cae365d996fc74e9ad",
  measurementId: "G-75HK96256V"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Esporta i servizi per usarli nelle pagine
export const auth = getAuth(app);
export const db = getFirestore(app);
