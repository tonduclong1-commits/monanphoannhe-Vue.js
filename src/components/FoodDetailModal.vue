<script setup>
import { ref, computed, watch } from 'vue'
import { X, Star, Clock, Flame, Plus, Minus, ShoppingBag, Check } from 'lucide-vue-next'
import { formatVND } from '../utils/format'

const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'add-to-cart'])

const quantity = ref(1)
const selectedSpicy = ref('Vừa')
const selectedToppings = ref([])
const customerNote = ref('')

// Reset selections when new item is opened
watch(() => props.item, (newItem) => {
  if (newItem) {
    quantity.value = 1
    selectedSpicy.value = newItem.spicyLevel === 0 ? 'Không cay' : newItem.spicyLevel === 3 ? 'Siêu cay' : 'Vừa'
    selectedToppings.value = []
    customerNote.value = ''
  }
}, { immediate: true })

function toggleTopping(topping) {
  const index = selectedToppings.value.findIndex(t => t.id === topping.id)
  if (index >= 0) {
    selectedToppings.value.splice(index, 1)
  } else {
    selectedToppings.value.push(topping)
  }
}

const unitPrice = computed(() => {
  if (!props.item) return 0
  const toppingTotal = selectedToppings.value.reduce((acc, curr) => acc + curr.price, 0)
  return props.item.price + toppingTotal
})

const totalPrice = computed(() => {
  return unitPrice.value * quantity.value
})

function handleAddToCart() {
  if (!props.item) return
  emit('add-to-cart', {
    ...props.item,
    quantity: quantity.value,
    selectedToppings: [...selectedToppings.value],
    selectedSpicy: selectedSpicy.value,
    customerNote: customerNote.value.trim(),
    calculatedPrice: unitPrice.value
  })
  emit('close')
}
</script>

<template>
  <div v-if="isOpen && item" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
    <!-- Backdrop -->
    <div @click="$emit('close')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"></div>

    <!-- Modal Content -->
    <div class="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
      <!-- Header Image -->
      <div class="relative aspect-16/9 sm:aspect-21/9 shrink-0">
        <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        <!-- Close Button -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="absolute bottom-4 left-6 right-6 text-white">
          <div class="flex items-center gap-2 mb-1">
            <span v-if="item.badge" class="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-amber-500 text-white">
              {{ item.badge }}
            </span>
            <div class="flex items-center gap-1 text-amber-300 text-xs font-bold">
              <Star class="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{{ item.rating }} ({{ item.reviewsCount }} đánh giá)</span>
            </div>
          </div>
          <h2 class="text-xl sm:text-2xl font-black leading-tight drop-shadow-sm">{{ item.name }}</h2>
        </div>
      </div>

      <!-- Scrollable Body -->
      <div class="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
        <!-- Description -->
        <p class="text-sm text-slate-600 leading-relaxed bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100/80">
          {{ item.description }}
        </p>

        <!-- Spicy Level Selection -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Flame class="w-4 h-4 text-orange-500" />
            <span>Mức độ cay</span>
          </label>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="lvl in ['Không cay', 'Cay nhẹ', 'Vừa', 'Siêu cay 🔥']"
              :key="lvl"
              type="button"
              @click="selectedSpicy = lvl"
              class="py-2 text-xs font-semibold rounded-xl border text-center transition cursor-pointer"
              :class="selectedSpicy === lvl
                ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'"
            >
              {{ lvl }}
            </button>
          </div>
        </div>

        <!-- Toppings / Extras -->
        <div v-if="item.toppings?.length">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
            <span>Topping & Món kèm thêm</span>
            <span class="text-[11px] text-amber-600 font-semibold">Tùy chọn</span>
          </label>
          <div class="space-y-2">
            <div
              v-for="tp in item.toppings"
              :key="tp.id"
              @click="toggleTopping(tp)"
              class="flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition select-none"
              :class="selectedToppings.some(t => t.id === tp.id)
                ? 'bg-amber-50/80 border-amber-400 text-amber-900'
                : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-700'"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-5 h-5 rounded-lg border flex items-center justify-center transition"
                  :class="selectedToppings.some(t => t.id === tp.id)
                    ? 'bg-amber-500 border-amber-500 text-white'
                    : 'border-slate-300 bg-white'"
                >
                  <Check v-if="selectedToppings.some(t => t.id === tp.id)" class="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span class="text-sm font-medium">{{ tp.name }}</span>
              </div>
              <span class="text-xs font-bold text-amber-600">+{{ formatVND(tp.price) }}</span>
            </div>
          </div>
        </div>

        <!-- Note for Kitchen -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Ghi chú cho quán (nếu có)
          </label>
          <input
            v-model="customerNote"
            type="text"
            placeholder="Ví dụ: ít hành lá, nhiều tương me, đóng gói riêng sốt..."
            class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-hidden"
          />
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <!-- Quantity control -->
        <div class="flex items-center justify-between w-full sm:w-auto gap-3">
          <div class="flex items-center border border-slate-300 rounded-2xl bg-white p-1">
            <button
              @click="quantity > 1 ? quantity-- : null"
              :disabled="quantity <= 1"
              class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
            >
              <Minus class="w-4 h-4" />
            </button>
            <span class="w-10 text-center font-black text-sm text-slate-800">{{ quantity }}</span>
            <button
              @click="quantity++"
              class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>

          <div class="sm:hidden text-right">
            <div class="text-[10px] text-slate-400 font-semibold">TỔNG TIỀN</div>
            <div class="text-lg font-black text-amber-600">{{ formatVND(totalPrice) }}</div>
          </div>
        </div>

        <!-- Add Button -->
        <button
          @click="handleAddToCart"
          class="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 active:scale-98 transition cursor-pointer"
        >
          <ShoppingBag class="w-4 h-4" />
          <span>Thêm vào giỏ • {{ formatVND(totalPrice) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
