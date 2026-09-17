import api from '@/services/axios'
import { jwtDecode } from 'jwt-decode';
import { ref } from 'vue'

export const isAdminState = ref(false)

const loginService = {
  login(credentials) {
    return api.post('/Users/Login', credentials);
  },
  setToken(token) {
    localStorage.setItem('token', token)
    this.updateAdminState()
  },
  getToken() {
    return localStorage.getItem('token');
  },
  removeToken() {
    localStorage.removeItem('token');
    isAdminState.value = false
  },
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  isAdmin() {
    return isAdminState.value
  },

  updateAdminState() {
    const token = localStorage.getItem('token')

    if (!token) {
      isAdminState.value = false
      return
    }

    try {
      const decoded = jwtDecode(token)

      // 嘗試多種方式取得 role
      let role = null
      if (decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
        role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      } else if (decoded.role) {
        role = decoded.role
      }

      isAdminState.value = role === 'Admin'

    } catch (error) {
      console.error('❌ Token 解析失敗:', error)
      isAdminState.value = false
    }
  }
}

export default loginService
