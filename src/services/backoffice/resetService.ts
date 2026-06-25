import { api } from '@/services/api'

export const resetService = {
  /**
   * Réinitialise le module des Produits
   */
  async resetProducts(): Promise<void> {
    // Simulation ou appel réel à un endpoint de nettoyage/suppression groupée
    await api.delete('/products/purge') 
  },

  /**
   * Réinitialise le module des Congés (Holidays)
   */
  async resetHolidays(): Promise<void> {
    await api.delete('/holidays/purge')
  },

  /**
   * Réinitialise le module des Notes de frais (Expense Reports)
   */
  async resetExpenseReports(): Promise<void> {
    await api.delete('/expensereports/purge')
  },

  /**
   * Réinitialise le module des Entrepôts et Stocks (Warehouses)
   */
  async resetStocks(): Promise<void> {
    await api.delete('/warehouses/purge')
  }
}