# Relazione Tecnica Finale: Progetto GeoQuiz
**Sviluppo di un'Applicazione Web Reattiva con Vue.js 3 e Vuetify**

---

## 1. Architettura del Sistema
L'applicazione GeoQuiz è basata su un'architettura **Single Page Application (SPA)** sviluppata con **Vue.js 3**. Utilizza la **Composition API** per garantire la massima modularità e riutilizzabilità del codice. La comunicazione con il backend è asincrona e si appoggia a **Firebase Firestore** per la persistenza dei dati e alle **Wikipedia REST API** per il reperimento dinamico dei contenuti.

---

## 2. Analisi dei Moduli Logici (File JavaScript)

### 2.1 Inizializzazione (`main.js`)
È il punto di ingresso (Entry Point) dell'intera applicazione.
*   **Mounting**: Crea l'istanza dell'app Vue e la "monta" sul tag `#app` del file HTML principale.
*   **Integrazione Framework**: Qui vengono importati e configurati **Vuetify** (per l'interfaccia) e il **Router** (per la navigazione).
*   **Iconset**: Configura il set di icone *Material Design Icons (MDI)*, essenziale per la visualizzazione dei simboli in tutta l'app.

### 2.2 Servizi Cloud (`firebase.js`)
Gestisce la connessione con i servizi backend di Google.
*   **Configurazione**: Contiene le chiavi API e le impostazioni del progetto Firebase.
*   **Inizializzazione Firestore**: Esporta l'oggetto `db`, che permette a tutte le pagine del sito di leggere e scrivere dati nel database NoSQL in modo centralizzato.

### 2.3 Logica di Business (`script.js`)
Contiene le funzioni core di utilità che non dipendono direttamente dall'interfaccia.
*   **`getCountries(mode)`**: Restituisce la lista dei paesi in base alla modalità scelta (Mondo o Europa).
*   **`getCountryInfo(country, mode)`**: 
    - Esegue il fetch verso l'API di Wikipedia.
    - Implementa una **Regex (Espressione Regolare)** avanzata per pulire il testo e censurare il nome del paese, garantendo che l'indizio non contenga la soluzione.
*   **`shuffleArray(array)`**: Implementazione dell'algoritmo **Fisher-Yates**. È una funzione "pura" che prende un array e ne restituisce una versione mescolata in modo imparziale.

---

## 3. Analisi Dettagliata delle Viste (Componenti Vue)

### 3.1 Modulo di Autenticazione (`LoginView.vue`)
*   **Logica**: Usa `v-model` per il binding dei dati e `handleLogin`/`handleRegister` per l'interazione con Firestore.
*   **Sicurezza**: Verifica l'esistenza dei documenti sul DB prima di procedere.

### 3.2 Motore di Gioco (`GameView.vue`)
*   **Ciclo di Vita**: Gestisce il timer con `setInterval` e la pulizia della memoria con `onUnmounted`.
*   **Interazione**: Utilizza `v-window` per gestire le transizioni tra le fasi di gioco (selezione, quiz, risultati).
*   **Persistence**: Registra il record dell'utente su Firebase tramite `updateHighScore`.

### 3.3 Dashboard e Classifica (`HomeView.vue` / `LeaderboardView.vue`)
*   **Home**: Gestisce la sessione tramite `localStorage`.
*   **Leaderboard**: Utilizza query Firestore ordinate (`orderBy`, `limit`) per mostrare i top player mondiali.

---

## 4. Requisiti Tecnici e Standard
*   **Responsiveness**: Ottenuta tramite il sistema a griglia di Vuetify e media queries in `style.css`.
*   **Separation of Concerns**: Logica (JS), Stile (CSS) e Interfaccia (Vue) sono mantenuti in file separati per una migliore manutenibilità.
*   **Accessibilità**: Utilizzo di tag semantici e icone ARIA-compliant.

---

## 5. Glossario per l'Esame
*   **Fisher-Yates**: Algoritmo per rimescolare array in modo equo.
*   **Reattività**: Sistema di Vue che aggiorna il DOM quando cambiano i dati.
*   **NoSQL**: Database non relazionale (come Firestore) che salva dati in formato simile a JSON.
*   **Entry Point**: Il file principale da cui parte l'esecuzione (main.js).

---
