<script setup>
import { X, Heart, Plus, Trash2 } from 'lucide-vue-next'
import { formatVND } from '../utils/format'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  favorites: {
    type: Array,
    default: () => []
  }
})

defineEmits(['close', 'remove-favorite', 'quick-add', 'open-detail'])
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div @click="$emit('close')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"></div>

    <div class="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]">
      <!-- Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
        <div class="flex items-center gap-2">
          <Heart class="w-5 h-5 fill-rose-500 text-rose-500" />
          <h3 class="text-base font-black text-slate-800">Món Yêu Thích Của Bạn</h3>
          <span class="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
            {{ favorites.length }}
          </span>
        </div>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-full hover:bg-slate-200/80 text-slate-500 flex items-center justify-center transition cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- List -->
      <div class="p-5 overflow-y-auto space-y-3 flex-1">
        <div v-if="favorites.length === 0" class="py-12 text-center text-slate-400 space-y-2">
          <Heart class="w-12 h-12 mx-auto stroke-1 text-slate-300" />
          <p class="text-sm font-medium">Bạn chưa lưu món ăn yêu thích nào</p>
          <p class="text-xs text-slate-400">Bấm biểu tượng trái tim ở từng món để lưu lại nhé!</p>
        </div>

        <div
          v-for="item in favorites"
          :key="item.id"
          class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition"
        >
          <img :src="item.image" :alt="item.name" class="w-16 h-16 rounded-xl object-cover shrink-0" />
          <div class="flex-1 min-w-0">
            <h4
              @click="$emit('open-detail', item)"
              class="font-bold text-xs sm:text-sm text-slate-800 hover:text-amber-600 cursor-pointer truncate"
            >
              {{ item.name }}
            </h4>
            <div class="text-xs font-black text-amber-600 mt-1">{{ formatVND(item.price) }}</div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <button
              @click="$emit('quick-add', item)"
              class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Thêm</span>
            </button>
            <button
              @click="$emit('remove-favorite', item.id)"
              class="p-1.5 text-slate-400 hover:text-rose-500 transition cursor-pointer"
              title="Xóa khỏi yêu thích"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
