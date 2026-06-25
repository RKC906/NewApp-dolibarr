import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Le code secret unique en dur dans le code
  const SECRET_CODE = 'cedric1234'
  
  const isAuthenticated = ref<boolean>(false)

  function login(inputCode: string): boolean {
    if (inputCode === SECRET_CODE) {
      isAuthenticated.value = true
      return true
    }
    isAuthenticated.value = false
    return false
  }

  function logout() {
    isAuthenticated.value = false
  }

  return {
    SECRET_CODE, // On l'exporte pour pouvoir le pré-remplir par défaut
    isAuthenticated,
    login,
    logout
  }
})