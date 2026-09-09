<script setup>
const props = defineProps({
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  showEdit: {
    type: Boolean,
    default: true,
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['edit', 'delete'])
const handleEdit = (item) => {
  emit('edit', item)
}
const handleDelete = (item) => {
  emit('delete', item)
}
</script>

<template>
  <div class="table-responsive shadow-sm rounded-3">
    <table class="table table-hover align-middle mb-0">
      <!-- 表頭區塊 -->
      <thead class="table-dark">
        <tr>
          <th v-for="col in columns" :key="col.key" scope="col">
            {{ col.label }}
          </th>
          <!-- 若有任何一個按鈕開啟，就顯示操作欄位 -->
          <th v-if="showEdit || showDelete" scope="col" class="text-center" style="width: 160px">
            操作
          </th>
        </tr>
      </thead>

      <!-- 資料內容區塊 -->
      <tbody>
        <!-- 無資料時顯示 -->
        <tr v-if="items.length === 0">
          <td
            :colspan="columns.length + (showEdit || showDelete ? 1 : 0)"
            class="text-center text-muted py-4"
          >
            目前尚無資料
          </td>
        </tr>

        <!-- 有資料時渲染 -->
        <tr v-else v-for="(item, index) in items" :key="item.id || index" style="cursor: pointer">
          <!-- 動態渲染欄位值 -->
          <td v-for="col in columns" :key="col.key">
            {{ item[col.key] }}
          </td>

          <!-- 按鈕區塊 -->
          <td v-if="showEdit || showDelete" class="text-center" @click.stop>
            <div class="btn-group btn-group-sm" role="group">
              <button
                v-if="showEdit"
                type="button"
                class="btn btn-outline-primary"
                @click="handleEdit(item)"
              >
                修改
              </button>
              <button
                v-if="showDelete"
                type="button"
                class="btn btn-outline-danger"
                @click="handleDelete(item)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-hover tbody tr:hover {
  background-color: rgba(13, 110, 253, 0.04);
}
</style>
