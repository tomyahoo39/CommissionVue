<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import imageService from '@/services/image'
import indexService from '@/services/index'
import typeService from '@/services/CommissionType'

const router = useRouter()
const isLoading = ref(false)

const indexData = ref([])
const homeNotice = ref('')
const types = ref([])

const BASE_URL = 'https://localhost:7015'
const getImageUrl = (path) => {
  if(!path) return ''
  return path.startsWith('https') ? path : `${BASE_URL}${path}`
}

const getTypeInfo = (typeId) => {
  return types.value.find(t => t.id === typeId) || {}
}

const getData = async () => {
  isLoading.value = true
  try {
    const typeRes = await typeService.getAllType()
    types.value = typeRes.data
    const noticeRes = await indexService.getIndexNotice()
    homeNotice.value = noticeRes.data[0].noticeContent
    const res = await imageService.getFirstThumbs()
    indexData.value = res.data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const goToImage = (typeId) => {
  router.push({ path: '/guestImage', query: {typeId} })
}

onMounted(() => {
  getData()
})

</script>

<template><div class="container py-4">
  <!-- 載入中 -->
  <div v-if="isLoading" class="text-center py-5 text-muted">
    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
    資料載入中...
  </div>

  <div v-else>
    <!-- 1. 委託前須知與規範文字 -->
    <section  class="mb-5 p-4 rounded bg-light border shadow-sm">
      <h3 class="h5 fw-bold mb-3 border-bottom pb-2 text-primary">📋 委託前須知與規範</h3>
      <div class="lh-lg text-dark whitespace-pre-line">
        <h5>{{ homeNotice}}</h5>
      </div>
    </section>

    <!-- 2. 四大分類卡片列表 -->
    <section>
      <h3 class="h5 fw-bold mb-4">🎨 委託項目作品覽集</h3>

      <div class="row g-4">
        <div v-for="item in indexData" :key="item.commissionTypeId" class="col-12 col-md-6">
          <div class="card h-100 shadow-sm cursor-pointer hover-card"
               @click="goToImage(item.commissionTypeId)">
            <div class="row g-0 h-100">
              <!-- 左側：自動撈取的第一張縮圖 -->
              <div class="col-12 col-sm-5 bg-secondary position-relative overflow-hidden">
                <div class="ratio ratio-4x3 h-100">
                  <img :src="getImageUrl(item.thumbPath)"
                       :alt="item.typeName"
                       class="object-fit-cover w-100 h-100" />
                </div>
              </div>

              <!-- 右側：名稱與前端自訂介紹 -->
              <div class="col-12 col-sm-7 p-3 d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <!-- ⭕ 拿正確匹配的標題 -->
                    <h5 class="fw-bold mb-0 text-dark">
                      {{ getTypeInfo(item.commissionTypeId).typeName || item.typeName }}
                    </h5>

                    <!-- ⭕ 有 basePrice 才顯示 -->
                    <span v-if="getTypeInfo(item.commissionTypeId).basePrice" class="badge bg-light text-dark border">
                      NT$ {{ getTypeInfo(item.commissionTypeId).basePrice }} 起
                    </span>
                  </div>

                  <!-- ⭕ 顯示 shortDescription -->
                  <p class="card-text text-muted small lh-base mb-2 whitespace-pre-line">
                    {{ getTypeInfo(item.commissionTypeId).shortDescription || '點擊觀看更多相關作品。' }}
                  </p>
                </div>

                <div class="text-end">
                  <span class="btn btn-sm btn-outline-primary rounded-pill">
                    前往作品集 ➔
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  </div>
</div></template>

<style scoped>

  .whitespace-pre-line {
    white-space: pre-line;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .hover-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

    .hover-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.12) !important;
    }
</style>
