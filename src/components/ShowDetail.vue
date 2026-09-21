<script setup>

  const props = defineProps({
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    item: {
      type: Object,
      required: true,
      default: () => ({})
    },
    showEdit: {
      type: Boolean,
      default: true
    }
  })

  const renderValue = (col, val) => {
    if (val === null || val === undefined || val === '') return '-'
    if (col.options && Array.isArray(col.options)){
      const target = col.options.find(opt => opt.value === val)
      return target ? target.text : val
    }
    return val
  }

  const getValueClass = (col, val) => {
    const map = col.valueClassMap
    if (!map || typeof map !== 'object') return ''
    return map[val] || ''
  }

  const emit = defineEmits(['edit'])

  const handleEdit = () => {
    emit('edit',props.item)
  }

</script>

<template>
  <div class="card shadow-sm border rounded-3 mb-4">
    <div class="card-body p-0">
      <table class="table table-bordered align-middle mb-0">
        <tbody>
          <!-- 垂直將欄位 Key 與 Value 呈現 -->
          <tr v-for="col in columns" :key="col.key">
            <!-- 左欄：欄位名稱 -->
            <th scope="row" class="bg-light text-secondary text-end px-3" style="width: 30%">
              {{ col.label }}：
            </th>
            <!-- 右欄：資料內容 -->
            <td class="px-3 text-dark whitespace-pre-line">
              <span :class="getValueClass(col, item[col.key])">
                {{ renderValue(col,item[col.key])}}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <div v-if="showEdit" class="card-footer bg-white text-end py-2">
      <button v-if="showEdit"
              type="button"
              class="btn btn-outline-primary btn-sm me-2"
              @click="handleEdit()">
        修改
      </button>
    </div>
  </div>
</template>

<style scoped>
  /* 讓表格邊框像傳統憑單表單一樣清晰 */
  .table-bordered th,
  .table-bordered td {
    border-color: #dee2e6;
  }
  .whitespace-pre-line {
    white-space: pre-line;
  }

  .status-pill {
    display: inline-block;
    padding: 0.12rem 0.6rem;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .status-enabled {
    color: #2f6b3a;
    background: #e8f6eb;
    border: 1px solid #b9dfc2;
  }

  .status-disabled {
    color: #8a5a18;
    background: #fff4df;
    border: 1px solid #f0d4a3;
  }
</style>
