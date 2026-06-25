<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productService } from '@/services/productService'
import type { product } from '@/interfaces/product'

// États réactifs typés
const products = ref<product[]>([])
const isLoading = ref<boolean>(true)
const errorMessage = ref<string | null>(null)

// Chargement des données au montage du composant
onMounted(async () => {
  try {
    products.value = await productService.getAll()
  } catch (error) {
    errorMessage.value = "Impossible de charger les produits depuis Dolibarr."
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="product-page">
    <h2>Catalogue Produits (Dolibarr)</h2>

    <div v-if="isLoading" class="loading">
      Chargement des produits...
    </div>

    <div v-else-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>

    <table v-else class="product-table">
      <thead>
        <tr>
          <th>Référence</th>
          <th>Désignation</th>
          <th>Prix HT</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td><strong>{{ product.ref }}</strong></td>
          <td>{{ product.label }}</td>
          <td>{{ Number(product.price).toFixed(2) }} €</td>
          <td>
            <span :class="product.status === '1' ? 'active' : 'inactive'">
              {{ product.status === '1' ? 'En vente' : 'Hors vente' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.product-page { padding: 20px; }
.loading { font-style: italic; color: #666; }
.error { color: #d32f2f; background: #ffebee; padding: 10px; border-radius: 4px; }
.product-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
.product-table th, .product-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
.product-table th { background-color: #f5f5f5; }
.active { color: green; font-weight: bold; }
.inactive { color: red; }
</style>