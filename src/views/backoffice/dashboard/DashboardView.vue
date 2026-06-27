<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DashboardStats } from '@/interfaces/dashboardStats'
import { dashboardService} from '@/services/backoffice/dashboardService'
import { Wallet, Users, Landmark, RefreshCw } from 'lucide-vue-next'
import '@/assets/css/backoffice/dashboard.css'

// États de l'interface
const stats = ref<DashboardStats | null>(null)
const isLoading = ref<boolean>(true)
const errorMessage = ref<string | null>(null)

// Chargement des données au montage du composant
onMounted(async () => {
  try {
    stats.value = await dashboardService.getSalaryStats()
  } catch (error) {
    errorMessage.value = "Impossible de charger les statistiques du tableau de bord."
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2>Tableau de Bord des Rémunérations</h2>
      <p class="subtitle">Synthèse de la masse salariale par genre et par mois de règlement.</p>
    </div>

    <!-- Écran de chargement -->
    <div v-if="isLoading" class="loading-state">
      <RefreshCw class="spin h-8 w-8" />
      <p>Génération des tableaux en cours...</p>
    </div>

    <!-- Écran d'erreur -->
    <div v-else-if="errorMessage" class="error-state">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Contenu Principal -->
    <div v-else-if="stats" class="dashboard-content">
      
      <!-- Section KPI (Toujours utile pour un coup d'œil rapide) -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon-wrapper blue">
            <Landmark class="h-6 w-6" />
          </div>
          <div class="kpi-data">
            <span class="kpi-title">Masse Salariale Totale</span>
            <span class="kpi-value">{{ stats.kpis.totalSalaries.toLocaleString() }} €</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-wrapper purple">
            <Users class="h-6 w-6" />
          </div>
          <div class="kpi-data">
            <span class="kpi-title">Effectif Total</span>
            <span class="kpi-value">{{ stats.kpis.totalEmployees }} employés</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-wrapper green">
            <Wallet class="h-6 w-6" />
          </div>
          <div class="kpi-data">
            <span class="kpi-title">Salaire Moyen</span>
            <span class="kpi-value">{{ stats.kpis.averageSalary.toLocaleString() }} €</span>
          </div>
        </div>
      </div>

      <!-- Section Tableaux Récapitulatifs -->
      <div class="tables-grid">
        
        <!-- Tableau 1 : Masse Salariale par Genre -->
        <div class="table-card">
          <h3>Masse Salariale par Genre</h3>
          <div class="table-wrapper">
            <table class="dashboard-table">
              <thead>
                <tr>
                  <th>Genre</th>
                  <th class="text-right">Montant Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(label, idx) in stats.byGender.labels" :key="label">
                  <td class="font-semibold">{{ label }}</td>
                  <td class="text-right numeric-value">
                    {{ stats.byGender.datasets[idx].toLocaleString() }} €
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tableau 2 : Évolution Mensuelle des Règlements -->
        <div class="table-card">
          <h3>Évolution Mensuelle des Règlements</h3>
          <div class="table-wrapper">
            <table class="dashboard-table">
              <thead>
                <tr>
                  <th>Mois / Période</th>
                  <th class="text-right">Total des Règlements</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(label, idx) in stats.byMonth.labels" :key="label">
                  <td>{{ label }}</td>
                  <td class="text-right numeric-value">
                    {{ stats.byMonth.datasets[idx].toLocaleString() }} €
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>