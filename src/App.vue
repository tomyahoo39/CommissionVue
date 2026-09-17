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
      <div class="main-card shadow-sm p-4 p-md-5 bg-white rounded-4">
        <RouterView />
      </div>
    </main>
  </div>

  <footer>
    <div>
      <!-- 創作者名稱與簡介 -->
      <h3>創作者 / 畫師名稱</h3>
      <p>日系插畫 / 角色設計 / 商業委託</p>
    </div>

    <div>
      <!-- 導覽與委託狀態 -->
      <h4>選單</h4>
      <ul>
        <li><a href="#about">關於我</a></li>
        <li><a href="#services">委託流程與計價</a></li>
        <li><a href="#terms">委託條款</a></li>
        <li><span>● 委託開放中</span></li>
      </ul>
    </div>

    <div>
      <!-- 社群與聯絡方式 -->
      <h4>聯絡與社群</h4>
      <ul>
        <li><a href="#">Twitter / X</a></li>
        <li><a href="#">Pixiv</a></li>
        <li><a href="#">Instagram</a></li>
        <li><a href="mailto:your_email@example.com">Email 聯絡</a></li>
      </ul>
    </div>

    <!-- 版權宣告 -->
    <div>
      <p>&copy; 2026 Your Name. All rights reserved.</p>
    </div>
  </footer>
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

/* 1. 全域重置與基礎樣式 */
footer {
  background-color: #222226; /* 深灰底色 */
  color: #cccccc; /* 淺灰字體 */
  padding: 30px 20px 15px;
  font-family: sans-serif;
}

/* 2. 橫向三欄佈局 */
footer > div:not(:last-child) {
  display: inline-block;
  vertical-align: top;
  width: 30%; /* 讓三欄並排 */
  box-sizing: border-box;
}

/* 3. 清除預設項目符號（黑點）與超連結底線 */
footer ul {
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
}

footer li {
  margin-bottom: 8px;
}

footer a {
  color: #a0a0b0;
  text-decoration: none;
}

footer a:hover {
  color: #ffffff; /* 滑鼠懸停變白 */
}

footer h3,
footer h4 {
  color: #ffffff;
  margin: 0 0 10px 0;
}

/* 4. 最下方的版權列 */
footer > div:last-child {
  border-top: 1px solid #33333b;
  margin-top: 20px;
  padding-top: 15px;
  text-align: center;
  font-size: 0.85rem;
  color: #777788;
}

/* 5. 手機版自動變成單欄（響應式） */
@media (max-width: 600px) {
  footer > div:not(:last-child) {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
