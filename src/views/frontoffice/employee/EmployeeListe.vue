<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Employee } from '@/interfaces/employee'
import type { EmployeeFilters } from '@/interfaces/employeeFilters'
import { employeeService} from '@/services/backoffice/employeeService'
import { Search, Filter, RefreshCw, UserPlus, Eye, Trash2, SlidersHorizontal } from 'lucide-vue-next'
import '@/assets/css/frontoffice/employee.css' // 📦 Importation explicite du CSS

// États des données et chargement
const employees = ref<Employee[]>([])
const isLoading = ref<boolean>(false)
const errorMessage = ref<string | null>(null)

// États des filtres (Multi-critères)
const filters = ref<EmployeeFilters>({
  globalSearch: '',
  genre: '',
  departement: '',
  statut: 'Actif' // Par défaut, on affiche les actifs
})

// Liste des départements pour le filtre (généralement reçue de l'API, ici en dur pour l'exemple)
const departments = ['Ressources Humaines', 'Technologie', 'Commercial', 'Comptabilité', 'Marketing']

// Fonction pour charger les données avec les filtres actuels
async function fetchEmployees() {
  isLoading.value = true
  errorMessage.value = null
  try {
    employees.value = await employeeService.getEmployees(filters.value)
  } catch (error) {
    errorMessage.value = "Erreur lors de la récupération des salariés."
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// Réinitialiser tous les filtres
function resetFilters() {
  filters.value = {
    globalSearch: '',
    genre: '',
    departement: '',
    statut: ''
  }
  fetchEmployees()
}

// Charger les salariés au démarrage
onMounted(() => {
  fetchEmployees()
})
</script>

<template>
  <div class="employees-container">
    
    <!-- En-tête de la page -->
    <div class="page-header">
      <div>
        <h2>Répertoire des Salariés</h2>
        <p class="subtitle">Consultez, recherchez et gérez les fiches de vos collaborateurs.</p>
      </div>
      <button class="btn-primary">
        <UserPlus class="h-4 w-4" />
        <span>Ajouter un salarié</span>
      </button>
    </div>

    <!-- Zone de Recherche Multi-critères -->
    <div class="filters-card">
      <div class="filters-header">
        <SlidersHorizontal class="h-4 w-4 text-muted" />
        <h3>Recherche multi-critères</h3>
      </div>
      
      <form @submit.prevent="fetchEmployees" class="filters-grid">
        <!-- Critère 1 : Recherche textuelle globale -->
        <div class="filter-group global-search">
          <label for="search">Recherche globale</label>
          <div class="input-icon-wrapper">
            <Search class="h-4 w-4 input-icon" />
            <input 
              id="search"
              type="text" 
              v-model="filters.globalSearch" 
              placeholder="Nom, prénom, référence..."
            />
          </div>
        </div>

        <!-- Critère 2 : Le Genre -->
        <div class="filter-group">
          <label for="genre">Genre</label>
          <select id="genre" v-model="filters.genre">
            <option value="">Tous les genres</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <!-- Critère 3 : Le Département -->
        <div class="filter-group">
          <label for="dept">Département</label>
          <select id="dept" v-model="filters.departement">
            <option value="">Tous les départements</option>
            <option v-for="dept in departments" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
        </div>

        <!-- Critère 4 : Le Statut -->
        <div class="filter-group">
          <label for="statut">Statut</label>
          <select id="statut" v-model="filters.statut">
            <option value="">Tous les statuts</option>
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
          </select>
        </div>

        <!-- Actions du formulaire -->
        <div class="filters-actions">
          <button type="button" class="btn-secondary" @click="resetFilters" :disabled="isLoading">
            Réinitialiser
          </button>
          <button type="submit" class="btn-primary-action" :disabled="isLoading">
            <RefreshCw class="h-4 w-4 spin" v-if="isLoading" />
            <Filter class="h-4 w-4" v-else />
            <span>Filtrer</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Section Message d'erreur -->
    <div v-if="errorMessage" class="error-banner">
      {{ errorMessage }}
    </div>

    <!-- Tableau des résultats -->
    <div class="table-card">
      <div class="table-wrapper">
        <table class="employees-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Collaborateur</th>
              <th>Genre</th>
              <th>Département</th>
              <th>Poste</th>
              <th>Statut</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Cas où la liste est vide -->
            <tr v-if="employees.length === 0 && !isLoading">
              <td colspan="7" class="text-center empty-table">
                Aucun salarié ne correspond à vos critères de recherche.
              </td>
            </tr>

            <!-- Lignes d'employés -->
            <tr v-for="emp in employees" :key="emp.ref_employe">
              <td class="font-mono">{{ emp.ref_employe }}</td>
              <td>
                <div class="user-info">
                  <span class="user-name">{{ emp.nom }} {{ emp.prenom }}</span>
                </div>
              </td>
              <td>{{ emp.genre }}</td>
              <td>{{ emp.departement }}</td>
              <td>{{ emp.poste }}</td>
              <td>
                <span class="badge" :class="emp.statut.toLowerCase()">
                  {{ emp.statut }}
                </span>
              </td>
              <td class="text-center actions-cell">
                <button class="btn-icon" title="Voir la fiche">
                  <Eye class="h-4 w-4" />
                </button>
                <button class="btn-icon delete" title="Supprimer">
                  <Trash2 class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>