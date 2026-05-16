<script setup>
/**
 * ABOUT VIEW - Istruzioni e Info
 * Spiega all'utente come giocare. Mostra l'uso di v-list e icone.
 */
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => router.push('/')
</script>

<template>
  <!-- mx-auto e max-width assicurano che la card sia centrata e leggibile su ogni schermo -->
  <v-card class="pa-8 mx-auto" elevation="10" rounded="xl" width="100%" max-width="550">
    <div class="text-center mb-4">
      <v-icon icon="mdi-help-circle-outline" size="64" color="primary" class="mb-2"></v-icon>
      <h1 class="text-h4 font-weight-bold">How to Play</h1>
    </div>
    
    <p class="text-body-1 mb-6 text-center">
      GeoQuiz is an educational platform to challenge your geographical knowledge.
    </p>
    
    <!-- 
      v-list: Componente per elenchi ordinati.
      bg-white-transparent: Classe definita in style.css per l'effetto vetro.
    -->
    <v-list class="text-left bg-transparent mb-6">
      <v-list-item prepend-icon="mdi-target" title="Select one of the 3 available game modes." rounded="lg" class="mb-2 bg-white-transparent"></v-list-item>
      <v-list-item prepend-icon="mdi-book-open-page-variant" title="Read the fact or curiosity sourced from Wikipedia." rounded="lg" class="mb-2 bg-white-transparent"></v-list-item>
      <v-list-item prepend-icon="mdi-magnify" title="Identify the correct country from the 4 options provided." rounded="lg" class="mb-2 bg-white-transparent"></v-list-item>
      <v-list-item prepend-icon="mdi-star" title="Reach the maximum score of 5 points to win!" rounded="lg" class="mb-2 bg-white-transparent"></v-list-item>
    </v-list>
    
    <v-divider class="mb-4"></v-divider>
    <div class="text-center">
      <p class="text-caption text-medium-emphasis mb-6">Academic Project - Corso Informatica II</p>
      <v-btn @click="goHome" color="primary" size="large" rounded="lg" block prepend-icon="mdi-arrow-left">
        Back to Menu
      </v-btn>
    </div>
  </v-card>
</template>

<style scoped>
/* CSS Spostato in style.css */
</style>
