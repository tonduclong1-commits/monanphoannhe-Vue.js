<script setup>
import { Sparkles, Flame, UtensilsCrossed, Zap, Soup, Coffee, CakeSlice } from 'lucide-vue-next'

const iconMap = {
  Sparkles,
  Flame,
  UtensilsCrossed,
  Zap,
  Soup,
  Coffee,
  CakeSlice
}

defineProps({
  categories: {
    type: Array,
    required: true
  },
  activeCategory: {
    type: String,
    default: 'all'
  }
})

defineEmits(['select-category'])
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div class="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="$emit('select-category', cat.id)"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border"
        :class="activeCategory === cat.id
          ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/25 scale-[1.02]'
          : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'"
      >
        <component :is="iconMap[cat.icon] || Sparkles" class="w-4 h-4" />
        <span>{{ cat.name }}</span>
        <span
          class="text-[11px] px-1.5 py-0.2 rounded-full font-bold"
          :class="activeCategory === cat.id ? 'bg-amber-600/60 text-white' : 'bg-slate-100 text-slate-500'"
        >
          {{ cat.count }}
        </span>
      </button>
    </div>
  </div>
</template>
