import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/backoffice/auth'

import FrontLayout from '@/layouts/FrontLayout.vue'
import BackOfficeLayout from '@/layouts/BackLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: FrontLayout,
      children: 
      [
        {
          path: 'accueil',
          redirect: '/accueil'
          
        },
        {
          path: '/listeemployee',
          name: 'listeemployee',
          component: () => import('@/views/frontoffice/employee/EmployeeListe.vue')
        }      
      ]
    },
    
    // 🔐 PAGE DE SÉCURITÉ (Hors Layout d'administration)
    {
      path: '/back/login',
      name: 'backlogin',
      component: () => import('@/views/backoffice/login/LoginView.vue')
    },

    // 🛠️ ESPACE BACKOFFICE (Protégé)
    {
      path: '/back',
      component: BackOfficeLayout,
      meta: { requiresAuth: true }, // Protège cette route ET tous ses enfants
      children: [
        {
          path: '',
          redirect: '/back/accueil'
        },
        {
          path: 'accueil',
          name: 'backaccueil',
          component: () => import('@/views/backoffice/AccueilView.vue')
        },
        {
          path: 'dashboard',
          name: 'backdashboard',
          component: () => import('@/views/backoffice/dashboard/DashboardView.vue')
        },
        {
          path: 'reset',
          name: 'backreset',
          component: () => import('@/views/backoffice/resetdata/ResetView.vue')
        },
        {
          path: 'importcsv',
          name: 'backimportcsv',
          component: () => import('@/views/backoffice/import/ImportView.vue')
        }
      ]
    }
  ],
})

// Navigation Guard mis à jour pour inspecter l'arborescence des sous-routes (.some)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (authStore.isAuthenticated) {
      next()
    } else {
      next('/back/login')
    }
  } else {
    next()
  }
})

export default router