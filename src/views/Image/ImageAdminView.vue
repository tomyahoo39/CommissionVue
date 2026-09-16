<script setup>
  import {ref,computed,onMounted } from 'vue'
  import UploadImage from '@/components/UploadImageView.vue'
  import imageService from '@/services/image'
  import typeService from '@/services/CommissionType'

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

  const BASE_URL = 'https://localhost:7015'
  const getImageUrl = (path) => {
    if (!path) return ''
    return path.startsWith('https') ? path :`${BASE_URL}${path}`
  }

  const moveImage = (index,direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= images.value.length) return

    const temp = images.value[index]
    images.value[index] = images.value[targetIndex]
    images.value[targetIndex] = temp

    images.value.forEach((img, i)=> {
      img.sortOrder = i + 1
    })
  }

  const isSaving = ref(false)
  const handleSave = async (img) => {
    isSaving.value = true
    try {
      const update = {
        commissionTypeId: img.commissionTypeId,
        title: img.title,
        sortOrder: img.sortOrder,
        isVisible: img.isVisible,
      }

      await imageService.updateImage(img.id, update)
      alert('圖片更新成功')
      getImagesByTypeId(selectedTypeId.value)
    } catch (error) {
      console.error(error)
      alert('更新失敗')
    } finally {
      isSaving.value = false
    }
  }

  onMounted(() => {
    getTypes()
  })
</script>

<template>
  <div class="container py-4">
    <!-- 標題與新增按鈕 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold">作品圖片管理</h2>
      <button class="btn btn-primary" @click="isModalOpen = true">
        + 新增圖片
      </button>
    </div>

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

    <!-- 載入中狀態 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      圖片載入中...
    </div>

    <!-- 2. 圖片內容展示區塊 -->
    <div v-else>
      <!-- 無圖片提示 -->
      <div v-if="images.length === 0" class="text-center py-5 border rounded bg-light text-muted">
        該分類目前尚無圖片，請點擊右上角「新增圖片」。
      </div>

      <!-- 圖片網格 (Cards) -->
      <div v-else class="row g-3">
        <div v-for="(img,index) in images"
             :key="img.id"
             class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div class="card h-100 shadow-sm" :class="{ 'opacity-50 bg-light': !img.isVisible }">
            <!-- 圖片縮圖 (點擊開啟大圖預覽) -->
            <div class="ratio ratio-4x3 bg-secondary card-img-top position-relative overflow-hidden cursor-pointer"
                 @click="previewImageUrl = getImageUrl(img.imagePath)">
              <img :src="getImageUrl(img.thumbPath)" :alt="img.title" class="object-fit-cover w-100 h-100" />
              <!-- 不顯示標籤 -->
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

              <!-- 2. 前台顯示開關 (isVisible) -->
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

              <!-- 3. 排序按鈕 (▲ / ▼) 與儲存按鈕 -->
              <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                <!-- 排序按鈕組 -->
                <div class="btn-group btn-group-sm">
                  <button type="button"
                          class="btn btn-outline-secondary"
                          :disabled="index === 0"
                          @click="moveImage(index, -1)">
                    ▲
                  </button>
                  <button type="button"
                          class="btn btn-outline-secondary"
                          :disabled="index === images.length - 1"
                          @click="moveImage(index, 1)">
                    ▼
                  </button>
                </div>

                <span class="badge bg-light text-dark border">
                  排序: {{ img.sortOrder }}
                </span>

                <!-- 單張儲存按鈕 -->
                <button class="btn btn-sm btn-primary" :disabled="isSaving" @click="handleSave(img)">
                  儲存
                </button>
              </div>
            </div>

            <!-- 卡片內容 -->
            <div class="card-body p-3 d-flex justify-content-between align-items-center">
              <h6 class="card-title text-truncate fw-bold mb-0" :title="img.title">
                {{ img.title }}
              </h6>
              <span class="badge bg-light text-dark border">
                排序: {{ img.sortOrder }}
              </span>
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
         class="modal fade show d-block bg-dark bg-opacity-75"
         tabindex="-1"
         @click.self="previewImageUrl = null">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bg-transparent border-0 text-end">
          <button type="button" class="btn-close btn-close-white mb-2 ms-auto" @click="previewImageUrl = null"></button>
          <img :src="previewImageUrl" class="img-fluid rounded shadow" style="max-height: 80vh; object-fit: contain;" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
