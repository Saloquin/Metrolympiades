import { useUserStore } from '@/stores/user' // Store utilisateur
import { createRouter, createWebHistory } from 'vue-router'

import ActivityManagementView from '@/views/ActivityManagementView.vue'
import DashboardView from '@/views/DashboardView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import MatchInfoView from '@/views/MatchInfoView.vue'
import MatchManagementView from '@/views/MatchManagementView.vue'
import RankingView from '@/views/RankingView.vue'
import RegisterView from '@/views/RegisterView.vue'
import TeamInfoView from '@/views/TeamInfoView.vue'
import TeamManagementView from '@/views/TeamManagementView.vue'

// Définir une configuration des routes non protégées
const routeOklm = ['Home', 'Login', 'Register', 'Ranking']

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView },
  { path: '/manage-members', name: 'TeamManagement', component: TeamManagementView },
  { path: '/team', name: 'TeamInfoView', component: TeamInfoView },
  { path: '/matches', name: 'MatchInfoView', component: MatchInfoView },
  { path: '/manage-match', name: 'MatchManagement', component: MatchManagementView },
  { path: '/ranking', name: 'Ranking', component: RankingView },
  { path: '/manage-activities', name: 'ActivityManagement', component: ActivityManagementView }
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
