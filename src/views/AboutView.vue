<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="view-container">
    <h1> Info about the game </h1>
    <div class="info-text">
      <p><strong>GeoQuiz</strong> is an educational project to challenge your geographical knowledge.</p>
      <h2> How to play: </h2>
      <ul style="text-align: left; display: inline-block;">
        <li>Select a gamemode between the 3 options.</li>
        <li>Read the fact or curiosity took from Wikipedia.</li>
        <li>Guess about what country is between the 4 options.</li>
        <li>Try to obtain the maximum score (5 points)!</li>
      </ul>
      <p><em>Developed for the course of Informatic II.</em></p>
    </div>
    <br>
    <button @click="goHome"> Back to the Menu </button>
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
