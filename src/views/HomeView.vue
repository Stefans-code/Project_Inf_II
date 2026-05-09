<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLogged = ref(localStorage.getItem('userLogged') === 'true')
const username = ref(localStorage.getItem('username') || "")
const password = ref("")

const handleLogin = () => {
  if (username.value && password.value) {
    localStorage.setItem('userLogged', 'true')
    localStorage.setItem('username', username.value)
    isLogged.value = true
  } else {
    alert("Inserisci username e password")
  }
}

const handleLogout = () => {
  localStorage.removeItem('userLogged')
  isLogged.value = false
}

const startGame = () => {
  router.push('/game')
}

const goProfile = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="view-container">
    <h1> Indovina lo stato</h1>
    
    <div v-if="!isLogged">
      <h2> Accedi o crea un account</h2>
      <label> Username </label>
      <input type="text" v-model="username" />
      <br>
      <label> Password </label>
      <input type="password" v-model="password" />
      <br>
      <button @click="handleLogin"> Login e registrazione </button>
    </div>

    <div v-else>
      <p>Benvenuto, {{ username }}!</p>
      <button @click="startGame"> Inizia a giocare </button><br>
      <button @click="goProfile"> Il mio Profilo </button><br>
      <button @click="router.push('/leaderboard')"> Classifica </button><br>
      <button @click="router.push('/about')"> Istruzioni </button><br>
      <button @click="handleLogout"> Logout </button>
    </div>
  </div>
</template>

<style scoped>
.view-container {
  text-align: center;
}
button {
  margin: 10px;
  padding: 10px 20px;
}
input {
  margin: 5px;
}
</style>
