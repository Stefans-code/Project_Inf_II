# GeoQuiz: Relazione Tecnica Integrale e Analisi del Software
**Progetto d'Esame - Informatica ed Elementi di Programmazione II**

---

## 1. Analisi dell'Architettura e dei Requisiti
Il progetto è stato concepito come una **Single Page Application (SPA)** moderna, focalizzata sulla reattività e sull'integrazione fluida tra dati cloud e interfacce dinamiche.

### 1.1 Rispetto delle Specifiche
Tutti i requisiti minimi e opzionali richiesti per il corso sono stati implementati:
*   **Front-end**: Sviluppato con standard HTML5, CSS3 e JavaScript (ES6+).
*   **Framework**: Utilizzo di **Vue.js 3** con la **Composition API**. Questa scelta permette una gestione dello stato più pulita rispetto alla Options API, separando logicamente i dati dalle funzioni.
*   **Framework UI**: Integrazione di **Vuetify 3**. Abbiamo sfruttato il sistema di componenti "pre-styled" per garantire accessibilità e coerenza visiva.
*   **Dati dal Server**: Utilizzo delle **REST API di Wikipedia**. Le chiamate sono gestite tramite il protocollo `fetch`, permettendo il caricamento asincrono dei contenuti senza ricaricare la pagina.
*   **Responsiveness**: Il sito è "mobile-first". Grazie alla griglia di Vuetify (V-Grid), il layout si riorganizza dinamicamente passando da una visualizzazione a più colonne su PC a una singola colonna su smartphone.
*   **Database (Cloud)**: Utilizzo di **Firebase Firestore**. È stato implementato un sistema di lettura (per la classifica e il record personale) e scrittura (per la registrazione e l'aggiornamento dei punteggi).

---

## 2. Analisi dei File di Logica (JavaScript)

### 2.1 `main.js`: Il Motore d'Avvio
Questo file rappresenta l'Entry Point dell'applicazione. La sua funzione principale è creare l'istanza globale di Vue.
*   **Inizializzazione**: Importa il componente radice `App.vue` e lo collega al DOM (Document Object Model).
*   **Middleware**: "Inietta" nel sistema il **Vue Router** per la navigazione e **Vuetify** per lo stile. Senza questa configurazione, i componenti specifici nelle viste non verrebbero riconosciuti dal browser.
*   **Asset**: Carica i font delle icone Material Design per garantire che tutti i simboli grafici siano renderizzati correttamente.

### 2.2 `firebase.js`: Il Ponte verso il Cloud
Configura la comunicazione con i server di Google.
*   **Sicurezza e Connessione**: Contiene l'oggetto di configurazione (chiavi API, ID progetto) necessario per autenticare l'app presso i server Firebase.
*   **Oggetto `db`**: Inizializza Firestore e lo esporta. Questo permette di avere un unico punto di connessione al database, ottimizzando le prestazioni e rendendo il codice più facile da mantenere.

### 2.3 `script.js`: La Logica di Business
In questo file risiedono le funzioni "pure" che gestiscono i dati del gioco indipendentemente dall'interfaccia grafica.
*   **`getCountries(mode)`**: Una struttura dati (array) che mappa i paesi disponibili. Divide logicamente le nazioni per area geografica o tematica.
*   **`getCountryInfo(country, mode)`**: 
    - Gestisce la chiamata HTTP a Wikipedia.
    - Implementa una logica di **Sanitizzazione del Testo**: usa una combinazione di `.replace()` e **Regex (Espressioni Regolari)** per trovare il nome del paese nel testo e censurarlo con `***`. Questo è fondamentale per non svelare la risposta nell'indizio.
*   **`shuffleArray(array)`**: Implementazione dell'algoritmo di **Fisher-Yates**. A differenza di metodi più semplici, questo algoritmo garantisce una distribuzione statistica perfetta, rimescolando gli elementi in modo che ogni combinazione sia equiprobabile.

---

## 3. Analisi Approfondita delle Viste (Componenti Vue)

### 3.1 `LoginView.vue`: Gestione Identità
Questa pagina non è solo un form, ma il modulo che gestisce lo stato di autenticazione locale.
*   **Binding Bidirezionale**: Utilizza la direttiva `v-model` per sincronizzare istantaneamente quello che l'utente scrive con lo stato interno di Vue.
*   **Persistenza Locale**: Una volta che Firestore conferma l'esistenza dell'utente, viene utilizzato il `localStorage` del browser. Questo permette all'utente di rimanere loggato anche se chiude la scheda del browser, un concetto chiave della moderna UX web.

### 3.2 `HomeView.vue`: Navigazione Adattiva
Gestisce l'indirizzamento dell'utente verso le varie sezioni.
*   **Routing**: Utilizza il componente `v-btn` con la prop `to`, che si integra con Vue Router per cambiare la vista senza ricaricare la pagina, mantenendo lo stato dell'app fluido.
*   **Gestione Sessione**: Controlla la presenza dell'username e fornisce la funzione di `handleLogout` per ripulire i dati di sessione.

### 3.3 `GameView.vue`: Il Game Loop e la Macchina a Stati
È il file più complesso. Gestisce un flusso di gioco diviso in fasi.
*   **Stato Reattivo**: Utilizza una variabile `state` per decidere quale parte del template visualizzare (Selezione, Quiz, o Risultati). Questo evita di avere pagine separate, rendendo tutto più veloce.
*   **Gestione del Tempo (Timer)**: Utilizza `setInterval` per il countdown. È programmato per fermarsi se l'utente risponde o se la pagina viene chiusa (`onUnmounted`), prevenendo sprechi di risorse computazionali.
*   **Logica del Quiz**: Dopo ogni risposta, la funzione `checkAnswer` blocca ulteriori input, mostra il feedback (success/error) e attende 2 secondi prima di passare al round successivo, dando all'utente il tempo di capire se ha indovinato.

### 3.4 `LeaderboardView.vue`: Gestione dei Dati Aggregati
Dimostra la capacità di gestire set di dati provenienti dal server.
*   **Query Ottimizzate**: Non scarica tutti gli utenti, ma chiede a Firestore solo i primi 10 (`limit`) ordinati per punteggio (`orderBy`). Questo riduce il traffico dati e velocizza il caricamento.
*   **Visualizzazione Dinamica**: Usa `v-for` per generare le righe della tabella partendo dall'array di dati ricevuto, dimostrando la potenza del rendering dichiarativo di Vue.

---

## 4. Design System e Stile Unificato (`style.css`)
Abbiamo creato un'estetica coerente e professionale separando completamente lo stile.
*   **Glassmorphism**: Tecnica che simula il vetro smerigliato. Ottenuta con `backdrop-filter: blur(16px)` e `background-color: rgba(...)`. Questo garantisce contrasto e leggibilità sopra la mappa del mondo.
*   **Adaptive Container**: Il contenitore principale (`.v-container`) calcola l'altezza disponibile (`min-height: calc(100vh - 120px)`) per assicurarsi che il footer non copra mai i pulsanti di gioco.
*   **Global Overrides**: Abbiamo forzato la trasparenza di Vuetify (`background: transparent !important`) per permettere allo sfondo personalizzato di essere visibile in tutta l'applicazione.

---

## 5. Domande Tecniche Avanzate per l'Esame

**1. Come viene gestita l'asincronia nel progetto?**
Usiamo il pattern `async/await`. Quando chiediamo dati a Wikipedia o Firebase, il codice "attende" la risposta senza bloccare il resto del browser. Questo garantisce che l'interfaccia non si "congeli" durante i caricamenti.

**2. Cos'è la Composition API e perché è meglio della Options API?**
La Composition API permette di raggruppare il codice per "funzionalità" invece che per "tipo di dato". È più simile alla programmazione JavaScript standard e rende il codice molto più facile da testare e riutilizzare.

**3. Come garantite l'accessibilità (Accessibility)?**
Usiamo i componenti Vuetify che seguono le specifiche WAI-ARIA. Inoltre, abbiamo scelto una palette di colori ad alto contrasto (blu scuro su bianco/vetro) per assicurarci che anche persone con difficoltà visive possano leggere il testo.

**4. Perché avete implementato Fisher-Yates invece di un semplice sort casuale?**
Il metodo `array.sort(() => Math.random() - 0.5)` non è veramente casuale (ha dei bias). Fisher-Yates è lo standard informatico per il rimescolamento equo (unbiased shuffle), dimostrando un approccio più rigoroso all'algoritmica.

---
