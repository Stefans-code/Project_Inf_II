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
  if (!username.value && !password.value) return alert("Insert the data!")
  else if (!username.value) return alert("Username is missing")
  else if (!password.value) return alert("Password is missing")
  
  try {
    const userRef = doc(db, "utenti", username.value)
    const docSnap = await getDoc(userRef)

    if (docSnap.exists() && docSnap.data().password === password.value) {
      localStorage.setItem('userLogged', 'true')
      localStorage.setItem('username', username.value)
      router.push('/') // Va alla Home (Menu) dopo il login
    } else {
      alert("Wrong credentials!")
    }
  } catch (error) {
    alert("Error: " + error.message)
  }
}

/** 
 * REGISTRAZIONE: Crea un nuovo utente
 */
const handleRegister = async () => {
  if (!username.value && !password.value) return alert("Insert the data!")
  else if (!username.value) return alert("Username is missing")
  else if (!password.value) return alert("Password is missing")
  
  try {
    const userRef = doc(db, "utenti", username.value)
    const docSnap = await getDoc(userRef)

    if (docSnap.exists()) {
      alert("Username already existing!")
    } else {
      await setDoc(userRef, { password: password.value, highScore: 0 })
      alert("Sign in completed!")
    }
  } catch (error) {
    alert("Error: " + error.message)
  }
}
</script>

<template>
  <div class="view-container md-card">
    <h1>GeoQuiz</h1>
    <p>Sign in to continue</p>
    
    <div class="login-form">
      <div class="md-field">
        <input type="text" v-model="username" placeholder="Username" />
      </div>
      <div class="md-field">
        <input type="password" v-model="password" placeholder="Password" />
      </div>
      
      <button @click="handleLogin" class="btn-filled">Login</button>
      <button @click="handleRegister" class="btn-tonal">Register</button>
    </div>
  </div>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
