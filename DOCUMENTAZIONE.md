# Relazione Tecnica Progetto GeoQuiz
**Candidato: [Tuo Nome]**
**Corso: Informatica ed Elementi di Programmazione II**

---

## 1. Conformità ai Requisiti del Progetto
Il progetto è stato sviluppato seguendo rigorosamente le specifiche fornite per l'esame:

*   **Tecnologie Core**: Sviluppato interamente in **HTML5, CSS3 e JavaScript** utilizzando il framework **VueJS 3**.
*   **Framework UI**: Utilizzo di **Vuetify 3** per garantire Material Design, componenti professionali e accessibilità.
*   **Responsiveness**: Il layout è adattivo al 100% (Mobile/Tablet/Desktop) grazie al sistema a griglia di Vuetify e media queries personalizzate.
*   **Uso di API**: Integrazione con le **Wikipedia REST API** per il recupero dinamico di fatti e curiosità geografiche.
*   **Uso di Database**: Integrazione con **Firebase Firestore** per la persistenza dei dati (lettura e scrittura).
*   **Schermate**: Il progetto dispone di **6 schermate dinamiche** (superando il minimo di 5 richiesto).
*   **Interazioni**: Implementazione diffusa di `v-model` (per gli input) e `@click` (per la logica di gioco e navigazione).

---

## 2. Analisi Dettagliata delle Pagine e Funzioni

### 2.1 Login e Registrazione (LoginView.vue)
Questa è la porta d'accesso al sistema. Gestisce l'identità dell'utente.
*   **`v-model="username"`**: Lega l'input dell'utente alla variabile JavaScript in tempo reale.
*   **`handleLogin()`**: Verifica asincronamente su Firebase se l'utente esiste. In caso positivo, salva la sessione in `localStorage`.
*   **`handleRegister()`**: Scrive un nuovo documento nel database Firestore inizializzando il punteggio a zero.

### 2.2 Menu Principale (HomeView.vue)
Hub centrale per la navigazione fluida tra le sezioni.
*   **`username` (ref)**: Recupera il nome salvato nel browser per personalizzare l'interfaccia.
*   **`handleLogout()`**: Esegue la pulizia della sessione (rimozione dati locali) e reindirizza l'utente al login.

### 2.3 Schermata di Gioco (GameView.vue)
Il modulo più complesso, contenente la logica di business e il game loop.
*   **`selectMode(m)`**: Imposta la categoria di gioco (Mondo, Cibo, Europa).
*   **`selectDifficulty(d)`**: Inizializza i parametri di difficoltà e resetta il punteggio della sessione.
*   **`startNewRound()`**: La funzione core che estrae un paese (evitando duplicati), interroga Wikipedia e genera 4 opzioni di risposta.
*   **`startTimer()` / `handleTimeout()`**: Gestiscono il countdown di 15 secondi tramite `setInterval`. In caso di scadenza, la domanda è persa.
*   **`checkAnswer(selected)`**: Valida la risposta dell'utente, aggiorna il punteggio e gestisce il feedback visivo (colorazione bottoni).
*   **`updateHighScore()`**: Confronta il punteggio attuale con quello salvato su Firebase e, se superiore, esegue una scrittura (`updateDoc`) per aggiornare il record.

### 2.4 Classifica Globale (LeaderboardView.vue)
Visualizzazione dei dati aggregati.
*   **`onMounted()`**: Esegue una query complessa su Firestore ordinando i documenti per `highScore` decrescente e limitando il risultato ai primi 10.
*   **`v-table`**: Visualizza i campioni con icone distintive per il podio.

### 2.5 Profilo Utente (ProfileView.vue)
Mostra i dati specifici dell'utente loggato.
*   **Lettura DB**: All'apertura della pagina, legge il record personale dell'utente direttamente dal suo documento Firebase.
*   **Visualizzazione**: Usa componenti `v-avatar` e tipografia avanzata per mostrare le statistiche.

### 2.6 Informazioni (AboutView.vue)
Guida all'uso e dettagli del progetto.
*   **Accessibilità**: Utilizza icone semantiche e una lista strutturata per spiegare le regole del gioco.

---

## 3. Logica Algoritmica e Sicurezza
*   **Fisher-Yates Shuffle**: Implementato per garantire la casualità assoluta delle risposte, requisito fondamentale per un quiz equo.
*   **Sanitizzazione Wikipedia**: Utilizzo di Espressioni Regolari (Regex) per censurare il nome del paese all'interno del testo (evitando che la risposta sia svelata nell'indizio) e per rimuovere tag HTML superflui.
*   **Protezione Interazioni**: Uso di variabili di stato per impedire all'utente di cliccare più volte la stessa risposta o di rispondere dopo la scadenza del tempo.

---

## 4. Design System e Accessibilità
*   **Glassmorphism**: Lo stile visivo si basa su card semi-trasparenti con sfocatura dello sfondo (`backdrop-filter`), garantendo un'estetica moderna senza sacrificare la leggibilità del testo (colore blu scuro ad alto contrasto).
*   **Layout Adattivo**: Ogni componente Vuetify è configurato per essere fluido. Le card si ridimensionano automaticamente e i menu si trasformano per una navigazione ottimale su schermi touch.

---
