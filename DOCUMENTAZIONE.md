# Guida Tecnica e Documentazione Ultra-Dettagliata - GeoQuiz (Material Edition)

Questa documentazione è stata redatta con un livello di dettaglio avanzato per coprire ogni aspetto tecnico del progetto **GeoQuiz**, utile per una discussione approfondita in sede d'esame.

---

## 1. Architettura del Sistema 

Il progetto adotta un'architettura **Single Page Application (SPA)** basata su **Vue.js 3**.

### Componenti Core:
- **Vite (Build Tool)**: Utilizzato per il bundling ultra-rapido grazie all'uso dei moduli ES nativi nel browser durante lo sviluppo.
- **Vue Router (Navigation)**: Gestisce la navigazione tramite l'oggetto `router`. Utilizza `createWebHistory` per manipolare l'URL senza ricaricare la pagina, mantenendo lo stato dell'applicazione sincronizzato.
- **Firebase Firestore (Data Layer)**: Database NoSQL orientato ai documenti. Ogni "oggetto" è un documento memorizzato in una "collezione". Nel nostro caso, la collezione `utenti` funge da schema principale.

---
## 2.Punto d'ingresso dell'applicazione(`main.js`)

Questo file è l'entry point dell'intera architettura software. Il suo compito è quello di inizializzare l'istanza dell'applicazione Vue e configurare l'ambiente runtime prima che l'interfaccia venga mostrata all'utente.

Il processo inizia con l'importazione della funzione `createApp` e del componente `App.vue` che funge da contenitore principale per l'intera interfaccia. Il file  importa gli stili globali tramite `style.css` e attraverso `app.use(router)` inietta il sistema di routing, permettendo all'SPA di gestire la navigazione senza dover ricaricare la pagina web.

Il ciclo di avvio si conclude con l'istruzione `app.mount('#app')`. Questo comando stabilisce il legame tra il framework e il documento HTML statico: Vue prende il controllo del nodo del DOM identificato dall'ID `app`(definito in `index.html`), iniettandovi i componenti e rendendo l'applicazione reattiva e interattiva.

---


## 3. Gestione della navigazione: il sistema di routing(`router/index.js`)

Il file `index.js` contenuto nella cartella `router` ha il compito di gestire l'intera logica di navigazione dell'applicazione.
Trattandosi di una Single Page Application, il passaggio da una sezione all'altra non avviene tramite il caricamento di nuove pagine HTML dal server, ma attraverso la manipolazione dinamica del DOM gestita dal plugin Vue Router.

All'interno di questo file viene definita la costante `router` tramite la funzione `create router`. La configurazione si articola su due pilastri principali:
- **La gestione della cronologia(`history`)**: utilizzando `createHistory`, l'applicazione permette all'utente di usare i tasti per andare avanti e indietro come in un sito multipagina tradizionale, pur restando tecnicamente sempre all'interno della stessa pagina
- **Definizione di percorsi di navigazione(`routes`): questo è il nucleo del file, dove viene definito un array di oggetti. Ogni oggetto associa un percorso URL(es. `/game`) a un componente specifico(es. `GameView`). In questo modo, quando l'utente naviga verso un determinato indirizzo, il router sa esattamente quale componente iniettare dentro il tag `<router-view />` presente nel file pricipale `App.vue`.

Infine, l'istanza del router viene esportata per essere utilizzata dal punto d'ingresso dell'app(`main.js`), garantendo così che l'intera struttura sia consapevole dello stato della navigazione in ogni momento.

---

## 4. Analisi Tecnica della Logica di Business (`script.js`)

Questo file contiene la logica "pura" dell'applicazione, separata dall'interfaccia utente (UI).

### Recupero Dati (Wikipedia API):
- **Funzione `getCountryInfo(countryName, mode)`**: 
  - Utilizza la tecnica del **Fallback**: se la modalità specifica (Cibo) non restituisce risultati validi, la funzione richiama se stessa ricorsivamente con `mode = 0` per garantire che il quiz non si blocchi mai.
  - **URL Encoding**: Viene usato `encodeURIComponent(query)` per trasformare caratteri speciali (spazi, accenti) in formati validi per l'URL (es. "South Africa" -> "South%20Africa").

### Elaborazione Stringhe (Regex):
- **Rimozione Tag**: `str.replace(/<[^>]*>/g, '')` -> Utilizza una classe negativa per trovare tutto ciò che è racchiuso tra `<` e `>` e lo elimina.
- **Censura Dinamica**: `new RegExp(n, "gi")` -> Crea un'espressione regolare dinamica per ogni parola nella blacklist. Il flag `g` indica "global" (trova tutte le occorrenze) e `i` indica "ignore case" (non distingue tra maiuscole e minuscole).

