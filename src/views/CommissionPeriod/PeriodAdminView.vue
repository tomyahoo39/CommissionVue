<script setup>
  import { ref, onMounted } from 'vue'
  import periodService from '@/services/commissionPeriod'
  import DataTable from '@/components/DataTable.vue'
  import FormModal from '@/components/FormModal.vue'

  const isLoading = ref(false)
  const periods = ref([])
  const periodColumns = [
    { label: '編號', key: 'id' },
    { label: '委託期名稱', key: 'title' },
    { label: '填單開始時間', key: 'openAt' },
    { label: '填單結束時間', key: 'closeAt' },
    {
      label: '填單狀態', key: 'ststus', options: [
        { text: '收件中', value: 1 },
        { text: '抽籤已完成', value: 2 },
      ]
    },
    { label: '最大中選人數', key: 'maxWinners' },
    { label: '建立時間', key: 'createdAt' },
  ]

  const getAllPeriod = async () => {
    isLoading.value = true
    try {
      const response = await periodService.getAllPeriod()
      periods.value = response.data
      isLoading.value = false
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  const currentTitle = ref()
  const isModalOpen = ref(false)
  const currentFields = [
    { label: '委託期名稱', key: 'title', type: 'text', required: true, placeholder: '請輸入委託期名稱' },
    { label: '填單開始時間', key: 'openAt', type: 'date', required: true, placeholder: '開始時間' },
    { label: '填單結束時間', key: 'closeAt', type: 'date', required: true, placeholder: '結束時間' },
    { label: '最大中選人數', key: 'maxWinners', type: 'number', required: true, placeholder: '請輸入數字' },
  ]
  const currentData = {}

  const openAddModal = () =>{
    currentTitle.value = '新增委託期'
    isModalOpen.value = true
  }

  const handleSubmit = async (formData) => {
    try {
      await periodService.createNewPeriod(formData)
      isModalOpen.value = false
      getAllPeriod()
    } catch (error) {
      console.error(error)
    }
  }

  onMounted(() => {
    getAllPeriod()
  })
</script>

<template>
  <div class="qa-setting-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold">委託期設定頁面</h2>
      <button class="btn btn-primary btn-sm" @click="openAddModal">新增委託期</button>
    </div>

    <!-- 載入中提示 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      資料載入中...
    </div>

    <DataTable :columns="periodColumns"
               :items="periods"
               :showEdit="false"
               :showDelete="false" />
    <FormModal :title="currentTitle"
               :isOpen="isModalOpen"
               :fields="currentFields"
               :originalData="currentData"
               @close="isModalOpen = false"
               @submit="handleSubmit"/>
  </div>
</template>

<style scoped></style>
