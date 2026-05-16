<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="py-10" fluid>
        <RouterView />
      </v-container>
    </v-main>

    <v-footer app color="transparent" class="justify-center pb-4" elevation="0">
      <div class="footer-text">
        &copy; 2026 GeoQuiz Project - Corso Informatica II
      </div>
    </v-footer>
  </v-app>
</template>

<style>
/* Gli stili globali sono gestiti in style.css */
</style>
