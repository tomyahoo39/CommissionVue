import { createRouter, createWebHistory } from 'vue-router'
import loginService from '@/services/login'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Index/IndexView.vue'),
    },
    {
      path: '/homeAdmin',
      name: 'homeAdmin',
      component: () => import('../views/Index/IndexAdminView.vue'),
      meta: { requiresLogin: true }
    },
    {
      path: '/guestImage',
      name: 'guestImage',
      component: () => import('../views/Image/ImageGuestView.vue')
    },
    {
      path: '/image',
      name: 'image',
      component: () => import('../views/Image/ImageAdminView.vue'),
      meta: { requiresLogin: true }
    },
    {
      path: '/guestPeriod',
      name: 'guestPeriod',
      component: () => import('../views/CommissionPeriod/PeriodGuestView.vue')
    },
    {
      path: '/period',
      name: 'period',
      component: () => import('../views/CommissionPeriod/PeriodAdminView.vue'),
      meta: { requiresLogin: true }
    },
    {
      path: '/type',
      name: 'type',
      component: () => import('../views/CommissionPeriod/CommissionTypeView.vue'),
      meta: { requiresLogin: true }
    },
    {
      path: '/social',
      name: 'social',
      component: () => import('../views/CommissionPeriod/SocialPlatformView.vue'),
      meta: { requiresLogin: true }
    },
    {
      path: '/guestOrder',
      name: 'guestOrder',
      component: () => import('../views/CommissionOrder/GuestOrdersView.vue'),
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../views/CommissionOrder/AdminOrdersView.vue'),
      meta: { requiresLogin: true }
    },
    {
      path: '/guestQa',
      name: 'guestQa',
      component: () => import('../views/QaSetting/GuestQaView.vue'),
    },
    {
      path: '/qa',
      name: 'qa',
      component: () => import('../views/QaSetting/QaSettingView.vue'),
      meta: { requiresLogin: true }
    },
    {
      path: '/showguestQa',
      name: 'showguestQa',
      component: () => import('../views/QaSetting/GuestQuestionView.vue'),
      meta: { requiresLogin: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login/LoginView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const requiresLogin = to.meta.requiresLogin;
  const isAuthenticated = loginService.isAuthenticated();

  if (requiresLogin && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
    alert('你已登入')
  } else {
    next()
  }
})

export default router
