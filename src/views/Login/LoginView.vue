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

  const showPassword = ref(false);


</script>

<template>
  <div class="container d-flex justify-content-center align-items-center py-5">
    <div class="card p-4 shadow-sm border-0" style="max-width: 400px; width: 100%;">
      <h3 class="text-center fw-bold mb-4">🔐 後台管理員登入</h3>

      <div class="zoom-hint mb-4" role="note">
        提示:登入失敗五次，將會鎖定帳號十分鐘。
      </div>

      <div v-if="errorMessage" class="alert alert-danger py-2" role="alert">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label fw-bold">帳號</label>
          <input v-model="username" type="text" class="form-control" placeholder="請輸入帳號" required />
        </div>

        <div class="mb-4">
          <div class="input-group">
            <input v-model="password"
                   :type="showPassword ? 'text' : 'password'"
                   class="form-control"
                   placeholder="請輸入密碼"
                   required />
            <button class="btn btn-outline-secondary"
                    type="button"
                    @click="showPassword = !showPassword">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
          登入系統
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
  .zoom-hint {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.9rem;
    border: 1px solid #c7b08a;
    border-radius: 999px;
    background: #fff8ea;
    color: #8a6b3d !important;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

</style>
