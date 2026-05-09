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
    // Recupera i top 10 punteggi da Firestore ordinati per punteggio decrescente
    const q = query(collection(db, "scores"), orderBy("highScore", "desc"), limit(10))
    const querySnapshot = await getDocs(q)
    const scores = []
    querySnapshot.forEach((doc) => {
      scores.push({ id: doc.id, ...doc.data() })
    })
    highScores.value = scores
  } catch (error) {
    console.error("Errore nel caricamento classifica:", error)
  } finally {
    isLoading.value = false
  }
})

const goHome = () => router.push('/')
</script>

<template>
  <div class="view-container">
    <h1> Classifica Globale (Realtime) </h1>
    
    <div v-if="isLoading">Caricamento dati dal database...</div>
    
    <table v-else align="center" border="1" cellpadding="10" style="border-collapse: collapse; width: 80%; max-width: 500px;">
      <thead>
        <tr>
          <th>Pos.</th>
          <th>Giocatore</th>
          <th>Punteggio</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in highScores" :key="entry.id">
          <td>{{ index + 1 }}</td>
          <td>{{ entry.username }}</td>
          <td>{{ entry.highScore }}</td>
        </tr>
      </tbody>
    </table>
    <br>
    <button @click="goHome"> Torna al Menu </button>
  </div>
</template>

<style scoped>
.view-container { text-align: center; padding: 20px; }
button { margin: 10px; padding: 10px 20px; }
</style>
