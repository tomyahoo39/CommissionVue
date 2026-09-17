<script setup>
import { RouterLink } from 'vue-router'
import loginService, { isAdminState } from '@/services/login'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  loginService.removeToken()
  router.push('/')
  alert('已登出系統，將導回首頁')
}
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
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle"
               href="#"
               role="button"
               data-bs-toggle="dropdown"
               aria-expanded="false">
              首頁
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <li><RouterLink to="/" class="dropdown-item">首頁</RouterLink></li>
              <li><hr></li>
              <li><RouterLink to="/homeAdmin" class="dropdown-item" v-if="isAdminState">首頁後台設定</RouterLink></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle"
               href="#"
               role="button"
               data-bs-toggle="dropdown"
               aria-expanded="false">
              作品集
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <li><RouterLink to="/guestImage" class="dropdown-item">委託項目作品</RouterLink></li>
              <li><hr></li>
              <li><RouterLink to="/image" class="dropdown-item" v-if="isAdminState">圖片設定與上傳</RouterLink></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle"
               href="#"
               role="button"
               data-bs-toggle="dropdown"
               aria-expanded="false">
              填單表
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <li><RouterLink to="/guestPeriod" class="dropdown-item">委託填單表</RouterLink></li>
              <li><hr></li>
              <li><RouterLink to="/period" class="dropdown-item" v-if="isAdminState">委託期設定</RouterLink></li>
              <li><RouterLink to="/type" class="dropdown-item" v-if="isAdminState">委託項目設定</RouterLink></li>
              <li><RouterLink to="/social" class="dropdown-item" v-if="isAdminState">社群平台設定</RouterLink></li>
            </ul>
          </li>

          <!-- 下拉選單 1 -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle"
               href="#"
               role="button"
               data-bs-toggle="dropdown"
               aria-expanded="false">
              排單表
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <li><RouterLink to="/guestOrder" class="dropdown-item">目前排單行程</RouterLink></li>
              <li><hr></li>
              <li><RouterLink to="/order" class="dropdown-item" v-if="isAdminState">後台排單設定</RouterLink></li>
            </ul>
          </li>

          <!-- 下拉選單 2 -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle"
               href="#"
               role="button"
               data-bs-toggle="dropdown"
               aria-expanded="false">
              Q&A資訊
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <li>
                <RouterLink to="/guestQa" class="dropdown-item" active-class="active">Q&A問與答</RouterLink>
              </li>
              <li><hr></li>
              <li>
                <RouterLink to="/qa" class="dropdown-item" active-class="active"
                            v-if="isAdminState">後台QA設定</RouterLink>
              </li>
              <li>
                <RouterLink to="/showguestQa" class="dropdown-item" active-class="active"
                            v-if="isAdminState">後台訪客提問資訊</RouterLink>
              </li>
            </ul>
          </li>
          <li class="nav-item" v-if="!isAdminState">
            <RouterLink to="/login" class="nav-link text-white">管理員登入</RouterLink>
          </li>
          <div class="d-flex" v-if="isAdminState">
            <button class="btn btn-outline-light btn-sm" @click="handleLogout">
              登出系統
            </button>
          </div>
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
