# Documentazione Progetto GeoQuiz
**Corso di Informatica ed Elementi di Programmazione II**

---

## 1. Obiettivo del Progetto
Il progetto GeoQuiz è un'applicazione web interattiva che mette alla prova la conoscenza geografica dell'utente. Il sistema estrae una curiosità casuale da Wikipedia e chiede all'utente di indovinare a quale paese si riferisce. È stato progettato per essere moderno, veloce e utilizzabile sia da PC che da smartphone.

---

## 2. Guida Rapida all'Applicazione
Per chi non conosce l'informatica, ecco come si muove un utente nel sito:
1.  **Accesso**: L'utente inserisce un nome (Username). Se è la prima volta, si registra, altrimenti entra direttamente.
2.  **Menu**: Una volta dentro, può scegliere se giocare, guardare i propri record o vedere la classifica dei migliori giocatori.
3.  **Il Gioco**: Appare una curiosità su un paese (il nome del paese è nascosto da degli asterischi `***`). L'utente ha 4 opzioni e 15 secondi per rispondere.
4.  **Punteggio**: Ogni risposta corretta aumenta il punteggio. Alla fine di 5 round, se il punteggio è il migliore di sempre per quell'utente, viene salvato automaticamente.

---

## 3. Architettura e Tecnologie (Spiegazione Tecnica)
Abbiamo utilizzato strumenti moderni per garantire che il sito sia professionale e solido:

*   **Vue.js 3**: È il "cervello" del sito. Gestisce tutto quello che succede nella pagina senza doverla ricaricare ogni volta (Single Page Application).
*   **Vuetify 3**: È la nostra "scatola degli attrezzi" per l'estetica. Fornisce pulsanti, tabelle e schede già pronte seguendo le regole del Material Design (lo stile di Google).
*   **Firebase**: È il nostro "magazzino dati" online. Qui salviamo i nomi degli utenti e i loro punteggi record.
*   **API di Wikipedia**: È la nostra fonte di informazioni. Il sito "telefona" a Wikipedia per farsi dare una curiosità casuale ogni volta che inizia una domanda.

---

## 4. Analisi delle Pagine e delle Funzioni
Ecco cosa fa ogni singola funzione che abbiamo scritto nel codice:

### Pagina di Login (LoginView.vue)
*   **handleLogin**: Controlla se il nome inserito esiste nel database. Se esiste, ti fa entrare.
*   **handleRegister**: Crea un nuovo spazio nel database per un nuovo utente, partendo da zero punti.

### Pagina di Gioco (GameView.vue)
*   **startNewRound**: Questa è la funzione più importante. Sceglie un paese, chiede a Wikipedia le informazioni e prepara le 4 risposte possibili.
*   **checkAnswer**: Controlla se hai cliccato il bottone giusto. Se è corretto ti dà un punto, altrimenti no. Impedisce anche di cliccare più volte per "imbrogliare".
*   **startTimer**: Avvia il conto alla rovescia di 15 secondi. Se arriva a zero, la domanda viene considerata persa.
*   **updateHighScore**: Se a fine partita hai fatto un nuovo record, questa funzione scrive il nuovo punteggio nel database online.

### Pagina Classifica (LeaderboardView.vue)
*   Questa pagina chiede al database la lista di tutti gli utenti, li ordina dal punteggio più alto al più basso e mostra i primi 10.

---

## 5. Dettagli che il Professore potrebbe chiedere

**D: Come avete reso il sito adatto ai telefoni (Responsive)?**
R: Abbiamo usato la "Griglia" di Vuetify. Il sito divide lo spazio in 12 colonne invisibili. Se lo schermo è grande, gli elementi occupano poche colonne e stanno vicini; se lo schermo è piccolo (cellulare), gli elementi occupano tutte e 12 le colonne e si impilano uno sopra l'altro.

**D: Come garantite che le risposte siano in ordine casuale?**
R: Usiamo l'algoritmo di **Fisher-Yates**. È un metodo matematico che rimescola le opzioni come se fossero un mazzo di carte, assicurando che la risposta corretta non finisca sempre nello stesso posto.

**D: Cos'è quell'effetto "vetro" trasparente delle finestre?**
R: Si chiama **Glassmorphism**. Lo abbiamo ottenuto tramite CSS usando il comando `backdrop-filter: blur()`, che sfoca quello che c'è dietro la finestra, rendendo il testo sopra molto più leggibile e moderno.

**D: Perché avete separato il CSS (lo stile) dai file Vue?**
R: Per ordine e pulizia (Separation of Concerns). In questo modo, se vogliamo cambiare un colore, lo facciamo in un unico file invece di dover cercare in ogni singola pagina del sito.

---
