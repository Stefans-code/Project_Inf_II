# Guida Tecnica e Documentazione - GeoQuiz

Questa documentazione è stata scritta per spiegare nel dettaglio ogni parte del codice, la logica utilizzata e le scelte tecniche effettuate. Può essere usata come guida per lo studio in vista dell'esame.

---

## 1. Architettura del Progetto
## Tecnologie Usate
-   **Frontend**: Vue.js 3 (Composition API)
-   **Routing**: Vue Router 4
-   **API Esterna**: Wikipedia REST API
-   **Backend (Database & Auth)**: **Firebase (Google Cloud)**
-   **Styling**: CSS standard

## Dettaglio Firebase
Il progetto utilizza Firebase per rendere l'esperienza utente persistente e multi-giocatore:
1.  **Authentication**: Gestisce il login e la registrazione degli utenti tramite Email e Password. I dati sono protetti e gestiti dai server di Google.
2.  **Firestore**: Un database NoSQL usato per memorizzare i record (High Scores). Ogni utente ha un documento associato al proprio UID univoco.
3.  **Cloud Sync**: I punteggi sono salvati online, quindi se l'utente cambia browser o dispositivo, ritroverà i suoi progressi.

- **Vite**: Usato come build tool per la sua velocità.
- **Vue Router**: Gestisce la navigazione tra le 5 pagine (Home, Gioco, Profilo, Classifica, Istruzioni) senza ricaricare il browser (Single Page Application).

---

## 2. Dettaglio dei File e Logica

### A. `script.js` (Il "Motore" dei Dati)
Questo file gestisce tutta la comunicazione con l'esterno.
- **`ALL_COUNTRIES` & `EUROPEAN_COUNTRIES`**: Liste di stringhe integrate per evitare di dipendere da database esterni in questa fase.
- **`getCountryInfo(countryName, mode)`**: La funzione principale. Prende il nome del paese e, se la modalità è "Cibo", aggiunge la parola "cuisine" alla ricerca per ottenere dati specifici.
- **`getData(query)`**: Usa la funzione nativa `fetch`. Perché? È lo standard moderno di JavaScript per fare richieste HTTP. Usa `encodeURIComponent` per gestire i nomi con spazi (es. "South Africa").
- **`trimTags` & `censoreName`**: Servono a pulire il testo. Wikipedia restituisce codice HTML (es. `<span>`) e nomi palesi. Queste funzioni usano le **Regex** (Espressioni Regolari) per pulire tutto.

### B. `src/views/GameView.vue` (La Logica del Quiz)
È il file più complesso. Gestisce:
- **Il Timer**: Usa `setInterval` per diminuire il valore ogni secondo. È importante notare `onUnmounted`: serve a fermare il timer se l'utente cambia pagina, evitando spreco di memoria.
- **La Scelta delle Opzioni**: Quando viene scelto un paese corretto, la funzione crea un array con quel paese + 3 paesi casuali, poi usa `.sort(() => Math.random() - 0.5)` per mescolarli.
- **Feedback Visivo**: Usiamo delle **classi dinamiche** in Vue (`:class="{ 'correct': ... }"`). Se l'utente clicca, Vue aggiunge istantaneamente la classe CSS che colora il pulsante.

### C. `src/router/index.js` (Il Vigile Urbano)
Definisce i percorsi (routes). Ogni rotta ha un `path` (l'URL) e un `component` (il file `.vue` da mostrare). Usa `createWebHistory` per avere URL puliti.

---

## 3. Possibili Domande del Professore (FAQ)

**D: Perché hai usato Vue Router invece di usare dei semplici `v-if` in un unico file?**
*R: Per migliorare l'organizzazione del codice. Ogni pagina ha la sua logica separata, rendendo il progetto più facile da leggere, testare e mantenere. Inoltre permette di usare i tasti "avanti" e "indietro" del browser.*

**D: Come gestisci i dati quando l'app viene chiusa?**
*R: Uso il `localStorage`. È un database interno al browser che permette di salvare stringhe. Lo uso per memorizzare il nome utente e il punteggio record in modo che non vadano persi al refresh.*

**D: Cos'è la funzione `fetch` e perché è asincrona (`async/await`)?**
*R: `fetch` serve a scaricare dati dal web. È asincrona perché non sappiamo quanto tempo ci metterà Wikipedia a rispondere. Usando `await`, diciamo al programma di "aspettare" la risposta prima di proseguire, senza però bloccare il resto dell'interfaccia.*

**D: Come hai evitato che il nome del paese apparisse nel testo della domanda?**
*R: Ho creato una funzione di "censura" chiamata `censoreName`. Questa funzione cerca il nome del paese all'interno della frase (ignorando maiuscole e minuscole) e lo sostituisce con degli asterischi `***`.*

**D: Perché hai scelto Wikipedia come sorgente dati?**
*R: Perché offre un'API REST gratuita, enorme e sempre aggiornata, che permette di avere fatti reali e diversi a ogni partita senza dover scrivere manualmente centinaia di domande.*

---

## 4. Installazione e Avvio
1. Scaricare il progetto.
2. Eseguire `npm install` per installare Vue, il Router e Firebase.
3. Eseguire `npm run dev` per lanciare il server locale.
