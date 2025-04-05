import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import TeamManagementView from '@/views/TeamManagementView.vue'
import MatchManagementView from '@/views/MatchManagementView.vue'
import RankingView from '@/views/RankingView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView },
  { path: '/team', name: 'TeamManagement', component: TeamManagementView },
  { path: '/matches', name: 'MatchManagement', component: MatchManagementView },
  { path: '/ranking', name: 'Ranking', component: RankingView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
