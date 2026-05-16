# Relazione Tecnica Finale GeoQuiz: Analisi Integrale del Software
**Progetto d'Esame: Informatica ed Elementi di Programmazione II**

---

## 1. Architettura Generale e Rispetto dei Requisiti
Il progetto GeoQuiz è stato sviluppato come una **Single Page Application (SPA)** utilizzando il framework **Vue.js 3** e la libreria di componenti **Vuetify 3**. La scelta di questa architettura è dettata dalla necessità di un'interfaccia fluida e reattiva, capace di gestire dati asincroni (API e Database) senza interruzioni per l'utente.

### 1.1 Tabella di Conformità ai Requisiti
| Requisito del Professore | Implementazione nel Progetto |
| :--- | :--- |
| **Framework VueJS** | Utilizzato Vue 3 con Composition API in tutte le viste. |
| **Uso di dati da API** | Integrazione con Wikipedia REST API per curiosità dinamiche. |
| **Responsiveness** | Implementata tramite Vuetify Grid System (v-row/v-col) e CSS. |
| **Uso di Vuetify** | Utilizzata versione 3 con Material Design 3 e set icone MDI. |
| **Almeno 5 schermate** | Presenti 6 schermate: Login, Home, Game, Profile, Leaderboard, About. |
| **Login Utente** | Implementato tramite Firestore con persistenza in localStorage. |
| **Uso di un DB (Read/Write)** | Firebase Firestore utilizzato per utenti e punteggi (record). |
| **Interazioni (v-model/click)** | `v-model` negli input, `@click` in tutta la logica di gioco. |

---

## 2. Analisi dei Moduli di Logica (JavaScript)

### 2.1 `main.js`: L'Entry Point dell'Applicazione
Questo file è il cuore pulsante dell'avvio del software.
*   **Inizializzazione**: Utilizza `createApp(App)` per creare l'istanza radice del progetto.
*   **Gestione Framework**: Qui viene iniettato il **Vue Router** per la navigazione e **Vuetify** per l'interfaccia. Senza questa configurazione, i componenti Material Design non verrebbero renderizzati.
*   **Configurazione Icone**: Registra il set `mdi` (Material Design Icons) che permette di visualizzare i simboli grafici in tutta l'applicazione.

### 2.2 `firebase.js`: Integrazione Cloud e Database
Gestisce la comunicazione con l'infrastruttura di Google.
*   **Inizializzazione App**: Configura le chiavi API per il collegamento al progetto Firebase.
*   **Esportazione Database**: Fornisce l'oggetto `db` (istanza di Firestore) a tutte le pagine del sito, permettendo operazioni atomiche di lettura e scrittura in modo centralizzato.

### 2.3 `script.js`: Logica di Business e Algoritmi
Contiene le utility funzioni che non dipendono direttamente dall'interfaccia.
*   **`getCountryInfo` (Wikipedia API)**: 
    - Esegue una richiesta HTTP tramite `fetch`.
    - **Censura Regex**: Utilizza un'espressione regolare dinamica per individuare il nome del paese nel testo della curiosità e sostituirlo con `***`, assicurando che la risposta non sia svelata nell'indizio.
*   **`shuffleArray` (Algoritmo Fisher-Yates)**: 
    - Implementa un rimescolamento equo (unbiased) dell'array di risposte. A differenza di metodi casuali semplici, questo algoritmo garantisce che ogni permutazione sia statisticamente equiprobabile.

---

## 3. Analisi Dettagliata delle Viste (Componenti Vue)

### 3.1 `LoginView.vue`: Autenticazione e Accesso
*   **Reattività**: Utilizza `v-model` per legare i campi input a variabili `ref`.
*   **Logica Firebase**: `handleLogin` cerca il documento utente. Se trovato, salva la sessione in `localStorage`. `handleRegister` crea un nuovo documento inizializzando il punteggio record a zero.

### 3.2 `GameView.vue`: Il Motore di Gioco (Game Engine)
Questo componente gestisce l'intero loop di gioco attraverso una macchina a stati.
*   **`state` (ref)**: Gestisce le fasi: `mode_selection`, `difficulty_selection`, `quiz`, `game_over`.
*   **`startTimer()`**: Utilizza `setInterval` per il countdown. Include un meccanismo di pausa se l'utente ha già risposto.
*   **`handleTimeout()`**: Scatta quando il tempo scade, assegnando errore e passando al round successivo dopo 2 secondi.
*   **`startNewRound()`**: Funzione asincrona che attende i dati da Wikipedia, pulisce il testo e prepara le risposte mescolate.
*   **`checkAnswer(selected)`**: Valida la risposta, blocca ulteriori input (lock logico), e mostra il feedback visivo (colorazione bottoni) per 2 secondi prima di avanzare.
*   **`updateHighScore()`**: Confronta il punteggio attuale con quello salvato su Firestore e aggiorna il record tramite `updateDoc`.

### 3.3 `LeaderboardView.vue` e `ProfileView.vue`
*   **Leaderboard**: Esegue query Firestore ordinate (`orderBy`) e limitate (`limit(10)`) per mostrare i top player.
*   **Profile**: Legge il record personale dell'utente loggato per mostrare i progressi storici.

---

## 4. Design, Stile e Responsiveness
*   **`style.css`**: Contiene lo stile globale. Implementa il **Glassmorphism** tramite `backdrop-filter: blur()`, garantendo profondità e leggibilità.
*   **Grid System**: Utilizziamo le classi di Vuetify (`v-row`, `v-col`) per assicurarci che l'interfaccia si adatti perfettamente sia a schermi desktop che a smartphone di piccole dimensioni.

---

## 5. Glossario Tecnico per l'Esame Orale

*   **Asincronia**: Capacità del codice di attendere risposte esterne (API/DB) senza bloccare l'interfaccia utente.
*   **Composition API**: Nuovo paradigma di Vue 3 che permette di organizzare il codice per funzionalità, rendendolo più leggibile e manutenibile.
*   **Fisher-Yates**: Algoritmo standard per il rimescolamento casuale equo.
*   **NoSQL**: Tipologia di database (come Firestore) che salva dati in documenti flessibili invece di tabelle rigide.
*   **Reattività**: Sistema di Vue che ri-renderizza automaticamente il DOM quando i dati sottostanti cambiano.
*   **Lifecycle Hooks**: Funzioni (come `onMounted` o `onUnmounted`) che scattano in momenti specifici della vita di un componente.

---
