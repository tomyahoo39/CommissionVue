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
    } else {
      await qaService.createNewQa(formData)
    }
    isModalOpen.value = false
    getQaSetting()
  } catch (error) {
    console.error('儲存失敗', error)
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
  <div class="qa-setting-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold">QA 設定頁面</h2>
      <button class="btn btn-primary btn-sm" @click="openAddModal">新增 QA</button>
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

<style scoped></style>
