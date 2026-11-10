<script setup>
import { Heart, Plus, Star, Clock, Flame } from 'lucide-vue-next'
import { formatVND } from '../utils/format'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
})

defineEmits(['open-detail', 'quick-add', 'toggle-favorite'])
</script>

<template>
  <div class="group bg-white rounded-3xl overflow-hidden border border-slate-150 hover:border-amber-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
    <!-- Image & Badges Container -->
    <div class="relative overflow-hidden aspect-4/3 cursor-pointer" @click="$emit('open-detail', item)">
      <img
        :src="item.image"
        :alt="item.name"
        class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

      <!-- Top Badges -->
      <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
        <span
          v-if="item.badge"
          class="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-xl text-white shadow-md"
          :class="item.badge.includes('Best') || item.badge.includes('Hot') ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-amber-500 to-yellow-500'"
        >
          {{ item.badge }}
        </span>
      </div>

      <!-- Favorite Button -->
      <button
        @click.stop="$emit('toggle-favorite', item.id)"
        class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-rose-500 transition shadow-md cursor-pointer active:scale-90"
        title="Lưu yêu thích"
      >
        <Heart class="w-4 h-4 transition-colors" :class="{ 'fill-rose-500 text-rose-500': isFavorite }" />
      </button>

      <!-- Spicy level & Prep time pill -->
      <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
        <div class="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
          <Clock class="w-3.5 h-3.5 text-amber-300" />
          <span>{{ item.prepTime }}</span>
        </div>
        <div v-if="item.spicyLevel > 0" class="flex items-center gap-0.5 bg-red-950/60 backdrop-blur-md px-2 py-1 rounded-lg text-[11px] text-red-200">
          <Flame class="w-3 h-3 text-red-400 fill-red-400" />
          <span>{{ item.spicyLevel === 3 ? 'Siêu cay' : item.spicyLevel === 2 ? 'Cay vừa' : 'Cay nhẹ' }}</span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between">
      <div>
        <!-- Rating & Reviews -->
        <div class="flex items-center justify-between gap-2 mb-2">
          <div class="flex items-center gap-1 text-amber-500 text-xs font-bold">
            <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{{ item.rating }}</span>
            <span class="text-slate-400 font-normal">({{ item.reviewsCount }})</span>
          </div>
          <span class="text-[11px] font-medium text-slate-400">#{{ item.category }}</span>
        </div>

        <!-- Name -->
        <h3
          @click="$emit('open-detail', item)"
          class="font-bold text-slate-800 text-base group-hover:text-amber-600 transition-colors line-clamp-1 cursor-pointer"
        >
          {{ item.name }}
        </h3>

        <!-- Description -->
        <p class="text-slate-500 text-xs line-clamp-2 mt-1.5 leading-relaxed">
          {{ item.description }}
        </p>
      </div>

      <!-- Price & Action -->
      <div class="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-lg font-black text-amber-600">
              {{ formatVND(item.price) }}
            </span>
            <span v-if="item.originalPrice" class="text-xs text-slate-400 line-through">
              {{ formatVND(item.originalPrice) }}
            </span>
          </div>
          <span v-if="item.toppings?.length" class="text-[10px] text-amber-600/80 font-medium">
            +{{ item.toppings.length }} tùy chọn thêm
          </span>
        </div>

        <div class="flex items-center gap-1.5">
          <button
            @click="$emit('open-detail', item)"
            class="px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 transition cursor-pointer"
          >
            Tùy chọn
          </button>
          <button
            @click.stop="$emit('quick-add', item)"
            class="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 active:scale-95 transition cursor-pointer"
            title="Thêm nhanh vào giỏ"
          >
            <Plus class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
