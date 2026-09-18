import api from '@/services/axios'

const questionService = {
  guestQa() {
    return api.get('/QaQuestions/AllQa')
  },
  newQuestion(qa) {
    return api.post('/QaQuestions/QaQuestions', qa)
  },
}

export default questionService
