<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = localStorage.getItem('username')

// Se non c'è un utente loggato, rimanda alla pagina di Login
onMounted(() => {
  if (localStorage.getItem('userLogged') !== 'true') {
    router.push('/login')
  }
})

const handleLogout = () => {
  localStorage.removeItem('userLogged')
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

<template>
  <div class="view-container md-card">
    <h1>GeoQuiz</h1>
    <p>Welcome back, <strong>{{ username }}</strong>.</p>
    
    <div class="menu-list">
      <button @click="router.push('/game')" class="btn-filled">Play Now</button>
      <button @click="router.push('/profile')" class="btn-tonal">My Profile</button>
      <button @click="router.push('/leaderboard')" class="btn-tonal">Leaderboard</button>
      <button @click="router.push('/about')" class="btn-outlined">Instructions</button>
      <button @click="handleLogout" class="btn-outlined logout-btn">Logout</button>
    </div>
  </div>
</template>

<style scoped>
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.logout-btn {
  margin-top: 16px;
  color: var(--md-sys-color-error);
  border-color: var(--md-sys-color-error);
}

.logout-btn:hover {
  background-color: rgba(179, 38, 30, 0.08);
}
</style>
