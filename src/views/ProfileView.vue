<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const router = useRouter()
const username = ref(localStorage.getItem('username') || "Guest")
const highScore = ref(0)

onMounted(async () => {
  if (username.value !== "Guest") {
    // Recupera i dati dal documento dell'utente basato sull'Username
    const userRef = doc(db, "utenti", username.value)
    const docSnap = await getDoc(userRef)
    if (docSnap.exists()) {
      highScore.value = docSnap.data().highScore || 0
    }
  }
})

const goHome = () => router.push('/')
</script>

<template>
  <div class="view-container md-card profile-view">
    <h1>Player Profile</h1>
    
    <div class="profile-stats">
      <div class="stat-item">
        <label>Username</label>
        <span class="stat-value">{{ username }}</span>
      </div>
      <div class="stat-item">
        <label>Personal Record</label>
        <span class="stat-value">{{ highScore }} points</span>
      </div>
    </div>
    
    <button @click="goHome" class="btn-filled">Back to Menu</button>
  </div>
</template>

<style scoped>
.profile-view {
  max-width: 400px;
}

.profile-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
  text-align: left;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  background-color: var(--md-sys-color-surface);
  border-radius: 16px;
  border: 1px solid var(--md-sys-color-outline);
}

.stat-item label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--md-sys-color-secondary);
  font-weight: 500;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--md-sys-color-primary);
}
</style>
