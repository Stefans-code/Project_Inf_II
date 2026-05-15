<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
/** 
 * NAVIGAZIONE: Torna alla pagina principale (Menu).
 */
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="view-container md-card about-view">
    <h1>About GeoQuiz</h1>
    
    <div class="info-content">
      <p class="intro">GeoQuiz is an educational platform designed to challenge and expand your geographical knowledge through interactive trivia.</p>
      
      <h2>How to Play</h2>
      <ul class="md-list">
        <li>
          <span class="icon">🎯</span>
          <span>Select one of the 3 available game modes.</span>
        </li>
        <li>
          <span class="icon">📖</span>
          <span>Read the fact or curiosity sourced from Wikipedia.</span>
        </li>
        <li>
          <span class="icon">🔍</span>
          <span>Identify the correct country from the 4 options provided.</span>
        </li>
        <li>
          <span class="icon">⭐</span>
          <span>Reach the maximum score of 5 points to win!</span>
        </li>
      </ul>
      
      <p class="credits">Developed for the <strong>Informatic II</strong> course.</p>
    </div>
    
    <button @click="goHome" class="btn-filled">Back to Menu</button>
  </div>
</template>

<style scoped>
.about-view {
  max-width: 550px;
}

.info-content {
  text-align: left;
  margin-bottom: 32px;
}

.intro {
  font-size: 1.1rem;
  margin-bottom: 24px;
}

h2 {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--md-sys-color-primary);
  margin-bottom: 16px;
}

.md-list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.md-list li {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background-color: var(--md-sys-color-surface);
  border-radius: 12px;
  border: 1px solid var(--md-sys-color-outline);
}

.md-list .icon {
  font-size: 1.5rem;
}

.credits {
  font-size: 0.875rem;
  color: var(--md-sys-color-secondary);
  border-top: 1px solid var(--md-sys-color-outline);
  padding-top: 16px;
  text-align: center;
}
</style>
