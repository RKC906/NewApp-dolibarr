import axios from 'axios'

// import.meta.env.DEV est un booléen fourni par Vite (true en dev, false en prod)
const BASE_URL = import.meta.env.DEV 
  ? '/api-dolibarr' 
  : import.meta.env.VITE_DOLIBARR_API_URL

const DOLIBARR_API_KEY = import.meta.env.VITE_DOLIBARR_API_KEY

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'DOLAPIKEY': DOLIBARR_API_KEY
  }
})