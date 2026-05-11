<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const router = useRouter()
const username = ref(localStorage.getItem('username') || "Ospite")
const highScore = ref(0)

onMounted(async () => {
  if (username.value !== "Ospite") {
    // Recupera i dati dal documento dell'utente basato sull'Username
    const userRef = doc(db, "utenti", username.value)
    const docSnap = await getDoc(userRef)
    if (docSnap.exists()) {
      highScore.value = docSnap.data().highScore || 0
    }
  }
})

const goHome = () => router.push('/')
</script>

<template>
  <div class="view-container">
    <h1> player profile (Cloud) </h1>
    <p><strong>Email:</strong> {{ userEmail }}</p>
    <p><strong>Record on Firebase:</strong> {{ highScore }} points</p>
    
    <button @click="goHome"> Back to Menu </button>
  </div>
</template>

<style scoped>
.view-container { text-align: center; padding: 20px; }
button { margin: 10px; padding: 10px 20px; }
</style>
