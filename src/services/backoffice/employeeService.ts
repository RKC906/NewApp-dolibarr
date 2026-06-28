import { api } from "@/services/api"
import type { Employee } from "@/interfaces/employee"
import type { EmployeeFilters } from "@/interfaces/employeeFilters"

export const employeeService = 
{
  /**
   * Récupère la liste des salariés filtrée selon les critères
   */
  async getEmployees(filters: EmployeeFilters): Promise<Employee[]> {
    const response = await api.get('/users', { params: filters })
    return response.data
  }
}