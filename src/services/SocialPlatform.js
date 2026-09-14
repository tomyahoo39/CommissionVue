import api from '@/services/axios'

const socialService = {
  getAllSocial() {
    return api.get('/SocialPlatforms/AllSocial')
  },
  createNewSocial(social) {
    return api.post('/SocialPlatforms/Social',social)
  },
  updateSocial(id, social) {
    return api.put(`/SocialPlatforms/Social/${id}`,social)
  }
}

export default socialService

