# Relazione Tecnica Integrale: Progetto GeoQuiz
**Manuale di Architettura, Sviluppo e Funzionamento Software**
**Corso di Informatica ed Elementi di Programmazione II**

---

## 1. Visione d'Insieme e Obiettivi Pedagogici
GeoQuiz non è solo un videogioco, ma un ecosistema software progettato per dimostrare la padronanza delle tecnologie web moderne. Il progetto integra la reattività dei framework front-end (Vue.js), la potenza dei sistemi cloud (Firebase) e l'interoperabilità con servizi di terze parti (Wikipedia REST API). 

### 1.1 Rispetto Rigoroso dei Requisiti d'Esame
Ogni riga di codice è stata scritta per soddisfare i criteri del bando:
*   **HTML5/JS/CSS**: Fondamenta solide su cui poggia il framework.
*   **Vue.js 3 (Composition API)**: Utilizzato per la gestione granulare della reattività.
*   **Vuetify 3**: Scelto per implementare il Material Design 3 e garantire la responsiveness senza scrivere migliaia di righe di CSS manuale (scelta consigliata dal corso).
*   **Dati da API**: Wikipedia è la nostra fonte dinamica di conoscenza.
*   **Database Cloud**: Firestore garantisce persistenza e scalabilità dei record.
*   **Schermate**: 6 viste distinte e funzionali.
*   **Accessibilità**: Contrasti cromatici elevati e componenti semantici.

---

## 2. Analisi dei Moduli di Sistema (JavaScript)

### 2.1 `main.js`: Il Cervello Centrale
Questo file è l'entry-point che orchestra l'avvio dell'applicazione.
*   **Creazione Istanza**: Tramite `createApp(App)` inizializziamo il nodo radice.
*   **Configurazione Vuetify**: È qui che definiamo le icone (`mdi`) e i set di componenti. Senza questo passaggio, i tag `v-app`, `v-card`, ecc., sarebbero ignorati dal browser.
*   **Routing**: `app.use(router)` attiva il meccanismo che permette di cambiare pagina in meno di un secondo senza ricaricare il sito.

### 2.2 `firebase.js`: L'Infrastruttura Dati
Gestisce la comunicazione criptata con i server di Google.
*   **Firestore Initialization**: Esportiamo l'oggetto `db`. Questo oggetto è un'istanza del database NoSQL Firestore. A differenza di un database SQL (a tabelle), Firestore salva "Documenti" all'interno di "Collezioni" (JSON-like), rendendo l'accesso ai dati istantaneo.

### 2.3 `script.js`: Gli Algoritmi e le Utilità
È il file "puro" dove risiede la logica matematica e di rete.
*   **Gestione Paesi**: Contiene array costanti di nazioni. Questa scelta è preferibile a un database esterno per i nomi dei paesi per garantire che il gioco funzioni istantaneamente al caricamento.
*   **`getCountryInfo` (Wikipedia API)**: 
    - Esegue una chiamata `fetch` all'endpoint di Wikipedia.
    - **Algoritmo di Censura (Regex)**: Utilizza l'espressione regolare `new RegExp(escapedCountry, 'gi')`. `g` sta per globale (sostituisce tutte le occorrenze) e `i` sta per case-insensitive (non fa differenza tra maiuscole e minuscole). Questo assicura che il quiz sia equo e che la risposta non sia svelata nell'indizio.
*   **`shuffleArray` (Fisher-Yates)**: 
    - È il metodo più efficiente per mescolare un array. 
    - **Dettaglio tecnico**: Parte dalla fine dell'array, sceglie un indice casuale tra gli elementi rimanenti e scambia i valori. Questo garantisce una complessità temporale di O(n), rendendolo estremamente veloce anche su set di dati enormi.

---

## 3. Analisi Profonda dei Componenti (Viste Vue)

### 3.1 `LoginView.vue`: Autenticazione e Persistenza
*   **Stato Reattivo**: Le variabili `username` e `password` sono dichiarate come `ref('')`. Grazie a `v-model`, ogni carattere digitato dall'utente viene istantaneamente riflesso nella memoria di Vue.
*   **Logica di Controllo**: `handleLogin` esegue una ricerca nel database. Se trova una corrispondenza, utilizza `localStorage.setItem('username', value)` per "ricordare" l'utente. Questo evita che l'utente debba rifare il login ogni volta che aggiorna la pagina (concetto di Session Persistence).

