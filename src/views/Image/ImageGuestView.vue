<script setup>
import { ref, computed, onMounted,watch } from 'vue'
import imageService from '@/services/image'
import typeService from '@/services/CommissionType'
import { useRoute, useRouter } from 'vue-router'
import { getImageUrl } from '@/utils/safeImageUrl'

const isLoading = ref(false)
const types = ref([])
const images = ref([])
const selectedTypeId = ref(null)
const previewImageUrl = ref(null)

const getTypes = async () => {
  isLoading.value = true
  try {
    const response = await typeService.getAllType()
    types.value = response.data
    if (types.value.length > 0) {
      const queryTypeId = Number(route.query.typeId)
      const hasType = types.value.some(t => t.id === queryTypeId)

      if (queryTypeId && hasType) {
        selectedTypeId.value = queryTypeId
      } else {
        selectedTypeId.value = types.value[0].id
      }

      await getImagesByTypeId(selectedTypeId.value)
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const getImagesByTypeId = async (typeId) => {
  isLoading.value = true
  try {
    const imgRes = await imageService.getGuestImage(typeId)
    images.value = imgRes.data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const handleTabClick = (typeId) => {
  selectedTypeId.value = typeId
  getImagesByTypeId(typeId)
}

const route = useRoute()

const currentType = computed(() => {
  return types.value.find(t => t.id === selectedTypeId.value) || {}
})


const router = useRouter()
const goToOrder = () => {
  router.push({
    path:'/guestPeriod'
  })
}

onMounted(() => {
  getTypes()
})
</script>

<template>
  <div class="container py-4 image-guest-text">
    <div class="text-end border-top pt-3">
      <button class="btn-custom-action commission-btn rounded-pill" @click="goToOrder">
        前往填寫委託單 ➔
      </button>
    </div>

    <!-- 標題與新增按鈕 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold">委託項目作品分類</h2>
    </div>
    <div class="zoom-hint mb-4" role="note">點擊縮圖可放大預覽</div>

    <!-- 1. 分類頁籤 (Tabs) -->
    <ul class="nav nav-tabs mb-4">
      <li v-for="typeItem in types" :key="typeItem.id" class="nav-item">
        <button class="nav-link"
                :class="{ active: selectedTypeId === typeItem.id }"
                @click="handleTabClick(typeItem.id)">
          {{ typeItem.typeName }}
        </button>
      </li>
    </ul>

    <div v-if="currentType.fullDescription || currentType.basePrice" class="card p-4 mb-4 bg-light border-0 shadow-sm">
      <h5 class="fw-bold mb-2 text-primary type-heading">{{ currentType.typeName }} </h5>



      <!-- 完整介紹：加上 whitespace-pre-line 確保 \n 換行與空格正常顯示 -->
      <div v-if="currentType.fullDescription" class="text-secondary whitespace-pre-line fs-6 lh-base">
        {{ currentType.fullDescription }}
      </div>
    </div>

    <!-- 載入中狀態 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      圖片載入中...
    </div>

    <!-- 2. 圖片內容展示區塊 -->
    <div v-else>
      <!-- 無圖片提示 -->
      <div v-if="images.length === 0" class="text-center py-5 border rounded bg-light text-muted">
        該分類目前尚無圖片，請等待作者更新。
      </div>

      <!-- 圖片網格 (Cards) -->
      <div v-else class="row g-3">
        <div v-for="img in images"
             :key="img.id"
             class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div class="card h-100 shadow-sm">
            <!-- 圖片縮圖 (點擊開啟大圖預覽) -->
            <div class="ratio ratio-4x3 bg-secondary card-img-top position-relative overflow-hidden cursor-pointer"
                 @click="previewImageUrl = getImageUrl(img.imagePath)">
              <img :src="getImageUrl(img.thumbPath)" :alt="img.title" class="object-fit-cover w-100 h-100" />
            </div>

            <!-- 卡片內容 -->
            <div class="card-body p-3 d-flex justify-content-between align-items-center">
              <h6 class="card-title text-truncate fw-bold mb-0" :title="img.title">
                {{ img.title }}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="previewImageUrl"
         class="modal fade show d-block bg-dark bg-opacity-75 preview-overlay"
         tabindex="-1"
         @click.self="previewImageUrl = null">
      <div class="modal-dialog modal-dialog-centered preview-modal-dialog">
        <div class="modal-content bg-transparent border-0 text-end preview-modal-content" @click="previewImageUrl = null">
          <button type="button" class="btn-close btn-close-white mb-2 ms-auto" @click.stop="previewImageUrl = null"></button>
          <img :src="previewImageUrl" class="img-fluid rounded shadow preview-full-image" @click.stop />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

  .whitespace-pre-line {
    white-space: pre-line;
  }

  .image-guest-text {
    color: #666;
  }

  .image-guest-text :is(
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    button,
    .nav-link,
    .card-title,
    .btn-custom-action,
    .text-muted,
    .text-secondary,
    .text-danger,
    .badge
  ) {
    font-size: 1.12rem !important;
    color: #666 !important;
    line-height: 1.7 !important;
  }

  .image-guest-text .type-heading {
    font-size: 1.45rem !important;
    line-height: 1.35 !important;
  }

  .commission-btn {
    border: 1px solid #666;
    color: #666;
    background-color: #fff;
    transition: all 0.2s ease;
    padding: 0.35rem 0.9rem;
  }

  .commission-btn:hover {
    border-color: #666;
    color: #fff !important;
    background-color: #666;
  }

  .zoom-hint {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.9rem;
    border: 1px solid #c7b08a;
    border-radius: 999px;
    background: #fff8ea;
    color: #8a6b3d !important;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  .zoom-hint::before {
    content: "※";
    font-weight: 800;
  }

  .preview-overlay {
    z-index: 2000;
  }

  .preview-modal-dialog {
    max-width: 96vw;
    margin: 0.25rem auto;
  }

  .preview-modal-content {
    width: 100%;
    min-height: 94vh;
    justify-content: center;
    align-items: center;
    cursor: zoom-out;
  }

  .preview-full-image {
    width: auto;
    max-width: 96vw;
    max-height: 94vh;
    object-fit: contain;
    cursor: default;
  }
</style>
