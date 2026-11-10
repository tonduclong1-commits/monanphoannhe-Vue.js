<script setup>
import { SlidersHorizontal, ArrowUpDown, Flame, RotateCcw } from 'lucide-vue-next'

const props = defineProps({
  sortBy: {
    type: String,
    default: 'popular'
  },
  spicyFilter: {
    type: String,
    default: 'all'
  },
  activeTag: {
    type: String,
    default: 'all'
  },
  totalResults: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:sortBy', 'update:spicyFilter', 'update:activeTag', 'reset-filters'])

const tags = ['Tất cả', 'Best Seller', 'Cực Hot', 'Chuẩn Vị', 'Món Ruột', 'No Nhanh', 'Healthy', 'Hot Trend']
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
    <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <!-- Results count -->
        <div class="flex items-center gap-2 text-slate-700 font-semibold text-sm">
          <SlidersHorizontal class="w-4 h-4 text-amber-500" />
          <span>Tìm thấy <strong class="text-amber-600 font-bold">{{ totalResults }}</strong> món ăn vặt</span>
        </div>

        <!-- Controls: Sort & Spicy -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Sort Dropdown -->
          <div class="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700">
            <ArrowUpDown class="w-3.5 h-3.5 text-slate-400" />
            <span class="text-slate-400">Sắp xếp:</span>
            <select
              :value="sortBy"
              @change="$emit('update:sortBy', $event.target.value)"
              class="bg-transparent font-medium focus:outline-hidden cursor-pointer text-slate-800"
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="rating">Đánh giá cao nhất (★)</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
            </select>
          </div>

          <!-- Spicy Filter -->
          <div class="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700">
            <Flame class="w-3.5 h-3.5 text-orange-500" />
            <span class="text-slate-400">Vị cay:</span>
            <select
              :value="spicyFilter"
              @change="$emit('update:spicyFilter', $event.target.value)"
              class="bg-transparent font-medium focus:outline-hidden cursor-pointer text-slate-800"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="0">Không cay (Trẻ em)</option>
              <option value="1">Cay nhẹ</option>
              <option value="2">Cay vừa thơm</option>
              <option value="3">Siêu cay xé lưỡi 🔥</option>
            </select>
          </div>

          <!-- Reset Filter Button -->
          <button
            v-if="sortBy !== 'popular' || spicyFilter !== 'all' || activeTag !== 'all'"
            @click="$emit('reset-filters')"
            class="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-amber-50 cursor-pointer transition"
          >
            <RotateCcw class="w-3 h-3" />
            <span>Xóa lọc</span>
          </button>
        </div>
      </div>

      <!-- Quick Tag Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">Tags:</span>
        <button
          v-for="tag in tags"
          :key="tag"
          @click="$emit('update:activeTag', tag === 'Tất cả' ? 'all' : tag)"
          class="text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap"
          :class="(activeTag === tag || (activeTag === 'all' && tag === 'Tất cả'))
            ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'"
        >
          {{ tag }}
        </button>
      </div>
    </div>
  </div>
</template>
