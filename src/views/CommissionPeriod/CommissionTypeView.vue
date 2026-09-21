<script setup>
  import { ref, onMounted } from 'vue'
  import Swal from 'sweetalert2'
  import typeService from '@/services/CommissionType.js'
  import DataTable from '@/components/DataTable.vue'
  import FormModal from '@/components/FormModal.vue'
  import ShowDetail from '@/components/ShowDetail.vue'

  const types = ref([])
  const typeColumns = [
    { label: '編號', key: 'id' },
    { label: '委託項目', key: 'typeName' },
    {
      label: '是否啟用', key: 'isActive', options: [
        { text: '啟用', value: true },
        { text: '停用', value: false },
      ],
      valueClassMap: {
        true: 'status-pill status-enabled',
        false: 'status-pill status-disabled'
      }
    },
    {
      label: '首頁縮圖是否展示', key: 'isHomeVisible', options: [
        { text: '啟用', value: true },
        { text: '停用', value: false },
      ],
      valueClassMap: {
        true: 'status-pill status-enabled',
        false: 'status-pill status-disabled'
      }
    },
    {
      label: '首頁縮圖展示順序', key: 'homeSortOrder', options: [
        { text: '停用', value: 0 }
      ]
    },
    { label: '底價', key: 'basePrice' },
    { label: '首頁簡短介紹', key: 'shortDescription' },
    { label: '作品集完整介紹', key: 'fullDescription' },
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
    { label: '委託底價', key: 'basePrice', type: 'number', required: true, placeholder: '請輸入委託底價數字' },
    { label: '首頁簡短介紹', key: 'shortDescription', type: 'textarea',placeholder: '請輸入首頁介紹' },
    { label: '作品集完整介紹', key: 'fullDescription', type: 'textarea',placeholder: '請輸入完整介紹' },
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
      label: '首頁縮圖是否展示', key: 'isHomeVisible', type: 'select', required: true, placeholder: '請選擇啟用狀態',
      options: [
        { text: '啟用', value: true },
        { text: '停用', value: false },
      ] },
    { label: '首頁縮圖展示順序', key: 'homeSortOrder', type: 'number', required: true, placeholder: '請輸入展示順序' },
    { label: '委託底價', key: 'basePrice', type: 'number', required: true, placeholder: '請輸入委託底價數字' },
    { label: '首頁簡短介紹', key: 'shortDescription', type: 'textarea', placeholder: '請輸入首頁介紹' },
    { label: '完整介紹', key: 'fullDescription', type: 'textarea', placeholder: '請輸入完整介紹' },
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
        await Swal.fire({
          icon: 'success',
          title: '修改成功',
          text: '委託項目已更新',
          confirmButtonText: '確認'
        })
        isModalOpen.value = false
        getTypes()
      }
      else {
        await typeService.createNewType(formData)
        await Swal.fire({
          icon: 'success',
          title: '新增成功',
          text: '委託項目已新增',
          confirmButtonText: '確認'
        })
        isModalOpen.value = false
        getTypes()
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: '操作失敗',
        html: '請檢查資料是否完整填寫 <br>首頁縮圖展示上限數量只能設定四筆',
        confirmButtonText: '確認'
      })
    }
  }


  onMounted(() => {
    getTypes()
  })
</script>

<template>
  <div class="qa-setting-page container py-4 commission-type-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold period-title">委託項目設定頁面</h2>
      <button class="btn period-btn" @click="openAddModal">新增委託項目</button>
    </div>

    <!-- 載入中提示 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      資料載入中...
    </div>

    <div v-else>
      <ShowDetail v-for="typeItem in types"
                  :key="typeItem.id"
                  :columns="typeColumns"
                  :item="typeItem"
                  :showEdit="true"
                  @edit="handleEdit" />
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

.commission-type-page :deep(.spinner-border) {
  color: #947659;
}

.commission-type-page :deep(.card) {
  border: 1px solid #e6ddd3 !important;
  border-radius: 16px !important;
  background: linear-gradient(135deg, #fffdf9 0%, #f7f4ee 100%);
  box-shadow: 0 6px 16px rgba(61, 60, 59, 0.08) !important;
  overflow: hidden;
}

.commission-type-page :deep(.card .table) {
  margin-bottom: 0;
}

.commission-type-page :deep(.card th.bg-light) {
  background: #f2f2f2 !important;
  color: #3d3c3b !important;
}

.commission-type-page :deep(.card td) {
  color: #666 !important;
}

.commission-type-page :deep(.card-footer) {
  border-top: 1px solid #e6ddd3;
  background: #fff;
}

.commission-type-page :deep(.btn-outline-primary) {
  border: 1px solid #666;
  border-radius: 999px;
  color: #666;
  background: #fff;
}

.commission-type-page :deep(.btn-outline-primary:hover) {
  border-color: #666;
  color: #fff;
  background: #666;
}
</style>
