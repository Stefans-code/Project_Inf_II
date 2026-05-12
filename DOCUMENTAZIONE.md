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

## 2. Analisi Tecnica della Logica di Business (`script.js`)

Questo file contiene la logica "pura" dell'applicazione, separata dall'interfaccia utente (UI).

### Recupero Dati (Wikipedia API):
- **Funzione `getCountryInfo(countryName, mode)`**: 
  - Utilizza la tecnica del **Fallback**: se la modalità specifica (Cibo) non restituisce risultati validi, la funzione richiama se stessa ricorsivamente con `mode = 0` per garantire che il quiz non si blocchi mai.
  - **URL Encoding**: Viene usato `encodeURIComponent(query)` per trasformare caratteri speciali (spazi, accenti) in formati validi per l'URL (es. "South Africa" -> "South%20Africa").

### Elaborazione Stringhe (Regex):
- **Rimozione Tag**: `str.replace(/<[^>]*>/g, '')` -> Utilizza una classe negativa per trovare tutto ciò che è racchiuso tra `<` e `>` e lo elimina.
- **Censura Dinamica**: `new RegExp(n, "gi")` -> Crea un'espressione regolare dinamica per ogni parola nella blacklist. Il flag `g` indica "global" (trova tutte le occorrenze) e `i` indica "ignore case" (non distingue tra maiuscole e minuscole).

---

## 3. Gestione dello Stato e Reattività (`GameView.vue`)

Utilizziamo la **Composition API** per gestire lo stato del gioco in modo granulare.

### Variabili Reattive (`ref`):
- `state`: Controlla il flusso dell'interfaccia (macchina a stati: `mode_selection` -> `quiz` -> `game_over`).
- `currentFact` e `options`: Aggiornati asincronicamente dopo ogni chiamata API, scatenando il re-rendering automatico del DOM grazie al sistema di "Proxy" di Vue 3.

### Ciclo di Vita (Lifecycle Hooks):
- **`onUnmounted`**: Cruciale per le performance. Quando l'utente cambia rotta (es. torna alla home), eseguiamo `clearInterval(timerInterval)`. Senza questo passaggio, il timer continuerebbe a girare in background, causando errori e spreco di risorse (memory leak).

### Algoritmo di Shuffle:
Per mescolare le risposte usiamo: `options.value.sort(() => Math.random() - 0.5)`.
- *Spiegazione Tecnica*: Il metodo `sort` si aspetta un valore positivo, negativo o zero. `Math.random() - 0.5` restituisce un numero casuale tra -0.5 e 0.5, forzando un ordinamento arbitrario dell'array.

---

## 4. Integrazione Backend e Cloud (`firebase.js` & Auth)

### Autenticazione Firestore:
Invece di usare Firebase Auth standard (OAuth), abbiamo costruito un sistema di controllo diretto su Firestore:
- **`getDoc(doc(db, "utenti", username))`**: Recupera il documento corrispondente allo username.
- **Verifica**: Confrontiamo in chiaro `docSnap.data().password` con l'input dell'utente. *Nota per l'esame: in un sistema di produzione reale, le password andrebbero cifrate (hashing) lato client o server.*

### Salvataggio Cloud:
- **`updateDoc`**: Usato per aggiornare solo il campo `highScore` senza sovrascrivere l'intero documento dell'utente.
- **Sincronia Asincrona**: L'uso di `await` assicura che il messaggio "Punteggio aggiornato" appaia solo dopo che il server di Google ha confermato la scrittura.

---

## 5. Design System: Material Design 3

L'interfaccia è stata costruita seguendo le linee guida **M3 (Material You)**.

### Sistema di Token (CSS Variables):
- **`--md-sys-color-primary`**: Definisce il colore dominante (Deep Indigo) per coerenza visiva.
- **`--elevation-2`**: Una combinazione di `box-shadow` che simula la profondità fisica degli elementi nello spazio 3D.
- **Responsive Design**: Utilizziamo `max-width` e `min-width` (450px) sulle card per garantire che l'app sia leggibile sia su Desktop che su Mobile, evitando l'effetto "skinny".

---

## 6. Possibili Domande Tecniche Avanzate (DOMANDE D'ESAME)

**D: Come gestisci l'asincronia se l'utente clicca velocemente più pulsanti?**
*R: Abbiamo implementato un "lock" logico. Nella funzione `checkAnswer`, controlliamo se `selectedOption.value` è già valorizzato. Se lo è, la funzione esce immediatamente (`return`), impedendo all'utente di rispondere due volte alla stessa domanda o di accumulare punti extra.*

**D: Cos'è il `fetch` e come differisce da `axios`?**
*R: `fetch` è l'API nativa dei browser moderni per le richieste HTTP. Restituisce una `Promise`. A differenza di `axios`, non lancia un errore per gli stati HTTP 4xx o 5xx (va controllato `response.ok`), ma essendo nativa non richiede dipendenze esterne, rendendo l'app più leggera.*

**D: Spiega la differenza tra `localStorage` e il Database Firestore.**
*R: Il `localStorage` è locale al browser (perso se si cambia PC o si pulisce la cache). Firestore è persistente nel Cloud (accessibile da qualsiasi dispositivo). Usiamo `localStorage` per la sessione corrente e Firestore per i record storici.*

**D: Perché usi `v-for` con la `:key`?**
*R: La `:key` è fondamentale per l'algoritmo di "diffing" di Vue. Permette al framework di identificare univocamente ogni elemento della lista e aggiornare solo quelli necessari nel DOM, invece di ricreare l'intera lista, migliorando drasticamente le prestazioni.*

---

## 7. Struttura dei File
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
