<script setup>
  import { ref, onMounted,computed } from 'vue'
  import periodService from '@/services/commissionPeriod'

  const period = ref(null)
  const isLoading = ref(false)

  const getFirstPeriod = async () => {
    isLoading.value = true
    try {
      const response = await periodService.getFirstPeriod()
      period.value = response.data
      isLoading.value = false
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  const activePeriod = computed(() => {
    if (!period.value) return null
    const today = new Date().toISOString().split('T')[0]
    const { openAt, closeAt } = period.value
    if (today >= openAt && today <= closeAt) {
      return period.value
    }
    return null
  })

  onMounted(() => {
    getFirstPeriod()
  })

</script>

<template>
  <div class="container my-4">
    <h2 class="h4 mb-4 fw-bold">委託期狀態</h2>

    <!-- 載入中提示 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      資料載入中...
    </div>

    <!-- 情況 A：如果今天有對應的委託期開放中 -->
    <div v-else-if="activePeriod" class="p-4 border rounded shadow-sm bg-white">
      <p class="mb-2"><strong>委託期：</strong>{{ activePeriod.title }}</p>
      <p class="mb-2"><strong>開始時間：</strong>{{ activePeriod.openAt }}</p>
      <p class="mb-2"><strong>結束時間：</strong>{{ activePeriod.closeAt }}</p>
      <p class="mb-0"><strong>最大中選人數：</strong>{{ activePeriod.maxWinners }}</p>
    </div>

    <!-- 情況 B：如果今天不在任何委託期內（或尚未有開放） -->
    <div v-else class="alert alert-warning text-center py-4">
      <h4>目前尚未有委託期開放，如有商業委託或加急處理，請透過Q&A頁面的信箱留言，會盡速為您服務</h4>
    </div>
  </div>
</template>

<style scoped></style>
