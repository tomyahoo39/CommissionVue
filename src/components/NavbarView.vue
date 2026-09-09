<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
    <div class="container">
      <!-- 品牌/系統名稱 -->
      <RouterLink to="/" class="navbar-brand fw-bold text-primary fs-4">
        🎨 繪圖委託系統
      </RouterLink>

      <!-- 手機版漢堡選單按鈕 -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 導覽連結 -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto gap-1">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link" active-class="active fw-bold">首頁</RouterLink>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">價目表</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">填單表</a>
          </li>

          <!-- 下拉選單 1 -->
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              排單表
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <li><a class="dropdown-item" href="#">目前排單</a></li>
              <li><a class="dropdown-item" href="#">歷史委託</a></li>
            </ul>
          </li>

          <!-- 下拉選單 2 -->
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              系統設定
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <li>
                <RouterLink to="/qa" class="dropdown-item" active-class="active"
                  >QA 設定</RouterLink
                >
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item text-muted" href="#">其他設定</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
}

.nav-link {
  transition: all 0.2s ease-in-out;
  border-radius: 6px;
  padding: 0.5rem 0.8rem !important;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dropdown-menu {
  border-radius: 10px;
}
</style>
