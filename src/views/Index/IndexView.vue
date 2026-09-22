<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import imageService from '@/services/image'
import typeService from '@/services/CommissionType'
import { getImageUrl } from '@/utils/safeImageUrl'

const router = useRouter()
const isLoading = ref(false)

const indexData = ref([])
const types = ref([])

const getTypeInfo = (typeId) => {
  return types.value.find(t => t.id === typeId) || {}
}

const getData = async () => {
  isLoading.value = true
  try {
    const typeRes = await typeService.getAllType()
    types.value = typeRes.data
    const res = await imageService.getFirstThumbs()
    indexData.value = res.data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const goToImage = (typeId) => {
  router.push({ path: '/guestImage', query: {typeId} })
}

onMounted(() => {
  getData()
})

</script>

<template><div class="container py-4">
  <!-- 載入中 -->
  <div v-if="isLoading" class="text-center py-5 text-muted">
    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
    資料載入中...
  </div>

  <div v-else>
    <!-- 1. 注意事項 -->
    <section class="mb-5 py-4">
      <h3 class="process-title text-center mb-4">/ 注意事項 /</h3>

      <ul class="notice-list mx-auto">
        <li>委託成立時即認定<strong> 委託人已成年 或 未成年但經監護人同意此委託交易之行為</strong></li>
        <li><strong>未成年不可委託R18圖</strong></li>
        <li>會確實告知完成時間，若有延誤必提前通知</li>
        <li class="text-warning-emphasis fw-bold">委託圖非買斷，不可二次修改、印製商品或有其他營利行為</li>
        <li>自印收藏或親友贈送等需先告知與討論</li>
        <li>價格會因人設、構圖等之複雜度去做調整</li>
        <li>會於社群公開發布加浮水印之委託圖</li>
        <li class="text-warning-emphasis fw-bold">匯款帳戶僅提供玉山、郵局</li>
        <li>此網站皆為非商業委託價格，商業委託麻煩以信箱聯繫</li>
        <li>未列在以上之事宜，歡迎私訊詢問</li>
      </ul>
    </section>
    <!-- 2. 委託流程 -->
    <section class="mb-5 py-4 text-center">
      <h3 class="process-title mb-4">/ 委託流程 /</h3>

      <div class="process-content mx-auto">
        <p class="mb-1 fw-bold">填寫委託表單</p>
        <p class="mb-1">（於上方導覽列填單表>委託填單表）</p>
        <p class="mb-1">▼</p>

        <p class="mb-1 fw-bold">私訊了解需求與報價</p>
        <p class="mb-1">▽</p>

        <p class="mb-1 fw-bold">支付半款/全款(3日內)</p>
        <p class="mb-1 text-warning-emphasis fw-bold">(驚喜包需付全款)</p>
        <p class="mb-1">▼</p>

        <p class="mb-1 fw-bold">確認草稿(可修改2次)</p>
        <p class="mb-1">▽</p>

        <p class="mb-1 fw-bold">確認線稿與底色(可修改1次)</p>
        <p class="mb-1">▼</p>

        <p class="mb-1 fw-bold">支付剩餘款項(3日內)</p>
        <p class="mb-1">▽</p>

        <p class="mb-3 fw-bold">確認完稿</p>

        <p class="mb-0">完稿僅能修改小細節或與委託設定不符之錯誤 <span class="text-danger">!</span></p>
      </div>
    </section>

    

    <!-- 2. 四大分類卡片列表 -->
    <section>
      <h3 class="h5 fw-bold mb-4">委託項目</h3>

      <div class="row g-4">
        <div v-for="item in indexData" :key="item.commissionTypeId" class="col-12 col-md-6">
          <div class="card h-100 shadow-sm cursor-pointer hover-card card-rounded"
               @click="goToImage(item.commissionTypeId)">
            <div class="row g-0 h-100">
              <!-- 左側：自動撈取的第一張縮圖 -->
              <div class="col-12 col-sm-5 bg-secondary position-relative overflow-hidden">
                <div class="ratio ratio-4x3 h-100">
                  <img :src="getImageUrl(item.thumbPath)"
                       :alt="item.typeName"
                       class="object-fit-cover w-100 h-100" />
                </div>
              </div>

              <!-- 右側：名稱與前端自訂介紹 -->
              <div class="col-12 col-sm-7 p-3 d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <!-- ⭕ 拿正確匹配的標題 -->
                    <h5 class="fw-bold mb-0 text-dark">
                      {{ getTypeInfo(item.commissionTypeId).typeName || item.typeName }}
                    </h5>

                    <!-- ⭕ 有 basePrice 才顯示 -->
                    <span v-if="getTypeInfo(item.commissionTypeId).basePrice" class="badge bg-light text-dark border">
                      NT$ {{ getTypeInfo(item.commissionTypeId).basePrice }} 起
                    </span>
                  </div>

                  <!-- ⭕ 顯示 shortDescription -->
                  <p class="card-text text-muted small lh-base mb-2 whitespace-pre-line">
                    {{ getTypeInfo(item.commissionTypeId).shortDescription || '點擊觀看更多相關作品。' }}
                  </p>
                </div>

                <div class="text-end">
                  <span class="btn btn-sm rounded-pill commission-btn">
                    前往作品集 ➔
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  </div>
</div></template>

<style scoped>

  .whitespace-pre-line {
    white-space: pre-line;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .hover-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

    .hover-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.12) !important;
    }

  .card-rounded {
    border-radius: 16px;
    overflow: hidden;
  }

  .commission-btn {
    border: 1px solid #666;
    color: #666;
    background-color: #fff;
    transition: all 0.2s ease;
  }

  .commission-btn:hover {
    border-color: #666;
    color: #fff;
    background-color: #666;
  }

  .process-title {
    font-size: 1.7rem;
    font-weight: 500;
    color: #4b4b4b;
  }

  .process-content {
    max-width: 620px;
    font-size: 1.12rem;
    color: #666;
    line-height: 1.7;
  }

  .notice-list {
    max-width: 620px;
    color: #666;
    font-size: 1.1rem;
    line-height: 1.8;
    padding-left: 1.25rem;
    text-align: left;
    list-style-position: outside;
  }

  .notice-list li {
    margin-bottom: 0.6rem;
  }
</style>
