import { api } from '@/services/api'

export const importService = {
  /**
   * Envoie la liste des employés extraite du premier CSV
   */
  async importEmployees(employeesData: Array<Record<string, any>>): Promise<any> {
    // Exemple d'envoi groupé vers votre endpoint d'intégration Dolibarr
    const response = await api.post('/users/bulk', { data: employeesData })
    return response.data
  },

  /**
   * Envoie la liste des salaires et paiements extraite du second CSV
   */
  async importSalaries(salariesData: Array<Record<string, any>>): Promise<any> {
    // Exemple d'envoi vers l'endpoint comptabilité / notes de frais / salaires
    const response = await api.post('/expensereports/salaries-bulk', { data: salariesData })
    return response.data
  },

  async importZipJustificatifs(zipFile: File): Promise<any> {
    const formData = new FormData()
    
    // Ajout du fichier ZIP au formulaire de requêtes
    // Note : Changez 'file' par la clé attendue par votre API backend (ex: 'zip_archive')
    formData.append('file', zipFile) 

    const response = await api.post('/expensereports/justificatifs-zip', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}