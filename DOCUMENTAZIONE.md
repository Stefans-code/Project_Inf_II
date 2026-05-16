# 🌍 GeoQuiz - Documentazione Tecnica e Funzionale
**Progetto per l'esame di Informatica II**

---

## 📖 1. Introduzione (Per i non esperti)
GeoQuiz è un gioco educativo interattivo. L'obiettivo è indovinare il paese corretto partendo da una curiosità o un fatto storico/culturale recuperato in tempo reale da **Wikipedia**. 

**Come funziona in parole semplici?**
1.  **L'Ingresso**: Ti registri con un nome utente.
2.  **La Scelta**: Decidi se giocare con tutto il mondo o solo con l'Europa.
3.  **La Sfida**: Leggi un indizio (dove il nome del paese è nascosto da degli asterischi `***`) e hai 15 secondi per rispondere.
4.  **Il Record**: Se fai un buon punteggio, il sito lo salva "nella nuvola".

---

## 🛠️ 2. Architettura Tecnica (Per l'Esame)
Il progetto segue il pattern **MVVM** (Model-View-ViewModel) fornito da **Vue.js 3**.

### Stack Tecnologico:
- **Framework**: Vue.js 3 (Composition API).
- **Interfaccia**: **Vuetify 3** (Material Design).
- **Database**: **Firebase Firestore** (Database NoSQL cloud).
- **API**: Wikipedia REST API.

---

## 📂 3. Mappatura Dettagliata delle Funzioni (Analisi del Codice)

### 🔑 LoginView.vue
- **`handleLogin()`**: 
    - *Cosa fa*: Recupera il documento utente da Firestore usando `getDoc(doc(db, "utenti", username))`.
    - *Perché*: Dimostra la capacità di interrogare un database asincrono e gestire la persistenza locale con `localStorage`.
- **`handleRegister()`**: 
    - *Cosa fa*: Usa `setDoc` per creare un nuovo profilo con `highScore: 0`.
    - *Perché*: Gestione della scrittura dei dati sul cloud.

### 🏠 HomeView.vue
- **`handleLogout()`**: 
    - *Cosa fa*: Pulisce il `localStorage` e reindirizza al login.
    - *Perché*: Gestione del ciclo di vita della sessione utente.

### 🎮 GameView.vue (Il Motore del Gioco)
- **`startTimer()`**: 
    - *Cosa fa*: Usa `setInterval` per diminuire il valore reattivo `timer`. 
    - *Nota*: Fondamentale spiegare il `clearInterval` in `onUnmounted` per evitare memory leak.
- **`startNewRound()`**: 
    - *Cosa fa*: Chiama `getCountryInfo()` (API Wikipedia), genera 4 opzioni e usa `shuffleArray` (Fisher-Yates) per mescolarle.
- **`checkAnswer(selected)`**: 
    - *Cosa fa*: Confronta la scelta con `currentAnswer`. Applica un "lock" (`selectedOption !== null`) per impedire risposte multiple.
- **`updateHighScore()`**: 
    - *Cosa fa*: Esegue una transazione logica (Legge il record vecchio -> Compara -> Aggiorna con `updateDoc` solo se il nuovo è maggiore).

---

## 🧩 4. Algoritmi e Logica Avanzata
- **Fisher-Yates Shuffle**: Implementato in `script.js` per garantire che ogni posizione della risposta corretta sia statisticamente equiprobabile (evita il bias del `Math.random() - 0.5`).
- **Sanitizzazione Wikipedia**: Usiamo **Espressioni Regolari (Regex)** per rimuovere il nome del paese dal testo della curiosità, sostituendolo con `***`, e per pulire i tag HTML sporchi restituiti dall'API.

---

## 🎨 5. Design System: Vuetify & Glassmorphism
- **Layout Adattivo**: Usiamo la griglia di Vuetify (`v-row`, `v-col`) che cambia `cols` in base al breakpoint dello schermo.
- **CSS Avanzato**: `backdrop-filter: blur(16px)` per l'effetto vetro e `overflow: hidden` sul body per bloccare lo scroll globale, simulando un'applicazione nativa.

---

## ❓ 6. Domande d'Esame "Tranello"

**D: Come comunicano le pagine tra loro?**
*R: Usiamo il **Vue Router** per la navigazione e il **localStorage** per passare l'informazione sull'utente loggato senza doverla ri-chiedere al database ogni volta.*

**D: Cos'è la Reattività in Vue 3?**
*R: È il sistema che, grazie ai `Proxy` di JavaScript, intercetta il cambiamento di una variabile (es. `score.value++`) e aggiorna automaticamente solo la parte di HTML che la visualizza, senza ricaricare la pagina.*

**D: Perché Firebase e non un database SQL tradizionale?**
*R: Per la velocità di prototipazione e la gestione nativa dei dati in formato JSON, che si sposa perfettamente con le applicazioni moderne in JavaScript.*

---
