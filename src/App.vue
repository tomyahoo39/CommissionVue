<script setup>
import { RouterView } from 'vue-router'
import NavbarView from './components/NavbarView.vue'
import { onMounted } from 'vue'
import loginService from '@/services/login'

onMounted(() => {
  loginService.updateAdminState()
})
</script>

<template>
  <div class="app-layout">
    <!-- 頂部導覽列 -->
    <NavbarView />

    <!-- 主要內容區塊 -->
    <main class="container my-4 my-md-5">
      <div class="main-card">
        <RouterView />
      </div>
    </main>

    <!-- 頁尾 -->
    <footer class="app-footer">
      <div class="footer-grid">
        <h3 class="footer-title">創作者 / 炸蝦魚</h3>
        <h4 class="footer-title">聯絡與社群</h4>

        <p class="footer-desc">插畫 / 驚喜包 / 非商業委託</p>
        <div class="footer-socials">
          <a href="https://www.plurk.com/m/hahafish23">Plurk</a>
          <a href="https://www.facebook.com/tenpurafishdrawing/">Facebook</a>
          <a href="https://www.threads.com/@hahafish23">Threads</a>
          <a href="https://www.instagram.com/hahafish23/">Instagram</a>
          <span>電子信箱：hahafish23@gmail.com</span>
        </div>
      </div>

      <!-- 版權聲明 -->
      <div class="footer-copyright">
        <p>&copy; 2026 TempuraFish. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* 顏色變數 */
:root {
  --cream-white: #f2f2f2;
  --coral-pink: #f4a8a8;
  --coral-dark: #e6969a;
  --text-dark: #3d3c3b;
  --text-light: #666666;
  --border-light: #ede9e4;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 全域基礎樣式 */
body {
  background-color: var(--cream-white);
  color: var(--text-dark);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  letter-spacing: -0.3px;
  min-height: 100vh;
}

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 主卡片樣式 */
.main-card {
  background-color: white;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 頁尾樣式 */
.app-footer {
  background-color: #f2f2f2;
  color: var(--text-dark);
  padding: 1.2rem 1.5rem 0.9rem;
  margin-top: auto;
  border-top: 1px solid rgba(61, 60, 59, 0.18);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.footer-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 0.5rem;
  column-gap: 2rem;
  align-items: center;
}

.footer-title {
  color: var(--text-dark);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.2px;
}

.footer-desc {
  font-size: 1rem;
  color: var(--text-dark);
  margin: 0;
}

.footer-socials {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.1rem;
  font-size: 1rem;
}

.app-footer a {
  color: var(--text-dark);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-icon {
  display: inline-block;
  margin-right: 0.35rem;
  font-size: 0.95em;
  vertical-align: baseline;
}

.app-footer a:hover {
  color: #947659;
}

/* 頁尾最後一欄（版權） */
.footer-copyright {
  max-width: 1200px;
  margin: 0.8rem auto 0;
  width: 100%;
  border-top: 1px solid rgba(61, 60, 59, 0.18);
  padding-top: 0.6rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-dark);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .main-card {
    padding: 1.5rem;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    row-gap: 0.4rem;
    column-gap: 0;
  }

  .footer-title {
    font-size: 1rem;
  }

  .footer-socials {
    gap: 0.8rem;
    font-size: 0.95rem;
  }
}
</style>
