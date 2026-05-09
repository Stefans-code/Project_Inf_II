// Importa le funzioni necessarie dall'SDK di Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// La configurazione del tuo progetto Firebase
// DEVI SOSTITUIRE QUESTI DATI con quelli che trovi nella console di Firebase!
const firebaseConfig = {
  apiKey: "IL_TUO_API_KEY",
  authDomain: "IL_TUO_AUTH_DOMAIN",
  projectId: "IL_TUO_PROJECT_ID",
  storageBucket: "IL_TUO_STORAGE_BUCKET",
  messagingSenderId: "IL_TUO_MESSAGING_SENDER_ID",
  appId: "IL_TUO_APP_ID"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Esporta i servizi per usarli nelle pagine
export const auth = getAuth(app);
export const db = getFirestore(app);
