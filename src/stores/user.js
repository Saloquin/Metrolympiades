import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isLoggedIn: false,
  }),
  actions: {
    // Lors de l'initialisation, on vérifie si un utilisateur et un token existent dans localStorage
    initializeUser() {
      if (this.currentUser && this.token) {
        this.isLoggedIn = true
      } else {
        this.isLoggedIn = false
      }
    },
    login(userData) {
      this.isLoggedIn = true
      this.currentUser = userData
      this.token = userData.token
      localStorage.setItem('token', userData.token)
      localStorage.setItem('user', JSON.stringify(userData))
    },
    logout() {
      this.isLoggedIn = false
      this.currentUser = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
})
