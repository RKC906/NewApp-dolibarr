export interface DashboardStats 
{
  byGender: {
    labels: string[] // ['Homme', 'Femme', 'Autre']
    datasets: number[] // [45000, 48500, 1200]
  }
  byMonth: {
    labels: string[] // ['Janvier', 'Février', 'Mars'...]
    datasets: number[] // [12000, 15000, 14500...]
  }
  kpis: {
    totalSalaries: number
    totalEmployees: number
    averageSalary: number
  }
}