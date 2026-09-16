import api from '@/services/axios'

const imageService = {
  getFirstThumbs() {
    return api.get('/Images/FirstThumbs')
  },
  getGuestImage(typeId) {
    return api.get(`/Images/AllImages?commissionTypeId=${typeId}`)
  },
  getAdminImage(typeId) {
    return api.get(`/Images/AllImagesAdmin?commissionTypeId=${typeId}`)
  },
  updateImage(id,update) {
    return api.put(`/Images/UpdateImage/${id}`,update)
  },
  uploadNewImage(image) {
    return api.post('/Images/Upload',image)
  }
}

export default imageService
