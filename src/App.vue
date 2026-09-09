<script setup>
import { RouterView } from 'vue-router'
import NavbarView from './components/NavbarView.vue'
</script>

<template>
  <div class="app-layout">
    <!-- 頂部導覽列 -->
    <NavbarView />

    <!-- 主要內容區塊 -->
    <main class="container my-4 my-md-5">
      <div class="main-card shadow-sm p-4 p-md-5 bg-white rounded-4">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style>
/* 全域基礎背景與字型 */
body {
  background-color: #f8f9fa;
  color: #333;
  min-height: 100vh;
}

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
