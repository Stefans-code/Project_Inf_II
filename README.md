# Project_Inf_II - GeoQuiz

Questo progetto è un gioco a quiz basato sulla geografia, sviluppato con **Vue.js** e **Vite**. Il gioco recupera curiosità e fatti storici sui paesi direttamente da Wikipedia.

## Caratteristiche
- Interfaccia basica e pulita.
- Recupero dinamico dei dati tramite API di Wikipedia.
- Sistema di punteggio e livelli di difficoltà.
- Gestione dello stato del gioco (Login, Selezione modalità, Quiz).

## Requisiti
Assicurati di avere [Node.js](https://nodejs.org/) installato sul tuo computer.

## Come avviare il progetto

1. **Installa le dipendenze**:
   Apri il terminale nella cartella del progetto e digita:
   ```bash
   npm install
   ```

2. **Avvia il server di sviluppo**:
   Una volta installate le dipendenze, avvia il progetto con:
   ```bash
   npm run dev
   ```

3. **Apri nel browser**:
   Il terminale ti fornirà un indirizzo (solitamente `http://localhost:5173/`). Copialo e incollalo nel tuo browser per iniziare a giocare.

## Struttura dei file principali
- `src/App.vue`: Contiene l'interfaccia principale e la logica del gioco.
- `script.js`: Modulo JavaScript per l'interazione con l'API di Wikipedia.
- `src/main.js`: Punto di ingresso dell'applicazione Vue.
