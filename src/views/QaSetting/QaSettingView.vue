<script setup>
import { ref, onMounted } from 'vue'
import qaService from '@/services/qaSetting.js'
import DataTable from '@/components/DataTable.vue'

const qaColumns = [
  { label: '編號', key: 'id' },
  { label: '問題', key: 'question' },
  { label: '回答', key: 'answer' },
  { label: '排序', key: 'sortOrder' },
  { label: '啟用狀態', key: 'isVisible' },
]

const qaList = ref([])
const isLoading = ref(true)

const getQaSetting = async () => {
  isLoading.value = true
  try {
    const response = await qaService.getQaSetting()
    qaList.value = response.data
  } catch (error) {
    console.error('API回傳結果失敗:', error)
  } finally {
    isLoading.value = false
  }
}

const handleEdit = (item) => {
  console.log('點擊修改', item)
  alert(`點擊修改問題:${item.question}`)
}

const handleDelete = (item) => {
  console.log('點擊刪除', item)
  if (confirm(`確定要刪除${item.qusetion}嗎?`))
    qaList.value = qaList.value.filter((q) => q.id !== item.id)
}

onMounted(() => {
  getQaSetting()
})
</script>

<template>
  <div class="qa-setting-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold">QA 設定頁面</h2>
      <button class="btn btn-primary btn-sm">新增 QA</button>
    </div>

    <!-- 載入中提示 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      資料載入中...
    </div>

    <!-- 載入完成，顯示子元件表格 -->
    <DataTable
      v-else
      :columns="qaColumns"
      :items="qaList"
      :showEdit="true"
      :showDelete="true"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<style scoped></style>
