<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = localStorage.getItem('username')

// Se non c'è un utente loggato, rimanda alla pagina di Login
onMounted(() => {
  if (localStorage.getItem('userLogged') !== 'true') {
    router.push('/login')
  }
})

const handleLogout = () => {
  localStorage.removeItem('userLogged')
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

<template>
  <div class="view-container">
    <h1> GeoQuiz - Menu Principale 🌍 </h1>
    <p>Ciao, <strong>{{ username }}</strong>! Cosa vuoi fare oggi?</p>
    
    <div class="menu-buttons">
      <button @click="router.push('/game')"> Inizia a Giocare </button><br>
      <button @click="router.push('/profile')"> Il mio Profilo </button><br>
      <button @click="router.push('/leaderboard')"> Classifica Globale </button><br>
      <button @click="handleLogout" class="btn-logout"> Logout </button>
    </div>
  </div>
</template>

<style scoped>
.view-container { text-align: center; }
.menu-buttons button { width: 220px; margin: 10px; padding: 12px; cursor: pointer; }
.btn-logout { background-color: #f0f0f0; margin-top: 20px !important; }
</style>
