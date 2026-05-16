<script setup>
/**
 * GAME VIEW - Il Cuore dell'Applicazione
 * Qui avviene la logica del quiz, il recupero dati da Wikipedia e il salvataggio dei record.
 */
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCountryInfo, getCountries, shuffleArray } from '../../script.js'
import { db } from '../firebase'
import { doc, updateDoc, getDoc } from 'firebase/firestore'

const router = useRouter()

/* --- STATI REATTIVI --- */
const state = ref('mode_selection') // Gestisce le fasi: selezione, quiz, fine
const mode = ref(0)                 // 0: Mondo, 1: Cibo, 2: Europa
const difficulty = ref(0)
const score = ref(0)
const maxScore = 5                  // Ogni partita dura 5 round come da requisiti
const answers = ref(0)
const currentFact = ref("")
const currentAnswer = ref("")
const options = ref([])
const isLoading = ref(false)
const timer = ref(15)               // Timer di 15 secondi per domanda
let timerInterval = null
const selectedOption = ref(null)
const isCorrect = ref(false);

let alreadyUsedCountrys = []

/**
 * AVVIO TIMER: Usa setInterval per il countdown.
 * È importante spiegare all'esame la pulizia (clearInterval) per evitare memory leak.
 */
const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  timer.value = 15;

  timerInterval = setInterval(() => {
    if (selectedOption.value !== null) return;

    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(timerInterval);
      if (selectedOption.value === null) handleTimeout();
    }
  }, 1000);
};

