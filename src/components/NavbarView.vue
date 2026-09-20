<script setup>
import { RouterLink } from 'vue-router'
import loginService, { isAdminState } from '@/services/login'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

const handleLogout = async () => {
  loginService.removeToken()
  router.push('/')
  await Swal.fire({
    icon: 'success',
    title: '已登出',
    text: '已登出系統，將導回首頁',
    confirmButtonText: '確認'
  })
}
</script>

<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <!-- 品牌/系統名稱 -->
      <RouterLink to="/" class="navbar-brand">
        <img src="@/assets/001.png" alt="TENPURA_FISH" class="navbar-brand-image" />
        TENPURA_FISH
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

      <!-- 導航連結 -->
      <div class="navbar-collapse collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">首頁</RouterLink>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle"
               href="#"
               role="button"
               data-bs-toggle="dropdown"
               aria-expanded="false"
            >
              作品集
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><RouterLink to="/guestImage" class="dropdown-item" active-class="active">委託項目作品</RouterLink></li>
              <li><hr v-if="isAdminState" /></li>
              <li><RouterLink to="/image" class="dropdown-item" active-class="active" v-if="isAdminState">圖片設定與上傳</RouterLink></li>
            </ul>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle"
               href="#"
               role="button"
               data-bs-toggle="dropdown"
               aria-expanded="false"
            >
              填單表
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><RouterLink to="/guestPeriod" class="dropdown-item" active-class="active">委託填單表</RouterLink></li>
              <li><hr v-if="isAdminState" /></li>
              <li><RouterLink to="/period" class="dropdown-item" active-class="active" v-if="isAdminState">委託表單設定</RouterLink></li>
              <li><RouterLink to="/type" class="dropdown-item" active-class="active" v-if="isAdminState">委託項目設定</RouterLink></li>
              <li><RouterLink to="/social" class="dropdown-item" active-class="active" v-if="isAdminState">社群平台設定</RouterLink></li>
            </ul>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle"
               href="#"
               role="button"
               data-bs-toggle="dropdown"
               aria-expanded="false"
            >
              排單表
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><RouterLink to="/guestOrder" class="dropdown-item" active-class="active">目前排單行程</RouterLink></li>
              <li><hr v-if="isAdminState" /></li>
              <li><RouterLink to="/order" class="dropdown-item" active-class="active" v-if="isAdminState">後台排單設定</RouterLink></li>
            </ul>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle"
               href="#"
               role="button"
               data-bs-toggle="dropdown"
               aria-expanded="false"
            >
              Q&A資訊
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <RouterLink to="/guestQa" class="dropdown-item" active-class="active">Q&A問與答</RouterLink>
              </li>
              <li><hr v-if="isAdminState" /></li>
              <li>
                <RouterLink to="/qa" class="dropdown-item" active-class="active" v-if="isAdminState">後台QA設定</RouterLink>
              </li>
              <li>
                <RouterLink to="/showguestQa" class="dropdown-item" active-class="active" v-if="isAdminState">後台訪客提問資訊</RouterLink>
              </li>
            </ul>
          </li>

          <li class="nav-item" v-if="!isAdminState">
            <RouterLink to="/login" class="nav-link nav-link-auth">管理員登入</RouterLink>
          </li>

          <div class="nav-auth" v-if="isAdminState">
            <button class="btn btn-logout" @click="handleLogout">
              登出系統
            </button>
          </div>
        </ul>
      </div>
    </div>
  </nav>
  <div>
    <img src="@/assets/002.png"
         alt="Logo"
         style="width: 100%; max-height: 350px; object-fit: cover; display: block;" />
  </div>
</template>

<style scoped>
/* 顏色變數 */
  .navbar {
    --cream-white: #F2F2F2;
    --coral-pink: #f4a8a8;
    --coral-dark: #e6969a;
    --text-dark: #3D3C3B;
    --text-light: #666666;
    --border-light: #ede9e4;
  }

/* 導航列基礎樣式 */
.navbar {
  background-color: #F2F2F2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--border-light);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: sticky;
  top: 0;
  z-index: 100;
  height: auto;
  overflow: visible;
}

.container {
  max-width: 100%;
  padding: 0 1rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: auto;
}

/* 品牌名稱 */
.navbar-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 1.55rem;
  font-weight: 600;
  color: var(--text-dark);
  text-decoration: none;
  letter-spacing: -0.3px;
  transition: color 0.2s ease;
}

