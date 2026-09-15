import api from '@/services/axios'

const typeService = {
  getActiveType() {
    return api.get('/CommissionTypes/ActiveType')
  },
  getAllType() {
    return api.get('/CommissionTypes/Type')
  },
  createNewType(type) {
    return api.post('/CommissionTypes/NewType',type)
  },
  updateType(id, type) {
    return api.put(`/CommissionTypes/UpdateType/${id}`,type)
  }
}

export default typeService
