<script setup lang="ts">
import { ref } from 'vue'
import { resetService } from '@/services/backoffice/resetService'
import { Trash2, RefreshCw, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-vue-next'
import '@/assets/css/backoffice/reset.css'

// Définition des statuts possibles pour chaque endpoint
type Status = 'idle' | 'pending' | 'success' | 'error'

// États pour suivre chaque module individuellement
const statusProducts = ref<Status>('idle')
const statusHolidays = ref<Status>('idle')
const statusExpenses = ref<Status>('idle')
const statusStocks = ref<Status>('idle')

const isGlobalLoading = ref<boolean>(false)
const showGlobalSuccess = ref<boolean>(false)

async function runFullReset() {
  const confirmAction = confirm(
    "⚠️ ATTENTION : Vous allez réinitialiser les modules Produits, Congés, Notes de frais et Stocks.\n\nÊtes-vous sûr de vouloir continuer ?"
  )
  
  if (!confirmAction) return

  // Initialisation des états
  isGlobalLoading.value = true
  showGlobalSuccess.value = false
  statusProducts.value = 'pending'
  statusHolidays.value = 'pending'
  statusExpenses.value = 'pending'
  statusStocks.value = 'pending'

  // 1. Réinitialisation des Produits
  try {
    statusProducts.value = 'pending'
    await resetService.resetProducts()
    statusProducts.value = 'success'
  } catch (error) {
    statusProducts.value = 'error'
  }

  // 2. Réinitialisation des Congés
  try {
    statusHolidays.value = 'pending'
    await resetService.resetHolidays()
    statusHolidays.value = 'success'
  } catch (error) {
    statusHolidays.value = 'error'
  }

  // 3. Réinitialisation des Notes de frais
  try {
    statusExpenses.value = 'pending'
    await resetService.resetExpenseReports()
    statusExpenses.value = 'success'
  } catch (error) {
    statusExpenses.value = 'error'
  }

  // 4. Réinitialisation des Stocks et Entrepôts
  try {
    statusStocks.value = 'pending'
    await resetService.resetStocks()
    statusStocks.value = 'success'
  } catch (error) {
    statusStocks.value = 'error'
  }

  isGlobalLoading.value = false
  
  // Si aucun n'a échoué, on affiche le succès global
  if (
    statusProducts.value === 'success' &&
    statusHolidays.value === 'success' &&
    statusExpenses.value === 'success' &&
    statusStocks.value === 'success'
  ) {
    showGlobalSuccess.value = true
  }
}
</script>

<template>
  <div class="reset-page-container">
    <h2>Maintenance Système</h2>
    <p class="page-description">Outils de nettoyage et de remise à zéro des bases de données de l'application.</p>

    <div class="danger-zone-card">
      <div>
        <span class="card-title">Zone de danger : Purge des Endpoints</span>
        <p class="card-description">
          Cette action va effacer définitivement le contenu des 4 modules sélectionnés ci-dessous sur votre instance Dolibarr.
        </p>
      </div>

      <div class="endpoints-list">
        
        <div class="endpoint-item">
          <span>Module Produits (<code>/products</code>)</span>
          <span :class="['status-badge', statusProducts]">
            {{ statusProducts === 'idle' ? 'En attente' : statusProducts === 'pending' ? 'Purge...' : statusProducts === 'success' ? 'Vidé' : 'Erreur' }}
          </span>
        </div>

        <div class="endpoint-item">
          <span>Module Congés (<code>/holidays</code>)</span>
          <span :class="['status-badge', statusHolidays]">
            {{ statusHolidays === 'idle' ? 'En attente' : statusHolidays === 'pending' ? 'Purge...' : statusHolidays === 'success' ? 'Vidé' : 'Erreur' }}
          </span>
        </div>

        <div class="endpoint-item">
          <span>Module Notes de frais (<code>/expensereports</code>)</span>
          <span :class="['status-badge', statusExpenses]">
            {{ statusExpenses === 'idle' ? 'En attente' : statusExpenses === 'pending' ? 'Purge...' : statusExpenses === 'success' ? 'Vidé' : 'Erreur' }}
          </span>
        </div>

        <div class="endpoint-item">
          <span>Module Entrepôts & Stocks (<code>/warehouses</code>)</span>
          <span :class="['status-badge', statusStocks]">
            {{ statusStocks === 'idle' ? 'En attente' : statusStocks === 'pending' ? 'Purge...' : statusStocks === 'success' ? 'Vidé' : 'Erreur' }}
          </span>
        </div>

      </div>

      <button 
        class="btn-destructive" 
        :disabled="isGlobalLoading" 
        @click="runFullReset"
      >
        <RefreshCw class="h-4 w-4 spin" v-if="isGlobalLoading" />
        <Trash2 class="h-4 w-4" v-else />
        <span>{{ isGlobalLoading ? 'Purge globale en cours...' : 'Lancer la réinitialisation des 4 modules' }}</span>
      </button>
    </div>

    <div v-if="showGlobalSuccess" class="global-success-zone">
      Tous les endpoints spécifiés ont été purgés et réinitialisés avec succès.
    </div>
  </div>
</template>