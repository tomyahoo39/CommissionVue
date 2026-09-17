<script setup>
  import { ref , onMounted } from 'vue'
  import socialService from '@/services/socialPlatform'
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
      ]
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
        alert('修改成功')
        isModalOpen.value = false
        getAllSocial()
      }
      else {
        await socialService.createNewSocial(formData)
        alert('新增成功')
        isModalOpen.value = false
        getAllSocial()
      }
    } catch (error) {
      console.error(error)
    }
  }

  onMounted(() => {
    getAllSocial()
  })
</script>

<template>
  <div class="qa-setting-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold">社群平台設定頁面</h2>
      <button class="btn btn-primary btn-sm" @click="openAddModal">新增社群平台</button>
    </div>

    <!-- 載入中提示 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      資料載入中...
    </div>

    <DataTable :columns="socialColumns"
               :items="socials"
               :showEdit="true"
               :showDelete ="false"
               @edit="handleEdit"/>
    <FormModal :title="currentTitle"
               :isOpen="isModalOpen"
               :fields="currentField"
               :originalData="currentData"
               @close="isModalOpen = false"
               @submit="handleSubmit"/>
  </div>
</template>

<style scoped></style>
