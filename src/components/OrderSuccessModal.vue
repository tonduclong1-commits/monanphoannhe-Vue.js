<script setup>
import { onMounted, ref } from 'vue'
import confetti from 'canvas-confetti'
import { CheckCircle2, Clock, MapPin, ChefHat, Bike, PackageCheck, X, Image as ImageIcon, ExternalLink } from 'lucide-vue-next'
import { formatVND } from '../utils/format'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  orderData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const orderStatusStep = ref(1) // 1: Nhận đơn, 2: Bếp làm, 3: Đang ship

onMounted(() => {
  if (props.isOpen) {
    triggerConfetti()
    simulateLiveTracking()
  }
})

function triggerConfetti() {
  try {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  } catch (e) {
    console.log(e)
  }
}

function simulateLiveTracking() {
  setTimeout(() => {
    orderStatusStep.value = 2
  }, 4000)
  setTimeout(() => {
    orderStatusStep.value = 3
  }, 10000)
}
</script>

<template>
  <div v-if="isOpen && orderData" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div @click="$emit('close')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"></div>

    <div class="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
      <!-- Close button -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
      >
        <X class="w-4 h-4" />
      </button>

      <!-- Success icon -->
      <div class="text-center space-y-2 mb-6">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md shadow-emerald-500/10">
          <CheckCircle2 class="w-10 h-10" />
        </div>
        <h2 class="text-2xl font-black text-slate-900">Đặt Món Thành Công!</h2>
        <p class="text-xs sm:text-sm text-slate-500">
          Mã đơn hàng: <strong class="text-amber-600 font-mono">{{ orderData.orderId }}</strong>
        </p>
      </div>

      <!-- Live Order Status Tracker -->
      <div class="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 mb-4">
        <h4 class="text-xs font-bold uppercase tracking-wider text-amber-900 mb-4 flex items-center gap-1.5">
          <Clock class="w-4 h-4 text-amber-600" />
          <span>Tiến trình giao hàng hỏa tốc (15-30 phút)</span>
        </h4>

        <div class="space-y-4">
          <!-- Step 1 -->
          <div class="flex items-start gap-3">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
              :class="orderStatusStep >= 1 ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-200 text-slate-500'"
            >
              <PackageCheck class="w-4 h-4" />
            </div>
            <div>
              <div class="text-xs font-bold text-slate-800">1. Đã nhận đơn hàng</div>
              <p class="text-[11px] text-slate-500">Quán đã xác nhận và in phiếu chế biến</p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex items-start gap-3">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
              :class="orderStatusStep >= 2 ? 'bg-amber-500 text-white animate-pulse shadow-sm' : 'bg-slate-200 text-slate-500'"
            >
              <ChefHat class="w-4 h-4" />
            </div>
            <div>
              <div class="text-xs font-bold text-slate-800">2. Đang chế biến nóng giòn</div>
              <p class="text-[11px] text-slate-500">Bếp đang chiên nướng, đóng gói giữ nhiệt</p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex items-start gap-3">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
              :class="orderStatusStep >= 3 ? 'bg-orange-500 text-white animate-bounce shadow-sm' : 'bg-slate-200 text-slate-500'"
            >
              <Bike class="w-4 h-4" />
            </div>
            <div>
              <div class="text-xs font-bold text-slate-800">3. Shipper đang hỏa tốc giao</div>
              <p class="text-[11px] text-slate-500">Tài xế đang di chuyển tới địa chỉ của bạn</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Proof Image Card if uploaded -->
      <div v-if="orderData.paymentProofImage" class="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 mb-4 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <img
            :src="orderData.paymentProofImage"
            alt="Biên lai thanh toán"
            class="w-12 h-12 object-cover rounded-xl border border-indigo-200 shadow-2xs"
          />
          <div>
            <div class="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
              <ImageIcon class="w-3.5 h-3.5 text-indigo-600" />
              <span>Đã đính kèm ảnh biên lai thanh toán</span>
            </div>
            <p class="text-[11px] text-indigo-600">Nhân viên thu ngân & bếp đã nhận được ảnh</p>
          </div>
        </div>
      </div>

      <!-- Customer Summary -->
      <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs text-slate-600 space-y-2 mb-6">
        <div class="flex items-center gap-2 font-bold text-slate-800">
          <MapPin class="w-4 h-4 text-amber-500" />
          <span>{{ orderData.customer.fullName }} ({{ orderData.customer.phone }})</span>
        </div>
        <p class="text-slate-500 pl-6">{{ orderData.customer.address }}</p>
        <div class="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-bold text-slate-800">
          <span>Tổng thanh toán:</span>
          <span class="text-amber-600 font-black text-base">{{ formatVND(orderData.total) }}</span>
        </div>
      </div>

      <!-- Action -->
      <button
        @click="$emit('close')"
        class="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition cursor-pointer shadow-md"
      >
        Tiếp Tục Đặt Thêm Món
      </button>
    </div>
  </div>
</template>
