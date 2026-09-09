import api from '@/services/axios'

const qaService = {
  getQaSetting() {
    return api.get('/QaSettings/AdminQaSetting')
  },
}

export default qaService
