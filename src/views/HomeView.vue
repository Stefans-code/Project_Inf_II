<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'

const router = useRouter()
const isLogged = ref(false)
const userEmail = ref("")
const password = ref("")

// Controlla se l'utente è già loggato all'avvio
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLogged.value = true
      userEmail.value = user.email
    } else {
      isLogged.value = false
    }
  })
})

/** 
 * Funzione di Login tramite Firebase
 */
const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, userEmail.value, password.value)
    alert("Login effettuato con successo!")
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      alert("Utente non trovato. Clicca su Registrati per creare un account.")
    } else {
      alert("Errore: " + error.message)
    }
  }
}

/** 
 * Funzione di Registrazione tramite Firebase
 */
const handleRegister = async () => {
  try {
    await createUserWithEmailAndPassword(auth, userEmail.value, password.value)
    alert("Account creato con successo!")
  } catch (error) {
    alert("Errore registrazione: " + error.message)
  }
}

const handleLogout = async () => {
  await signOut(auth)
  alert("Logout effettuato.")
}

const startGame = () => router.push('/game')
const goProfile = () => router.push('/profile')
</script>

<template>
  <div class="view-container">
    <h1> GeoQuiz - Firebase Edition </h1>
    
    <div v-if="!isLogged">
      <h2> Accedi o Registrati </h2>
      <label> Email </label>
      <input type="email" v-model="userEmail" placeholder="esempio@email.com" />
      <br>
      <label> Password </label>
      <input type="password" v-model="password" placeholder="Minimo 6 caratteri" />
      <br>
      <button @click="handleLogin"> Accedi </button>
      <button @click="handleRegister"> Registrati </button>
    </div>

    <div v-else>
      <p>Sessione attiva: <strong>{{ userEmail }}</strong></p>
      <div class="menu-buttons">
        <button @click="startGame"> Inizia Partita </button><br>
        <button @click="goProfile"> Il mio Profilo </button><br>
        <button @click="router.push('/leaderboard')"> Classifica Globale </button><br>
        <button @click="router.push('/about')"> Istruzioni di gioco </button><br>
        <button @click="handleLogout" class="btn-logout"> Esci dall'account </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-container {
  text-align: center;
}
.menu-buttons button {
  width: 200px;
  margin: 8px;
  padding: 12px;
}
.btn-logout {
  margin-top: 30px !important;
  background-color: #eee;
}
button {
  margin: 5px;
  padding: 10px 15px;
}
</style>
