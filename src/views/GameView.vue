<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCountryInfo, getCountries } from '../../script.js'

const router = useRouter()
const state = ref('mode_selection') // mode_selection, difficulty_selection, quiz, game_over
const mode = ref(0) // 0: Curiosità, 1: Cibo, 2: Europa
const difficulty = ref(0)
const score = ref(0)
const maxScore = 5

const currentFact = ref("")
const currentAnswer = ref("")
const options = ref([])
const isLoading = ref(false)

const selectMode = (m) => {
  mode.value = m
  state.value = 'difficulty_selection'
}

const selectDifficulty = (d) => {
  difficulty.value = d
  startNewRound()
}

const startNewRound = async () => {
  state.value = 'quiz'
  isLoading.value = true
  currentFact.value = "Caricamento fatto da Wikipedia..."
  
  const availableCountries = getCountries(mode.value)
  currentAnswer.value = availableCountries[Math.floor(Math.random() * availableCountries.length)]
  
  // Chiama l'API con la modalità specifica
  currentFact.value = await getCountryInfo(currentAnswer.value, mode.value)
  
  // Genera opzioni
  let ops = [currentAnswer.value]
  while (ops.length < 4) {
    let c = availableCountries[Math.floor(Math.random() * availableCountries.length)]
    if (!ops.includes(c)) ops.push(c)
  }
  options.value = ops.sort(() => Math.random() - 0.5)
  isLoading.value = false
}

const checkAnswer = (selected) => {
  if (selected === currentAnswer.value) {
    score.value++
    if (score.value >= maxScore) {
      state.value = 'game_over'
      updateHighScore()
    } else {
      startNewRound()
    }
  } else {
    alert("Sbagliato! La risposta corretta era: " + currentAnswer.value)
    startNewRound()
  }
}

const updateHighScore = () => {
  const currentHigh = parseInt(localStorage.getItem('highScore') || "0")
  if (score.value > currentHigh) {
    localStorage.setItem('highScore', score.value.toString())
  }
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="game-container">
    <!-- SELEZIONE MODALITÀ -->
    <div v-if="state === 'mode_selection'">
      <h1> Modalità di gioco</h1>
      <p> Seleziona la sfida </p>
      <button @click="selectMode(0)"> Curiosità del mondo </button><br>
      <button @click="selectMode(1)"> Cibo e tradizioni </button><br>
      <button @click="selectMode(2)"> Solo Europa </button><br>
      <button @click="goHome"> Indietro </button>
    </div>

    <!-- SELEZIONE DIFFICOLTÀ -->
    <div v-if="state === 'difficulty_selection'">
      <h1> Difficoltà </h1>
      <p> Scegli quanto vuoi sfidarti </p>
      <button @click="selectDifficulty(0)"> Facile </button><br>
      <button @click="selectDifficulty(1)"> Media </button><br>
      <button @click="selectDifficulty(2)"> Difficile </button><br>
      <button @click="state = 'mode_selection'"> Indietro </button>
    </div>

    <!-- QUIZ -->
    <div v-if="state === 'quiz'">
      <h2> Punteggio: {{ score }} / {{ maxScore }} </h2>
      <div class="fact-box">
        <p v-if="isLoading"><em>Recupero dati...</em></p>
        <p v-else>{{ currentFact }}</p>
      </div>
      <div v-if="!isLoading">
        <button v-for="opt in options" :key="opt" @click="checkAnswer(opt)"> {{ opt }} </button>
      </div>
      <br>
      <button @click="goHome"> Esci </button>
    </div>

    <!-- GAME OVER -->
    <div v-if="state === 'game_over'">
      <h1> Partita Finita! </h1>
      <p> Hai totalizzato {{ score }} punti su {{ maxScore }} </p>
      <button @click="goHome"> Torna al menu </button>
      <button @click="state = 'mode_selection'; score = 0"> Gioca ancora </button>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  text-align: center;
  padding: 20px;
}
.fact-box {
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 15px;
  margin: 20px auto;
  max-width: 500px;
  min-height: 100px;
}
button {
  margin: 5px;
  padding: 8px 15px;
}
</style>
