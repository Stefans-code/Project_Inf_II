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

const goHome = () => router.push('/')
</script>

<template>
  <div class="view-container">
    <h1> Players leaderboard 🏆 </h1>
    
    <div v-if="isLoading">Loading leaderboard...</div>
    
    <table v-else align="center" border="1" cellpadding="10" style="border-collapse: collapse; width: 80%; max-width: 500px;">
      <thead>
        <tr>
          <th>Pos.</th>
          <th>Player</th>
          <th>Record</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in highScores" :key="entry.username">
          <td>{{ index + 1 }}</td>
          <td>{{ entry.username }}</td>
          <td>{{ entry.highScore }}</td>
        </tr>
      </tbody>
    </table>
    <br>
    <button @click="goHome"> Back to Menu </button>
  </div>
</template>

<style scoped>
.view-container { text-align: center; padding: 20px; }
button { margin: 10px; padding: 10px 20px; }
</style>
