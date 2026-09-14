<script setup>
  import { ref, onMounted } from 'vue'
  import typeService from '@/services/commissionType'
  import DataTable from '@/components/DataTable.vue'
  import FormModal from '@/components/FormModal.vue'

  const types = ref([])
  const typeColumns = [
    { label: '編號', key: 'id' },
    { label: '委託項目', key: 'typeName' },
    {
      label: '是否啟用', key: 'isActive', options: [
        { text: '啟用', value: true },
        { text: '停用', value: false },
      ]
    },
    {
      label: '前台圖片是否展示', key: 'isHomeVisible', options: [
        { text: '啟用', value: true },
        { text: '停用', value: false },
      ] },
    {
      label: '前台圖片展示順序', key: 'homeSortOrder', options: [
        { text: '停用', value: 0 }
      ]
    },
  ]
  const isLoading = ref(false)

  const getTypes = async () => {
    isLoading.value = true
    try {
      const response = await typeService.getAllType()
      types.value = response.data
      isLoading.value = false
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  const currentTitle = ref()
  const isModalOpen = ref(false)
  const currentData = ref({})
  const currentFields = ref([])

  const addFields = [
    { label: '委託項目', key: 'typeName', type: 'text', required: true, placeholder: '請輸入委託項目' },
  ]
  const editFields = [
    { label: '委託項目', key: 'typeName', type: 'text', required: true, placeholder: '請輸入委託項目' },
    {
      label: '啟用狀態', key: 'isActive', type: 'select', required: true, placeholder: '請選擇啟用狀態',
      options: [
        { text: '啟用', value: true },
        { text: '停用', value: false },
      ]
    },
    {
      label: '前台圖片是否展示', key: 'isHomeVisible', type: 'select', required: true, placeholder: '請選擇啟用狀態',
      options: [
        { text: '啟用', value: true },
        { text: '停用', value: false },
      ] },
    { label: '前台圖片展示順序', key: 'homeSortOrder', type: 'number', required: true, placeholder: '請輸入展示順序' },
  ]

  const openAddModal = () => {
    currentTitle.value = '新增委託項目'
    isModalOpen.value = true
    currentData.value = {}
    currentFields.value = addFields
  }

  const handleEdit = (item) => {
    currentTitle.value = '修改委託項目'
    isModalOpen.value = true
    currentData.value = { ...item }
    currentFields.value = editFields
}

  const handleSubmit = async (formData) => {
    try {
      if (formData.id) {
        const { id } = formData
        await typeService.updateType(id, formData)
        isModalOpen.value = false
        getTypes()
      }
      else {
        await typeService.createNewType(formData)
        isModalOpen.value = false
        getTypes()
      }
    } catch (error) {
      console.error(error)
    }
  }


  onMounted(() => {
    getTypes()
  })
</script>

<template>
  <div class="qa-setting-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold">委託項目設定頁面</h2>
      <button class="btn btn-primary btn-sm" @click="openAddModal">新增委託項目</button>
    </div>

    <!-- 載入中提示 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      資料載入中...
    </div>

    <DataTable :columns="typeColumns"
               :items="types"
               :showEdit=true
               :showDelete=false
               @edit=handleEdit />
    <FormModal :title="currentTitle"
               :isOpen="isModalOpen"
               :fields="currentFields"
               :originalData="currentData"
               @close="isModalOpen = false"
               @submit="handleSubmit"/>
  </div>
</template>

<style scoped></style>