### 3.2 `HomeView.vue`: Hub Dinamico
*   **Personalizzazione**: All'attivazione della pagina, recuperiamo l'username dal storage locale. Se non è presente, il sistema è programmato per mostrare "Guest" o reindirizzare al login.
*   **Interazione**: I pulsanti `v-btn` con la prop `to` (es. `to="/game"`) permettono una navigazione fluida e priva di lag, gestita dal sistema di routing interno.

### 3.3 `GameView.vue`: Il Motore di Gioco (Game Engine)
È il componente più denso di codice (oltre 400 righe) e gestisce la logica di stato.
*   **Macchina a Stati (Finite State Machine)**: La variabile `state` controlla il template. Passiamo da `mode_selection` (scelta tema) a `difficulty_selection` (scelta difficoltà), poi a `quiz` e infine a `game_over`.
*   **Gestione del Timer**: Utilizziamo l'hook `onUnmounted` per distruggere il timer quando l'utente lascia la pagina. Questo è un dettaglio tecnico fondamentale per evitare i **Memory Leak** (consumo inutile di memoria).
*   **Game Loop**: Ogni round consuma una "domanda". Al termine dei 5 round previsti, la funzione `checkAnswer` interrompe il loop e attiva la schermata dei risultati.
*   **Salvataggio Cloud**: `updateHighScore` non sovrascrive sempre il dato, ma esegue prima un controllo di confronto. Questo garantisce che il record sia effettivamente il "massimo punteggio" mai raggiunto.

### 3.4 `LeaderboardView.vue`: Elaborazione Dati Server-Side
*   **Query Firestore**: Utilizziamo le funzioni `query`, `orderBy` e `limit`. 
*   **Spiegazione Tecnica**: Firestore crea degli "Indici" sui campi ordinati. Questo permette di ottenere la classifica in pochi millisecondi anche se avessimo migliaia di utenti registrati.
*   **Visualizzazione**: La tabella è dinamica. Se un utente nuovo entra in classifica, questa si aggiorna automaticamente al caricamento successivo grazie alla query `getDocs`.

---

## 4. Design e Responsiveness (Il Sistema Visivo)

### 4.1 `style.css`: Il Design System
Abbiamo creato una separazione netta tra struttura (HTML) e stile (CSS).
*   **Glassmorphism (Vetro Smerigliato)**: Implementato tramite `backdrop-filter: blur(16px)`. Questo comando dice alla GPU del computer di sfocare lo sfondo dietro l'elemento, creando profondità.
*   **Gestione Sfondo**: Lo sfondo è applicato direttamente al tag `html` con `background-size: cover`. Questo assicura che la mappa del mondo sia sempre visibile, non importa quanto sia grande la finestra del browser.
*   **Layout Adattivo**: Abbiamo configurato il contenitore principale per avere un padding dinamico. Su schermi piccoli, i margini si riducono automaticamente per lasciare spazio al contenuto del gioco.

---

## 5. Manuale per la Presentazione Orale (Domande d'Esame)

**D: Come hai garantito che il sito non si blocchi durante i caricamenti?**
*R: Ho usato la programmazione asincrona (Async/Await). Quando l'app chiede dati a Wikipedia o Firebase, non blocca l'esecuzione del codice principale, permettendo all'utente di continuare a vedere le animazioni o il timer mentre i dati arrivano.*

**D: Cos'è Vuetify e perché è stato scelto rispetto al CSS manuale?**
*R: Vuetify è un framework di componenti che segue il Material Design. È stato scelto perché garantisce coerenza visiva, componenti pronti e già testati per l'accessibilità e la responsiveness, permettendoci di focalizzarci sulla logica del gioco invece che sul debug del layout.*

**D: Spiega l'importanza di `v-model` nel tuo progetto.**
*R: `v-model` è la colonna portante dell'interattività in Vue. Permette la "sincronizzazione bidirezionale": se l'utente scrive nell'input, la variabile nel codice cambia; se il codice cambia la variabile, l'input si aggiorna da solo. Lo usiamo per il login e per la gestione della difficoltà.*

**D: Come hai gestito la sicurezza del punteggio?**
*R: Anche se è un front-end, la logica di confronto del record avviene nel momento del salvataggio. Usiamo le funzioni di Firebase per assicurarci che solo l'utente loggato possa scrivere nel proprio documento specifico.*

---
