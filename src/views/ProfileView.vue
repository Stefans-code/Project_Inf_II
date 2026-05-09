<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const router = useRouter()
const userEmail = ref("Caricamento...")
const highScore = ref(0)

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userEmail.value = user.email
      // Recupera il punteggio da Firestore
      const userRef = doc(db, "scores", user.uid)
      const docSnap = await getDoc(userRef)
      if (docSnap.exists()) {
        highScore.value = docSnap.data().highScore || 0
      }
    } else {
      router.push('/') // Torna alla home se non loggato
    }
  })
})

const goHome = () => router.push('/')
</script>

<template>
  <div class="view-container">
    <h1> Profilo Giocatore (Cloud) </h1>
    <p><strong>Email:</strong> {{ userEmail }}</p>
    <p><strong>Record su Firebase:</strong> {{ highScore }} punti</p>
    
    <button @click="goHome"> Torna al Menu </button>
  </div>
</template>

<style scoped>
.view-container { text-align: center; padding: 20px; }
button { margin: 10px; padding: 10px 20px; }
</style>
