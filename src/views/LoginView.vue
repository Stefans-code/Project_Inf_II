<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const router = useRouter()
const username = ref("")
const password = ref("")

/** 
 * LOGIN: Controlla le credenziali su Firestore
 */
const handleLogin = async () => {
  if (!username.value || !password.value) return alert("Inserisci i dati!")
  
  try {
    const userRef = doc(db, "utenti", username.value)
    const docSnap = await getDoc(userRef)

    if (docSnap.exists() && docSnap.data().password === password.value) {
      localStorage.setItem('userLogged', 'true')
      localStorage.setItem('username', username.value)
      router.push('/') // Va alla Home (Menu) dopo il login
    } else {
      alert("Credenziali errate!")
    }
  } catch (error) {
    alert("Errore: " + error.message)
  }
}

/** 
 * REGISTRAZIONE: Crea un nuovo utente
 */
const handleRegister = async () => {
  if (!username.value || !password.value) return alert("Inserisci i dati!")
  
  try {
    const userRef = doc(db, "utenti", username.value)
    const docSnap = await getDoc(userRef)

    if (docSnap.exists()) {
      alert("Username già esistente!")
    } else {
      await setDoc(userRef, { password: password.value, highScore: 0 })
      alert("Registrazione completata!")
    }
  } catch (error) {
    alert("Errore: " + error.message)
  }
}
</script>

<template>
  <div class="view-container">
    <h1> Benvenuto su GeoQuiz 🌍 </h1>
    <div class="login-box">
      <h2> Accedi per continuare </h2>
      <input type="text" v-model="username" placeholder="Username" /><br>
      <input type="password" v-model="password" placeholder="Password" /><br>
      <button @click="handleLogin"> Login </button>
      <button @click="handleRegister"> Registrati </button>
    </div>
  </div>
</template>

<style scoped>
.view-container { text-align: center; padding-top: 50px; }
.login-box { border: 1px solid #ccc; display: inline-block; padding: 30px; border-radius: 8px; }
input { margin: 10px; padding: 10px; }
button { margin: 5px; padding: 10px 20px; cursor: pointer; }
</style>
