<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const username = ref('')
const password = ref('')

const handleLogin = () => {
  if (username.value && password.value) {
    // Qui andrà la logica del DB Firebase in futuro
    router.push('/')
  } else {
    alert("Inserisci i dati")
  }
}
</script>

<template>
  <div class="login">
    <h1>Accedi o crea un account</h1>
    <label>Username</label>
    <input v-model="username" type="text" />
    <br>
    <label>Password</label>
    <input v-model="password" type="password" />
    <br>
    <button @click="handleLogin">Login e registrazione</button>
    <br>
    <button @click="router.push('/')">Torna indietro</button>
  </div>
</template>

<style scoped>
.login {
  text-align: center;
}
input {
  margin: 10px;
}
button {
  margin: 5px;
}
</style>
