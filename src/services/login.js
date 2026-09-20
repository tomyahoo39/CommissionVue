import api from '@/services/axios'
import { jwtDecode } from 'jwt-decode'
import { ref } from 'vue'

export const isAdminState = ref(false)

function safeDecode(token) {
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}

function isTokenExpired(decoded) {
  if (!decoded?.exp) return true
  return decoded.exp * 1000 <= Date.now()
}

function getRole(decoded) {
  return decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    || decoded?.role
    || null
}

const loginService = {
  login(credentials) {
    return api.post('/Users/Login', credentials)
  },
  setToken(token) {
    localStorage.setItem('token', token)
    this.updateAdminState()
  },
  getToken() {
    return localStorage.getItem('token')
  },
  removeToken() {
    localStorage.removeItem('token')
    isAdminState.value = false
  },
  isAuthenticated() {
    const token = this.getToken()
    const decoded = token ? safeDecode(token) : null
    if (!decoded || isTokenExpired(decoded)) {
      this.removeToken()
      return false
    }
    return true
  },
  updateAdminState() {
    const token = this.getToken()
    const decoded = token ? safeDecode(token) : null
    if (!decoded || isTokenExpired(decoded)) {
      this.removeToken()
      return
    }
    isAdminState.value = getRole(decoded) === 'Admin'
  },
  isAdmin() {
    return this.isAuthenticated() && isAdminState.value
  }
}

export default loginService
