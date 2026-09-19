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
      alert('抽籤失敗，請檢查1.輸入數字與委託期一致2.該委託期是否已完成抽籤3.補抽人數不可以超過委託期上限4.其他錯誤')
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
  <div class="qa-setting-page container py-4">
    <div class="period-admin-note card p-4 mb-4">
      <h3 class="h5 fw-bold mb-2 period-title">抽籤提醒</h3>
      <p class="mb-3 period-note-text">
        抽籤人數需與委託期設定人數一致，若後續訂單取消人數不足，請使用補抽功能，補抽人數需小於等於委託期設定人數。
      </p>
      <div class="row g-3 align-items-end">
        <div class="col-12 col-md-4">
          <label class="form-label mb-1">委託期ID</label>
          <input v-model.number="formState.periodId" type="number" class="form-control period-input" />
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label mb-1">該期抽選人數</label>
          <input v-model.number="formState.drawCount" type="number" class="form-control period-input" />
        </div>
        <div class="col-12 col-md-4 d-flex gap-2">
          <button type="button" class="btn period-btn flex-fill" @click="submitDraw">委託期抽選</button>
          <button type="button" class="btn period-btn flex-fill" @click="submitReDraw">委託期補抽</button>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold period-title">委託期列表</h2>
      <button class="btn period-btn" @click="openAddModal">新增委託期</button>
    </div>

    <!-- 載入中提示 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      資料載入中...
    </div>

    <div class="period-table-wrap">
      <DataTable :columns="periodColumns"
                 :items="periods"
                 :showEdit="false"
                 :showDelete="false" />
    </div>
    <FormModal :title="currentTitle"
               :isOpen="isModalOpen"
               :fields="currentFields"
               :originalData="currentData"
               @close="isModalOpen = false"
               @submit="handleSubmit" />
  </div>
</template>

<style scoped>
.period-title {
  color: #3d3c3b;
  letter-spacing: 0.02em;
}

.period-admin-note {
  border: 1px solid #e6ddd3;
  border-radius: 16px;
  background: linear-gradient(135deg, #fffdf9 0%, #f7f4ee 100%);
  box-shadow: 0 6px 16px rgba(61, 60, 59, 0.08);
}

.period-note-text {
  color: #666;
  line-height: 1.7;
}

.period-input {
  border: 1px solid #d8cec2;
  border-radius: 10px;
  background-color: #fffdfb;
  color: #666;
}

.period-input:focus {
  border-color: #947659;
  box-shadow: 0 0 0 0.2rem rgba(148, 118, 89, 0.15);
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

.period-table-wrap {
  border: 1px solid #e6ddd3;
  border-radius: 16px;
  background: linear-gradient(135deg, #fffdf9 0%, #f7f4ee 100%);
  box-shadow: 0 6px 16px rgba(61, 60, 59, 0.08);
  padding: 0.35rem;
}

.period-table-wrap :deep(.table-responsive) {
  border-radius: 12px;
  box-shadow: none !important;
}

.period-table-wrap :deep(.table-dark) {
  --bs-table-bg: #f2f2f2;
  --bs-table-color: #3d3c3b;
}

.period-table-wrap :deep(.table-hover tbody tr:hover) {
  background-color: rgba(148, 118, 89, 0.08) !important;
}
</style>
