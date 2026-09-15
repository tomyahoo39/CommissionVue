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
  },
  drawOrder(draw) {
    return api.post('/CommissionOrders/Draw',draw)
  },
  RedrawOrder(draw) {
    return api.post('/CommissionOrders/ReDraw',draw)
  }


}

export default orderService

