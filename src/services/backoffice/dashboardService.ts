import { api } from '@/services/api'
import type { DashboardStats } from '@/interfaces/dashboardStats'

export const dashboardService = 
{
  /**
   * Récupère les statistiques consolidées pour le tableau de bord
   */
  async getSalaryStats(): Promise<DashboardStats> {
    const response = await api.get('/reports/salary-dashboard')
    return response.data
  }
}