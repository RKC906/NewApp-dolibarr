export interface Employee {
  id?: string
  ref_employe: string
  nom: string
  prenom: string
  genre: string
  departement: string
  poste: string
  statut: 'Actif' | 'Inactif'
}