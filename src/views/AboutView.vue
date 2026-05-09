<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="view-container">
    <h1> Informazioni sul Gioco </h1>
    <div class="info-text">
      <p><strong>GeoQuiz</strong> è un progetto educativo che mette alla prova le tue conoscenze geografiche.</p>
      <h2> Come si gioca: </h2>
      <ul style="text-align: left; display: inline-block;">
        <li>Scegli una modalità di gioco tra le 3 disponibili.</li>
        <li>Leggi il fatto o la curiosità recuperata da Wikipedia.</li>
        <li>Indovina a quale paese si riferisce tra le 4 opzioni.</li>
        <li>Cerca di totalizzare il punteggio massimo (5 punti)!</li>
      </ul>
      <p><em>Sviluppato per il corso di Informatica II.</em></p>
    </div>
    <br>
    <button @click="goHome"> Torna al Menu </button>
  </div>
</template>

<style scoped>
.view-container {
  text-align: center;
  padding: 20px;
}
.info-text {
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}
button {
  margin: 10px;
  padding: 10px 20px;
}
</style>
