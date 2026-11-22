import api from '@/services/axios'

const periodService = {
  getFirstPeriod() {
    return api.get('/CommissionPeriods/first')
  },
  getAllPeriod() {
    return api.get('/CommissionPeriods/AllPeriods')
  },
  createNewPeriod(period) {
    return api.post('/CommissionPeriods/NewPeriod',period)
  },
  deletePeriod(periodId) {
    return api.delete(`/CommissionPeriods/DeletePeriod/${periodId}`)
  }
}

export default periodService
