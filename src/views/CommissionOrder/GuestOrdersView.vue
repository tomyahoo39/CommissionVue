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
      ]
    },
    {
      label: '稿件狀態', key: 'workStatus', options: [
        { text: '未安排', value: 1 },
        { text: '已排單', value: 2 },
        { text: '進行中', value: 3 },
        { text: '已完成', value: 4 },
        { text: '已取消', value: 5 }
      ]
    },
      { label: '安排日期', key: 'scheduledDate' },
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
    <!-- 載入中動畫區塊 -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <!-- 無資料提示區塊 -->
    <div v-else-if="guestOrders.length === 0" class="card p-5 text-center text-muted shadow-sm">
      目前尚無任何委託訂單資料。
    </div>

    <!-- 訂單表格 -->
    <DataTable v-else
               :columns="orderColumns"
               :items="guestOrders"
               :show-edit="false"
               :show-delete="false" />
  </div>
</template>

<style scoped></style>
