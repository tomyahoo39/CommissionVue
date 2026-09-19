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
    <h2 class="text-center fw-bold mb-4 qa-title">常見問題 Q&A</h2>

    <!-- 載入中 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2 qa-spinner" role="status"></div>
      資料載入中...
    </div>

    <!-- QA 列表 -->
    <div v-else class="qa-list">
      <div
        v-for="(item, index) in qaList"
        :key="item.id || index"
        class="card mb-3 qa-card"
      >
        <!-- 問題列 (橫線/頁首) -->
        <div
          class="card-header qa-question-header d-flex align-items-center py-3"
        >
          <span class="badge qa-question-badge text-warning-emphasis me-2 fs-5 fw-bold">Q{{ index + 1 }}</span>
          <span class="fs-5">{{ item.question }}</span>
        </div>

        <!-- 答案列 (內文) -->
        <div class="card-body qa-answer-body py-3 px-4">
          <div class="d-flex">
            <strong class="qa-answer-label me-2 fs-5">A:</strong>
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
        <div class="card qa-form-card">
          <div class="card-body p-4">
            <h3 class="h5 fw-bold text-center mb-3">如果有問題請留言</h3>
            <p class="text-muted text-center fs-7 mb-4">
              請留下您的 Email 與問題，我將會抽空回覆您。
            </p>

            <!-- 成功送出提示訊息 -->
            <div
              v-if="submitSuccess"
              class="alert qa-success-alert d-flex align-items-center"
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
                  class="form-control qa-input"
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
                  class="form-control qa-input"
                  rows="4"
                  placeholder="請詳細描述您的問題"
                  required
                ></textarea>
              </div>

              <!-- 送出按鈕 -->
              <div class="d-grid">
                <button type="submit" class="btn qa-submit-btn" :disabled="isSubmitting">
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

<style scoped>
.qa-title {
  color: #3d3c3b;
  letter-spacing: 0.02em;
}

.qa-spinner {
  color: #947659;
}

.qa-list {
  margin-bottom: 3.5rem;
}

.qa-card {
  border: 1px solid #e6ddd3;
  border-radius: 16px;
  box-shadow: none;
  overflow: hidden;
}

.qa-question-header {
  background: #f2f2f2;
  color: #3d3c3b;
  font-weight: 600;
  border-bottom: 1px solid #e6ddd3;
}

.qa-question-badge {
  background: transparent !important;
  color: var(--bs-warning-text-emphasis) !important;
  box-shadow: none;
  font-weight: 700;
}

.qa-answer-body {
  background: #fff;
  color: #666;
}

.qa-answer-label {
  color: #947659;
}

.qa-form-card {
  border: 1px solid #e6ddd3;
  border-radius: 16px;
  background: linear-gradient(135deg, #fffdf9 0%, #f7f4ee 100%);
  box-shadow: none;
}

.qa-success-alert {
  border: 1px solid #d6c8b9;
  background: #faf7f2;
  color: #3d3c3b;
}

.qa-input {
  border: 1px solid #d8cec2;
  border-radius: 10px;
  background-color: #fffdfb;
  color: #666;
}

.qa-input:focus {
  border-color: #947659;
  box-shadow: 0 0 0 0.2rem rgba(148, 118, 89, 0.15);
}

.qa-submit-btn {
  border: 1px solid #666;
  border-radius: 999px;
  color: #666;
  background: #fff;
  transition: all 0.2s ease;
}

.qa-submit-btn:hover {
  border-color: #666;
  color: #fff;
  background: #666;
}
</style>
