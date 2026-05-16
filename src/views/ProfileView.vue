<script setup>
/**
 * PROFILE VIEW - I Record Personali
 * Recupera i dati dell'utente loggato per mostrare il suo record storico.
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const router = useRouter()
const username = ref(localStorage.getItem('username') || "Guest")
const highScore = ref(0)

/**
 * Caricamento dati: Recuperiamo il record dal documento specifico dell'utente.
 */
onMounted(async () => {
  if (username.value !== "Guest") {
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
  <v-card class="pa-8 text-center mx-auto" elevation="10" rounded="xl" width="100%" max-width="400">
    <!-- v-avatar: Cerchio perfetto per l'immagine o l'icona dell'utente -->
    <v-avatar color="primary-container" size="80" class="mb-4">
      <v-icon icon="mdi-account" size="48" color="primary"></v-icon>
    </v-avatar>
    
    <h1 class="text-h4 font-weight-bold mb-6">Player Profile</h1>
    
    <!-- Info Box con gerarchia chiara (text-overline per le etichette) -->
    <v-card variant="tonal" color="primary" class="pa-6 mb-8" rounded="lg">
      <div class="text-overline mb-1 text-primary">Username</div>
      <div class="text-h5 font-weight-bold mb-4">{{ username }}</div>
      
      <v-divider class="mb-4" opacity="0.1"></v-divider>
      
      <div class="text-overline mb-1 text-primary">Personal Record</div>
      <div class="text-h3 font-weight-black text-primary">
        {{ highScore }} <span class="text-h6 font-weight-medium">pts</span>
      </div>
    </v-card>
    
    <v-btn @click="goHome" color="primary" size="large" rounded="lg" block prepend-icon="mdi-home">
      Back to Menu
    </v-btn>
  </v-card>
</template>

<style scoped>
/* CSS Spostato in style.css */
</style>
