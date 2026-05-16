<script setup>
/**
 * LEADERBOARD VIEW - Classifica Globale
 * Dimostra l'uso di query avanzate su Firestore (orderBy, limit) e la visualizzazione tabellare.
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

const router = useRouter()
const highScores = ref([])
const isLoading = ref(true)

/**
 * Recupero Top 10: Interroghiamo Firestore per ottenere i 10 punteggi più alti.
 */
onMounted(async () => {
  try {
    const q = query(collection(db, "utenti"), orderBy("highScore", "desc"), limit(10))
    const querySnapshot = await getDocs(q)
    const scores = []
    querySnapshot.forEach((doc) => {
      scores.push({ username: doc.id, ...doc.data() })
    })
    highScores.value = scores
  } catch (error) {
    console.error("Errore classifica:", error)
  } finally {
    isLoading.value = false
  }
})

const goHome = () => router.push('/')
</script>

<template>
  <v-card class="pa-6 mx-auto" elevation="8" rounded="xl" width="100%" max-width="500">
    <div class="text-center mb-6">
      <v-icon icon="mdi-trophy-variant" size="48" color="amber-darken-2" class="mb-2"></v-icon>
      <h1 class="text-h4 font-weight-bold">Leaderboard</h1>
      <p class="text-medium-emphasis">Global top explorers</p>
    </div>
    
    <!-- v-card come contenitore della tabella per gestire lo scroll interno -->
    <v-card variant="outlined" rounded="lg" class="mb-6" style="max-height: 400px; overflow-y: auto;">
      <div v-if="isLoading" class="text-center py-10">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-4 text-body-2 text-primary">Loading champions...</p>
      </div>
      
      <!-- v-table: Componente Vuetify per tabelle pulite e reattive -->
      <v-table v-else hover fixed-header>
        <thead>
          <tr>
            <th class="text-left font-weight-bold">Rank</th>
            <th class="text-left font-weight-bold">Player</th>
            <th class="text-right font-weight-bold">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in highScores" :key="entry.username">
            <td>
              <v-avatar 
                size="28" 
                :color="index === 0 ? 'amber' : (index === 1 ? 'grey-lighten-1' : (index === 2 ? 'brown-lighten-1' : 'primary-container'))"
                class="text-caption font-weight-black"
              >
                {{ index + 1 }}
              </v-avatar>
            </td>
            <td>
              <div class="d-flex align-center">
                <v-icon icon="mdi-account" size="small" class="mr-2" color="medium-emphasis"></v-icon>
                <span class="font-weight-medium">{{ entry.username }}</span>
              </div>
            </td>
            <td class="text-right font-weight-bold text-primary">{{ entry.highScore }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
    
    <v-btn @click="goHome" color="primary" size="large" rounded="lg" block prepend-icon="mdi-arrow-left">
      Back to Menu
    </v-btn>
  </v-card>
</template>

<style scoped>
/* CSS Spostato in style.css */
</style>
