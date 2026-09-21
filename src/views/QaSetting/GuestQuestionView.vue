<script setup>
import { ref, onMounted } from 'vue'
import questionService from '@/services/qaQuestion'

const guestQa = ref([])
const isLoading = ref(false)

const questionColumn = [
  { label: '編號', key: 'id' },
  { label: '電子信箱', key: 'email' },
  { label: '問題', key: 'question' },
  { label: '建立時間', key: 'createdAt' },
]

const showGuestQuestion = async () => {
  isLoading.value = true
  try {
    const response = await questionService.guestQa()
    guestQa.value = response.data
    isLoading.value = false
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  showGuestQuestion()
})
</script>

<template>
  <div class="guest-questions-page container py-4 qa-setting-theme">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold page-title">訪客提問列表</h2>
      <button class="btn period-btn" @click="showGuestQuestion">
        🔄 重新整理
      </button>
    </div>

    <!-- 載入中狀態 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      資料載入中...
    </div>

    <!-- 無資料狀態 -->
    <div v-else-if="guestQa.length === 0" class="empty-card p-5 text-center text-muted">
      目前尚無任何訪客留言。
    </div>

    <!-- 留言列表表格 -->
    <div v-else class="question-table-wrap">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-dark">
              <tr>
                <th v-for="col in questionColumn" :key="col.key" scope="col">
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in guestQa" :key="item.id">
                <td class="fw-bold">#{{ item.id }}</td>
                <td>
                  <span class="badge email-pill me-1">Email</span>
                  {{ item.email }}
                </td>
                <td style="max-width: 500px" class="text-break">
                  {{ item.question }}
                </td>
                <td class="text-nowrap">{{ item.createdAt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  color: #3d3c3b;
  letter-spacing: 0.02em;
}

.period-btn {
  border: 1px solid #666;
  border-radius: 999px;
  color: #666;
  background: #fff;
  transition: all 0.2s ease;
}

.period-btn:hover {
  border-color: #666;
  color: #fff;
  background: #666;
}

.empty-card {
  border: 1px dashed #d6c8b9;
  border-radius: 16px;
  background: #faf7f2;
}

.question-table-wrap {
  border: 1px solid #e6ddd3;
  border-radius: 16px;
  background: linear-gradient(135deg, #fffdf9 0%, #f7f4ee 100%);
  box-shadow: 0 6px 16px rgba(61, 60, 59, 0.08);
  padding: 0.35rem;
}

.qa-setting-theme :deep(.table-responsive) {
  border-radius: 12px;
  box-shadow: none !important;
}

.qa-setting-theme :deep(.table-dark) {
  --bs-table-bg: #f2f2f2;
  --bs-table-color: #3d3c3b;
}

.qa-setting-theme :deep(.table-hover tbody tr:hover) {
  background-color: rgba(148, 118, 89, 0.08) !important;
}

.qa-setting-theme :deep(tbody td) {
  color: #666;
}

.qa-setting-theme :deep(.spinner-border) {
  color: #947659;
}

.email-pill {
  background: #fff4df;
  color: #8a5a18;
  border: 1px solid #f0d4a3;
}
</style>
