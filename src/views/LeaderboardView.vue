<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

const router = useRouter()
const highScores = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    // Recupera la classifica dalla cartella 'utenti', ordinando per highScore
    const q = query(collection(db, "utenti"), orderBy("highScore", "desc"), limit(10))
    const querySnapshot = await getDocs(q)
    const scores = []
    querySnapshot.forEach((doc) => {
      // L'ID del documento è proprio l'username scelto dall'utente
      scores.push({ username: doc.id, ...doc.data() })
    })
    highScores.value = scores
  } catch (error) {
    console.error("Errore classifica:", error)
  } finally {
    isLoading.value = false
  }
})

/** 
 * NAVIGAZIONE: Torna alla pagina principale (Menu).
 */
const goHome = () => router.push('/')
</script>

<template>
  <div class="view-container md-card leaderboard-view">
    <h1>Global Leaderboard</h1>
    
    <div v-if="isLoading" class="loading-state">
      <p>Fetching top explorers...</p>
    </div>
    
    <div v-else class="table-container">
      <table class="md-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in highScores" :key="entry.username">
            <td class="rank-col">{{ index + 1 }}</td>
            <td class="player-col">{{ entry.username }}</td>
            <td class="score-col">{{ entry.highScore }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <button @click="goHome" class="btn-filled back-btn">Back to Menu</button>
  </div>
</template>

<style scoped>
.leaderboard-view {
  max-width: 500px;
}

.loading-state {
  padding: 40px;
  color: var(--md-sys-color-secondary);
}

.table-container {
  margin: 24px 0 32px 0;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid var(--md-sys-color-outline);
}

.md-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.md-table th {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  padding: 12px 16px;
  font-weight: 500;
  font-size: 0.875rem;
}

.md-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--md-sys-color-outline);
  background-color: var(--md-sys-color-surface);
}

.md-table tr:last-child td {
  border-bottom: none;
}

.rank-col { font-weight: 700; width: 60px; color: var(--md-sys-color-primary); }
.score-col { font-weight: 500; text-align: right; }

.back-btn {
  width: 100%;
}
</style>
