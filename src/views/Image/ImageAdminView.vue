<script setup>
  import { ref,reactive,computed,onMounted } from 'vue'
  import imageService from '@/services/image'
  import typeService from '@/services/CommissionType'

  const isUploading = ref(false)
  const types = ref([])
  const filePreview = ref(null)

  const formState = reactive({
    commissionTypeId: null,
    title: '',
    file:null
  })

  const fileInputRef = ref(null)

  const getTypes = async () => {
    try {
      const response = await typeService.getAllType()
      types.value = response.data
    }
    catch (error) {
      console.error(error)
    }
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      formState.file = selectedFile
      filePreview.value = URL.createObjectURL(selectedFile)
    }
  }

  const handleSubmit = async () => {
    if (!formState.file || !formState.commissionTypeId || !formState.title) {
      alert('請完整填入所需資料')
      return
    }
    isUploading.value = true
    try {
      const formData = new FormData()
      formData.append('CommissionTypeId', formState.commissionTypeId)
      formData.append('Title', formState.title)
      formData.append('File', formState.file)

      await imageService.uploadNewImage(formData)
      alert('圖片上傳成功')

      formState.commissionTypeId = null
      formState.title = ''
      formState.file = null
      filePreview.value = null

      if (fileInputRef.value) {
        fileInputRef.value.value = ''
      }
    } catch (error) {
      console.error(error)
    } finally {
      isUploading.value = false
    }
  }



  onMounted(() => {
    getTypes()
  })
</script>

<template>
  <div class="container py-4" style="max-width: 500px;">
    <h3 class="h5 fw-bold mb-4">上傳作品圖片</h3>

    <form @submit.prevent="handleSubmit" class="card p-4 shadow-sm">
      <!-- 1. 選擇委託項目分類 -->
      <div class="mb-3">
        <label for="commissionTypeId" class="form-label">委託項目分類 <span class="text-danger">*</span></label>
        <select id="commissionTypeId"
                v-model.number="formState.commissionTypeId"
                class="form-select"
                required>
          <option :value="null" disabled>請選擇分類</option>
          <option v-for="item in types" :key="item.id" :value="item.id">
            {{ item.typeName }}
          </option>
        </select>
      </div>

      <!-- 2. 圖片標題 -->
      <div class="mb-3">
        <label for="title" class="form-label">圖片標題 <span class="text-danger">*</span></label>
        <input id="title"
               v-model="formState.title"
               type="text"
               class="form-control"
               placeholder="例如：雙人插畫範例"
               required />
      </div>

      <!-- 3. 選取檔案 -->
      <div class="mb-3">
        <label for="file" class="form-label">選擇圖片檔案 <span class="text-danger">*</span></label>
        <input id="file"
               ref="fileInputRef"
               type="file"
               accept="image/jpeg, image/png, image/webp"
               class="form-control"
               @change="handleFileChange"
               required />
      </div>

      <!-- 4. 本地即時預覽區域 -->
      <div v-if="filePreview" class="mb-3 text-center border p-2 rounded bg-light">
        <p class="small text-muted mb-1">預覽圖片：</p>
        <img :src="filePreview" class="img-fluid rounded" style="max-height: 200px; object-fit: contain;" />
      </div>

      <!-- 5. 送出按鈕 -->
      <button type="submit" class="btn btn-primary w-100" :disabled="isUploading">
        <span v-if="isUploading" class="spinner-border spinner-border-sm me-2"></span>
        {{ isUploading ? '上傳處理中...' : '開始上傳' }}
      </button>
    </form>
  </div>
</template>

<style scoped></style>
