<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/backoffice/auth'
import '@/assets/css/layouts/backoffice.css'

// Import direct des icônes Lucide pour correspondre au look shadcn
import { 
  Menu, 
  ChevronRight, 
  LayoutDashboard, 
  Package, 
  Calendar, 
  FileText, 
  Boxes, 
  LogOut 
} from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

// Gestion de la rétractation globale de la Sidebar
const isCollapsed = ref<boolean>(false)

// Gestion de l'ouverture/fermeture individuelle de chaque bloc de navigation
const openSections = ref({
  general: true,
  catalogue: true,
  rh: true,
  compta: true,
  stocks: true
})

function toggleSection(section: 'general' | 'catalogue' | 'rh' | 'compta' | 'stocks') {
  openSections.value[section] = !openSections.value[section]
}

function handleLogout() {
  authStore.logout()
  router.push('/backoffice/login')
}
</script>

<template>
  <div class="backoffice-provider">
    <aside class="bo-sidebar" :class="{ 'collapsed': isCollapsed }">
      <div class="sidebar-header-zone">
        <span class="hide-on-collapse">🛠️ Dolibarr Admin</span>
        <span v-if="isCollapsed">🛠️</span>
      </div>

      <div class="sidebar-content-zone">
        <div class="sidebar-group">
          <button class="sidebar-group-label" @click="toggleSection('general')">
            <span class="hide-on-collapse">Général</span>
            <ChevronRight class="chevron-icon h-3 w-3" :class="{ 'rotated': openSections.general }" />
          </button>
          <div class="sidebar-menu-items" v-show="openSections.general">
            <RouterLink to="/back/accueil" class="sidebar-menu-link" active-class="active-sublink">
                <LayoutDashboard class="h-4 w-4" />
                <span class="hide-on-collapse">Accueil</span>
            </RouterLink>
            <RouterLink to="/back/dashboard" class="sidebar-menu-link" active-class="active-sublink">
              <LayoutDashboard class="h-4 w-4" />
              <span class="hide-on-collapse">Tableau de bord</span>
            </RouterLink>
            <RouterLink to="/back/reset" class="sidebar-menu-link" active-class="active-sublink">
              <Settings class="h-4 w-4" /> <span class="hide-on-collapse">Réinitialisation</span>
            </RouterLink>
          </div>
        </div>

        <div class="sidebar-group">
          <button class="sidebar-group-label" @click="toggleSection('catalogue')">
            <span class="hide-on-collapse">Catalogue</span>
            <ChevronRight class="chevron-icon h-3 w-3" :class="{ 'rotated': openSections.catalogue }" />
          </button>
          <div class="sidebar-menu-items" v-show="openSections.catalogue">
            <RouterLink to="/products" class="sidebar-menu-link" active-class="active-sublink">
              <Package class="h-4 w-4" />
              <span class="hide-on-collapse">Produits</span>
            </RouterLink>
          </div>
        </div>

        <div class="sidebar-group">
          <button class="sidebar-group-label" @click="toggleSection('rh')">
            <span class="hide-on-collapse">Ressources Humaines</span>
            <ChevronRight class="chevron-icon h-3 w-3" :class="{ 'rotated': openSections.rh }" />
          </button>
          <div class="sidebar-menu-items" v-show="openSections.rh">
            <RouterLink to="/backoffice/holidays" class="sidebar-menu-link" active-class="active-sublink">
              <Calendar class="h-4 w-4" />
              <span class="hide-on-collapse">Demandes de congés</span>
            </RouterLink>
          </div>
        </div>

        <div class="sidebar-group">
          <button class="sidebar-group-label" @click="toggleSection('compta')">
            <span class="hide-on-collapse">Comptabilité</span>
            <ChevronRight class="chevron-icon h-3 w-3" :class="{ 'rotated': openSections.compta }" />
          </button>
          <div class="sidebar-menu-items" v-show="openSections.compta">
            <RouterLink to="/backoffice/expense-reports" class="sidebar-menu-link" active-class="active-sublink">
              <FileText class="h-4 w-4" />
              <span class="hide-on-collapse">Notes de frais</span>
            </RouterLink>
          </div>
        </div>

        <div class="sidebar-group">
          <button class="sidebar-group-label" @click="toggleSection('stocks')">
            <span class="hide-on-collapse">Logistique</span>
            <ChevronRight class="chevron-icon h-3 w-3" :class="{ 'rotated': openSections.stocks }" />
          </button>
          <div class="sidebar-menu-items" v-show="openSections.stocks">
            <RouterLink to="/backoffice/warehouses" class="sidebar-menu-link" active-class="active-sublink">
              <Boxes class="h-4 w-4" />
              <span class="hide-on-collapse">Entrepôts / Stocks</span>
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="sidebar-footer-zone">
        <button class="btn-logout-bo" @click="handleLogout">
          <LogOut class="h-4 w-4" />
          <span class="hide-on-collapse">Déconnexion</span>
        </button>
      </div>
    </aside>

    <div class="bo-main-inset">
      <header class="bo-topbar">
        <button class="btn-trigger-sidebar" @click="isCollapsed = !isCollapsed" title="Masquer/Afficher le menu">
          <Menu class="h-4 w-4" />
        </button>
        
        <div class="bo-breadcrumb">
          <span class="bc-muted">Dolibarr Admin</span>
          <span class="bc-separator">/</span>
          <span class="bc-current">Espace d'administration</span>
        </div>
      </header>

      <main class="bo-page-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>