.navbar-brand-image {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.navbar-brand:hover {
  color: #947659;
}

/* 漢堡按鈕 */
.navbar-toggler {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  flex-shrink: 0;
}

.navbar-toggler-icon {
  width: 1.5rem;
  height: 1.5rem;
  display: inline-block;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%232b2b2b' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}

/* 導航區域 */
.navbar-collapse {
  display: flex;
  flex-basis: auto;
  flex-grow: 1;
  justify-content: flex-end;
}

.navbar-nav {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.nav-item {
  position: relative;
}

/* 導航連結 */
.nav-link {
  color: var(--text-dark) !important;
  font-weight: 500;
  font-size: 1.08rem;
  padding: 0.5rem 0.8rem !important;
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: #947659 !important;
}

/* 認證連結按鈕 */
.nav-link-auth {
  background-color: white !important;
  border: 2px solid var(--text-light);
  color: var(--text-light) !important;
  margin-left: 2rem;
}

.nav-link-auth:hover {
  background-color: var(--text-light) !important;
  color: white !important;
  border-color: var(--text-light);
  box-shadow: none;
}

/* 下拉選單 */
.dropdown-menu {
  background-color: var(--cream-white);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 0.5rem 0 !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  color: var(--text-dark) !important;
  font-size: 1rem;
  padding: 0.6rem 1rem !important;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  color: #947659 !important;
}

.dropdown-item.active,
.dropdown-item:active {
  background-color: transparent !important;
  color: #947659 !important;
}

/* 認證區域 */
.nav-auth {
  margin-left: 2rem;
}

/* 登出按鈕 */
.btn-logout {
  background-color: white;
  border: 2px solid var(--text-light);
  color: var(--text-light);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-logout:hover {
  background-color: var(--text-light);
  color: white;
  border-color: var(--text-light);
}

@media (max-width: 991.98px) {
  .navbar-toggler {
    display: flex !important;
    align-items: center;
  }

  .navbar-collapse {
    display: none !important;
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: var(--cream-white);
    border-bottom: 1px solid var(--border-light);
    width: 100vw;
    max-height: calc(100vh - 56px);
    padding: 1rem;
    overflow-y: auto;
    z-index: 99;
  }

  .navbar-collapse.show {
    display: flex !important;
  }

  .navbar-nav {
    flex-direction: column;
    gap: 0;
    width: 100%;
  }

  .nav-item {
    width: 100%;
    position: relative;
  }

  .nav-link {
    width: 100%;
    padding: 0.8rem 1rem !important;
    border-radius: 6px;
    margin-bottom: 0.3rem;
  }

  .nav-link-auth {
    margin-left: 0 !important;
  }

  .nav-auth {
    width: 100%;
    margin-left: 0 !important;
    margin-top: 0.5rem;
  }

  .btn-logout {
    width: 100%;
  }

  .navbar-nav .dropdown-menu {
    position: absolute !important;
    border: 1px solid var(--border-light);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    background-color: var(--cream-white);
    border-radius: 6px;
    padding: 0.5rem 0 !important;
    top: 100%;
    left: 0;
    right: auto;
    min-width: 200px;
    width: max-content;
    margin-top: 0.2rem;
    margin-left: 0;
    z-index: 110;
  }

  .dropdown-item {
    font-size: 0.95rem;
    white-space: nowrap;
  }
}

@media (min-width: 992px) {
  .container {
    width: max-content;
    max-width: none;
    margin: 0 auto;
    justify-content: center;
    gap: 3.0rem;
  }

  .navbar-toggler {
    display: none !important;
  }

  .nav-item {
    position: relative;
  }

  .navbar-nav .dropdown-menu {
    position: absolute !important;
    top: 100%;
    left: 0;
    display: none;
    min-width: 220px;
    margin-top: 0.35rem;
    z-index: 110;
  }

  .navbar-nav .dropdown-menu.show {
    display: block;
  }

  .navbar-collapse {
    display: flex !important;
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    flex-direction: row;
    background-color: transparent;
    border-bottom: none;
    width: auto;
    padding: 0;
    flex-grow: 0 !important;
    flex-basis: auto !important;
    justify-content: center;
    margin-left: 0.6rem;
  }

  .navbar-nav {
    flex-direction: row;
    gap: 0.3rem;
    justify-content: center;
  }

  .nav-auth {
    margin-left: 2rem;
  }
}
</style>
