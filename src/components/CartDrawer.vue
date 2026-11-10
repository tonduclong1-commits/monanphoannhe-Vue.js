<script setup>
import { ref } from 'vue'
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-vue-next'
import { formatVND } from '../utils/format'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  cartItems: {
    type: Array,
    default: () => []
  },
  subtotal: {
    type: Number,
    default: 0
  },
  shippingFee: {
    type: Number,
    default: 18000
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  appliedPromo: {
    type: Object,
    default: null
  },
  grandTotal: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits([
  'close',
  'update-quantity',
  'remove-item',
  'apply-promo',
  'remove-promo',
  'open-checkout'
])

const inputPromo = ref('')

function handleApplyInput() {
  if (inputPromo.value.trim()) {
    emit('apply-promo', inputPromo.value.trim())
    inputPromo.value = ''
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Backdrop -->
    <div @click="$emit('close')" class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"></div>

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
        <!-- Header -->
        <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/40">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <ShoppingBag class="w-4 h-4" />
            </div>
            <div>
              <h2 class="text-base font-black text-slate-800">Giỏ Hàng Của Bạn</h2>
              <p class="text-xs text-slate-500">{{ cartItems.length }} món ăn vặt được chọn</p>
            </div>
          </div>

          <button
            @click="$emit('close')"
            class="w-8 h-8 rounded-full hover:bg-slate-200/80 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Free shipping progress bar -->
        <div class="bg-amber-100/60 px-5 py-2.5 border-b border-amber-200/60 text-xs">
          <div v-if="subtotal >= 150000" class="flex items-center gap-1.5 text-emerald-700 font-bold">
            <Sparkles class="w-4 h-4 text-emerald-600" />
            <span>Chúc mừng! Bạn được MIỄN PHÍ SHIP toàn thành phố 🎉</span>
          </div>
          <div v-else>
            <div class="flex justify-between items-center text-slate-700 font-medium mb-1">
              <span>Mua thêm <strong class="text-amber-700 font-bold">{{ formatVND(150000 - subtotal) }}</strong> để được Freeship</span>
              <span class="font-bold text-amber-600">{{ Math.min(100, Math.round((subtotal / 150000) * 100)) }}%</span>
            </div>
            <div class="w-full h-1.5 bg-amber-200/80 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                :style="{ width: `${Math.min(100, (subtotal / 150000) * 100)}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Items List -->
        <div class="flex-1 overflow-y-auto p-5 space-y-4">
          <!-- Empty State -->
          <div v-if="cartItems.length === 0" class="py-16 text-center space-y-4">
            <div class="w-20 h-20 rounded-full bg-amber-50 text-amber-500 mx-auto flex items-center justify-center text-4xl shadow-inner">
              🍢
            </div>
            <div>
              <h3 class="font-bold text-slate-700 text-base">Giỏ hàng đang trống</h3>
              <p class="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Bạn chưa chọn món nào. Hãy dạo phố và thưởng thức các món ăn vặt thơm ngon nhé!
              </p>
            </div>
            <button
              @click="$emit('close')"
              class="px-5 py-2.5 rounded-full bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-500/20 hover:bg-amber-600 transition cursor-pointer"
            >
              Xem thực đơn ngay
            </button>
          </div>

          <!-- Items -->
          <div
            v-for="(item, index) in cartItems"
            :key="`${item.id}-${index}`"
            class="flex gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-amber-200 transition"
          >
            <!-- Thumbnail -->
            <img :src="item.image" :alt="item.name" class="w-20 h-20 rounded-xl object-cover shrink-0" />

            <!-- Details -->
            <div class="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <div class="flex items-start justify-between gap-2">
                  <h4 class="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1">{{ item.name }}</h4>
                  <button
                    @click="$emit('remove-item', index)"
                    class="text-slate-400 hover:text-rose-500 transition cursor-pointer p-0.5"
                    title="Xóa món"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- Customizations summary -->
                <div class="flex flex-wrap gap-1 mt-1 text-[10px]">
                  <span class="px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-800 font-medium">
                    {{ item.selectedSpicy || 'Vừa' }}
                  </span>
                  <span
                    v-for="tp in item.selectedToppings"
                    :key="tp.id"
                    class="px-1.5 py-0.5 rounded-md bg-amber-100/80 text-amber-800 font-medium"
                  >
                    +{{ tp.name }}
                  </span>
                </div>

                <p v-if="item.customerNote" class="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">
                  "{{ item.customerNote }}"
                </p>
              </div>

              <!-- Price & Quantity -->
              <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                <span class="font-black text-amber-600 text-sm">
                  {{ formatVND((item.calculatedPrice || item.price) * item.quantity) }}
                </span>

                <div class="flex items-center bg-white border border-slate-200 rounded-xl px-1.5 py-0.5">
                  <button
                    @click="$emit('update-quantity', { index, delta: -1 })"
                    class="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    <Minus class="w-3 h-3" />
                  </button>
                  <span class="w-7 text-center font-bold text-xs text-slate-800">{{ item.quantity }}</span>
                  <button
                    @click="$emit('update-quantity', { index, delta: 1 })"
                    class="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    <Plus class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer / Checkout Area -->
        <div v-if="cartItems.length > 0" class="p-5 border-t border-slate-100 bg-white space-y-3.5">
          <!-- Promo Code Input -->
          <div>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <input
                  v-model="inputPromo"
                  @keyup.enter="handleApplyInput"
                  type="text"
                  placeholder="Nhập mã: PHOANVAT, FREESHIP..."
                  class="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 uppercase font-mono tracking-wider focus:outline-hidden focus:border-amber-500 uppercase"
                />
                <Tag class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                @click="handleApplyInput"
                class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
              >
                Áp dụng
              </button>
            </div>

            <!-- Applied Promo Tag -->
            <div
              v-if="appliedPromo"
              class="mt-2 flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs"
            >
              <div class="flex items-center gap-1.5 font-medium">
                <Check class="w-4 h-4 text-emerald-600" />
                <span>Mã <strong>{{ appliedPromo.code }}</strong>: {{ appliedPromo.description }}</span>
              </div>
              <button
                @click="$emit('remove-promo')"
                class="text-rose-500 hover:text-rose-700 text-[11px] font-bold cursor-pointer underline ml-2"
              >
                Hủy
              </button>
            </div>
          </div>

          <!-- Price Calculation -->
          <div class="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <div class="flex justify-between">
              <span>Tạm tính</span>
              <span class="font-semibold text-slate-800">{{ formatVND(subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Phí vận chuyển</span>
              <span :class="shippingFee === 0 ? 'text-emerald-600 font-bold' : 'font-semibold text-slate-800'">
                {{ shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee) }}
              </span>
            </div>
            <div v-if="discountAmount > 0" class="flex justify-between text-emerald-600 font-semibold">
              <span>Giảm giá khuyến mãi</span>
              <span>-{{ formatVND(discountAmount) }}</span>
            </div>
            <div class="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Tổng thanh toán</span>
              <span class="text-amber-600 font-black">{{ formatVND(grandTotal) }}</span>
            </div>
          </div>

          <!-- Checkout Button -->
          <button
            @click="$emit('open-checkout')"
            class="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm shadow-lg shadow-orange-500/25 active:scale-98 transition cursor-pointer"
          >
            <span>Tiến Hành Đặt Hàng</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