---

## 5. Il componente radice: `App.vue`

Il file `App.vue` rappresenta il guscio che racchiude le altri parti del sito. Essendo il componente radice(root component), è il primo pezzo dell'interfaccia che viene caricato nella pagina HTML.
La struttura del file si divide in tre parti:
- **la logica**(`<script>`): qui viene importato il componente routerView, strumento fondamentalee per permettere a Vue di sapere dove "proiettare" i vari contenuti(come la Home, la pagina di login, ecc..) quando l'utente naviga nel sito.
- **la struttura visiva**(`<template>`): qui è definito il layout generale. In particolare è presente il tag `<RouterView />` che funge da "contenitore" per il componente corrispondente all'indirizzo URL attuale. C'è anche un `<footer>` statico, poichè si trova fuori dal `RouterView` il copiright e le informazioni del corso rimangono visibili in fondo alla pagina indipendentemente dalla sezione in cui si trova l'utente.
- **lo stile**(`<style>`): qui vengono definiti i parametri grafici del layout principale, come la centratura dei contenuti, l'aspetto del test, garantendo che l'app abbia un aspetto coerente su ogni schermata.

  
---

## 6. Logica di Accesso (`LoginView.vue`)

Il componente (`LoginView.vue`) gestisce l'accesso e la registrazione degli utenti. L'applicazione interagisce direttamente co il database Firebase Firestore èer verificare le identità esistenti e registrarne di nuove. La logica è progettata per essere asincrona, garantendo che l'interfaccia non si blocchi durante l'attesa dei dati dal server.

- **la funzione `handleLogin`**: dopo una prima verifica èer assicurarsi che i campi non siano vuoti, il codice cerca nel database un documento specifico nella collezione "utenti". Se il documento viene trovato e la password salvata su Firebase corrisponde a quella inserita, l'accesso viene confermato. L'uso di `localStorage` permette all'app di salvare l'username e lo stato di login nella memoria del browser. Questo consente al sito di riconoscere l'utente anche se la pagina viene ricaricata. Una volta completato il processo, il router reinderizza automaticamente l'utente verso la dasjboard principale.
- **la funzione `handleRegister`**: la funzione di registrazione seggue un flusso simile ma inverso. Prima di creare un nuovo account, il sistema controlla che l'username scelto non sia già presente nel database per evitare conflitti. Se il controllo è positivo, viene creato un nuovo record su Firestore dove, oltre alla password, viene inizializzato il campo `highScore` a zero. Questo assicura che ogni nuovo utente abbia  già una struttura dati pronta per salvare i futuri record ottenuti nel gioco.

**Feedback utente**
Il feedback all'utente è gestiro tramite messaggi di avviso(`alert`) che comunicano immediatamente l'esito delle operazioni, come la mancanza di credentiali, un errore di battitura o il successo della registrazione.

---

## 7. La Homepage (`HomeView.vue`)

Il componente `HomeView.vue` è la prima schermata che l'utente visualizza dopo aver effettuato l'accesso e ha il compito di indirizzarlo verso le diverse funzionalità del progetto.

Nella sezione `<script>` il componente utilizza il router di Vue per gestire il passaggio tra le varie "pagine". La logica della Home verifica che l'utente sia effettivamnete loggato(controllando il `localStorage` impostato nel login). Se l'utente è presente, la Home personalizza l'esperienza mostrando un messaggio di benvenuto con l'username recuperato dalla sessione

Nella pagina ogni bottone del menu è collegato a una rotta definita nel file `router/index.js` come ad esempio `/game` o `/leaderboard`.

---

## 8. Gestione dello Stato e Reattività (`GameView.vue`)

Il componente `GameView.vue` rappresenta il cuore interattivo dell'applicazione. Utilizziamo la **Composition API** per gestire lo stato del gioco in modo granulare.

### Variabili Reattive (`ref`):
- **la variabile reattiva `state`**: controlla il flusso dell'interfaccia (macchina a stati: `mode_selection` ->`difficulty_selection` -> `quiz` -> `game_over`). Questo approccio permette al template di mostrare sezioni diverse in  base alla fase del gioco
- **le variabili `currentFact`(la domanda) e `options`(le risposte)**: aggiornate asincronicamente dopo ogni chiamata API, scatenando il re-rendering automatico del DOM grazie al sistema di "Proxy" di Vue 3. Il framework intercetta il cambiamento dei dati e aggiorna solo la parte di interfaccia necessaria, garantendo prestazioni elevate e un'interfaccia sempre sincronizzata

