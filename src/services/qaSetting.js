import api from '@/services/axios'

const qaService = {
  getQaSetting() {
    return api.get('/QaSettings/AdminQaSetting')
  },
  getGuestQa() {
    return api.get('/QaSettings/ClientQaSetting')
  },
  createNewQa(newData) {
    return api.post('/QaSettings/CreateQaSetting', newData)
  },
  editQa(qaData) {
    return api.put(`/QaSettings/Update`, qaData)
  },
  deleteQa(id) {
    return api.delete(`/QaSettings/Delete/${id}`)
  },
}

export default qaService
