<script setup>
  import { ref , onMounted } from 'vue'
  import Swal from 'sweetalert2'
  import socialService from '@/services/SocialPlatform.js'
  import DataTable from '@/components/DataTable.vue'
  import FormModal from '@/components/FormModal.vue'

  const socials = ref([])
  const socialColumns = [
  { label: '編號', key: 'id' },
  { label: '社群平台', key: 'socialName' },
    {
      label: '啟用狀態', key: 'isActive', options: [
        { text: '啟用', value: true },
        { text: '停用', value: false },
      ],
      valueClassMap: {
        true: 'status-pill status-enabled',
        false: 'status-pill status-disabled'
      }
    },
  ]
  const isLoading = ref(false)

  const getAllSocial = async () => {
    isLoading.value = true
    try {
      const response = await socialService.getAllSocial()
      socials.value = response.data
      isLoading.value = false
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }


  const currentTitle = ref()
  const isModalOpen = ref(false)
  const currentField = ref([])
  const currentData = ref({})

  const addFields = [
    { label:'社群平台', key:'socialName',type:'text',required:true,placeholder:'請輸入社群平台'},
  ]
const editFields = [
    { label: '社群平台', key: 'socialName', type: 'text', required: true, placeholder: '請輸入社群平台' },
    {
    label: '啟用狀態', key: 'isActive', type: 'select', required: true, options: [
      { text: '啟用', value: true },
      { text: '停用', value: false },
    ]
    },
  ]


  const openAddModal = () => {
    currentTitle.value = '新增社群平台'
    isModalOpen.value = true
    currentField.value = addFields
    currentData.value= {}
  }

  const handleEdit = (item) => {
    currentTitle.value = '修改社群平台'
    isModalOpen.value = true
    currentField.value = editFields
    currentData.value = { ...item }
  }

  const handleSubmit = async (formData) => {
    try {
      if (formData.id) {
        const { id } = formData
        await socialService.updateSocial(id, formData)
        await Swal.fire({
          icon: 'success',
          title: '修改成功',
          text: '社群平台已更新',
          confirmButtonText: '確認'
        })
        isModalOpen.value = false
        getAllSocial()
      }
      else {
        await socialService.createNewSocial(formData)
        await Swal.fire({
          icon: 'success',
          title: '新增成功',
          text: '社群平台已新增',
          confirmButtonText: '確認'
        })
        isModalOpen.value = false
        getAllSocial()
      }
    } catch (error) {
      console.error(error)
      await Swal.fire({
        icon: 'error',
        title: '操作失敗',
        text: '請檢查資料是否正確',
        confirmButtonText: '確認'
      })
    }
  }

  onMounted(() => {
    getAllSocial()
  })
</script>

<template>
  <div class="qa-setting-page container py-4 social-setting-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold period-title">社群平台設定頁面</h2>
      <button class="btn period-btn" @click="openAddModal">新增社群平台</button>
    </div>

    <!-- 載入中提示 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      資料載入中...
    </div>

    <div class="social-table-wrap">
      <DataTable :columns="socialColumns"
                 :items="socials"
                 :showEdit="true"
                 :showDelete ="false"
                 @edit="handleEdit"/>
    </div>
    <FormModal :title="currentTitle"
               :isOpen="isModalOpen"
               :fields="currentField"
               :originalData="currentData"
               @close="isModalOpen = false"
               @submit="handleSubmit"/>
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

.social-table-wrap {
  border: 1px solid #e6ddd3;
  border-radius: 16px;
  background: linear-gradient(135deg, #fffdf9 0%, #f7f4ee 100%);
  box-shadow: 0 6px 16px rgba(61, 60, 59, 0.08);
  padding: 0.35rem;
}

.social-setting-page :deep(.table-responsive) {
  border-radius: 12px;
  box-shadow: none !important;
}

.social-setting-page :deep(.table-dark) {
  --bs-table-bg: #f2f2f2;
  --bs-table-color: #3d3c3b;
}

.social-setting-page :deep(.table-hover tbody tr:hover) {
  background-color: rgba(148, 118, 89, 0.08) !important;
}

.social-setting-page :deep(tbody td) {
  color: #666;
}

.social-setting-page :deep(.btn-outline-primary) {
  border: 1px solid #666;
  border-radius: 999px;
  color: #666;
  background: #fff;
}

.social-setting-page :deep(.btn-outline-primary:hover) {
  border-color: #666;
  color: #fff;
  background: #666;
}

.social-setting-page :deep(.spinner-border) {
  color: #947659;
}

.social-setting-page :deep(.status-pill) {
  display: inline-block;
  padding: 0.12rem 0.6rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.social-setting-page :deep(.status-enabled) {
  color: #2f6b3a;
  background: #e8f6eb;
  border: 1px solid #b9dfc2;
}

.social-setting-page :deep(.status-disabled) {
  color: #8a5a18;
  background: #fff4df;
  border: 1px solid #f0d4a3;
}
</style>
