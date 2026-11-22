import api from '@/services/axios'

const questionService = {
  guestQa() {
    return api.get('/QaQuestions/AllQa')
  },
  newQuestion(qa) {
    return api.post('/QaQuestions/QaQuestions', qa)
  },
  qaIsFinish(id,qa) {
    return api.put(`/QaQuestions/QaIsFinish/${id}`, qa)
  }
}

export default questionService
