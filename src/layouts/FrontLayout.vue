<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import '@/assets/css/layouts/frontoffice.css'
</script>

<template>
  <div class="front-layout-wrapper">
    <header class="front-layout-header">
      <div class="front-logo">🛒 Dolibarr App</div>
      <nav class="front-nav">
        <RouterLink to="/products" class="front-nav-link" active-class="active-link">
          Produits
        </RouterLink>
        <RouterLink to="/backoffice/login" class="btn-admin-nav">
          Espace Admin 🔐
        </RouterLink>
      </nav>
    </header>

    <main class="front-main-content">
      <RouterView />
    </main>
  </div>
</template>