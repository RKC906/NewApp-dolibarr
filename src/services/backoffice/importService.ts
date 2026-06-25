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
  }
}