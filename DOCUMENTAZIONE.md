# Relazione Tecnica Finale: Progetto GeoQuiz
**Sviluppo di un'Applicazione Web Reattiva con Vue.js 3 e Vuetify**

---

## 1. Architettura del Sistema
L'applicazione GeoQuiz è basata su un'architettura **Single Page Application (SPA)** sviluppata con **Vue.js 3**. Utilizza la **Composition API** per garantire la massima modularità e riutilizzabilità del codice. La comunicazione con il backend è asincrona e si appoggia a **Firebase Firestore** per la persistenza dei dati e alle **Wikipedia REST API** per il reperimento dinamico dei contenuti.

---

## 2. Analisi Dettagliata dei Moduli (Viste)

### 2.1 Modulo di Autenticazione (`LoginView.vue`)
Il modulo gestisce l'accesso e la registrazione degli utenti tramite un sistema di identificazione univoco.
*   **Gestione dello Stato**: Utilizza variabili reattive (`ref`) collegate tramite **v-model** ai campi di input per catturare le credenziali in tempo reale.
*   **Funzione `handleLogin`**: Esegue una chiamata asincrona a Firestore tramite `getDoc`. Se il documento esiste, inizializza la sessione utente salvando l'identificativo nel `localStorage`.
*   **Funzione `handleRegister`**: Utilizza il metodo `setDoc` di Firebase per creare un nuovo record utente, garantendo l'integrità dei dati iniziali (punteggio settato a zero).
*   **Componenti UI**: Utilizza `v-text-field` con proprietà `variant="outlined"` e icone semantiche per migliorare la UX.

### 2.2 Dashboard Utente (`HomeView.vue`)
Funge da router centrale e punto di ingresso alle funzionalità di gioco.
*   **Logica di Sessione**: Recupera l'username dal `localStorage` per personalizzare l'esperienza. Implementa un meccanismo di protezione per cui, se l'utente non è loggato, viene reindirizzato alla pagina di accesso.
*   **Funzione `handleLogout`**: Esegue il `removeItem` dal storage locale e resetta lo stato del router, garantendo una chiusura sicura della sessione.
*   **Responsiveness**: Organizzata tramite `v-row` e `v-col` con gestione dei breakpoint (`sm`, `md`) per adattare i bottoni di navigazione a schermi di diverse dimensioni.

### 2.3 Motore di Gioco (`GameView.vue`)
È il modulo più denso di logica applicativa, che gestisce il ciclo di vita di una partita.
*   **Macchina a Stati**: Gestita tramite la variabile reattiva `state` che alterna i template tra selezione modalità, selezione difficoltà, fase quiz e game over tramite il componente `v-window`.
*   **Funzione `startTimer`**: Implementa un countdown di 15 secondi tramite `setInterval`. Gestisce correttamente la pulizia della memoria richiamando `clearInterval` nell'hook `onUnmounted`.
*   **Algoritmo `startNewRound`**:
    1.  Estrae un paese casuale dalla libreria `script.js`.
    2.  Verifica che non sia già stato usato nella sessione corrente per evitare ripetizioni.
    3.  Invia una richiesta asincrona alle API di Wikipedia per ottenere la curiosità associata.
    4.  Genera 4 opzioni di risposta e le mescola tramite l'algoritmo **Fisher-Yates**.
*   **Funzione `checkAnswer`**: Valida l'input dell'utente confrontandolo con il target. Implementa un feedback visivo istantaneo tramite le classi dinamiche di Vuetify (`color="success"` o `color="error"`).
*   **Integrazione Cloud (`updateHighScore`)**: Se il punteggio finale è superiore al record precedente salvato su Firebase, esegue un `updateDoc` atomico per aggiornare le statistiche globali dell'utente.

### 2.4 Classifica Globale (`LeaderboardView.vue`)
Visualizza i dati aggregati del database in tempo reale.
*   **Query Firestore**: All'attivazione (`onMounted`), esegue una query ordinata decrescente (`orderBy`) limitata ai primi 10 risultati (`limit`).
*   **Componente `v-table`**: Sfrutta le proprietà `fixed-header` e `hover` per una visualizzazione dei dati professionale e leggibile.
*   **Gestione Caricamento**: Utilizza `v-progress-circular` per gestire lo stato di attesa (loading) durante il fetch asincrono dei dati dal server.

### 2.5 Profilo Utente (`ProfileView.vue`)
Modulo dedicato alla visualizzazione delle statistiche personali.
*   **Integrazione Dati**: Interroga il documento specifico dell'utente su Firestore per recuperare il valore `highScore`.
*   **Visualizzazione**: Utilizza `v-avatar` per la componente estetica e `v-divider` per separare logicamente le informazioni.

### 2.6 Informazioni e Istruzioni (`AboutView.vue`)
Modulo statico-dinamico per il supporto all'utente.
*   **Struttura**: Utilizza `v-list` e `v-list-item` per presentare le regole del gioco in modo strutturato e accessibile.

---

## 3. Standard Tecnici e Requisiti Soddisfatti
*   **Reattività Avanzata**: Utilizzo sistematico di `ref` e `computed` per garantire un'interfaccia sempre sincronizzata con lo stato dei dati.
*   **Responsiveness**: Implementata tramite il sistema a griglia di Vuetify e stili CSS personalizzati (Glassmorphism) con `backdrop-filter: blur()`.
*   **Gestione API**: Le chiamate a Wikipedia sono isolate in un file di logica esterno (`script.js`) per favorire la manutenibilità.
*   **Persistenza NoSQL**: Utilizzo di Firebase Firestore con gestione degli accessi tramite documenti univoci.

---

## 4. Glossario Tecnico per l'Esame
*   **Fisher-Yates**: Algoritmo per la generazione di permutazioni casuali, usato per mescolare le risposte.
*   **Single Page Application (SPA)**: Applicazione web che carica un'unica pagina HTML e aggiorna il contenuto dinamicamente tramite JavaScript.
*   **v-model**: Direttiva Vue per il data-binding bidirezionale tra input e stato.
*   **Reattività**: Capacità del framework di aggiornare il DOM in risposta al cambiamento dei dati sottostanti.
*   **Breakpoint**: Punti di interruzione CSS che definiscono come il layout cambia in base alla larghezza dello schermo.

---
