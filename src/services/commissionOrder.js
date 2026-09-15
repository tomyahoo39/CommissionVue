import api from '@/services/axios'


const orderService = {
  getAdminOrder(periodId) {
    return api.get(`/CommissionOrders/Orders/${periodId}`)
  },
  getGuestOrder() {
    return api.get('/CommissionOrders/Guest')
  },
  editOrder(id,order) {
    return api.put(`/CommissionOrders/Date/${id}`,order)
  },

  createNewOrder(order) {
    return api.post('/CommissionOrders/NewOrder',order)
  }


}

export default orderService

