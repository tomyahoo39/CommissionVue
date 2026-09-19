<script setup>
  import { ref, onMounted } from 'vue'
  import orderService from '@/services/commissionOrder'
  import ShowDetail from '@/components/ShowDetail.vue'
  import FormModal from '@/components/FormModal.vue'
  import periodService from '@/services/commissionPeriod'

  const orderList = ref([])
  const isLoading = ref(false)
  const orderColumn = [
    { label: '順序編號', key: 'id' },
    { label: '訂單編號', key: 'orderCode' },
    { label: '標題', key: 'title' },
    { label: '暱稱', key: 'nickname' },
    { label: 'Email', key: 'email' },
    { label: '連絡社群', key: 'socialName' },
    { label: '社群網址', key: 'socialUrl' },
    { label: '委託項目', key: 'typeName' },
    { label: '委託設定', key: 'commissionSetting' },
    {
      label: '付款狀態', key: 'paymentStatus', options: [
        { text: '未付款', value: 1 },
        { text: '已付訂金', value: 2 },
        { text: '已付全款', value: 3 }
      ],
      valueClassMap: {
        1: 'status-pill status-disabled',
        2: 'status-pill status-pending',
        3: 'status-pill status-enabled'
      }
    },
    {
      label: '稿件狀態', key: 'workStatus', options: [
        { text: '未安排', value: 1 },
        { text: '已排單', value: 2 },
        { text: '進行中', value: 3 },
        { text: '已完成', value: 4 },
        { text: '已取消', value: 5 }
      ],
      valueClassMap: {
        1: 'status-pill status-pending',
        2: 'status-pill status-pending',
        3: 'status-pill status-pending',
        4: 'status-pill status-enabled',
        5: 'status-pill status-disabled'
      }
    },
    {
      label: '中選狀態', key: 'selectionStatus', options: [
        { text: '等待抽籤', value: 1 },
        { text: '中選', value: 2 },
        { text: '已取消', value: 3 }
      ],
      valueClassMap: {
        1: 'status-pill status-pending',
        2: 'status-pill status-enabled',
        3: 'status-pill status-disabled'
      }
    },
    { label: '備註', key: 'adminNote'},
    { label: '安排日期', key: 'scheduledDate'},
    { label: '建立時間', key: 'createdAt' },
  ]
  const periodId = ref('')
  const periods = ref([])

  const getLatestPeriod = async () => {
    try {
      const response = await periodService.getAllPeriod()
      periods.value = response.data

      if (periods.value && periods.value.length > 0) {
        const latestPeriod = periods.value[0]
        periodId.value = latestPeriod.id
        getAdminOrder()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getAdminOrder = async () => {
    isLoading.value = true
    try {
      const response = await orderService.getAdminOrder(periodId.value)
      orderList.value = response.data
      isLoading.value = false
    } catch (error) {
      console.log(error)
      alert('找不到該委託期訂單人選')
    } finally {
      isLoading.value = false
    }
  }

  const modalTitle = ref()
  const isModalOpen = ref(false)
  const currentFields = ref([])
  const currentData = ref({})
  const editFields = [
    {
      label: '付款狀態', key: 'paymentStatus', type: 'select', required:true, options: [
        { text: '未付款', value: 1 },
        { text: '已付訂金', value: 2 },
        { text: '已付全款', value: 3 }
      ]
    },
    {
      label: '稿件狀態', key: 'workStatus', type: 'select', required: true, options: [
        { text: '未安排', value: 1 },
        { text: '已排單', value: 2 },
        { text: '進行中', value: 3 },
        { text: '已完成', value: 4 },
        { text: '已取消', value: 5 }
      ]
    },
    {
      label: '中選狀態', key: 'selectionStatus', type: 'select', required: true, options: [
        { text: '等待抽籤', value: 1 },
        { text: '中選', value: 2 },
        { text: '已取消', value: 3 }
      ]
    },
    { label: '備註', key: 'adminNote', type: 'textarea', placeholder: '請輸入備註內容' },
    { label: '安排日期(不能小於今天)', key: 'scheduledDate', type: 'date', placeholder: '輸入格式:xxxx-xx-xx' },
  ]

  const handleEdit = (item) => {
    modalTitle.value = '更改訂單狀態'
    isModalOpen.value = true
    currentFields.value = editFields
    currentData.value = {...item}
  }

  const handleSubmit = async (formData) => {
    try {
      const { id } = formData
      const payload = {
        paymentStatus: formData.paymentStatus,
        workStatus: formData.workStatus,
        selectionStatus: formData.selectionStatus,
        adminNote: formData.adminNote || null,
        scheduledDate: formData.scheduledDate ? formData.scheduledDate : null,
      }
      await orderService.editOrder(id, payload)
      alert('修改成功')
      isModalOpen.value = false
      getAdminOrder()
    } catch (error) {
      console.error('儲存失敗', error)
      alert('修改失敗，請稍後再試')
    }
  }

  onMounted(() => {
    getLatestPeriod()
  })
</script>

<template>
  <div class="container py-4 admin-order-page">
    <div class="note-card p-4 mb-4">
      <h3 class="h5 fw-bold mb-2 page-title">委託訂單管理</h3>
      <p class="mb-3 page-subtitle">委託期列表請至導覽列 &gt; 填單表 &gt; 委託期設定查詢</p>

      <div class="row g-3 align-items-end">
        <div class="col-12 col-md-4">
          <label class="form-label mb-1">請輸入委託期ID</label>
          <input v-model="periodId" type="number" class="form-control period-input" />
        </div>
        <div class="col-12 col-md-3">
          <button type="button" class="btn period-btn w-100" @click="getAdminOrder">確認</button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      資料載入中...
    </div>

    <div v-else-if="orderList.length === 0" class="empty-card text-center py-5 text-muted">
      目前尚無該委託期的訂單資料。
    </div>

    <div v-else>
      <ShowDetail
        v-for="orderItem in orderList"
        :key="orderItem.id"
        :columns ="orderColumn"
        :item ="orderItem"
        :showEdit="true"
        @edit="handleEdit"
      />
    </div>
  </div>

  <FormModal
    :title="modalTitle"
    :isOpen="isModalOpen"
    :fields="currentFields"
    :originalData="currentData"
    @submit=handleSubmit
    @close="isModalOpen = false"
  />
</template>

<style scoped>
.page-title {
  color: #3d3c3b;
  letter-spacing: 0.02em;
}

.page-subtitle {
  color: #666;
  line-height: 1.7;
}

.note-card {
  border: 1px solid #e6ddd3;
  border-radius: 16px;
  background: linear-gradient(135deg, #fffdf9 0%, #f7f4ee 100%);
  box-shadow: 0 6px 16px rgba(61, 60, 59, 0.08);
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

.empty-card {
  border: 1px dashed #d6c8b9;
  border-radius: 16px;
  background: #faf7f2;
}

.admin-order-page :deep(.card) {
  border: 1px solid #e6ddd3 !important;
  border-radius: 16px !important;
  background: linear-gradient(135deg, #fffdf9 0%, #f7f4ee 100%);
  box-shadow: 0 6px 16px rgba(61, 60, 59, 0.08) !important;
  overflow: hidden;
}

.admin-order-page :deep(.card th.bg-light) {
  background: #f2f2f2 !important;
  color: #3d3c3b !important;
}

.admin-order-page :deep(.card td) {
  color: #666 !important;
}

.admin-order-page :deep(.card-footer) {
  border-top: 1px solid #e6ddd3;
  background: #fff;
}

.admin-order-page :deep(.btn-outline-primary) {
  border: 1px solid #666;
  border-radius: 999px;
  color: #666;
  background: #fff;
}

.admin-order-page :deep(.btn-outline-primary:hover) {
  border-color: #666;
  color: #fff;
  background: #666;
}

.admin-order-page :deep(.status-pill) {
  display: inline-block;
  padding: 0.12rem 0.6rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.admin-order-page :deep(.status-enabled) {
  color: #2f6b3a;
  background: #e8f6eb;
  border: 1px solid #b9dfc2;
}

.admin-order-page :deep(.status-pending) {
  color: #8a5a18;
  background: #fff4df;
  border: 1px solid #f0d4a3;
}

.admin-order-page :deep(.status-disabled) {
  color: #8f3a42;
  background: #fdecef;
  border: 1px solid #f3c9d0;
}

.admin-order-page :deep(.spinner-border) {
  color: #947659;
}
</style>
