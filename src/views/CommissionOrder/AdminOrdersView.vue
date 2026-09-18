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
    {
      label: '中選狀態', key: 'selectionStatus', options: [
        { text: '等待抽籤', value: 1 },
        { text: '中選', value: 2 },
        { text: '已取消', value: 3 }
      ]
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
  <h3>委託期列表請至導覽列>填單表>委託期設定查詢</h3>
  <label>請輸入委託期ID</label>
  <input v-model="periodId">
  <button type="button" @click="getAdminOrder">確認</button>
  <ShowDetail
     v-for="orderItem in orderList"
    :key="orderItem.id"
    :columns ="orderColumn"
    :item ="orderItem"
    :showEdit="true"
    @edit="handleEdit"
  />
  <FormModal
    :title="modalTitle"
    :isOpen="isModalOpen"
    :fields="currentFields"
    :originalData="currentData"
    @submit=handleSubmit
    @close="isModalOpen = false"
  />
</template>

<style scoped></style>
