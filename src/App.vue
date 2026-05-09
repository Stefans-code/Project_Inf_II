<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app-wrapper">
    <header>
      <!-- Punto d'ingresso principale per le diverse pagine del router -->
    </header>

    <main>
      <!-- Questo tag carica dinamicamente la pagina corrispondente all'URL -->
      <RouterView />
    </main>

    <footer>
      <p style="text-align: center; margin-top: 50px; font-size: 0.8rem; color: #888;">
        &copy; 2026 GeoQuiz Project - Corso Informatica II
      </p>
    </footer>
  </div>
</template>

<style>
/* Reset base e stili globali per l'intera applicazione */
body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #ffffff;
  color: #333;
}

#app-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* Stili comuni per i bottoni */
button {
  cursor: pointer;
  border: 1px solid #ccc;
  background: #f9f9f9;
  border-radius: 4px;
}

button:hover {
  background: #e9e9e9;
}
</style>
