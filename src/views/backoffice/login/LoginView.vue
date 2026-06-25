<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/backoffice/auth'

import '@/assets/css/backoffice/login.css'

const authStore = useAuthStore()
const router = useRouter()

// Pré-remplissage automatique avec le code défini en dur dans le store
const accessCode = ref<string>(authStore.SECRET_CODE)
const errorMessage = ref<string | null>(null)

function handleAccess() {
  const success = authStore.login(accessCode.value)
  
  if (success) {
    router.push('/back/accueil')
  } else {
    errorMessage.value = "Code d'accès unique incorrect."
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Accès Backoffice</h2>
      <p class="subtitle">Veuillez valider le code d'accès unique pré-rempli pour vous connecter à l'administration.</p>

      <form @submit.prevent="handleAccess">
        <div class="form-group">
          <label for="code">Code de sécurité</label>
          <input 
            id="code"
            type="password" 
            v-model="accessCode" 
            placeholder="Entrez le code unique"
            required
          />
        </div>

        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

        <button type="submit" class="btn-submit">
          Entrer dans le Backoffice
        </button>
      </form>
    </div>
  </div>
</template>