### Ciclo di Vita (Lifecycle Hooks):
- **`onUnmounted`**: Cruciale per le performance. Quando l'utente cambia rotta (es. torna alla home), eseguiamo `clearInterval(timerInterval)`. Senza questo passaggio, il timer continuerebbe a girare in background, causando errori e spreco di risorse (memory leak).

### Algoritmo di Shuffle:
Per garantire che il quiz sia sempre diverso, le risposte vengono mescolate ad ogni round.
- **Meccanica**: utilizziamo il metodo `options.value.sort(() => Math.random() - 0.5)`.
- *Spiegazione Tecnica*: Il metodo `sort` si aspetta un valore positivo, negativo o zero per decidere l'ordine degli elementi. Sottraendo 0.5 al risultato di `Math.random()`(che genera un numero tra 0 e 1),  otteniamo un valore casuale che oscilla tra -0.5 e 0.5, forzando un ordinamento arbitrario e prevedibile dell'array delle risposte.

### Integrazione cloud e record:
Al termine della partita entra in gioco la funzione `updateHighScore`. Questa funzione recupera l'username dal `localStorage`, interroga Firestore per ottenere il record precedente e, solo se il punteggio attuale è superiore, procede all'aggiornamento del database con `updateDoc`. Viene anche salvata la data del record per mantenere uno storico preciso.

---

## 9. Integrazione Backend e Cloud (`firebase.js` & Auth)

### Autenticazione Firestore:
Invece di usare Firebase Auth standard (OAuth), abbiamo costruito un sistema di controllo diretto su Firestore:
- **`getDoc(doc(db, "utenti", username))`**: Recupera il documento corrispondente allo username.
- **Verifica**: Confrontiamo in chiaro `docSnap.data().password` con l'input dell'utente. *Nota per l'esame: in un sistema di produzione reale, le password andrebbero cifrate (hashing) lato client o server.*

### Salvataggio Cloud:
- **`updateDoc`**: Usato per aggiornare solo il campo `highScore` senza sovrascrivere l'intero documento dell'utente.
- **Sincronia Asincrona**: L'uso di `await` assicura che il messaggio "Punteggio aggiornato" appaia solo dopo che il server di Google ha confermato la scrittura.

---

## 10. Design System: Material Design 3

L'interfaccia è stata costruita seguendo le linee guida **M3 (Material You)**.

### Sistema di Token (CSS Variables):
- **`--md-sys-color-primary`**: Definisce il colore dominante (Deep Indigo) per coerenza visiva.
- **`--elevation-2`**: Una combinazione di `box-shadow` che simula la profondità fisica degli elementi nello spazio 3D.
- **Responsive Design**: Utilizziamo `max-width` e `min-width` (450px) sulle card per garantire che l'app sia leggibile sia su Desktop che su Mobile, evitando l'effetto "skinny".

---

## 11. Possibili Domande Tecniche Avanzate (DOMANDE D'ESAME)

**D: Come gestisci l'asincronia se l'utente clicca velocemente più pulsanti?**
*R: Abbiamo implementato un "lock" logico. Nella funzione `checkAnswer`, controlliamo se `selectedOption.value` è già valorizzato. Se lo è, la funzione esce immediatamente (`return`), impedendo all'utente di rispondere due volte alla stessa domanda o di accumulare punti extra.*

**D: Cos'è il `fetch` e come differisce da `axios`?**
*R: `fetch` è l'API nativa dei browser moderni per le richieste HTTP. Restituisce una `Promise`. A differenza di `axios`, non lancia un errore per gli stati HTTP 4xx o 5xx (va controllato `response.ok`), ma essendo nativa non richiede dipendenze esterne, rendendo l'app più leggera.*

**D: Spiega la differenza tra `localStorage` e il Database Firestore.**
*R: Il `localStorage` è locale al browser (perso se si cambia PC o si pulisce la cache). Firestore è persistente nel Cloud (accessibile da qualsiasi dispositivo). Usiamo `localStorage` per la sessione corrente e Firestore per i record storici.*

**D: Perché usi `v-for` con la `:key`?**
*R: La `:key` è fondamentale per l'algoritmo di "diffing" di Vue. Permette al framework di identificare univocamente ogni elemento della lista e aggiornare solo quelli necessari nel DOM, invece di ricreare l'intera lista, migliorando drasticamente le prestazioni.*

---

## 12. Struttura dei File
```text
/
├── script.js          # Business Logic (Wikipedia, Regex, Sanitization)
├── DOCUMENTAZIONE.md  # Guida tecnica per lo studio
├── src/
│   ├── firebase.js    # Inizializzazione Google Cloud Services
│   ├── style.css      # Design System (Material Design 3 Tokens)
│   ├── views/         # Componenti Pagina (Home, Game, Profile, etc.)
│   └── router/        # Configurazione Vue Router (Single Page Navigation)
```
