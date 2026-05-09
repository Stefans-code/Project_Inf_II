<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
// Recupera i dati dal database locale del browser
const username = ref(localStorage.getItem('username') || "Ospite")
const highScore = ref(localStorage.getItem('highScore') || "0")

const goHome = () => {
  router.push('/')
}

// Funzione per resettare i progressi
const clearData = () => {
  if (confirm("Vuoi davvero cancellare i tuoi record?")) {
    localStorage.removeItem('highScore')
    highScore.value = "0"
  }
}
</script>

<template>
  <div class="view-container">
    <h1> Profilo Giocatore </h1>
    <p><strong>Nome Utente:</strong> {{ username }}</p>
    <p><strong>Record Personale:</strong> {{ highScore }} punti</p>
    
    <div class="profile-actions">
      <button @click="goHome"> Torna al Menu </button>
      <button @click="clearData" class="btn-danger"> Reset Record </button>
    </div>
  </div>
</template>

<style scoped>
.view-container {
  text-align: center;
  padding: 20px;
}
.btn-danger {
  color: #c00;
  margin-top: 20px;
}
button {
  margin: 10px;
  padding: 10px 20px;
}
</style>
