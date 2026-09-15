import api from '@/services/axios'

const imageService = {
  getFirstThumbs() {
    return api.get('/Images/FirstThumbs')
  },
  getGuestImage() {
    return api.get('/Images/AllImages')
  },
  getAdminImage() {
    return api.get('/Images/AllImagesAdmin')
  },
  updateImage(id,update) {
    return api.put(`/Images/UpdateImage/${id}`,update)
  },
  uploadNewImage(image) {
    return api.post('/Images/Upload',image)
  }
}

export default imageService
