# Guida Tecnica e Documentazione - GeoQuiz (Material Edition)

Questa documentazione fornisce una panoramica dettagliata dell'architettura, delle scelte tecniche e della logica di implementazione del progetto **GeoQuiz**. È strutturata per facilitare la comprensione del codice in sede di esame.

---

## 1. Architettura del Progetto

Il progetto è una **Single Page Application (SPA)** sviluppata con **Vue.js 3** e orchestrata da **Vite**.

### Stack Tecnologico
- **Frontend**: Vue.js 3 (Composition API) per la reattività.
- **Styling**: Material Design 3 (M3) con CSS custom per un'interfaccia professionale e accessibile.
- **Database & Auth**: Firebase Firestore (NoSQL) per la persistenza dei dati.
- **Routing**: Vue Router 4 per la navigazione tra le viste.
- **API Esterna**: Wikipedia REST API per il recupero dinamico dei fatti geografici.

---

## 2. Dettaglio delle Tecnologie e Logica

### A. Firebase & Sicurezza (Firestore)
A differenza dei sistemi tradizionali, abbiamo implementato un sistema di **Authentication Manuale** tramite Firestore per semplicità accademica:
1. **Document-Based Auth**: Ogni utente è un documento nella collezione `utenti`. L'ID del documento è lo `username`.
2. **Persistence**: Usiamo `localStorage` per mantenere la sessione attiva (`userLogged`) e l'identità dell'utente tra i refresh della pagina.
3. **Cloud Records**: I punteggi record (`highScore`) sono salvati in modo asincrono su Firestore, permettendo una classifica globale in tempo reale.

### B. Wikipedia API & Data Sanitization (`script.js`)
La logica di recupero dati è centralizzata in `script.js`:
1. **Query Dinamiche**: Supporta diverse modalità (es. "Cibo" aggiunge "cuisine" alla query).
2. **Regex (Espressioni Regolari)**: Utilizziamo le Regex per:
   - **`trimTags`**: Rimuovere il codice HTML restituito da Wikipedia (`/<[^>]*>/g`).
   - **`censoreName`**: Cercare il nome del paese (case-insensitive) e sostituirlo con `***` per non svelare la risposta.
3. **Asincronia**: Usiamo `async/await` con `fetch` per gestire le chiamate di rete senza bloccare il thread principale dell'interfaccia.

### C. Game Engine (`GameView.vue`)
Il cuore del gioco gestisce stati complessi:
1. **State Machine**: La vista cambia dinamicamente tra `mode_selection`, `difficulty_selection`, `quiz` e `game_over` usando la direttiva `v-if` di Vue.
2. **Timer & Lifecycle**: Il timer usa `setInterval`. Fondamentale è l'uso di `onUnmounted` per distruggere il timer quando l'utente esce dal gioco, evitando "memory leaks".
3. **Randomization**: Le opzioni di risposta sono generate pescando il paese corretto e 3 casuali, rimescolati con l'algoritmo `.sort(() => Math.random() - 0.5)`.

### D. Design System (Material Design 3)
L'app segue i principi del **Material Design 3**:
- **Design Tokens**: Uso di variabili CSS (`--md-sys-color-...`) per una palette coerente.
- **Elevation**: Uso di ombre realistiche per definire la gerarchia visiva.
- **Componenti**: Bottoni standardizzati (Filled, Tonal, Outlined) e Card con bordi arrotondati (28px-32px).
- **Accessibilità**: Contrasto elevato per tutti i testi per garantire la leggibilità.

---

## 3. Possibili Domande d'Esame (FAQ)

**D: Perché hai usato la Composition API (`script setup`) invece della Options API?**
*R: La Composition API permette una migliore organizzazione del codice e il riutilizzo della logica. È lo standard moderno di Vue 3 che rende il codice più leggibile e simile a JavaScript puro.*

**D: Come gestisci l'integrità dei dati nel database?**
*R: Prima di aggiornare l'highScore su Firestore, confrontiamo il punteggio attuale con quello salvato nel cloud tramite `getDoc`. L'aggiornamento avviene solo se il nuovo punteggio è superiore (`score.value > currentHigh`).*

**D: Cosa succede se Wikipedia non restituisce dati per un paese?**
*R: La funzione `getCountryInfo` gestisce l'errore ricorsivamente: se la ricerca specifica (es. cucina) fallisce, effettua un fallback sulla ricerca base del paese per garantire che il quiz continui senza errori.*

**D: Perché hai scelto Firestore (NoSQL) invece di un database SQL come MySQL?**
*R: Per la flessibilità. Firestore permette di salvare oggetti JSON direttamente e scala automaticamente. Per un progetto web moderno, la facilità di integrazione con Firebase SDK è un enorme vantaggio rispetto a gestire un server backend separato.*

**D: Spiega l'uso del Router Guard (se applicabile) o della protezione pagine.**
*R: In `HomeView.vue` e altre viste, usiamo l'hook `onMounted` per controllare il `localStorage`. Se l'utente non è loggato, viene reindirizzato automaticamente alla pagina di Login tramite `router.push('/login')`.*

---

## 4. Struttura del Codice Principale

- **`src/firebase.js`**: Configurazione e inizializzazione dei servizi Google Cloud.
- **`src/style.css`**: Sistema di design globale, colori M3 e classi di utilità.
- **`src/views/`**: Contiene i componenti "Pagina" (SPA).
- **`script.js`**: Logica di business "agnostica" rispetto alla UI (fetch dati e pulizia stringhe).

---

## 5. Manutenzione e Avvio
1. `npm install`: Installa le dipendenze (Vue, Firebase, Vite).
2. `npm run dev`: Avvia l'ambiente di sviluppo locale.
3. `npm run build`: Genera i file ottimizzati per il deploy in produzione.
