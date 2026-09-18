<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import loginService from '@/services/login';

const router = useRouter();
const username = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = '請輸入帳號與密碼'
    return
  }

  isLoading.value = true;
  errorMessage.value = '';
  try {
    const res = await loginService.login(
      {
        username: username.value,
        password: password.value
      })
    loginService.setToken(res.data.token);
    loginService.updateAdminState();
    router.push('/')
  } catch (error) {
    console.error('登入失敗:', error);
    errorMessage.value = '登入失敗，請檢查帳號與密碼'
  } finally {
    isLoading.value = false
  }
}


</script>

<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card p-4 shadow-sm border-0" style="max-width: 400px; width: 100%;">
      <h3 class="text-center fw-bold mb-4">🔐 後台管理員登入</h3>

      <div v-if="errorMessage" class="alert alert-danger py-2" role="alert">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label fw-bold">帳號</label>
          <input v-model="username" type="text" class="form-control" placeholder="請輸入帳號" required />
        </div>

        <div class="mb-4">
          <label class="form-label fw-bold">密碼</label>
          <input v-model="password" type="password" class="form-control" placeholder="請輸入密碼" required />
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
          登入系統
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
