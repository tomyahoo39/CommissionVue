<script setup>
  import { ref,reactive, onMounted } from 'vue'
  import periodService from '@/services/commissionPeriod'
  import DataTable from '@/components/DataTable.vue'
  import FormModal from '@/components/FormModal.vue'
  import orderService from '@/services/commissionOrder'

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
  const currentData = ref({})

  const openAddModal = () =>{
    currentTitle.value = '新增委託期'
    isModalOpen.value = true
  }

  const handleSubmit = async (formData) => {
    try {
      await periodService.createNewPeriod(formData)
      alert('新增委託期成功')
      isModalOpen.value = false
      getAllPeriod()
    } catch (error) {
      console.error(error)
      alert('新增委託期失敗，請稍後再試')
    }
  }

  const formState = reactive({
    periodId: '',
    drawCount:'',
  })

  const submitDraw = async () => {
    try {
      const payload = {
        periodId: formState.periodId,
        drawCount:formState.drawCount
      }
      await orderService.drawOrder(payload)
      alert('抽籤完成')
      formState.periodId = ''
      formState.drawCount = ''
      getAllPeriod()
    } catch (error) {
      console.error(error)
      alert('抽籤失敗，請檢查輸入數字是否與委託期一致')
    }
  }

  const submitReDraw = async () => {
    try {
      const payload = {
        periodId: formState.periodId,
        drawCount: formState.drawCount
      }
      await orderService.RedrawOrder(payload)
      alert('補抽完成')
      formState.periodId = ''
      formState.drawCount = ''
      getAllPeriod()
    } catch (error) {
      console.error(error)
      alert('補抽失敗，請檢查輸入數字是否超出委託期人數設定')
    }
  }

  onMounted(() => {
    getAllPeriod()
  })
</script>

<template>
  <label>委託期ID</label>
  <input v-model.number="formState.periodId" />
  <label>該期抽選人數</label>
  <input v-model.number="formState.drawCount" />
  <button type="button" @click="submitDraw">委託期抽選</button>
  <button type="button" @click="submitReDraw">委託期補抽</button>
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
               @submit="handleSubmit" />
  </div>
</template>

<style scoped></style>
