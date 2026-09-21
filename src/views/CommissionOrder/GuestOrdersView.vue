<script setup>
  import {ref,onMounted} from 'vue'
  import orderService from '@/services/commissionOrder'
  import DataTable from '@/components/DataTable.vue'

  const guestOrders = ref([])
  const isLoading = ref(false)
  const orderColumns = [
      { label: '訂單編號', key: 'orderCode' },
      { label: '暱稱', key: 'nickname' },
      { label: '連絡社群', key: 'socialName' },
      { label: '委託項目', key: 'typeName' },
    {
      label: '付款狀態', key: 'paymentStatus',options: [
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
      { label: '交稿日期', key: 'scheduledDate' },
  ]


  const getGuestOrder = async() => {
    isLoading.value = true
    try {
      const response = await orderService.getGuestOrder()
      guestOrders.value = response.data
      isLoading.value = false
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    getGuestOrder()
  })
</script>

<template>

  <div class="container py-4">
    <h2 class="h4 fw-bold mb-3 guest-order-title">目前排單行程</h2>
    <p class="guest-order-subtitle">以下為目前公開的委託排單與進度資訊</p>

    <!-- 載入中動畫區塊 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2 loading-spinner" role="status"></div>
      資料載入中...
    </div>

    <!-- 無資料提示區塊 -->
    <div v-else-if="guestOrders.length === 0" class="orders-empty-card p-5 text-center text-muted shadow-sm">
      目前尚無任何委託訂單資料。
    </div>

    <!-- 訂單表格 -->
    <div v-else class="orders-table-wrap">
      <DataTable :columns="orderColumns"
                 :items="guestOrders"
                 :show-edit="false"
                 :show-delete="false" />
    </div>
  </div>
</template>

<style scoped>
.guest-order-title {
  color: #3d3c3b;
  letter-spacing: 0.02em;
}

.guest-order-subtitle {
  margin-top: -0.2rem;
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.98rem;
}

.loading-spinner {
  color: #947659;
}

.orders-empty-card {
  border: 1px dashed #d6c8b9;
  border-radius: 16px;
  background: #faf7f2;
}

.orders-table-wrap {
  border: 1px solid #e6ddd3;
  border-radius: 16px;
  background: linear-gradient(135deg, #fffdf9 0%, #f7f4ee 100%);
  box-shadow: none;
  padding: 0.35rem;
}

.orders-table-wrap :deep(.table-responsive) {
  border-radius: 12px;
  box-shadow: none !important;
}

.orders-table-wrap :deep(.table) {
  margin-bottom: 0;
}

.orders-table-wrap :deep(.table-dark) {
  --bs-table-bg: #f2f2f2;
  --bs-table-color: #3d3c3b;
}

.orders-table-wrap :deep(.table-hover tbody tr:hover) {
  background-color: rgba(148, 118, 89, 0.08) !important;
}

.orders-table-wrap :deep(tbody td) {
  color: #666;
}

.orders-table-wrap :deep(.status-pill) {
  display: inline-block;
  padding: 0.12rem 0.6rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.orders-table-wrap :deep(.status-enabled) {
  color: #2f6b3a;
  background: #e8f6eb;
  border: 1px solid #b9dfc2;
}

.orders-table-wrap :deep(.status-pending) {
  color: #8a5a18;
  background: #fff4df;
  border: 1px solid #f0d4a3;
}

.orders-table-wrap :deep(.status-disabled) {
  color: #8f3a42;
  background: #fdecef;
  border: 1px solid #f3c9d0;
}
</style>
