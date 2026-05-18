import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import GameView from '../views/GameView.vue'
import ProfileView from '../views/ProfileView.vue'
import LeaderboardView from '../views/LeaderboardView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/', name: 'home', component: HomeView },
    { path: '/game', name: 'game', component: GameView },
    { path: '/profile', name: 'profile', component: ProfileView },
    { path: '/leaderboard', name: 'leaderboard', component: LeaderboardView },
    { path: '/about', name: 'about', component: AboutView }
  ]
})

// Navigation Guard: Forza l'autenticazione. Se non loggato, reindirizza a /login.
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('username')
  
  if (to.name !== 'login' && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
