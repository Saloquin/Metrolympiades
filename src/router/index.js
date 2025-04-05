import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user' // Store utilisateur

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import TeamManagementView from '@/views/TeamManagementView.vue'
import MatchManagementView from '@/views/MatchManagementView.vue'
import RankingView from '@/views/RankingView.vue'
import TeamInfoView from '@/views/TeamInfoView.vue'

// Définir une configuration des routes non protégées
const routeOklm = ['Home', 'Login', 'Register', 'Ranking']

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView },
  { path: '/manage-members', name: 'TeamManagement', component: TeamManagementView },
  { path: '/team', name: 'TeamInfoView', component: TeamInfoView },
  { path: '/manage-match', name: 'MatchManagement', component: MatchManagementView },
  { path: '/ranking', name: 'Ranking', component: RankingView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (!routeOklm.includes(to.name) && !userStore.isLoggedIn) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
