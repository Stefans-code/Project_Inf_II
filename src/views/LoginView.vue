<script setup>
/**
 * LOGIN VIEW - Accesso e Registrazione
 * Gestisce l'autenticazione tramite Username. In un progetto accademico,
 * questo dimostra l'uso della persistenza dei dati e della navigazione condizionale.
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const router = useRouter()
const username = ref('')
const password = ref('') // Nota: In questo prototipo la password non è verificata per semplicità

/**
 * Gestione Accesso: Controlla se l'utente esiste nel database Firestore.
 */
const handleLogin = async () => {
  if (!username.value) return alert("Please enter a username")
  
  const userRef = doc(db, "utenti", username.value)
  const docSnap = await getDoc(userRef)
  
  if (docSnap.exists()) {
    localStorage.setItem('username', username.value)
    router.push('/')
  } else {
    alert("User not found. Please register first.")
  }
}

/**
 * Gestione Registrazione: Crea un nuovo documento utente su Firebase.
 */
const handleRegister = async () => {
  if (!username.value) return alert("Please enter a username")
  
  const userRef = doc(db, "utenti", username.value)
  const docSnap = await getDoc(userRef)
  
  if (docSnap.exists()) {
    alert("User already exists!")
  } else {
    // Inizializziamo l'utente con un punteggio di 0
    await setDoc(userRef, { 
      highScore: 0, 
      createdAt: new Date() 
    })
    alert("Registration successful! Now login.")
  }
}
</script>

<template>
  <!-- La card è centrata con mx-auto e ha una larghezza massima per PC -->
  <v-card class="pa-8 text-center mx-auto" elevation="12" rounded="xl" width="100%" max-width="400">
    <v-icon icon="mdi-account-circle" size="80" color="primary" class="mb-4"></v-icon>
    <h1 class="text-h4 font-weight-bold mb-2">GeoQuiz</h1>
    <p class="text-body-1 text-medium-emphasis mb-6">Sign in to start your journey</p>
    
    <v-form @submit.prevent>
      <!-- v-text-field: Input moderno di Vuetify con icona e stile 'outlined' -->
      <v-text-field
        v-model="username"
        label="Username"
        prepend-inner-icon="mdi-account"
        variant="outlined"
        rounded="lg"
        class="mb-2"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        label="Password"
        prepend-inner-icon="mdi-lock"
        type="password"
        variant="outlined"
        rounded="lg"
        class="mb-6"
        required
      ></v-text-field>
      
      <!-- Pulsanti con stili diversi (colorato e tonale) per gerarchia visiva -->
      <v-btn 
        @click="handleLogin" 
        color="primary" 
        size="large" 
        rounded="lg" 
        block 
        class="mb-3"
        prepend-icon="mdi-login"
      >
        Login
      </v-btn>

      <v-btn 
        @click="handleRegister" 
        variant="tonal" 
        size="large" 
        rounded="lg" 
        block
        prepend-icon="mdi-account-plus"
      >
        Register
      </v-btn>
    </v-form>
  </v-card>
</template>

<style scoped>
/* Stili esterni in style.css */
</style>
