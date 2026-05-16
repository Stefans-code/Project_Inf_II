<script setup>
/**
 * HOME VIEW - Il Menu Principale del Gioco
 * In questa pagina l'utente può scegliere cosa fare (Giocare, Profilo, Classifica, Istruzioni).
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
// Recuperiamo l'username salvato localmente per dare un benvenuto personalizzato
const username = ref(localStorage.getItem('username') || "Guest")

/**
 * Funzione di Logout: Pulisce il nome utente e torna al login.
 * Utile per l'esame spiegare come 'localStorage' mantiene la sessione.
 */
const handleLogout = () => {
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

<template>
  <!-- 
    v-card: Il contenitore principale in stile Material Design.
    mx-auto: Centra la card orizzontalmente.
    elevation: Aggiunge un'ombra per dare profondità.
    max-width: Impedisce alla card di diventare troppo larga su PC.
  -->
  <v-card class="pa-8 text-center mx-auto" elevation="8" rounded="xl" width="100%" max-width="450">
    <!-- Icona del Mondo per richiamare il tema del gioco -->
    <v-icon icon="mdi-earth" size="x-large" color="primary" class="mb-2"></v-icon>
    <h1 class="text-h4 font-weight-bold mb-2">GeoQuiz</h1>
    <p class="mb-6">Welcome back, <strong class="text-primary">{{ username }}</strong>.</p>
    
    <!-- 
      v-row e v-col: Il sistema a griglia di Vuetify che rende il layout ADATTIVO.
      cols="12": Su schermi piccoli occupa tutta la larghezza.
    -->
    <v-row dense>
      <v-col cols="12">
        <v-btn to="/game" color="primary" size="x-large" rounded="lg" block prepend-icon="mdi-play">
          Play Now
        </v-btn>
      </v-col>
      
      <v-col cols="12" sm="6">
        <v-btn to="/profile" variant="tonal" size="large" rounded="lg" block prepend-icon="mdi-account">
          My Profile
        </v-btn>
      </v-col>
      
      <v-col cols="12" sm="6">
        <v-btn to="/leaderboard" variant="tonal" size="large" rounded="lg" block prepend-icon="mdi-trophy">
          Leaderboard
        </v-btn>
      </v-col>
      
      <v-col cols="12">
        <v-btn to="/about" variant="outlined" size="large" rounded="lg" block prepend-icon="mdi-information">
          Instructions
        </v-btn>
      </v-col>
      
      <v-col cols="12" class="mt-4">
        <v-btn @click="handleLogout" variant="text" color="error" block prepend-icon="mdi-logout">
          Logout
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
/* Gli stili sono stati spostati in style.css per ordine e pulizia */
</style>
