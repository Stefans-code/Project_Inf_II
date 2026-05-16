# 🌍 GeoQuiz - Documentazione Tecnica e Funzionale
**Progetto per l'esame di Informatica II**

---

## 📖 1. Introduzione (Per i non esperti)
GeoQuiz è un gioco educativo interattivo. L'obiettivo è indovinare il paese corretto partendo da una curiosità o un fatto storico/culturale recuperato in tempo reale da **Wikipedia**. 

**Come funziona in parole semplici?**
1.  **L'Ingresso**: Ti registri con un nome utente.
2.  **La Scelta**: Decidi se giocare con tutto il mondo o solo con l'Europa.
3.  **La Sfida**: Leggi un indizio (dove il nome del paese è nascosto da degli asterischi `***`) e hai 15 secondi per rispondere.
4.  **Il Record**: Se fai un buon punteggio, il sito lo salva "nella nuvola" così puoi sfidare i tuoi amici nella classifica globale.

---

## 🛠️ 2. Architettura Tecnica (Per l'Esame)
Il progetto segue il pattern **MVVM** (Model-View-ViewModel) fornito da **Vue.js 3**.

### Stack Tecnologico:
- **Framework**: Vue.js 3 (Composition API).
- **Interfaccia**: **Vuetify 3**. Abbiamo scelto questo framework per implementare il *Material Design* in modo professionale, garantendo che il sito sia **Adattivo (Responsive)** e **Accessibile**.
- **Database**: **Firebase Firestore**. Un database NoSQL in tempo reale per la gestione degli utenti e dei punteggi.
- **API Esterne**: Wikipedia REST API per il recupero dinamico dei contenuti.

---

## 📂 3. Analisi dei Componenti (Le Pagine)

### 🏠 HomeView.vue
È il centro di controllo. Usa il sistema a griglia di Vuetify (`v-row`, `v-col`) per disporre i pulsanti in modo ordinato su PC e impilarli su smartphone.
- **Tecnica**: Usa `v-btn` con icone MDI per un feedback visivo immediato.

### 🔑 LoginView.vue
Gestisce l'accesso. 
- **Logica**: Controlla se l'utente esiste su Firestore. Se non esiste, permette la registrazione creando un nuovo documento.
- **UI**: Usa `v-text-field` con validazione per un inserimento dati pulito.

### 🎮 GameView.vue (Il Cuore)
Qui risiede la logica più complessa del game loop.
- **Timer**: Gestito con `setInterval`. Se il tempo scade, la funzione `handleTimeout` assegna 0 punti e passa al round successivo.
- **Algoritmo Fisher-Yates**: Usato per mescolare le 4 opzioni di risposta in modo che la posizione della risposta corretta sia sempre casuale e non prevedibile.
- **Transizioni**: Usa `v-window` per passare dalla selezione del gioco al quiz senza ricaricare la pagina.

---

## 🎨 4. Design e Stile (`style.css`)
Abbiamo separato completamente lo stile dalla logica per una maggiore pulizia.
- **Glassmorphism**: Abbiamo creato un effetto "vetro" usando `backdrop-filter: blur()`. Questo permette di vedere la mappa del mondo sullo sfondo mantenendo il testo leggibile.
- **Layout Adaptive**: Il CSS blocca lo scroll globale (`overflow: hidden`) per far sembrare il sito un'app nativa, spostando lo scroll all'interno delle singole card se necessario.

---

## ❓ 5. Possibili Domande Tecniche (DOMANDE D'ESAME)

**D: Come gestisci l'asincronia se l'utente clicca velocemente più pulsanti?**
*R: Abbiamo implementato un "lock" logico. Nella funzione `checkAnswer`, controlliamo se `selectedOption.value` è già valorizzato. Se lo è, la funzione esce immediatamente (`return`), impedendo all'utente di rispondere due volte.*

**D: Perché usi `v-for` con la `:key`?**
*R: La `:key` è fondamentale per l'algoritmo di "diffing" di Vue. Permette al framework di identificare univocamente ogni elemento della lista e aggiornare solo quelli necessari nel DOM, migliorando le prestazioni.*

**D: Spiega la differenza tra `localStorage` e il Database Firestore.**
*R: Il `localStorage` è locale al browser (perso se si cambia PC). Firestore è persistente nel Cloud (accessibile da ovunque). Usiamo il primo per la sessione e il secondo per i record.*

---

## 🚀 6. Punti Chiave da presentare
1.  **Flessibilità**: Il layout si adatta a ogni risoluzione grazie a Vuetify.
2.  **Solidità**: Firebase garantisce la persistenza dei record nel tempo.
3.  **Pulizia**: Il codice è diviso tra logica (Vue), dati (Firebase) e stile (CSS).

---
