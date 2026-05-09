<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app-wrapper">
    <header>
      <!-- Qui potresti mettere un logo o un titolo fisso se vuoi -->
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <p style="text-align: center; margin-top: 50px; font-size: 0.8rem; color: #888;">
        &copy; 2026 GeoQuiz Project
      </p>
    </footer>
  </div>
</template>

<style>
/* Reset base per tutte le pagine */
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #fff;
  color: #333;
}

#app-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
