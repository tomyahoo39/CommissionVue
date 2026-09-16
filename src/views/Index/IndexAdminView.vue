<script setup>
import { ref, onMounted } from 'vue'
import { getHomeConfig, saveHomeConfig } from '@/services/index'
import typeService from '@/services/CommissionType'

const configForm = ref(
  {
    noticeContent: '',
    typesInfo: '',
  }
)
const types = ref([])

const handleSave = () => {
  saveHomeConfig(configForm.value)
  alert('首頁資訊已儲存')
}

onMounted(async() => {
  configForm.value = getHomeConfig()
  try {
    const res = await typeService.getAllType()
    types.value = res.data

    types.value.forEach(type => {
      if (!configForm.value.typesInfo[type.id]) {
        configForm.value.typesInfo[type.id] = { description: '', basePrice: '' }
      }
    })
  } catch (error) {
    console.error(error)
  }
})

  

</script>

<template>
  <div class="container py-4">
    <h3 class="mb-4 fw-bold">首頁資訊管理</h3>

    <!-- 須知規範 -->
    <div class="card p-3 mb-4 shadow-sm">
      <h5 class="fw-bold">委託須知與規範</h5>
      <textarea v-model="configForm.noticeContent" class="form-control" rows="10"></textarea>
    </div>

    <!-- 各分類設定 -->
    <div class="card p-3 mb-4 shadow-sm">
      <h5 class="fw-bold mb-3">分類價格與描述</h5>
      <div v-for="t in types" :key="t.id" class="border-bottom pb-3 mb-3">
        <h6 class="fw-bold text-primary">{{ t.typeName }} (ID: {{ t.id }})</h6>
        <div class="row g-2">
          <div class="col-md-3">
            <label class="form-label small">起價 (basePrice)</label>
            <input v-model="configForm.typesInfo[t.id].basePrice" type="text" class="form-control" placeholder="2000" />
          </div>
          <div class="col-md-9">
            <label class="form-label small">詳細描述 (description)</label>
            <textarea v-model="configForm.typesInfo[t.id].description" class="form-control" rows="3"></textarea>
          </div>
        </div>
      </div>
    </div>

    <button class="btn btn-primary px-4" @click="handleSave">儲存設定</button>
  </div>
</template>

<style scoped></style>
