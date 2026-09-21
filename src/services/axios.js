import axios from 'axios'
import router from '@/router/router'
import loginService from '@/services/login'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  if (loginService.isAuthenticated()) {
    const token = loginService.getToken()
    config.headers.Authorization = `Bearer ${token}`
  } else {
    delete config.headers.Authorization
  }
  return config
})

api.interceptors.response.use(
  (response) => {
  return response
},
  (error) => {
    if (error.response?.status === 401) {
      loginService.removeToken()
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)


export default api
