<script setup lang="ts">
import { ref } from 'vue'
import { useImport } from '@/composables/backoffice/useImport'
import { UploadCloud, FileSpreadsheet, Check, RefreshCw, AlertCircle } from 'lucide-vue-next'
import '@/assets/css/backoffice/import.css'

const {
  employeesFileName,
  employeesHeaders,
  employeesRows,
  salariesFileName,
  salariesHeaders,
  salariesRows,
  isLoading,
  successMessage,
  errorMessage,
  hasDataToImport,
  loadFile,
  removeFile,
  submitGlobalImport
} = useImport()

// Références HTML pour ouvrir l'explorateur de fichiers au clic
const fileInputEmployees = ref<HTMLInputElement | null>(null)
const fileInputSalaries = ref<HTMLInputElement | null>(null)

// Gestion du drag and drop & sélection manuelle
function onFileChange(event: Event, target: 'employees' | 'salaries') {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    loadFile(input.files[0], target)
  }
}

function onDrop(event: DragEvent, target: 'employees' | 'salaries') {
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    loadFile(event.dataTransfer.files[0], target)
  }
}
</script>

<template>
  <div class="import-page-container">
    <h2>Gestionnaire d'Importations CSV</h2>
    <p class="page-description">
      Préparez vos fichiers ci-dessous. Vous pouvez importer un seul fichier ou les deux simultanément.
    </p>

    <div v-if="successMessage" class="toast-success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="toast-error">{{ errorMessage }}</div>

    <div class="import-grid">
      
      <div class="import-card-slot">
        <div class="card-slot-title">📦 Fichier 1 : Répertoire des Employés</div>
        
        <div 
          class="file-dropzone"
          :class="{ 'has-file': employeesFileName }"
          @dragover.prevent
          @drop.prevent="onDrop($event, 'employees')"
          @click="fileInputEmployees?.click()"
        >
          <input 
            type="file" 
            ref="fileInputEmployees" 
            class="file-input-hidden" 
            accept=".csv"
            @change="onFileChange($event, 'employees')"
          />
          <UploadCloud class="h-8 w-8 text-muted" v-if="!employeesFileName" />
          <FileSpreadsheet class="h-8 w-8" v-else style="color: var(--success-color);" />
          
          <div class="dropzone-text">
            <h4 v-if="!employeesFileName">Glissez ou sélectionnez le CSV Employés</h4>
            <h4 v-else style="color: var(--success-color);">{{ employeesFileName }}</h4>
            <p>{{ employeesFileName ? 'Fichier prêt' : 'Colonnes attendues : ref_employe, nom, genre...' }}</p>
          </div>
        </div>
        <button v-if="employeesFileName" class="btn-remove-file" @click="removeFile('employees')">Retirer le fichier</button>
      </div>

      <div class="import-card-slot">
        <div class="card-slot-title">💳 Fichier 2 : Salaires & Justificatifs</div>
        
        <div 
          class="file-dropzone"
          :class="{ 'has-file': salariesFileName }"
          @dragover.prevent
          @drop.prevent="onDrop($event, 'salaries')"
          @click="fileInputSalaries?.click()"
        >
          <input 
            type="file" 
            ref="fileInputSalaries" 
            class="file-input-hidden" 
            accept=".csv"
            @change="onFileChange($event, 'salaries')"
          />
          <UploadCloud class="h-8 w-8 text-muted" v-if="!salariesFileName" />
          <FileSpreadsheet class="h-8 w-8" v-else style="color: var(--success-color);" />
          
          <div class="dropzone-text">
            <h4 v-if="!salariesFileName">Glissez ou sélectionnez le CSV Salaires</h4>
            <h4 v-else style="color: var(--success-color);">{{ salariesFileName }}</h4>
            <p>{{ salariesFileName ? 'Fichier prêt' : 'Colonnes attendues : ref_salaire, ref_employe, montant...' }}</p>
          </div>
        </div>
        <button v-if="salariesFileName" class="btn-remove-file" @click="removeFile('salaries')">Retirer le fichier</button>
      </div>

    </div>

    <div class="global-action-bar">
      <button 
        class="btn-primary" 
        :disabled="!hasDataToImport || isLoading" 
        @click="submitGlobalImport"
      >
        <RefreshCw class="h-4 w-4 spin" v-if="isLoading" />
        <Check class="h-4 w-4" v-else />
        <span>{{ isLoading ? 'Importation groupée en cours...' : "Lancer l'importation des fichiers chargés" }}</span>
      </button>
    </div>

    <div class="preview-container" v-if="employeesRows.length > 0 || salariesRows.length > 0">
      
      <div v-if="employeesRows.length > 0" class="preview-block">
        <div class="preview-block-title">Aperçu : Fichier Employés ({{ employeesRows.length }} lignes)</div>
        <div class="preview-table-wrapper">
          <table class="preview-table">
            <thead>
              <tr>
                <th v-for="h in employeesHeaders" :key="h">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in employeesRows.slice(0, 5)" :key="idx">
                <td v-for="h in employeesHeaders" :key="h">{{ row[h] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="salariesRows.length > 0" class="preview-block">
        <div class="preview-block-title">Aperçu : Fichier Salaires ({{ salariesRows.length }} lignes)</div>
        <div class="preview-table-wrapper">
          <table class="preview-table">
            <thead>
              <tr>
                <th v-for="h in salariesHeaders" :key="h">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in salariesRows.slice(0, 5)" :key="idx">
                <td v-for="h in salariesHeaders" :key="h" :title="row[h]">{{ row[h] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>