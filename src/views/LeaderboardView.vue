<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const highScores = ref([])

onMounted(() => {
  // Simuliamo una classifica recuperando i dati locali o mettendone di prova
  const localScore = localStorage.getItem('highScore') || "0"
  const username = localStorage.getItem('username') || "Tu"
  
  highScores.value = [
    { name: username, score: parseInt(localScore) },
    { name: "Marco", score: 4 },
    { name: "Sofia", score: 3 },
    { name: "Luca", score: 2 }
  ].sort((a, b) => b.score - a.score)
})

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="view-container">
    <h1> Classifica Globale </h1>
    <table align="center" border="1" cellpadding="10" style="border-collapse: collapse; width: 80%; max-width: 400px;">
      <thead>
        <tr>
          <th>Posizione</th>
          <th>Giocatore</th>
          <th>Punteggio</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in highScores" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ entry.name }}</td>
          <td>{{ entry.score }}</td>
        </tr>
      </tbody>
    </table>
    <br>
    <button @click="goHome"> Torna al Menu </button>
  </div>
</template>

<style scoped>
.view-container {
  text-align: center;
  padding: 20px;
}
button {
  margin: 10px;
  padding: 10px 20px;
}
</style>
