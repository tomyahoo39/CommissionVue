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
  <div class="guest-questions-page container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold">訪客提問列表</h2>
      <button class="btn btn-outline-secondary btn-sm" @click="showGuestQuestion">
        🔄 重新整理
      </button>
    </div>

    <!-- 載入中狀態 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      資料載入中...
    </div>

    <!-- 無資料狀態 -->
    <div v-else-if="guestQa.length === 0" class="card shadow-sm p-5 text-center text-muted">
      目前尚無任何訪客留言。
    </div>

    <!-- 留言列表表格 -->
    <div v-else class="card shadow-sm border-0">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
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
                  <span class="badge bg-light text-dark border me-1">Email</span>
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

<style scoped></style>
