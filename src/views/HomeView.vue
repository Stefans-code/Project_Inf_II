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
      <button @click="router.push('/game')">🚀 Inizia a Giocare </button><br>
      <button @click="router.push('/profile')">👤 Il mio Profilo </button><br>
      <button @click="router.push('/leaderboard')">🏆 Classifica Globale </button><br>
      <button @click="router.push('/about')">📖 Istruzioni </button><br>
      <button @click="handleLogout" class="btn-logout">🚪 Logout </button>
    </div>
  </div>
</template>




<style scoped>
.view-container { text-align: center; }
.menu-buttons button { width: 220px; margin: 10px; padding: 12px; cursor: pointer; min-width: 250px;}
.btn-logout { border-color: #ff4757;  color: #ff4757; margin-top: 20px !important; }



h1 {
  font-size: 2.8rem;
  margin-bottom: 10px;
}

p {
  color: var(--text-muted);
  font-size: 1.1rem;
}


.menu-buttons { 
  display: flex;
  flex-direction: column;
  align-items: center;      /* Centra in orizzontale */
  justify-content: center; /* Centra in verticale rispetto allo schermo */
  flex-grow: 1;            /* Dice a questa sezione di occupare tutto lo spazio vuoto */
  padding: 40px 20px;
  text-align: center;

  background: var(--card-bg);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.05); /* Ombra leggerissima */
  max-width: 450px;
  width: 90%;
  margin: auto;
}




</style>
