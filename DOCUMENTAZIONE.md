# Relazione Tecnica Integrale: Progetto GeoQuiz
**Manuale di Architettura, Sviluppo e Funzionamento Software**

---

## 1. Architettura del Sistema
Il progetto GeoQuiz è una **Single Page Application (SPA)** basata su **Vue.js 3** e **Vuetify 3**, con un backend serverless appoggiato su **Firebase Firestore**. 

---

## 2. Analisi Dettagliata del Modulo "GameView.vue"
In questa sezione analizziamo ogni singola funzione che governa la logica di gioco.

### 2.1 Gestione del Tempo e Eventi Temporali
*   **`startTimer()`**: 
    - *Logica*: Utilizza `setInterval` per decrementare la variabile reattiva `timer` ogni 1000ms.
    - *Controllo*: Include una clausola di salvaguardia: se `selectedOption.value` non è null (ovvero l'utente ha risposto), il timer si sospende logicamente. 
    - *Sicurezza*: In caso di scadenza (timer = 0), invoca `handleTimeout()`.
*   **`handleTimeout()`**: 
    - *Scopo*: Gestisce l'assenza di risposta. 
    - *Flusso*: Imposta la risposta come errata, incrementa il contatore dei round e, dopo 2 secondi di pausa per permettere all'utente di rendersene conto, passa al round successivo o alla fine del gioco.

### 2.2 Configurazione Sessione
*   **`selectMode(m)`**: 
    - Riceve un intero (0, 1 o 2) che mappa la categoria (Mondo, Cibo, Europa). Aggiorna lo stato della macchina a stati portando l'utente alla scelta della difficoltà.
*   **`selectDifficulty(d)`**: 
    - Inizializza i contatori (`score = 0`, `answers = 0`) e pulisce l'array `alreadyUsedCountrys` per garantire che ogni partita sia fresca. Invoca quindi il primo round.

### 2.3 Il Game Loop (Round e Risposte)
*   **`startNewRound()`**: 
    - È una funzione **async** (asincrona). 
    - *Wikipedia*: Attende la risposta delle API tramite `getCountryInfo`.
    - *Opzioni*: Genera un array di 4 risposte univoche.
    - *Shuffle*: Utilizza l'algoritmo Fisher-Yates per mescolare le risposte in modo che la posizione della corretta sia imprevedibile.
*   **`checkAnswer(selected)`**: 
    - Esegue il `clearInterval` immediato per bloccare il tempo.
    - Implementa un "Lock Logico": se l'utente ha già cliccato, la funzione non fa nulla.
    - Gestisce il feedback visivo impostando colori e icone in base alla correttezza.
    - *Transizione*: Utilizza un `setTimeout` di 2000ms per creare una pausa narrativa tra una domanda e l'altra.

### 2.4 Persistenza e Navigazione
*   **`updateHighScore()`**: 
    - Esegue un fetch da Firestore per leggere il record attuale.
    - Effettua una comparazione: se `score attuale > highScore storico`, procede con `updateDoc`.
*   **`goHome()`**: 
    - Pulisce i timer attivi per evitare memory leak e utilizza `router.push('/')` per cambiare vista.

---

## 3. Analisi dei File JavaScript di Supporto

### 3.1 `script.js`: Logica Algoritmica
*   **`getCountryInfo`**: Utilizza **Espressioni Regolari (Regex)** per cercare il nome del paese nel testo estratto da Wikipedia e sostituirlo con `***`.
*   **`shuffleArray`**: Implementazione rigorosa dell'algoritmo di rimescolamento.

### 3.2 `firebase.js`: Configurazione Cloud
*   Inizializza la connessione con Google Firebase e esporta l'istanza `db` per permettere l'accesso ai dati a tutti i componenti Vue.

---

## 4. Standard Tecnici e Responsiveness
*   **Vuetify Grid System**: Utilizzo di `v-row` e `v-col` con breakpoint dinamici.
*   **Glassmorphism**: Implementato via CSS in `style.css` tramite `backdrop-filter` per un'estetica moderna e leggibile.
*   **Reattività**: Uso di `ref` per il data-binding bidirezionale (`v-model`).

---

## 5. Guida per la Discussione d'Esame (Domande Tecniche)
1.  **Asincronia**: Spiegazione dell'uso di `async/await` per non bloccare il thread principale della UI.
2.  **Ciclo di Vita**: L'importanza di `onUnmounted` per la gestione corretta delle risorse (timer).
3.  **Data Binding**: Come `v-model` sincronizza input utente e stato interno.
4.  **NoSQL**: Perché Firestore è scalabile e come differisce dai DB a tabelle.

---