const handleTimeout = () => {
  if (selectedOption.value !== null) return;
  isCorrect.value = false;
  selectedOption.value = 'timeout';
  
  setTimeout(() => {
    answers.value++;
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
 * LOGICA DEL ROUND: 
 * 1. Sceglie un paese casuale.
 * 2. Chiama l'API di Wikipedia.
 * 3. Genera 4 opzioni e le mescola con Fisher-Yates.
 */
const startNewRound = async () => {
  if (timerInterval) clearInterval(timerInterval)
  state.value = 'quiz'
  isLoading.value = true
  selectedOption.value = null
  currentFact.value = "Retrieving info from Wikipedia..."
  
  const availableCountries = getCountries(mode.value)
  do {
    currentAnswer.value = availableCountries[Math.floor(Math.random() * availableCountries.length)]
  } while(alreadyUsedCountrys.includes(currentAnswer.value))
  
  alreadyUsedCountrys.push(currentAnswer.value)
  currentFact.value = await getCountryInfo(currentAnswer.value, mode.value)
  
  let ops = [currentAnswer.value]
  while (ops.length < 4) {
    let c = availableCountries[Math.floor(Math.random() * availableCountries.length)]
    if (!ops.includes(c)) ops.push(c)
  }
  options.value = shuffleArray(ops) // Algoritmo equo
  
  isLoading.value = false
  startTimer()
}

/**
 * VERIFICA RISPOSTA: Gestisce il punteggio e il feedback visivo.
 */
const checkAnswer = (selected) => {
  if (selectedOption.value !== null) return;
  clearInterval(timerInterval);
  selectedOption.value = selected;
  isCorrect.value = (selected === currentAnswer.value);

  setTimeout(() => {
    answers.value++
    if (isCorrect.value) score.value++;
    
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
 * PERSISTENZA CLOUD: Salva il record su Firestore.
 */
const updateHighScore = async () => {
  const currentUsername = localStorage.getItem('username')
  if (!currentUsername) return;
  
  const userRef = doc(db, "utenti", currentUsername)
  const docSnap = await getDoc(userRef)
  
  let currentHigh = 0
  if (docSnap.exists()) currentHigh = docSnap.data().highScore || 0

  if (score.value > currentHigh) {
    await updateDoc(userRef, { highScore: score.value })
  }
}

const goHome = () => {
  if (timerInterval) clearInterval(timerInterval)
  router.push('/')
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

/* --- HELPER NAVIGAZIONE --- */
const selectMode = (m) => { mode.value = m; state.value = 'difficulty_selection'; }
const selectDifficulty = (d) => { 
  difficulty.value = d; answers.value = 0; score.value = 0; 
  alreadyUsedCountrys = []; startNewRound(); 
}
</script>

<template>
  <v-card class="pa-6 mx-auto" elevation="10" rounded="xl" width="100%" max-width="650">
    <!-- v-window: Usato per gestire le diverse schermate (fasi) del gioco con transizioni fluide -->
    <v-window v-model="state" disabled>
      
      <!-- FASE 1: Selezione Modalità -->
      <v-window-item value="mode_selection">
        <div class="text-center">
          <v-icon icon="mdi-layers-outline" size="48" color="primary" class="mb-2"></v-icon>
          <h1 class="text-h4 font-weight-bold mb-2">Game Mode</h1>
          <p class="mb-6">Pick your specialty</p>
          <v-row dense>
            <v-col cols="12"><v-btn @click="selectMode(0)" color="primary" size="large" rounded="lg" block>World Trivia</v-btn></v-col>
            <v-col cols="12"><v-btn @click="selectMode(1)" variant="tonal" size="large" rounded="lg" block>Food & Traditions</v-btn></v-col>
            <v-col cols="12"><v-btn @click="selectMode(2)" variant="tonal" size="large" rounded="lg" block>Europe Only</v-btn></v-col>
            <v-col cols="12" class="mt-4"><v-btn @click="goHome" variant="outlined" size="large" rounded="lg" block>Back</v-btn></v-col>
          </v-row>
        </div>
      </v-window-item>

      <!-- FASE 2: Selezione Difficoltà -->
      <v-window-item value="difficulty_selection">
        <div class="text-center">
          <v-icon icon="mdi-speedometer" size="48" color="primary" class="mb-2"></v-icon>
          <h1 class="text-h4 font-weight-bold mb-2">Difficulty</h1>
          <p class="mb-6">Challenge level</p>
          <v-row dense>
            <v-col cols="12" sm="4"><v-btn @click="selectDifficulty(0)" variant="tonal" size="large" rounded="lg" block>Easy</v-btn></v-col>
            <v-col cols="12" sm="4"><v-btn @click="selectDifficulty(1)" variant="tonal" size="large" rounded="lg" block>Medium</v-btn></v-col>
            <v-col cols="12" sm="4"><v-btn @click="selectDifficulty(2)" variant="tonal" size="large" rounded="lg" block>Hard</v-btn></v-col>
            <v-col cols="12" class="mt-4"><v-btn @click="state = 'mode_selection'" variant="outlined" size="large" rounded="lg" block>Back</v-btn></v-col>
          </v-row>
        </div>
      </v-window-item>

      <!-- FASE 3: Il Quiz vero e proprio -->
      <v-window-item value="quiz">
        <div class="header-info d-flex justify-space-between align-center mb-4">
          <v-chip color="primary" variant="flat" label>Score: {{ score }} / {{ maxScore }}</v-chip>
          <div class="text-right" style="min-width: 120px;">
            <div class="text-caption mb-1">Time Left: {{ timer }}s</div>
            <!-- v-progress-linear: Barra di caricamento per il timer visivo -->
            <v-progress-linear :model-value="(timer / 15) * 100" color="error" height="8" rounded></v-progress-linear>
          </div>
        </div>
        
        <!-- Box della Curiosità -->
        <v-card variant="flat" class="pa-5 mb-6 bg-white" rounded="lg" border>
          <div v-if="isLoading" class="text-center py-4">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p class="mt-2 text-body-2 text-primary font-weight-bold">Fetching from Wikipedia...</p>
          </div>
          <p v-else class="text-body-1 line-height-relaxed text-black font-weight-medium">{{ currentFact }}</p>
        </v-card>

        <!-- Griglia delle Opzioni (ADATTIVA: 1 colonna mobile, 2 colonne PC) -->
        <div v-if="!isLoading" class="quiz-grid-vuetify">
          <v-row dense>
            <v-col v-for="opt in options" :key="opt" cols="12" sm="6">
              <v-btn 
                @click="checkAnswer(opt)"
                block height="72" rounded="lg" variant="elevated"
                :color="selectedOption === opt ? (opt === currentAnswer ? 'success' : 'error') : (selectedOption && opt === currentAnswer ? 'success' : 'surface')"
                :disabled="selectedOption !== null"
                class="text-none"
              > 
                {{ opt }} 
              </v-btn>
            </v-col>
          </v-row>
        </div>
        
        <v-btn @click="goHome" variant="text" color="medium-emphasis" block class="mt-6">Exit Game</v-btn>
      </v-window-item>

      <!-- FASE 4: Fine Gioco e Risultati -->
      <v-window-item value="game_over">
        <div class="text-center">
          <v-icon icon="mdi-flag-checkered" size="64" color="primary" class="mb-4"></v-icon>
          <h1 class="text-h3 font-weight-bold mb-2">Final Score</h1>
          <div class="text-h2 mb-8 text-primary font-weight-black">{{ score }} / {{ maxScore }}</div>
          <v-btn @click="goHome" color="primary" size="x-large" rounded="xl" block prepend-icon="mdi-home">
            Back to Menu
          </v-btn>
        </div>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<style scoped>
/* CSS Spostato in style.css */
</style>
