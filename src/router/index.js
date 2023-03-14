import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/users/:username/repos',
    name: 'userpage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/UserDetails.vue'),
    props: true,
  },
  {
    path: "/users/:username/repos/:reponame",
    name: 'userrepo',
    component: () => import('../views/RepoDetails.vue'),
    props: true,
  },
  {
    path: '/notfound',
    name: 'notfound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
