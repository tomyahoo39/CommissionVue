import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Index/IndexView.vue'),
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../views/CommissionOrder/AdminOrdersView.vue'),
    },
    {
      path: '/guestOrder',
      name: 'guestOrder',
      component: () => import('../views/CommissionOrder/GuestOrdersView.vue'),
    },
    {
      path: '/qa',
      name: 'qa',
      component: () => import('../views/QaSetting/QaSettingView.vue'),
    },
    {
      path: '/guestQa',
      name: 'guestQa',
      component: () => import('../views/QaSetting/GuestQaView.vue'),
    },
    {
      path: '/showguestQa',
      name: 'showguestQa',
      component: () => import('../views/QaSetting/GuestQuestionView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
