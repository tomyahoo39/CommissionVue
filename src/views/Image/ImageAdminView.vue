<script setup>
  import {ref,onMounted } from 'vue'
  import Swal from 'sweetalert2'
  import UploadImage from '@/components/UploadImageView.vue'
  import imageService from '@/services/image'
  import typeService from '@/services/CommissionType'
  import { getImageUrl } from '@/utils/safeImageUrl'

  const isLoading = ref(false)
  const isModalOpen = ref(false)

  const types = ref([])
  const images = ref([])
  const selectedTypeId = ref(null)
  const previewImageUrl = ref(null)

  const getTypes = async () => {
    isLoading.value = true
    try {
      const typeRes = await typeService.getAllType()
      types.value = typeRes.data

      if (types.value.length > 0) {
        selectedTypeId.value = types.value[0].id
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
      const imgRes = await imageService.getAdminImage(typeId)
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

  const handleSubmit = () => {
    if (selectedTypeId.value) {
      getImagesByTypeId(selectedTypeId.value)
    }
  }


const reindexSortOrder = () => {
  images.value.sort((a, b) => a.sortOrder - b.sortOrder)
}

  const isSaving = ref(false)
  const handleBatchSave = async () => {
    isSaving.value = true
    try {
      reindexSortOrder()
      const updatePromises = images.value.map(img => {
        const update = {
          commissionTypeId: img.commissionTypeId,
          title: img.title,
          sortOrder: img.sortOrder,
          isVisible: img.isVisible
        }
        return imageService.updateImage(img.id, update)
      })
      await Promise.all(updatePromises)
      await Swal.fire({
        icon: 'success',
        title: '更新成功',
        text: '所有圖片更新成功',
        confirmButtonText: '確認'
      })
      getImagesByTypeId(selectedTypeId.value)
    } catch (error) {
      console.error(error)
      await Swal.fire({
        icon: 'error',
        title: '更新失敗',
        text: '請稍後再試',
        confirmButtonText: '確認'
      })
    } finally {
      isSaving.value = false
    }
  }

  onMounted(() => {
    getTypes()
  })
</script>

<template>
  <div class="container py-4 image-admin-text">
    <!-- 標題與按鈕區塊 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold admin-title">作品圖片管理</h2>
      <div>
        <!-- ⭕ 一鍵儲存整個分類的變更 -->
        <button class="btn admin-btn me-2" :disabled="isSaving || images.length === 0" @click="handleBatchSave">
          <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
          💾 儲存所有變更
        </button>
        <button class="btn admin-btn" @click="isModalOpen = true">
          + 新增圖片
        </button>
      </div>
    </div>

    <!-- 1. 分類頁籤 (Tabs) -->
    <ul class="nav nav-tabs mb-4 admin-tabs">
      <li v-for="typeItem in types" :key="typeItem.id" class="nav-item">
        <button class="nav-link"
                :class="{ active: selectedTypeId === typeItem.id }"
                @click="handleTabClick(typeItem.id)">
          {{ typeItem.typeName }}
        </button>
      </li>
    </ul>

    <!-- 載入中狀態 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      圖片載入中...
    </div>

    <!-- 2. 圖片內容展示區塊 -->
    <div v-else>
      <div v-if="images.length === 0" class="text-center py-5 border rounded bg-light text-muted admin-empty-card">
        該分類目前尚無圖片，請點擊右上角「新增圖片」。
      </div>

      <div v-else class="row g-3">
        <div v-for="img in images"
             :key="img.id"
             class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div class="card h-100 admin-image-card" :class="{ 'opacity-50 bg-light': !img.isVisible }">

            <!-- 圖片縮圖 -->
            <div class="ratio ratio-4x3 bg-secondary card-img-top position-relative overflow-hidden cursor-pointer"
                 @click="previewImageUrl = getImageUrl(img.imagePath)">
              <img :src="getImageUrl(img.thumbPath)" :alt="img.title" class="object-fit-cover w-100 h-100" />
              <span v-if="!img.isVisible" class="badge bg-danger position-absolute top-0 start-0 m-2">
                已隱藏
              </span>
            </div>

            <div class="card-body p-3">
              <!-- 1. 修改標題 -->
              <div class="mb-2">
                <label class="form-label small text-muted mb-1">圖片標題</label>
                <input v-model="img.title" type="text" class="form-control form-control-sm" />
              </div>

              <!-- 2. 前台顯示開關 -->
              <div class="form-check form-switch mb-3">
                <input :id="'switch-' + img.id"
                       v-model="img.isVisible"
                       class="form-check-input"
                       type="checkbox"
                       role="switch" />
                <label :for="'switch-' + img.id" class="form-check-label small">
                  {{ img.isVisible ? '前台顯示中' : '已隱藏' }}
                </label>
              </div>

              <!-- ⭕ 3. 改良版排序控制器：數字輸入框 + 微調按鈕 -->
              <div class="pt-2 border-top">
                <label class="form-label small text-muted mb-1">顯示排序</label>
                <div class="input-group input-group-sm">
                  <!-- 數字直接輸入框 (輸入完按 Enter 或切換焦點即自動重新重排) -->
                  <input v-model.number="img.sortOrder"
                         type="number"
                         min="1"
                         :max="images.length"
                         class="form-control text-center fw-bold"
                         @change="reindexSortOrder"
                         @keyup.enter="reindexSortOrder" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <!-- 頁面標題與開關按鈕 -->

    <UploadImage :isOpen="isModalOpen"
                 @close="isModalOpen = false"
                 @submit="handleSubmit" />

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
.image-admin-text {
  color: #666;
}

.admin-title {
  color: #3d3c3b;
  letter-spacing: 0.02em;
}

.admin-btn {
  border: 1px solid #666;
  border-radius: 999px;
  color: #666;
  background-color: #fff;
  transition: all 0.2s ease;
}

.admin-btn:hover {
  border-color: #666;
  color: #fff;
  background-color: #666;
}

.admin-tabs :deep(.nav-link) {
  color: #666;
  border-radius: 8px 8px 0 0;
}

.admin-tabs :deep(.nav-link.active) {
  color: #3d3c3b;
  border-color: #d8cec2 #d8cec2 #fff;
  font-weight: 600;
}

.admin-empty-card {
  border: 1px dashed #d6c8b9 !important;
  border-radius: 16px !important;
  background: #faf7f2 !important;
}

.admin-image-card {
  border: 1px solid #e6ddd3;
  border-radius: 14px;
  box-shadow: none;
  overflow: hidden;
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
