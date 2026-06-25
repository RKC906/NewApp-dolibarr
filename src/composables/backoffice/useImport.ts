import { ref, computed } from 'vue'
import { importService } from '@/services/backoffice/importService'

export function useImport() {
  // États pour le Fichier 1 (Employés)
  const employeesFileName = ref<string | null>(null)
  const employeesHeaders = ref<string[]>([])
  const employeesRows = ref<Array<Record<string, string>>>([])

  // États pour le Fichier 2 (Salaires)
  const salariesFileName = ref<string | null>(null)
  const salariesHeaders = ref<string[]>([])
  const salariesRows = ref<Array<Record<string, string>>>([])

  // États globaux de l'interface
  const isLoading = ref<boolean>(false)
  const successMessage = ref<string | null>(null)
  const errorMessage = ref<string | null>(null)

  // Indique si au moins un fichier est prêt à être importé
  const hasDataToImport = computed(() => {
    return employeesRows.value.length > 0 || salariesRows.value.length > 0
  })

  // Parseur CSV robuste
  function parseCSVLine(text: string): string[] {
    const result: string[] = []
    let currentField = ''
    let insideQuotes = false

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      if (char === '"') {
        insideQuotes = !insideQuotes
      } else if (char === ',' && !insideQuotes) {
        result.push(currentField.trim().replace(/^"|"$/g, ''))
        currentField = ''
      } else {
        currentField += char
      }
    }
    result.push(currentField.trim().replace(/^"|"$/g, ''))
    return result
  }

  // Analyse le texte brut et remplit le bon état cible
  function processContent(content: string, target: 'employees' | 'salaries') {
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '')
    if (lines.length === 0) return

    const extractedHeaders = parseCSVLine(lines[0])
    const rows: Array<Record<string, string>> = []

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const rowObject: Record<string, string> = {}
      
      extractedHeaders.forEach((header, index) => {
        rowObject[header] = values[index] || ''
      })
      rows.push(rowObject)
    }

    if (target === 'employees') {
      employeesHeaders.value = extractedHeaders
      employeesRows.value = rows
    } else {
      salariesHeaders.value = extractedHeaders
      salariesRows.value = rows
    }
    
    // Réinitialise les messages lors d'un nouvel ajout
    successMessage.value = null
    errorMessage.value = null
  }

  // Handler générique de lecture de fichier (Contient la correction du bug TS)
  function loadFile(file: File, target: 'employees' | 'salaries') {
    if (target === 'employees') {
      employeesFileName.value = file.name
    } else {
      salariesFileName.value = file.name
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result
      // 🛠️ FIX TS(2345) : On vérifie explicitement que c'est une string avant de l'envoyer
      if (typeof text === 'string') {
        processContent(text, target)
      } else {
        errorMessage.value = "Le format de lecture du fichier est invalide."
      }
    }
    reader.readAsText(file)
  }

  // Actions de nettoyage individuelles
  function removeFile(target: 'employees' | 'salaries') {
    if (target === 'employees') {
      employeesFileName.value = null
      employeesHeaders.value = []
      employeesRows.value = []
    } else {
      salariesFileName.value = null
      salariesHeaders.value = []
      salariesRows.value = []
    }
    successMessage.value = null
  }

  // Déclencheur unique pour envoyer tout ce qui est chargé
  async function submitGlobalImport() {
    if (!hasDataToImport.value) return

    isLoading.value = true
    successMessage.value = null
    errorMessage.value = null

    try {
      let msgEmployees = ''
      let msgSalaries = ''

      // Si le fichier des employés est présent, on l'envoie
      if (employeesRows.value.length > 0) {
        await importService.importEmployees(employeesRows.value)
        msgEmployees = `✅ ${employeesRows.value.length} employé(s) ajoutés.`
        removeFile('employees')
      }

      // Si le fichier des salaires est présent, on l'envoie également
      if (salariesRows.value.length > 0) {
        await importService.importSalaries(salariesRows.value)
        msgSalaries = `✅ ${salariesRows.value.length} note(s) de salaire traitée(s).`
        removeFile('salaries')
      }

      successMessage.value = `Importation terminée avec succès ! ${msgEmployees} ${msgSalaries}`
    } catch (error) {
      errorMessage.value = "Une erreur s'est produite lors de l'envoi des données vers l'API Dolibarr."
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
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
  }
}