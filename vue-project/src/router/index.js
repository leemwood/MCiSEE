import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import UtilitySitesPage from '../pages/UtilitySitesPage.vue'
import SearchPage from '../pages/SearchPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/utilities',
    name: 'Utilities',
    component: UtilitySitesPage
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router