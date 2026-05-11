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

const currentFact = ref("")
const currentAnswer = ref("")
const options = ref([])
const isLoading = ref(false)
const timer = ref(15)
let timerInterval = null
const selectedOption = ref(null)
const isCorrect = ref(false);

const startTimer = () => {
  // Reset totale di ogni timer precedente
  if (timerInterval) clearInterval(timerInterval);
  timer.value = 15;

  timerInterval = setInterval(() => {
    //Se la card di feedback è aperta, il timer si ferma
    if (selectedOption.value !== null) return;

    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(timerInterval);
      //il timeout scatta solo se non è già stata data una risposta
      if (selectedOption.value === null) {
        handleTimeout();
      }
    }
  }, 1000);
};

// funzione per gestire il tempo scaduto graficamente
const handleTimeout = () => {
  if (selectedOption.value !== null) return;

  isCorrect.value = false;
  selectedOption.value = 'timeout';
  
  setTimeout(() => {
    selectedOption.value = null; // Chiude la card
    startNewRound();             // Carica il nuovo round e fa ripartire il timer
  }, 2000);
};


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
  if (selectedOption.value !== null) return;

  clearInterval(timerInterval);
  
  selectedOption.value = selected;
  isCorrect.value = (selected === currentAnswer.value);

  setTimeout(() => {
    if (isCorrect.value) {
      score.value++;
    }

    if (score.value >= maxScore.value) {
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
      <button @click="selectMode(0)"> Curiosità del mondo </button><br>
      <button @click="selectMode(1)"> Cibo e tradizioni </button><br>
      <button @click="selectMode(2)"> Solo Europa </button><br>
      <button @click="goHome"> Indietro </button>
    </div>

    <div v-if="state === 'difficulty_selection'">
      <h1> Difficoltà </h1>
      <button @click="selectDifficulty(0)"> Facile </button><br>
      <button @click="selectDifficulty(1)"> Media </button><br>
      <button @click="selectDifficulty(2)"> Difficile </button><br>
      <button @click="state = 'mode_selection'"> Indietro </button>
    </div>

    <div v-if="state === 'quiz'">
      <div class="header-info">
        <span>Punteggio: {{ score }} / {{ maxScore }}</span> | 
        <span>Tempo: {{ timer }}s</span>
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
          :class="{ 'correct': selectedOption === opt && opt === currentAnswer.value, 'wrong': selectedOption === opt && opt !== currentAnswer.value }"
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
      <button @click="goHome"> Torna al menu </button>
    </div>
  </div>


  <Transition name="pop">
  <div v-if="selectedOption" class="feedback-overlay">
    <div class="feedback-card" :class="isCorrect ? 'card-success' : 'card-error'">
      
      <div class="feedback-icon">
        {{ selectedOption === 'timeout' ? '⏰' : (isCorrect ? '✅' : '❌') }}
      </div>

      <h2>
        {{ selectedOption === 'timeout' ? 'Tempo Scaduto!' : (isCorrect ? 'Corretto!' : 'Ops, quasi!') }}
      </h2>

      <p v-if="!isCorrect || selectedOption === 'timeout'">
        La risposta corretta era:<br>
        <strong class="correct-text-highlight">{{ currentAnswer.value || currentAnswer }}</strong>
      </p>
      
      <p v-else>Ottimo lavoro! +1 punto</p>
      
    </div>
  </div>
</Transition>
</template>



<style scoped>
.game-container { text-align: center; padding: 20px; }

.fact-box {
  color: white; 
  font-weight: 500;
  font-style: italic;
  background-color: var(--bg-color);
  border-left: 5px solid var(--primary-color);
  padding: 30px; 
  width: 100%;       
  max-width: 600px;  
  margin: 0 auto 20px auto; 
  border-radius: 10px; }

.options-container { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 20px; 
  max-width: 600px; 
  width: 100%; 
  margin: 0 auto;}


button { padding: 20px 10px; cursor: pointer; font-weight: 600;}
.correct { background-color: #4CAF50 !important; color: white; }
.wrong { background-color: #f44336 !important; color: white; }



.game-container > div {
  display: flex;
  flex-direction: column;
  align-items: center;    /* Centra i bottoni */
  gap: 15px;             /* Finalmente lo spazio tra i bottoni! */
  width: 100%;

  /* Altezza minima per occupare la vista se necessario */
  min-height: 60vh;
  background: white;
  padding: 50px;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.05);
}

.game-container button {
  width: 100%;
  max-width: 300px;      
  padding: 12px;
}


.game-container {
  
  flex: 1; 
  display: flex;
  flex-direction: column;
  
  /* Centra tutto verticalmente e orizzontalmente */
  justify-content: center; 
  align-items: center;
  
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.header-info{
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  padding: 0 10px;

  font-weight: 700;
  color: var(--secondary-color);
  font-size: 0.9rem;
  text-transform: uppercase;
}

h1 {
  margin-bottom: 30px;
  color: var(--secondary-color);
  font-size: 2rem;
}





/* Feedback utente in caso di errore o di risposta corretta */
.feedback-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4); /* Oscura leggermente il gioco dietro */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Sopra a ogni cosa */
  backdrop-filter: blur(4px); /* Sfoca il gioco sullo sfondo */
}


.feedback-card {
  background: white;
  padding: 40px;
  border-radius: 30px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  max-width: 400px;
  width: 85%;
}

.card-success { border-bottom: 8px solid #2ecc71; }
.card-error { border-bottom: 8px solid #e74c3c; }

.feedback-card h2 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: var(--secondary-color);
}


</style>
