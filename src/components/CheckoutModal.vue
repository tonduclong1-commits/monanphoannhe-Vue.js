<script setup>
import { ref } from 'vue'
import {
  X,
  MapPin,
  Phone,
  User,
  FileText,
  QrCode,
  Banknote,
  CreditCard,
  ShieldCheck,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Sparkles
} from 'lucide-vue-next'
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
  grandTotal: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'confirm-order'])

const fullName = ref('')
const phone = ref('')
const address = ref('')
const note = ref('')
const paymentMethod = ref('qr') // 'qr' | 'cod' | 'card'
const errors = ref({})

// Image upload state
const paymentReceipt = ref(null) // Data URL string
const receiptFileName = ref('')
const fileInputRef = ref(null)

function handleFileUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Vui lòng chọn file hình ảnh (PNG, JPG, JPEG, WEBP)')
    return
  }

  receiptFileName.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => {
    paymentReceipt.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function handleDrop(event) {
  event.preventDefault()
  const file = event.dataTransfer?.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Vui lòng chọn file hình ảnh')
    return
  }

  receiptFileName.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => {
    paymentReceipt.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function removeReceipt() {
  paymentReceipt.value = null
  receiptFileName.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// Quick Sample Receipt for instant testing
function useSampleReceipt() {
  // SVG receipt converted to data url for fast testing
  receiptFileName.value = 'bien-lai-vietqr-thanh-cong.png'
  paymentReceipt.value = 'https://images.unsplash.com/photo-1554415707-9e4966a604f7?w=600&auto=format&fit=crop&q=80'
}

function validateAndSubmit() {
  errors.value = {}
  if (!fullName.value.trim()) {
    errors.value.fullName = 'Vui lòng nhập họ và tên'
  }
  if (!phone.value.trim() || !/^[0-9]{9,11}$/.test(phone.value.replace(/\s/g, ''))) {
    errors.value.phone = 'Số điện thoại không hợp lệ (9-11 số)'
  }
  if (!address.value.trim()) {
    errors.value.address = 'Vui lòng nhập địa chỉ nhận hàng'
  }

  if (Object.keys(errors.value).length > 0) {
    return
  }

  emit('confirm-order', {
    customer: {
      fullName: fullName.value.trim(),
      phone: phone.value.trim(),
      address: address.value.trim(),
      note: note.value.trim()
    },
    paymentMethod: paymentMethod.value,
    total: props.grandTotal,
    paymentProofImage: paymentReceipt.value,
    paymentProofName: receiptFileName.value,
    items: [...props.cartItems]
  })
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div @click="$emit('close')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"></div>

    <div class="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[92vh]">
      <!-- Header -->
      <div class="p-5 border-b border-amber-400/40 flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
        <div>
          <h3 class="text-lg font-black tracking-tight">Xác Nhận Đặt Món Phố</h3>
          <p class="text-xs text-amber-100">Giao hàng hỏa tốc trong 15 - 30 phút</p>
        </div>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center cursor-pointer transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="validateAndSubmit" class="p-6 overflow-y-auto space-y-4 flex-1">
        <!-- Customer Name -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <User class="w-3.5 h-3.5 text-amber-500" />
            <span>Họ và tên người nhận *</span>
          </label>
          <input
            v-model="fullName"
            type="text"
            placeholder="Ví dụ: Nguyễn Văn Hoàng"
            class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-hidden"
            :class="{ 'border-rose-400 bg-rose-50/40': errors.fullName }"
          />
          <span v-if="errors.fullName" class="text-xs text-rose-500 font-medium">{{ errors.fullName }}</span>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Phone class="w-3.5 h-3.5 text-amber-500" />
            <span>Số điện thoại *</span>
          </label>
          <input
            v-model="phone"
            type="tel"
            placeholder="Ví dụ: 0912 345 678"
            class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-hidden"
            :class="{ 'border-rose-400 bg-rose-50/40': errors.phone }"
          />
          <span v-if="errors.phone" class="text-xs text-rose-500 font-medium">{{ errors.phone }}</span>
        </div>

        <!-- Address -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <MapPin class="w-3.5 h-3.5 text-amber-500" />
            <span>Địa chỉ giao hàng chi tiết *</span>
          </label>
          <textarea
            v-model="address"
            rows="2"
            placeholder="Số nhà, ngõ/ngách, tên đường, phường/xã, quận..."
            class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-hidden"
            :class="{ 'border-rose-400 bg-rose-50/40': errors.address }"
          ></textarea>
          <span v-if="errors.address" class="text-xs text-rose-500 font-medium">{{ errors.address }}</span>
        </div>

        <!-- Shipper Note -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <FileText class="w-3.5 h-3.5 text-amber-500" />
            <span>Lời nhắn cho shipper</span>
          </label>
          <input
            v-model="note"
            type="text"
            placeholder="Ví dụ: Gọi trước khi đến, gửi bảo vệ tòa nhà..."
            class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 focus:outline-hidden"
          />
        </div>

        <!-- Payment Method -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Phương thức thanh toán
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              @click="paymentMethod = 'qr'"
              class="flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition cursor-pointer"
              :class="paymentMethod === 'qr'
                ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'"
            >
              <QrCode class="w-5 h-5 mb-1 text-indigo-600" />
              <span class="text-xs font-bold">Quét VietQR</span>
              <span class="text-[10px] text-slate-400">MoMo / Ngân hàng</span>
            </button>

            <button
              type="button"
              @click="paymentMethod = 'cod'"
              class="flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition cursor-pointer"
              :class="paymentMethod === 'cod'
                ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'"
            >
              <Banknote class="w-5 h-5 mb-1 text-emerald-600" />
              <span class="text-xs font-bold">Tiền mặt (COD)</span>
              <span class="text-[10px] text-slate-400">Trả khi nhận món</span>
            </button>

            <button
              type="button"
              @click="paymentMethod = 'card'"
              class="flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition cursor-pointer"
              :class="paymentMethod === 'card'
                ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'"
            >
              <CreditCard class="w-5 h-5 mb-1 text-orange-600" />
              <span class="text-xs font-bold">Thẻ Online</span>
              <span class="text-[10px] text-slate-400">ATM / Visa / Master</span>
            </button>
          </div>
        </div>

        <!-- VietQR Box -->
        <div v-if="paymentMethod === 'qr'" class="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center gap-4">
          <div class="w-24 h-24 bg-white p-1 rounded-xl shadow-xs border border-indigo-200 shrink-0 flex items-center justify-center">
            <img
              :src="`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=247-PHOANVAT-${grandTotal}`"
              alt="Mã QR thanh toán"
              class="w-full h-full object-contain"
            />
          </div>
          <div class="text-xs text-indigo-950 space-y-1">
            <div class="font-bold flex items-center gap-1">
              <ShieldCheck class="w-4 h-4 text-emerald-600" />
              <span>Chuyển khoản VietQR tự động</span>
            </div>
            <p class="text-indigo-700 text-[11px]">Ngân hàng: <strong>MB Bank (Quân Đội)</strong></p>
            <p class="text-indigo-700 text-[11px]">STK: <strong class="text-indigo-950">0988123456</strong></p>
            <p class="text-indigo-700 text-[11px]">Nội dung: <strong>PHOANVAT {{ phone || 'SĐT' }}</strong></p>
            <p class="text-indigo-900 font-black text-sm">Số tiền: {{ formatVND(grandTotal) }}</p>
          </div>
        </div>

        <!-- UPLOAD PAYMENT PROOF / RECEIPT IMAGE -->
        <div class="space-y-2 pt-1 border-t border-slate-100">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon class="w-4 h-4 text-amber-500" />
              <span>Upload Ảnh Hóa Đơn / Biên Lai Chuyển Khoản</span>
            </label>
            <button
              type="button"
              @click="useSampleReceipt"
              class="text-[11px] text-amber-700 hover:text-amber-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles class="w-3 h-3 text-amber-500" />
              <span>Dùng ảnh mẫu</span>
            </button>
          </div>

          <!-- Hidden File Input -->
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileUpload"
          />

          <!-- Upload Dropzone if no image yet -->
          <div
            v-if="!paymentReceipt"
            @click="fileInputRef?.click()"
            @dragover.prevent
            @drop="handleDrop"
            class="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/70 p-5 rounded-2xl text-center cursor-pointer transition duration-200 group"
          >
            <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <UploadCloud class="w-5 h-5" />
            </div>
            <p class="text-xs font-bold text-slate-800">
              Nhấn để tải lên ảnh biên lai hoặc kéo thả ảnh vào đây
            </p>
            <p class="text-[11px] text-slate-400 mt-0.5">
              Hỗ trợ JPG, PNG, WEBP (Ảnh chụp màn hình chuyển khoản VietQR, MoMo, Hóa đơn)
            </p>
          </div>

          <!-- Uploaded Preview -->
          <div
            v-else
            class="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3"
          >
            <div class="flex items-center gap-3 min-w-0">
              <img
                :src="paymentReceipt"
                alt="Biên lai thanh toán"
                class="w-14 h-14 object-cover rounded-xl border border-emerald-300 shrink-0 shadow-2xs"
              />
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span class="truncate">{{ receiptFileName || 'Ảnh biên lai thanh toán' }}</span>
                </div>
                <p class="text-[10px] text-emerald-600 mt-0.5">Đã đính kèm ảnh thành công</p>
              </div>
            </div>

            <button
              type="button"
              @click="removeReceipt"
              class="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-100/60 transition cursor-pointer shrink-0"
              title="Xóa ảnh"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      <!-- Footer Action -->
      <div class="p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div>
          <span class="text-xs text-slate-500">Tổng thanh toán:</span>
          <div class="text-xl font-black text-amber-600">{{ formatVND(grandTotal) }}</div>
        </div>
        <button
          type="button"
          @click="validateAndSubmit"
          class="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm shadow-md shadow-orange-500/20 active:scale-98 transition cursor-pointer"
        >
          Xác Nhận Đặt Món
        </button>
      </div>
    </div>
  </div>
</template>
