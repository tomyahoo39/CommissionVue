<script setup>
import { ref, onMounted } from 'vue'
import indexService from '@/services/index'

const isLoading = ref(false)
const isSaving = ref(false)
const noticeId = ref(1)
const noticeContent = ref('')
const message = ref({type:'',text:''})

const getNotice = async () => {
  isLoading.value = true
  try {
    const res = await indexService.getIndexNotice()
    const data = res.data
    noticeId.value = data[0].id
    noticeContent.value = data[0].noticeContent
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const showMessage = (type, text) => {
  message.value = { type, text }
  setTimeout(() => {
    message.value = { type: '', text: '' }
  }, 3000)
}

const handleSave = async () => {
  if (!noticeContent.value.trim()) {
    showMessage('warning', '須知內容不可為空！')
    return
  }
  isSaving.value = true
  try {
    await indexService.updateNotice(noticeId.value, noticeContent.value)
    showMessage('success', '委前須知已成功更新！')
  } catch (error) {
    console.error(error)
    showMessage('danger', '儲存失敗，請確認後端服務是否正常。')
  } finally {
    isSaving.value = false
  }
}



onMounted(() => {
  getNotice()
})
</script>

<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold">⚙️ 委託前須知與規範設定</h2>
    </div>

    <!-- 狀態提示 -->
    <div v-if="message.text" :class="`alert alert-${message.type} alert-dismissible fade show`" role="alert">
      {{ message.text }}
    </div>

    <!-- 載入中 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      資料載入中...
    </div>

    <!-- 編輯表單 -->
    <div v-else class="card shadow-sm border-0 p-4">
      <div class="mb-3">
        <label for="noticeArea" class="form-label fw-bold">委前須知內容 (支援 Enter 換行與排版)：</label>
        <textarea id="noticeArea"
                  v-model="noticeContent"
                  class="form-control font-monospace"
                  rows="12"
                  placeholder="請在此輸入全站委託前須知文字..."></textarea>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-secondary" @click="getNotice" :disabled="isSaving">
          重置 / 重新載入
        </button>
        <button class="btn btn-primary px-4" @click="handleSave" :disabled="isSaving">
          <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
          儲存變更
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
