<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { Store, Lock } from 'lucide-vue-next'
import '@/assets/css/layouts/frontoffice.css'
</script>

<template>
  <div class="front-layout-wrapper">
    <!-- Barre de navigation haute -->
    <header class="front-layout-header">
      <div class="header-container">
        
        <!-- Logo de l'application -->
        <div class="front-logo">
          <Store class="h-5 w-5" />
          <span>Dolibarr App</span>
        </div>
        
        <!-- Navigation principale -->
        <nav class="front-nav">
          <RouterLink to="/" class="front-nav-link" active-class="active-link">
            Accueil
          </RouterLink>
          <RouterLink to="/listeemployee" class="front-nav-link" active-class="active-link">
            Liste des employee
          </RouterLink> 
          <RouterLink to="/products" class="front-nav-link" active-class="active-link">
            Produits
          </RouterLink>
        </nav>

        <!-- Actions de droite -->
        <div class="header-actions">
          <RouterLink to="/back/login" class="btn-admin-nav">
            <Lock class="h-3.5 w-3.5" />
            <span>Espace Admin</span>
          </RouterLink>
        </div>

      </div>
    </header>

    <!-- Conteneur principal de la vue -->
    <main class="front-main-content">
      <RouterView />
    </main>
  </div>
</template>