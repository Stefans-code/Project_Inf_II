<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref(localStorage.getItem('username') || "Ospite")
const highScore = ref(localStorage.getItem('highScore') || "0")

const goHome = () => {
  router.push('/')
}

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
    <p><strong>Nome:</strong> {{ username }}</p>
    <p><strong>Miglior Punteggio:</strong> {{ highScore }}</p>
    
    <button @click="goHome"> Torna al Menu </button>
    <button @click="clearData"> Reset Record </button>
  </div>
</template>

<style scoped>
.view-container {
  text-align: center;
  padding: 20px;
}
button {
  margin: 10px;
  padding: 10px 20px;
}
</style>
