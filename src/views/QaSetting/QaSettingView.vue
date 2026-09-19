<script setup>
import { ref, onMounted } from 'vue'
import qaService from '@/services/qaSetting.js'
import DataTable from '@/components/DataTable.vue'
import FormModal from '@/components/FormModal.vue'

const qaColumns = [
  { label: '編號', key: 'id' },
  { label: '問題', key: 'question' },
  { label: '回答', key: 'answer' },
  { label: '排序', key: 'sortOrder' },
  {
    label: '啟用狀態', key: 'isVisible', options: [
      { text: '啟用', value: true },
      { text: '停用', value: false },
    ],
    valueClassMap: {
      true: 'status-pill status-enabled',
      false: 'status-pill status-disabled'
    }
  },
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

const isModalOpen = ref(false)
const modalTitle = ref()
const currentFields = ref([])
const currentData = ref({})

const addFields = [
  {
    label: 'Q&A問題',
    key: 'question',
    type: 'text',
    required: true,
    placeholder: '請填入問題內容',
  },
  {
    label: 'Q&A回答',
    key: 'answer',
    type: 'text',
    required: true,
    placeholder: '請填入回答內容',
  },
]

const editFields = [
  {
    label: 'Q&A問題',
    key: 'question',
    type: 'text',
    required: true,
    placeholder: '請填入問題內容',
  },
  {
    label: 'Q&A回答',
    key: 'answer',
    type: 'text',
    required: true,
    placeholder: '請填入回答內容',
  },
  {
    label: 'Q&A問答排序',
    key: 'sortOrder',
    type: 'number',
    required: true,
    placeholder: '請輸入順序數字',
  },
  {
    label: '啟用狀態',
    key: 'isVisible',
    type: 'select',
    options: [
      {
        text: '啟用',
        value: true,
      },
      {
        text: '停用',
        value: false,
      },
    ],
    required: true,
    placeholder: '請選擇啟用狀態',
  },
]

const openAddModal = () => {
  modalTitle.value = '新增QA問答'
  currentData.value = {}
  currentFields.value = addFields
  isModalOpen.value = true
}

const handleEdit = (item) => {
  modalTitle.value = '修改QA問答'
  currentData.value = { ...item }
  currentFields.value = editFields
  isModalOpen.value = true
}

const handleSubmit = async (formData) => {
  try {
    if (formData.id) {
      await qaService.editQa(formData)
      alert('修改成功')
    } else {
      await qaService.createNewQa(formData)
      alert('新增成功')
    }
    isModalOpen.value = false
    getQaSetting()
  } catch (error) {
    alert('儲存失敗，請稍後再試')
  }
}

const handleDelete = async (item) => {
  if (confirm(`確定要刪除${item.id}的Q&A嗎?`)) {
    await qaService.deleteQa(item.id)
    getQaSetting()
  }
}

onMounted(() => {
  getQaSetting()
})
</script>

<template>
  <div class="qa-setting-page container py-4 qa-setting-theme">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold page-title">QA 設定頁面</h2>
      <button class="btn period-btn" @click="openAddModal">新增 QA</button>
    </div>

    <!-- 載入中提示 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      資料載入中...
    </div>

    <!-- 載入完成，顯示子元件表格 -->
    <div v-else class="qa-table-wrap">
      <DataTable
        :columns="qaColumns"
        :items="qaList"
        :showEdit="true"
        :showDelete="true"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
    <FormModal
      :title="modalTitle"
      :isOpen="isModalOpen"
      :fields="currentFields"
      :originalData="currentData"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />
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

.qa-table-wrap {
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

.qa-setting-theme :deep(.btn-outline-primary) {
  border: 1px solid #666;
  border-radius: 10px;
  color: #666;
  background: #fff;
}

.qa-setting-theme :deep(.btn-outline-primary:hover) {
  border-color: #666;
  color: #fff;
  background: #666;
}

.qa-setting-theme :deep(.btn-outline-danger) {
  border: 1px solid #d86a75;
  border-radius: 10px;
  color: #c4525e;
  background: #fff;
}

.qa-setting-theme :deep(.btn-outline-danger:hover) {
  border-color: #c4525e;
  color: #fff;
  background: #c4525e;
}

.qa-setting-theme :deep(.btn-group .btn) {
  min-width: 54px;
  padding-inline: 0.65rem;
  border-radius: 10px !important;
}

.qa-setting-theme :deep(.btn-group) {
  display: inline-flex;
  gap: 0.4rem;
}

.qa-setting-theme :deep(.btn-group > .btn:not(:first-child)),
.qa-setting-theme :deep(.btn-group > .btn-group:not(:first-child)) {
  margin-left: 0 !important;
}

.qa-setting-theme :deep(.spinner-border) {
  color: #947659;
}

.qa-setting-theme :deep(.status-pill) {
  display: inline-block;
  padding: 0.12rem 0.6rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.qa-setting-theme :deep(.status-enabled) {
  color: #2f6b3a;
  background: #e8f6eb;
  border: 1px solid #b9dfc2;
}

.qa-setting-theme :deep(.status-disabled) {
  color: #8a5a18;
  background: #fff4df;
  border: 1px solid #f0d4a3;
}
</style>
