<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCountryInfo, getCountries } from '../../script.js'
import { db, auth } from '../firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const router = useRouter()
const state = ref('mode_selection')
const mode = ref(0)
const difficulty = ref(0)
const score = ref(0)
const maxScore = 5

const currentFact = ref("")
const currentAnswer = ref("")
const options = ref([])
const isLoading = ref(false)
const timer = ref(15)
let timerInterval = null
const selectedOption = ref(null)

const startTimer = () => {
  timer.value = 15
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    timer.value--
    if (timer.value <= 0) {
      clearInterval(timerInterval)
      alert("Tempo scaduto!")
      startNewRound() 
    }
  }, 1000)
}

const selectMode = (m) => {
  mode.value = m
  state.value = 'difficulty_selection'
}

const selectDifficulty = (d) => {
  difficulty.value = d
  startNewRound()
}

const startNewRound = async () => {
  if (timerInterval) clearInterval(timerInterval)
  state.value = 'quiz'
  isLoading.value = true
  selectedOption.value = null
  currentFact.value = "Caricamento fatto da Wikipedia..."
  
  const availableCountries = getCountries(mode.value)
  currentAnswer.value = availableCountries[Math.floor(Math.random() * availableCountries.length)]
  currentFact.value = await getCountryInfo(currentAnswer.value, mode.value)
  
  let ops = [currentAnswer.value]
  while (ops.length < 4) {
    let c = availableCountries[Math.floor(Math.random() * availableCountries.length)]
    if (!ops.includes(c)) ops.push(c)
  }
  options.value = ops.sort(() => Math.random() - 0.5)
  
  isLoading.value = false
  startTimer()
}

const checkAnswer = (selected) => {
  if (selectedOption.value !== null) return 
  
  selectedOption.value = selected
  clearInterval(timerInterval)

  setTimeout(() => {
    if (selected === currentAnswer.value) {
      score.value++
      if (score.value >= maxScore) {
        state.value = 'game_over'
        updateHighScore() // Salvataggio su Firebase
      } else {
        startNewRound()
      }
    } else {
      alert("Sbagliato! Era: " + currentAnswer.value)
      startNewRound()
    }
  }, 1000)
}

/** 
 * LOGICA FIREBASE: Salva il punteggio massimo nel database Firestore
 */
const updateHighScore = async () => {
  const user = auth.currentUser
  if (user) {
    const userRef = doc(db, "scores", user.uid)
    const docSnap = await getDoc(userRef)
    
    let currentHigh = 0
    if (docSnap.exists()) {
      currentHigh = docSnap.data().highScore || 0
    }

    if (score.value > currentHigh) {
      await setDoc(userRef, {
        username: user.email,
        highScore: score.value,
        updatedAt: new Date()
      }, { merge: true })
      console.log("Punteggio aggiornato su Firebase!")
    }
  } else {
    // Fallback su localStorage se non loggato
    localStorage.setItem('highScore', score.value.toString())
  }
}

const goHome = () => {
  if (timerInterval) clearInterval(timerInterval)
  router.push('/')
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<template>
  <div class="game-container">
    <div v-if="state === 'mode_selection'">
      <h1> Modalità di gioco</h1>
      <p> Seleziona la sfida </p>
      <button @click="selectMode(0)"> Curiosità del mondo </button><br>
      <button @click="selectMode(1)"> Cibo e tradizioni </button><br>
      <button @click="selectMode(2)"> Solo Europa </button><br>
      <button @click="goHome"> Indietro </button>
    </div>

    <div v-if="state === 'difficulty_selection'">
      <h1> Difficoltà </h1>
      <p> Scegli quanto vuoi sfidarti </p>
      <button @click="selectDifficulty(0)"> Facile </button><br>
      <button @click="selectDifficulty(1)"> Media </button><br>
      <button @click="selectDifficulty(2)"> Difficile </button><br>
      <button @click="state = 'mode_selection'"> Indietro </button>
    </div>

    <div v-if="state === 'quiz'">
      <div class="header-info">
        <span>Punteggio: {{ score }} / {{ maxScore }}</span> | 
        <span :class="{ 'timer-low': timer <= 5 }">Tempo: {{ timer }}s</span>
      </div>
      
      <div class="fact-box">
        <p v-if="isLoading"><em>Recupero dati...</em></p>
        <p v-else>{{ currentFact }}</p>
      </div>

      <div v-if="!isLoading" class="options-container">
        <button 
          v-for="opt in options" 
          :key="opt" 
          @click="checkAnswer(opt)"
          :class="{
            'correct': selectedOption === opt && opt === currentAnswer.value,
            'wrong': selectedOption === opt && opt !== currentAnswer.value
          }"
        > 
          {{ opt }} 
        </button>
      </div>
      <br>
      <button @click="goHome"> Esci </button>
    </div>

    <div v-if="state === 'game_over'">
      <h1> Partita Finita! </h1>
      <p> Hai totalizzato {{ score }} punti! </p>
      <p><em>Il tuo record è stato salvato su Firebase.</em></p>
      <button @click="goHome"> Torna al menu </button>
      <button @click="state = 'mode_selection'; score = 0"> Gioca ancora </button>
    </div>
  </div>
</template>

<style scoped>
.game-container { text-align: center; padding: 20px; }
.header-info { font-weight: bold; margin-bottom: 10px; }
.timer-low { color: red; animation: blink 1s infinite; }
@keyframes blink { 50% { opacity: 0.5; } }
.fact-box { background: #f0f0f0; border: 2px solid #ccc; padding: 20px; margin: 20px auto; max-width: 600px; min-height: 120px; border-radius: 10px; }
.options-container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 400px; margin: 0 auto; }
button { padding: 10px; cursor: pointer; }
.correct { background-color: #4CAF50 !important; color: white; }
.wrong { background-color: #f44336 !important; color: white; }
</style>
