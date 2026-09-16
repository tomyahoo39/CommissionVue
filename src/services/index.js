import api from '@/services/axios'

const indexService = {
  getIndexNotice() {
    return api.get('/Configs/Notice')
  },
  updateNotice(id,notice) {
    return api.put(`/Configs/UpdateNotice/${id}`, {
      noticeContent: notice
    })
  }
}

export default indexService

