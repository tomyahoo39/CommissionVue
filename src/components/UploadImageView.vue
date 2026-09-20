<script setup>
  import { ref,reactive,computed,onMounted } from 'vue'
  import Swal from 'sweetalert2'
  import imageService from '@/services/image'
  import typeService from '@/services/CommissionType'

  defineProps({
    isOpen:{
      type:Boolean,
      default:false
    }
  })

  const emit = defineEmits(['close','submit'])

  const isUploading = ref(false)
  const types = ref([])
  const filePreview = ref(null)
  const fileInputRef = ref(null)

  const formState = reactive({
    commissionTypeId: null,
    title: '',
    file:null
  })


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

  const resetForm = ()=>{
    formState.commissionTypeId = null
    formState.title = ''
    formState.file = null
    filePreview.value = null
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }

  const closeModal = () => {
    resetForm()
    emit('close')
  }

  const handleSubmit = async () => {
    if (!formState.file || !formState.commissionTypeId || !formState.title) {
      await Swal.fire({
        icon: 'warning',
        title: '資料未完整',
        text: '請完整填入所需資料',
        confirmButtonText: '確認'
      })
      return
    }
    isUploading.value = true
    try {
      const formData = new FormData()
      formData.append('CommissionTypeId', formState.commissionTypeId)
      formData.append('Title', formState.title)
      formData.append('File', formState.file)

      await imageService.uploadNewImage(formData)
      await Swal.fire({
        icon: 'success',
        title: '上傳成功',
        text: '圖片上傳成功',
        confirmButtonText: '確認'
      })

      resetForm()
      emit('submit')
      emit('close')

      if (fileInputRef.value) {
        fileInputRef.value.value = ''
      }
    } catch (error) {
      console.error(error)
      await Swal.fire({
        icon: 'error',
        title: '上傳失敗',
        html: '上傳圖片限定 Jpg、Png、Webp<br>圖片大小不可超過 10MB',
        confirmButtonText: '確認'
      })
    } finally {
      isUploading.value = false
    }
  }

  onMounted(() => {
    getTypes()
  })
</script>

<template>
  <div v-if="isOpen" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1" @click.self="closeModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content shadow">

        <div class="modal-header">
          <h5 class="modal-title fw-bold">上傳作品圖片</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <!-- 1. 選擇委託項目分類 -->
            <div class="mb-3">
              <label for="commissionTypeId" class="form-label">委託項目分類 <span class="text-danger">*</span></label>
              <select id="commissionTypeId" v-model.number="formState.commissionTypeId" class="form-select" required>
                <option :value="null" disabled>請選擇分類</option>
                <option v-for="item in types" :key="item.id" :value="item.id">
                  {{ item.typeName }}
                </option>
              </select>
            </div>

            <!-- 2. 圖片標題 -->
            <div class="mb-3">
              <label for="title" class="form-label">圖片標題 <span class="text-danger">*</span></label>
              <input id="title" v-model="formState.title" type="text" class="form-control" placeholder="例如：雙人插畫範例" required />
            </div>

            <!-- 3. 選取檔案 -->
            <div class="mb-3">
              <label for="file" class="form-label">選擇圖片檔案(檔案大小不可超過10MB) <span class="text-danger">*</span></label>
              <input id="file" ref="fileInputRef" type="file" accept="image/jpeg, image/png, image/webp" class="form-control" @change="handleFileChange" required />
            </div>

            <!-- 4. 本地即時預覽區域 -->
            <div v-if="filePreview" class="mb-3 text-center border p-2 rounded bg-light">
              <p class="small text-muted mb-1">預覽圖片：</p>
              <img :src="filePreview" class="img-fluid rounded" style="max-height: 200px; object-fit: contain;" />
            </div>

            <!-- 5. 送出按鈕 -->
            <div class="d-flex justify-content-end gap-2 mt-4">
              <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
              <button type="submit" class="btn btn-primary" :disabled="isUploading">
                <span v-if="isUploading" class="spinner-border spinner-border-sm me-1"></span>
                {{ isUploading ? '上傳處理中...' : '開始上傳' }}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped></style>
