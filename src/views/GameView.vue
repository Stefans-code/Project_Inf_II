<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCountryInfo, getCountries } from '../../script.js'
import { db } from '../firebase'
import { doc, updateDoc, getDoc } from 'firebase/firestore'

const router = useRouter()
const state = ref('mode_selection')
const mode = ref(0)
const difficulty = ref(0)
const score = ref(0)
const maxScore = 5

const answers = ref(0)

const currentFact = ref("")
const currentAnswer = ref("")
const options = ref([])
const isLoading = ref(false)
const timer = ref(15)
let timerInterval = null
const selectedOption = ref(null)
const isCorrect = ref(false);

let alreadyUsedCountrys = []

/** 
 * GESTORE TIMER: Avvia il conto alla rovescia di 15 secondi per ogni domanda.
 * Se il tempo scade, invoca handleTimeout().
 */
const startTimer = () => {
  // Reset totale di ogni timer precedente per evitare sovrapposizioni
  if (timerInterval) clearInterval(timerInterval);
  timer.value = 15;

  timerInterval = setInterval(() => {
    // Se la card di feedback è aperta, il timer si ferma temporaneamente
    if (selectedOption.value !== null) return;

    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(timerInterval);
      // Il timeout scatta solo se non è già stata data una risposta
      if (selectedOption.value === null) {
        handleTimeout();
      }
    }
  }, 1000);
};

// funzione per gestire il tempo scaduto graficamente
/** 
 * GESTIONE TIMEOUT: Se il tempo scade, il giocatore non riceve punti e viene 
 * conteggiato un tentativo (consuma una delle 5 domande del test).
 */
const handleTimeout = () => {
  if (selectedOption.value !== null) return;

  isCorrect.value = false;
  selectedOption.value = 'timeout';
  
  setTimeout(() => {
    answers.value++;
    // Se abbiamo raggiunto il limite di 5 domande, finisce il gioco
    if (answers.value >= maxScore) {
      state.value = 'game_over';
      updateHighScore();
    } else {
      selectedOption.value = null;
      startNewRound();
    }
  }, 2000);
};


/** 
 * SELEZIONE MODALITÀ: Imposta la categoria di gioco (Mondo, Cibo, Europa).
 * @param {number} m - L'indice della modalità scelta.
 */
const selectMode = (m) => {
  mode.value = m
  state.value = 'difficulty_selection'
}

/** 
 * SELEZIONE DIFFICOLTÀ: Imposta la difficoltà e inizializza i punteggi per la nuova partita.
 * @param {number} d - L'indice della difficoltà.
 */
const selectDifficulty = (d) => {
  difficulty.value = d
  answers.value = 0
  score.value = 0
  alreadyUsedCountrys = []
  startNewRound()
}

/** 
 * INIZIO NUOVO ROUND: Estrae un paese casuale (non duplicato), recupera il fatto 
 * da Wikipedia e genera le opzioni di risposta.
 */
const startNewRound = async () => {
  if (timerInterval) clearInterval(timerInterval)
  state.value = 'quiz'
  isLoading.value = true
  selectedOption.value = null
  currentFact.value = "Loading fact from Wikipedia..."
  
  // Selezione del paese corretto (evita duplicati nella stessa sessione)
  const availableCountries = getCountries(mode.value)
  do {
    currentAnswer.value = availableCountries[Math.floor(Math.random() * availableCountries.length)]
  } while(alreadyUsedCountrys.includes(currentAnswer.value))
  
  alreadyUsedCountrys.push(currentAnswer.value)

  // Chiamata all'API di Wikipedia tramite script.js
  currentFact.value = await getCountryInfo(currentAnswer.value, mode.value)
  
  /** 
   * GENERAZIONE OPZIONI: Crea un array di 4 risposte (1 corretta + 3 casuali).
   */
  let ops = [currentAnswer.value]
  while (ops.length < 4) {
    let c = availableCountries[Math.floor(Math.random() * availableCountries.length)]
    if (!ops.includes(c)) ops.push(c)
  }
  // Mescola le risposte in ordine casuale
  options.value = ops.sort(() => Math.random() - 0.5)
  
  isLoading.value = false
  startTimer()
}

/** 
 * VERIFICA RISPOSTA: Controlla se la risposta scelta è corretta, aggiorna il punteggio 
 * e gestisce il passaggio alla domanda successiva o alla fine del gioco.
 * @param {string} selected - Il paese selezionato dall'utente.
 */
