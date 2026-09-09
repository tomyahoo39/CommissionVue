<script setup>
import { onMounted } from 'vue'
import qaService from '@/services/qaSetting.js'

const getQaSetting = async () => {
  try {
    const response = await qaService.getQaSetting()
    console.log('API回傳結果:', response)
  } catch (error) {
    console.error('API回傳結果失敗:', error)
  }
}

onMounted(() => {
  getQaSetting()
})
</script>

<template>QA設定頁面</template>

<style scoped></style>
