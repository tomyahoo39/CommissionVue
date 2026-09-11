import api from '@/services/axios'


const orderService = {
  getAdminOrder(periodId) {
    return api.get(`/CommissionOrders/Orders/${periodId}`)
  },
  getGuestOrder() {
    return api.get('/CommissionOrders/Orders/Guest')
  },
  editOrder(id,order) {
    return api.put(`/CommissionOrders/Date/${id}`,order)
  }
}

export default orderService

