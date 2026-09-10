<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '編輯資料',
  },
  isOpen: {
    type: Boolean,
    required: true,
    default: false,
  },
  fields: {
    type: Array,
    required: true,
  },
  originalData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close', 'submit'])

const formData = ref({})

watch(
  () => props.originalData,
  (newData) => {
    formData.value = { ...newData }
  },
  { immediate: true, deep: true },
)

const handleSubmit = () => {
  emit('submit', { ...formData.value })
}
</script>

<template>
  <!-- Bootstrap Modal 手動切換開關 -->
  <div v-if="isOpen" class="modal fade show d-block tab-modal-backdrop" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content shadow">
        <!-- 彈窗標題 -->
        <div class="modal-header">
          <h5 class="modal-title fw-bold">{{ title }}</h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <!-- 彈窗內容：依據 fields 動態產生輸入框 -->
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div v-for="field in fields" :key="field.key" class="mb-3">
              <label :for="field.key" class="form-label font-weight-bold">
                {{ field.label }}
                <span v-if="field.required" class="text-danger">*</span>
              </label>

              <!-- 文字框 -->
              <input
                v-if="field.type === 'text'"
                :id="field.key"
                v-model="formData[field.key]"
                type="text"
                class="form-control"
                :placeholder="field.placeholder"
                :required="field.required"
              />
              <!-- 數字區域 -->
              <input
                v-else-if="field.type === 'number'"
                :id="field.key"
                v-model.number="formData[field.key]"
                type="number"
                class="form-control"
                min="0"
                :placeholder="field.placeholder"
                :required="field.required"
              />
              <!-- 3. 下拉選單 (select) -> 適合 true/false 或選單 -->
              <select
                v-else-if="field.type === 'select'"
                :id="field.key"
                v-model="formData[field.key]"
                class="form-select"
                :required="field.required"
              >
                <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
                  {{ opt.text }}
                </option>
              </select>

              <!-- 長文字區域 -->
              <textarea
                v-else-if="field.type === 'textarea'"
                :id="field.key"
                v-model="formData[field.key]"
                class="form-control"
                rows="3"
                :placeholder="field.placeholder || `請輸入${field.label}`"
                :required="field.required"
              ></textarea>
            </div>
          </div>

          <!-- 按鈕區 -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="emit('close')">取消</button>
            <button type="submit" class="btn btn-primary" @click="handleSave">儲存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
