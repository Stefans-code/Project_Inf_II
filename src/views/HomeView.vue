<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const router = useRouter()
const isLogged = ref(localStorage.getItem('userLogged') === 'true')
const username = ref(localStorage.getItem('username') || "")
const password = ref("")

/** 
 * LOGIN MANUALE TRAMITE FIRESTORE (Solo Username)
 */
const handleLogin = async () => {
  if (!username.value || !password.value) return alert("Inserisci i dati!")
  
  try {
    const userRef = doc(db, "utenti", username.value)
    const docSnap = await getDoc(userRef)

    if (docSnap.exists()) {
      if (docSnap.data().password === password.value) {
        // Login riuscito
        localStorage.setItem('userLogged', 'true')
        localStorage.setItem('username', username.value)
        isLogged.value = true
        alert("Bentornato " + username.value + "!")
      } else {
        alert("Password errata!")
      }
    } else {
      alert("Username non trovato. Registrati!")
    }
  } catch (error) {
    alert("Errore: " + error.message)
  }
}

/** 
 * REGISTRAZIONE MANUALE TRAMITE FIRESTORE
 */
const handleRegister = async () => {
  if (!username.value || !password.value) return alert("Inserisci i dati!")
  if (username.value.length < 3) return alert("Username troppo corto!")

  try {
    const userRef = doc(db, "utenti", username.value)
    const docSnap = await getDoc(userRef)

    if (docSnap.exists()) {
      alert("Username già esistente, scegline un altro.")
    } else {
      // Crea il nuovo utente nel database
      await setDoc(userRef, {
        password: password.value,
        highScore: 0,
        createdAt: new Date()
      })
      localStorage.setItem('userLogged', 'true')
      localStorage.setItem('username', username.value)
      isLogged.value = true
      alert("Account creato! Benvenuto " + username.value)
    }
  } catch (error) {
    alert("Errore registrazione: " + error.message)
  }
}

const handleLogout = () => {
  localStorage.removeItem('userLogged')
  localStorage.removeItem('username')
  isLogged.value = false
}

const startGame = () => router.push('/game')
const goProfile = () => router.push('/profile')
</script>

<template>
  <div class="view-container">
    <h1> GeoQuiz 🌍 </h1>
    
    <div v-if="!isLogged">
      <h2> Login Giocatore </h2>
      <label> Username </label>
      <input type="text" v-model="username" placeholder="Inserisci username" />
      <br>
      <label> Password </label>
      <input type="password" v-model="password" placeholder="Inserisci password" />
      <br>
      <div class="auth-buttons">
        <button @click="handleLogin"> Accedi </button>
        <button @click="handleRegister"> Registrati </button>
      </div>
    </div>

    <div v-else>
      <p>Giocatore: <strong>{{ username }}</strong></p>
      <div class="menu-buttons">
        <button @click="startGame"> Inizia Partita </button><br>
        <button @click="goProfile"> Il mio Profilo </button><br>
        <button @click="router.push('/leaderboard')"> Classifica </button><br>
        <button @click="router.push('/about')"> Istruzioni </button><br>
        <button @click="handleLogout" class="btn-logout"> Logout </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-container { text-align: center; }
.auth-buttons { margin-top: 15px; }
.menu-buttons button { width: 200px; margin: 8px; padding: 12px; }
.btn-logout { margin-top: 20px !important; background-color: #eee; }
button { margin: 5px; padding: 10px 15px; cursor: pointer; }
input { padding: 8px; margin: 5px; }
</style>
