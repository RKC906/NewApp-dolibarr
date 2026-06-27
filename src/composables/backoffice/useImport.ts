import { ref, computed } from 'vue'
import { importService } from '@/services/backoffice/importService'

// Définition d'un type pour les cibles d'importation afin de sécuriser le code
type ImportTarget = 'employees' | 'salaries' | 'zip'

export function useImport() {
  // États pour le Fichier 1 (Employés)
  const employeesFileName = ref<string | null>(null)
  const employeesHeaders = ref<string[]>([])
  const employeesRows = ref<Array<Record<string, string>>>([])

  // États pour le Fichier 2 (Salaires)
  const salariesFileName = ref<string | null>(null)
  const salariesHeaders = ref<string[]>([])
  const salariesRows = ref<Array<Record<string, string>>>([])

  // NOUVEAU : États pour le Fichier 3 (Archive ZIP)
  const zipFileName = ref<string | null>(null)
  const zipFile = ref<File | null>(null) // Stocke l'objet binaire File complet

  // États globaux de l'interface
  const isLoading = ref<boolean>(false)
  const successMessage = ref<string | null>(null)
  const errorMessage = ref<string | null>(null)

  // Modifié : Indique si au moins un fichier (CSV ou ZIP) est prêt à être importé
  const hasDataToImport = computed(() => {
    return employeesRows.value.length > 0 || salariesRows.value.length > 0 || zipFile.value !== null
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

  // Analyse le texte brut et remplit le bon état cible (Uniquement pour le CSV)
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

  // Modifié : Handler de lecture s'adaptant au format CSV (Texte) ou ZIP (Binaire)
  function loadFile(file: File, target: ImportTarget) {
    // Cas spécifique pour le ZIP : Pas besoin de FileReader (binaire), on stocke directement le fichier
    if (target === 'zip') {
      zipFileName.value = file.name
      zipFile.value = file
      successMessage.value = null
      errorMessage.value = null
      return
    }

    // Traitement classique pour les fichiers CSV
    if (target === 'employees') {
      employeesFileName.value = file.name
    } else {
      salariesFileName.value = file.name
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result
      if (typeof text === 'string') {
        processContent(text, target as 'employees' | 'salaries')
      } else {
        errorMessage.value = "Le format de lecture du fichier est invalide."
      }
    }
    reader.readAsText(file)
  }

  // Modifié : Actions de nettoyage prenant en compte le ZIP
  function removeFile(target: ImportTarget) {
    if (target === 'employees') {
      employeesFileName.value = null
      employeesHeaders.value = []
      employeesRows.value = []
    } else if (target === 'salaries') {
      salariesFileName.value = null
      salariesHeaders.value = []
      salariesRows.value = []
    } else if (target === 'zip') {
      zipFileName.value = null
      zipFile.value = null
    }
    successMessage.value = null
  }

  // Modifié : Déclencheur unique mis à jour pour orchestrer l'envoi des CSV et du ZIP
  async function submitGlobalImport() {
    if (!hasDataToImport.value) return

    isLoading.value = true
    successMessage.value = null
    errorMessage.value = null

    try {
      let msgEmployees = ''
      let msgSalaries = ''
      let msgZip = ''

      // 1. Si le fichier des employés est présent, on l'envoie
      if (employeesRows.value.length > 0) {
        await importService.importEmployees(employeesRows.value)
        msgEmployees = `\n- ✅ ${employeesRows.value.length} employé(s) ajouté(s).`
        removeFile('employees')
      }

      // 2. Si le fichier des salaires est présent, on l'envoie
      if (salariesRows.value.length > 0) {
        await importService.importSalaries(salariesRows.value)
        msgSalaries = `\n- ✅ ${salariesRows.value.length} note(s) de salaire traitée(s).`
        removeFile('salaries')
      }

      // 3. NOUVEAU : Si le fichier ZIP est présent, on l'envoie
      if (zipFile.value) {
        await importService.importZipJustificatifs(zipFile.value)
        msgZip = `\n- ✅ Archive de justificatifs (${zipFileName.value}) intégrée.`
        removeFile('zip')
      }

      successMessage.value = `Importation terminée avec succès ! ${msgEmployees} ${msgSalaries} ${msgZip}`
    } catch (error) {
      errorMessage.value = "Une erreur s'est produite lors de l'envoi des données vers le serveur."
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
    zipFileName, // Exposé pour ImportView.vue
    zipFile,     // Exposé au besoin
    isLoading,
    successMessage,
    errorMessage,
    hasDataToImport,
    loadFile,
    removeFile,
    submitGlobalImport
  }
}