const checkAnswer = (selected) => {
  if (selectedOption.value !== null) return;

  clearInterval(timerInterval);
  
  selectedOption.value = selected;
  isCorrect.value = (selected === currentAnswer.value);

  setTimeout(() => {
    answers.value++
    if (isCorrect.value) {
      score.value++;
    }
    
    // LOGICA DI FINE GIOCO: Il test termina rigorosamente dopo 5 tentativi (risposte date o timeout)
    if (answers.value >= maxScore) {
      selectedOption.value = null;
      state.value = 'game_over';
      updateHighScore();
    } else {
      selectedOption.value = null;
      startNewRound();
    }
  }, 2000);
};

/** 
 * SALVATAGGIO CLOUD: Salva il record nel documento dell'utente usando l'Username
 */
const updateHighScore = async () => {
  const currentUsername = localStorage.getItem('username')
  if (currentUsername) {
    try {
      const userRef = doc(db, "utenti", currentUsername)
      const docSnap = await getDoc(userRef)
      
      let currentHigh = 0
      if (docSnap.exists()) {
        currentHigh = docSnap.data().highScore || 0
      }

      if (score.value > currentHigh) {
        await updateDoc(userRef, {
          highScore: score.value,
          updatedAt: new Date()
        })
        console.log("Punteggio aggiornato nel cloud!")
      }
    } catch (e) {
      console.error("Errore salvataggio:", e)
    }
  }
}

/** 
 * NAVIGAZIONE: Torna alla home e pulisce il timer.
 */
const goHome = () => {
  if (timerInterval) clearInterval(timerInterval)
  router.push('/')
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<template>
  <div class="view-container md-card game-view">
    <div v-if="state === 'mode_selection'" class="state-container">
      <h1>Game Mode</h1>
      <p>Select your category</p>
      <div class="options-list">
        <button @click="selectMode(0)" class="btn-filled">World Trivia</button>
        <button @click="selectMode(1)" class="btn-tonal">Food & Traditions</button>
        <button @click="selectMode(2)" class="btn-tonal">Europe Only</button>
        <button @click="goHome" class="btn-outlined">Back</button>
      </div>
    </div>

    <div v-if="state === 'difficulty_selection'" class="state-container">
      <h1>Difficulty</h1>
      <p>How hard do you want it?</p>
      <div class="options-list">
        <button @click="selectDifficulty(0)" class="btn-tonal">Easy</button>
        <button @click="selectDifficulty(1)" class="btn-tonal">Medium</button>
        <button @click="selectDifficulty(2)" class="btn-tonal">Hard</button>
        <button @click="state = 'mode_selection'" class="btn-outlined">Back</button>
      </div>
    </div>

    <div v-if="state === 'quiz'" class="state-container quiz-state">
      <div class="header-info">
        <div class="stat-badge">Score: {{ score }} / {{ maxScore }}</div>
        <div class="stat-badge timer-badge">Time: {{ timer }}s</div>
      </div>
      
      <div class="fact-card">
        <p v-if="isLoading" class="loading-text">Recupero dati...</p>
        <p v-else>{{ currentFact }}</p>
      </div>

      <div v-if="!isLoading" class="quiz-grid">
        <button 
          v-for="opt in options" 
          :key="opt" 
          @click="checkAnswer(opt)"
          class="btn-tonal quiz-btn"
          :class="{ 'correct': selectedOption === opt && opt === currentAnswer, 'wrong': selectedOption === opt && opt !== currentAnswer }"
        > 
          {{ opt }} 
        </button>
      </div>
      
      <button @click="goHome" class="btn-outlined exit-btn">Exit</button>
    </div>

    <div v-if="state === 'game_over'" class="state-container">
      <h1>Results</h1>
      <p>Final Score: <strong>{{ score }} / {{ maxScore }}</strong></p>
      <button @click="goHome" class="btn-filled">Back to Menu</button>
    </div>
  </div>


</template>

<style scoped>
.game-view {
  max-width: 600px;
}

.state-container {
  display: flex;
  flex-direction: column;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-badge {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  padding: 6px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
}

.timer-badge {
  background-color: #fce4ec;
  color: #880e4f;
}

.fact-card {
  background-color: var(--md-sys-color-surface);
  border: 1px solid var(--md-sys-color-outline);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
  text-align: left;
}

.quiz-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.quiz-btn {
  height: 64px;
  padding: 8px;
  text-transform: none;
}

.exit-btn {
  margin-top: 12px;
}

.correct { background-color: #C8E6C9 !important; color: #1B5E20 !important; }
.wrong { background-color: #FFCDD2 !important; color: #B71C1C !important; }

.feedback-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.feedback-card {
  max-width: 320px;
  width: 90%;
}

.feedback-icon { font-size: 3rem; margin-bottom: 8px; }
.success-border { border-bottom: 4px solid #4CAF50; }
.error-border { border-bottom: 4px solid #F44336; }

.correct-highlight {
  color: #2E7D32;
  font-size: 1.25rem;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
