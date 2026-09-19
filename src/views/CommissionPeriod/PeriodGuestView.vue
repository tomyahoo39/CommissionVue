<script setup>
  import { ref,reactive, onMounted,computed } from 'vue'
  import periodService from '@/services/commissionPeriod'
  import typeService from '@/services/CommissionType'
  import socialService from '@/services/SocialPlatform'
  import orderService from '@/services/commissionOrder'

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

  const typeOptions = ref([])
  const socialOptions = ref([])
  const isSubmit = ref(false)
  const formState = reactive({
    title: '',
    nickname: '',
    email: '',
    socialId: null,
    socialUrl: '',
    commissionTypeId: null,
    commissionSetting: ''
  })

  const getActiveOptions = async () => {
    try {
      const typeRes = await typeService.getActiveType()
      const socialRes = await socialService.getActiveSocial()
      typeOptions.value = typeRes.data
      socialOptions.value = socialRes.data
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async () => {
    isSubmit.value = true
    try {
      const payload = {
        title: formState.title,
        nickname: formState.nickname,
        email: formState.email,
        socialId: formState.socialId,
        socialUrl: formState.socialUrl,
        commissionTypeId: formState.commissionTypeId,
        commissionSetting: formState.commissionSetting,
      }
      await orderService.createNewOrder(payload)
      alert('委託已送出')

      Object.assign(formState, {
        title: '',
        nickname: '',
        email: '',
        socialId: null,
        socialUrl: '',
        commissionTypeId: null,
        commissionSetting: ''
      })
    } catch (error) {
      console.error(error)
      alert('送出失敗，請檢查是否完整填寫')
    } finally {
      isSubmit.value = false
    }
  }


  onMounted(() => {
    getFirstPeriod()
    getActiveOptions()
  })

</script>

<template>
  <div class="container my-4">
    <h2 class="h4 mb-4 fw-bold period-title">委託期狀態</h2>

    <!-- 載入中提示 -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      資料載入中...
    </div>

    <!-- 情況 A：如果今天有對應的委託期開放中 -->
    <div v-else-if="activePeriod" class="period-status-card">
      <span class="period-badge">開放中</span>
      <p class="mb-2"><strong>委託期：</strong>{{ activePeriod.title }}</p>
      <p class="mb-2"><strong>開始時間：</strong>{{ activePeriod.openAt }}</p>
      <p class="mb-2"><strong>結束時間：</strong>{{ activePeriod.closeAt }}</p>
      <p class="mb-0"><strong>最大中選人數：</strong>{{ activePeriod.maxWinners }}</p>
    </div>

    <!-- 情況 B：如果今天不在任何委託期內（或尚未有開放） -->
    <div v-else class="period-status-empty text-center py-4">
      <h4 class="mb-0">目前尚未有委託期開放，如有商業委託或加急處理，請透過Q&A頁面的信箱留言，會盡速為您服務</h4>
    </div>
  </div>

  <div class="container py-4 period-form-wrap" v-if="activePeriod">
    <h2 class="h4 mb-4 fw-bold period-title text-center">填寫委託申請表單</h2>

    <form @submit.prevent="handleSubmit" class="card p-4 shadow-sm period-form-card" v-if="activePeriod">
      <!-- 標題 -->
      <div class="mb-3">
        <label for="title" class="form-label">委託標題 <span class="text-danger">*</span></label>
        <input id="title"
               v-model="formState.title"
               type="text"
               class="form-control period-input"
               placeholder="例如：雙人頭像委託"
               required />
      </div>

      <!-- 暱稱 -->
      <div class="mb-3">
        <label for="nickname" class="form-label">您的暱稱 <span class="text-danger">*</span></label>
        <input id="nickname"
               v-model="formState.nickname"
               type="text"
               class="form-control period-input"
               placeholder="請輸入暱稱"
               required />
      </div>

      <!-- 電子郵件 -->
      <div class="mb-3">
        <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
        <input id="email"
               v-model="formState.email"
               type="email"
               class="form-control period-input"
               placeholder="user@example.com"
               required />
      </div>

      <!-- 聯絡社群平台 -->
      <div class="mb-3">
        <label for="socialId" class="form-label">聯絡社群平台 </label>
        <select id="socialId"
                v-model.number="formState.socialId"
                class="form-select period-input"
                >
          <option :value="null" disabled>請選擇社群平台</option>
          <option v-for="item in socialOptions" :key="item.id" :value="item.id">
            {{ item.socialName }}
          </option>
        </select>
      </div>

      <!-- 社群帳號 / 連結 -->
      <div class="mb-3">
        <label for="socialUrl" class="form-label">社群帳號或個人頁面連結 </label>
        <input id="socialUrl"
               v-model="formState.socialUrl"
               type="text"
               class="form-control period-input"
               placeholder="https://twitter.com/your_id"
               />
      </div>

      <!-- 委託項目類別 -->
      <div class="mb-3">
        <label for="commissionTypeId" class="form-label">委託項目 <span class="text-danger">*</span></label>
        <select id="commissionTypeId"
                v-model.number="formState.commissionTypeId"
                class="form-select period-input"
                required>
          <option :value="null" disabled>請選擇委託項目</option>
          <option v-for="item in typeOptions" :key="item.id" :value="item.id">
            {{ item.typeName }}
          </option>
        </select>
      </div>

      <!-- 委託詳細需求說明 -->
      <div class="mb-4">
        <label for="commissionSetting" class="form-label">委託細節與需求說明<span class="text-danger">*</span></label>
        <textarea id="commissionSetting"
                  v-model="formState.commissionSetting"
                  class="form-control period-input"
                  rows="4"
                  placeholder="請填寫角色設定、風格需求或相關備註..."></textarea>
      </div>

      <!-- 送出按鈕 -->
      <button type="submit" class="btn w-100 period-submit-btn" :disabled="isSubmit">
        <span v-if="isSubmit" class="spinner-border spinner-border-sm me-2"></span>
        {{ isSubmit ? '送出中...' : '確認送出委託' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
  .period-title {
    color: #3d3c3b;
    letter-spacing: 0.02em;
  }

  .period-form-wrap {
    max-width: 640px;
  }

  .period-form-card {
    border: 1px solid #e6ddd3;
    border-radius: 16px;
    background: linear-gradient(135deg, #fffdf9 0%, #f7f4ee 100%);
    box-shadow: 0 6px 16px rgba(61, 60, 59, 0.08);
  }

  .period-form-card .form-label {
    color: #3d3c3b;
    font-weight: 600;
    margin-bottom: 0.45rem;
  }

  .period-input {
    border: 1px solid #d8cec2;
    border-radius: 10px;
    background-color: #fffdfb;
    color: #666;
  }

  .period-input:focus {
    border-color: #947659;
    box-shadow: 0 0 0 0.2rem rgba(148, 118, 89, 0.15);
  }

  .period-submit-btn {
    border: 1px solid #666;
    border-radius: 999px;
    color: #666;
    background: #fff;
    transition: all 0.2s ease;
  }

  .period-submit-btn:hover {
    border-color: #666;
    color: #fff;
    background: #666;
  }

  .period-submit-btn:disabled {
    opacity: 0.7;
  }

  .period-status-card {
    position: relative;
    padding: 1.2rem 1.3rem;
    border: 1px solid #e6ddd3;
    border-radius: 16px;
    background: linear-gradient(135deg, #fffdf9 0%, #f7f4ee 100%);
    box-shadow: 0 6px 16px rgba(61, 60, 59, 0.08);
    color: #666;
    line-height: 1.7;
  }

  .period-badge {
    display: inline-block;
    margin-bottom: 0.65rem;
    padding: 0.2rem 0.7rem;
    border-radius: 999px;
    background-color: #947659;
    color: #fff;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  .period-status-empty {
    border: 1px dashed #d6c8b9;
    border-radius: 16px;
    background: #faf7f2;
    color: #666;
  }

  .period-status-empty h4 {
    font-size: 1.05rem;
    font-weight: 500;
    line-height: 1.7;
  }

  /* 當輸入框聚焦 (focus) 時，將預設提示文字隱藏 */
  input:focus::placeholder,
  textarea:focus::placeholder {
    color: transparent;
  }

</style>
