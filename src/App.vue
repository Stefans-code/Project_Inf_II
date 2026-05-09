<script setup>
import { ref } from 'vue'
import { getCountryInfo } from '../script.js'

const title = ref("titolo")
const msg = ref('Indovina il paese')
const isLogged = ref(false)
const state = ref(0)

const score = ref(0)
const maxScore = ref(5)
const mode = ref(0)
const difficulty = ref(0)

const states = {
  main: 0,
  login : 1,
  game_mode: 2,
  game_difficulty: 3,
  game: 4,
}

// Logica per far funzionare il gioco con script.js
const currentFact = ref("")
const countries = ["Italy", "France", "Germany", "Spain", "Japan", "Brazil"]
const currentAnswer = ref("")
const options = ref([])

const startNewRound = async () => {
  state.value = states.game
  currentFact.value = "Caricamento..."
  currentAnswer.value = countries[Math.floor(Math.random() * countries.length)]
  currentFact.value = await getCountryInfo(currentAnswer.value)
  
  let ops = [currentAnswer.value]
  while (ops.length < 4) {
    let c = countries[Math.floor(Math.random() * countries.length)]
    if (!ops.includes(c)) ops.push(c)
  }
  options.value = ops.sort(() => Math.random() - 0.5)
}

const checkAnswer = (selected) => {
  if (selected === currentAnswer.value) {
    score.value++
    if (score.value >= maxScore.value) alert("Hai vinto!")
    startNewRound()
  } else {
    alert("Sbagliato!")
  }
}
</script>

<template>
  <div v-if="state == states.main">
    <h1> Indovina lo stato</h1>
    <button v-if="isLogged" @click="state = states.game_mode"> Inizia a giocare </button>
    <button v-else @click="state = states.login"> Login e registrazione </button>
  </div>

  <div v-if="state == states.login">
    <h1> Accedi o crea un'account</h1>
    <label> Username </label>
    <input type="text" />
    <br>
    <label> Password </label>
    <input type="password" />
    <br>
    <button @click="isLogged = true; state = states.game_mode"> Login e registrazione </button>
  </div>

  <div v-if="state == states.game_mode">
    <h1> Modalità di gioco</h1>
    <p> Seleziona la sfida </p>
    <button @click="mode = 0; state = states.game_difficulty"> Curiosità del mondo </button><br>
    <button @click="mode = 1; state = states.game_difficulty"> Cibo e tradizioni </button><br>
    <button @click="mode = 2; state = states.game_difficulty"> solo europa </button><br>
  </div>

  <div v-if="state == states.game_difficulty">
    <h1> Modalità di gioco</h1>
    <p> Seleziona una difficoltà </p>
    <button @click="difficulty = 0; startNewRound()"> Facile </button><br>
    <button @click="difficulty = 1; startNewRound()"> Media </button><br>
    <button @click="difficulty = 2; startNewRound()"> Difficile </button><br>
  </div>

  <div v-if="state == states.game">
    <p> Punteggio: {{ score }} </p>
    <p> {{ currentFact }} </p>
    <button v-for="opt in options" @click="checkAnswer(opt)"> {{ opt }} </button>
    <br><br>
    <button @click="state = states.main"> Esci </button>
  </div>
</template>

<style>
/* Grafica basica come richiesto */
body {
  font-family: sans-serif;
  padding: 20px;
}
button {
  margin: 5px;
  padding: 5px 10px;
}
input {
  margin-bottom: 10px;
}
</style>
