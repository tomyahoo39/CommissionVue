<script setup>
import { ref, onMounted } from 'vue'
import questionService from '@/services/qaQuestion'
import qaService from '@/services/qaSetting'

const qaList = ref([])
const isLoading = ref(false)

const getGuestQa = async () => {
  isLoading.value = true
  try {
    const response = await qaService.getGuestQa()
    qaList.value = response.data
  } catch (error) {
    console.error('API回傳結果失敗:', error)
  } finally {
    isLoading.value = false
  }
}

const newQuestion = ref({
  email: '',
  question: '',
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)

const handleSubmitQuestion = async () => {
  isSubmitting.value = true
  submitSuccess.value = false
  try {
    await questionService.newQuestion(newQuestion.value)
    newQuestion.value = {
      email: '',
      question: '',
    }
    submitSuccess.value = true
    setTimeout(() => {
      submitSuccess.value = false
    }, 5000)
  } catch (error) {
    console.log(error)
    alert('送出失敗，請稍後再試!')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  getGuestQa()
})
</script>

<template>
  <div class="container py-4">
    <h2 class="text-center fw-bold mb-4">常見問題 Q&A</h2>

    <!-- 載入中 -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <!-- QA 列表 -->
    <div v-else class="qa-list">
      <div
        v-for="(item, index) in qaList"
        :key="item.id || index"
        class="card mb-3 shadow-sm border-0"
      >
        <!-- 問題列 (橫線/頁首) -->
        <div
          class="card-header bg-primary text-white font-weight-bold d-flex align-items-center py-3"
        >
          <span class="badge bg-white text-primary me-2 fs-6">Q{{ index + 1 }}</span>
          <span class="fs-5">{{ item.question }}</span>
        </div>

        <!-- 答案列 (內文) -->
        <div class="card-body bg-light text-secondary py-3 px-4">
          <div class="d-flex">
            <strong class="text-primary me-2 fs-5">A:</strong>
            <p class="mb-0 fs-6 align-self-center text-dark">
              {{ item.answer }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 訪客提問區塊 -->
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            <h3 class="h5 fw-bold text-center mb-3">如果有問題請留言</h3>
            <p class="text-muted text-center fs-7 mb-4">
              請留下您的 Email 與問題，我將會抽空回覆您。
            </p>

            <!-- 成功送出提示訊息 -->
            <div
              v-if="submitSuccess"
              class="alert alert-success d-flex align-items-center"
              role="alert"
            >
              <i class="bi bi-check-circle-fill me-2"></i>
              <div>問題已成功送出！我們會盡快回覆您。</div>
            </div>

            <!-- 提問表單 -->
            <form @submit.prevent="handleSubmitQuestion">
              <!-- 信箱輸入框 -->
              <div class="mb-3">
                <label for="guestEmail" class="form-label fw-bold">
                  電子信箱 <span class="text-danger">*</span>
                </label>
                <input
                  id="guestEmail"
                  v-model="newQuestion.email"
                  type="email"
                  class="form-control"
                  placeholder="xxx@example.com"
                  required
                />
              </div>

              <!-- 問題內容輸入框 -->
              <div class="mb-3">
                <label for="guestQuestion" class="form-label fw-bold">
                  您的問題 <span class="text-danger">*</span>
                </label>
                <textarea
                  id="guestQuestion"
                  v-model="newQuestion.question"
                  class="form-control"
                  rows="4"
                  placeholder="請詳細描述您的問題"
                  required
                ></textarea>
              </div>

              <!-- 送出按鈕 -->
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                  <span
                    v-if="isSubmitting"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  {{ isSubmitting ? '處理中...' : '送出問題' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
