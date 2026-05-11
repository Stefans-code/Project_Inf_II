<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app-wrapper">
    <main>
      <RouterView />
    </main>

    <footer>
      <p class="footer-text">
        &copy; 2026 GeoQuiz Project - Corso Informatica II
      </p>
    </footer>
  </div>
</template>

<style>
/* App-level layout */
#app-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-text {
  text-align: center;
  margin-top: 40px;
  font-size: 0.875rem;
  color: #37474f; /* Dark Slate for better contrast */
  font-weight: 500;
}
</style>
