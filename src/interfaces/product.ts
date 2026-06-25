export interface product
{
  id: string
  ref: string          // Référence unique du produit
  label: string        // Libellé / Nom du produit
  description: string
  price: string        // Dolibarr retourne souvent les prix sous forme de string
  price_ttc: string
  status: string       // '1' si en vente, '0' si hors vente
  stock_reel?: number  // Stock réel (si le module stock est activé)
}