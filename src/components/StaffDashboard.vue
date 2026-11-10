<script setup>
import { ref } from 'vue'
import {
  ChefHat,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Bike,
  Package,
  AlertCircle,
  LogOut,
  Flame,
  ShieldCheck,
  RotateCcw,
  Image as ImageIcon,
  Eye,
  X
} from 'lucide-vue-next'
import { formatVND } from '../utils/format'

const props = defineProps({
  currentUser: {
    type: Object,
    required: true
  },
  orders: {
    type: Array,
    default: () => []
  },
  menuItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'back-to-store',
  'logout',
  'switch-to-admin',
  'update-order-status',
  'trigger-toast'
])

// Lightbox for payment receipt
const viewingReceipt = ref(null)

// Local orders list combining real orders and initial demo orders for kitchen testing
const kitchenOrders = ref([
  ...props.orders,
  {
    orderId: '#PHO-8821',
    orderTime: '09:15',
    status: 'cooking', // 'pending' | 'cooking' | 'ready' | 'delivered'
    paymentMethod: 'cod',
    customer: {
      fullName: 'Trần Minh Quân',
      phone: '0977 123 456',
      address: 'Phòng 402, Tòa Nhà Bitexco, Q.1'
    },
    items: [
      { name: 'Bánh tráng nướng Đà Lạt đặc biệt', quantity: 2, selectedSpicy: 'Cay vừa' },
      { name: 'Trà mãng cầu xiêm chua ngọt', quantity: 2, selectedSpicy: 'Không cay' }
    ],
    total: 106000
  },
  {
    orderId: '#PHO-8822',
    orderTime: '09:22',
    status: 'pending',
    paymentMethod: 'qr',
    paymentProofImage: 'https://images.unsplash.com/photo-1554415707-9e4966a604f7?w=600&auto=format&fit=crop&q=80',
    customer: {
      fullName: 'Nguyễn Thị Thảo',
      phone: '0908 999 888',
      address: '25 Lê Lợi, P. Bến Nghé, Q.1'
    },
    items: [
      { name: 'Cá viên chiên nước mắm tỏi bơ xóc đậu bắp', quantity: 1, selectedSpicy: 'Cay vừa' },
      { name: 'Nem chua rán phố cổ Hà Nội', quantity: 1, selectedSpicy: 'Cay nhẹ' },
      { name: 'Trà đào cam sả thanh mát', quantity: 1, selectedSpicy: 'Không cay' }
    ],
    total: 112000
  }
])

function advanceStatus(order) {
  if (order.status === 'pending') {
    order.status = 'cooking'
    emit('trigger-toast', `Đơn ${order.orderId} chuyển sang BẾP ĐANG NẤU! 🍳`)
  } else if (order.status === 'cooking') {
    order.status = 'ready'
    emit('trigger-toast', `Đơn ${order.orderId} ĐÃ CHẾ BIẾN XONG, chờ shipper! 🛵`)
  } else if (order.status === 'ready') {
    order.status = 'delivered'
    emit('trigger-toast', `Đơn ${order.orderId} ĐÃ GIAO THÀNH CÔNG! 🎉`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
    <!-- Header -->
    <header class="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 shadow-xs">
      <div class="flex items-center gap-3">
        <button
          @click="$emit('back-to-store')"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer border border-slate-200/80"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Về Cửa Hàng</span>
        </button>

        <div class="h-5 w-px bg-slate-200 hidden sm:block"></div>

        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-600 flex items-center justify-center text-lg font-bold border border-orange-200">
            👨‍🍳
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-sm sm:text-base font-black tracking-tight text-slate-900">
                BẢNG ĐIỀU KHIỂN BẾP & NHÂN VIÊN
              </h1>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-300">
                Live Kitchen
              </span>
            </div>
            <p class="text-[11px] text-slate-500 font-medium">Tiếp nhận và đẩy trạng thái đơn hàng theo thời gian thực</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Switch to Admin (if user has admin role) -->
        <button
          v-if="currentUser.role === 'admin'"
          @click="$emit('switch-to-admin')"
          class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition cursor-pointer"
        >
          <ShieldCheck class="w-3.5 h-3.5 text-amber-600" />
          <span>Bảng Admin</span>
        </button>

        <!-- Current User Avatar -->
        <div class="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span class="text-base">{{ currentUser.avatar || '👨‍🍳' }}</span>
          <div class="hidden sm:block text-left text-xs">
            <div class="font-bold text-slate-900 leading-none">{{ currentUser.fullName }}</div>
            <div class="text-[10px] text-orange-600 font-bold uppercase">{{ currentUser.role }}</div>
          </div>
        </div>

        <!-- Logout -->
        <button
          @click="$emit('logout')"
          class="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition cursor-pointer"
          title="Đăng xuất"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </header>

    <!-- Kitchen Kanban Columns -->
    <main class="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- COLUMN 1: PENDING -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div class="p-4 border-b border-rose-100 bg-rose-50/60 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
              <h3 class="font-bold text-sm text-rose-950">Chờ Tiếp Nhận</h3>
            </div>
            <span class="text-xs bg-rose-100 text-rose-700 font-black px-2.5 py-0.5 rounded-full border border-rose-200">
              {{ kitchenOrders.filter(o => o.status === 'pending').length }}
            </span>
          </div>

          <div class="p-4 space-y-4 flex-1 overflow-y-auto">
            <div
              v-for="order in kitchenOrders.filter(o => o.status === 'pending')"
              :key="order.orderId"
              class="bg-slate-50 p-4 rounded-2xl border border-rose-200 space-y-3 shadow-2xs hover:border-rose-300 transition"
            >
              <div class="flex justify-between items-start">
                <div>
                  <span class="text-sm font-black text-rose-700 font-mono">{{ order.orderId }}</span>
                  <p class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock class="w-3 h-3" />
                    <span>{{ order.orderTime }}</span>
                  </p>
                </div>
                <span class="text-xs font-black text-slate-800">{{ formatVND(order.total) }}</span>
              </div>

              <!-- Customer Details -->
              <div class="text-xs bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700 space-y-1">
                <div class="font-bold text-slate-900">{{ order.customer.fullName }} - {{ order.customer.phone }}</div>
                <div class="text-[11px] text-slate-500">{{ order.customer.address }}</div>
                <div v-if="order.paymentProofImage" class="pt-1 flex items-center justify-between border-t border-slate-100">
                  <span class="text-[10px] text-indigo-700 font-bold flex items-center gap-1">
                    <ImageIcon class="w-3 h-3 text-indigo-500" />
                    <span>Có ảnh chuyển khoản</span>
                  </span>
                  <button
                    type="button"
                    @click="viewingReceipt = order.paymentProofImage"
                    class="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Eye class="w-3 h-3" />
                    <span>Xem ảnh</span>
                  </button>
                </div>
              </div>

              <!-- Dish list -->
              <div class="space-y-1.5 text-xs">
                <div v-for="(it, i) in order.items" :key="i" class="flex justify-between text-slate-700">
                  <span><strong>{{ it.quantity }}x</strong> {{ it.name }}</span>
                  <span v-if="it.selectedSpicy" class="text-orange-600 font-bold text-[10px]">{{ it.selectedSpicy }}</span>
                </div>
              </div>

              <!-- Action button -->
              <button
                @click="advanceStatus(order)"
                class="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-orange-600/20 active:scale-98"
              >
                <ChefHat class="w-4 h-4" />
                <span>Tiếp Nhận & Bắt Đầu Nấu</span>
              </button>
            </div>
          </div>
        </div>

        <!-- COLUMN 2: COOKING -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div class="p-4 border-b border-orange-100 bg-orange-50/60 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></span>
              <h3 class="font-bold text-sm text-orange-950">Bếp Đang Làm Nóng Giòn</h3>
            </div>
            <span class="text-xs bg-orange-100 text-orange-700 font-black px-2.5 py-0.5 rounded-full border border-orange-200">
              {{ kitchenOrders.filter(o => o.status === 'cooking').length }}
            </span>
          </div>

          <div class="p-4 space-y-4 flex-1 overflow-y-auto">
            <div
              v-for="order in kitchenOrders.filter(o => o.status === 'cooking')"
              :key="order.orderId"
              class="bg-slate-50 p-4 rounded-2xl border border-orange-200 space-y-3 shadow-2xs hover:border-orange-300 transition"
            >
              <div class="flex justify-between items-start">
                <div>
                  <span class="text-sm font-black text-amber-700 font-mono">{{ order.orderId }}</span>
                  <p class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Flame class="w-3 h-3 text-orange-500" />
                    <span>Đang nướng/chiên</span>
                  </p>
                </div>
                <span class="text-xs font-black text-slate-800">{{ formatVND(order.total) }}</span>
              </div>

              <!-- Dishes -->
              <div class="space-y-1.5 text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                <div v-for="(it, i) in order.items" :key="i" class="flex justify-between text-slate-800">
                  <span><strong>{{ it.quantity }}x</strong> {{ it.name }}</span>
                  <span class="text-amber-600 text-[10px] font-bold">{{ it.selectedSpicy }}</span>
                </div>
              </div>

              <!-- Action button -->
              <button
                @click="advanceStatus(order)"
                class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-orange-500/20 active:scale-98"
              >
                <CheckCircle2 class="w-4 h-4" />
                <span>Nấu Xong ➔ Sẵn Sàng Giao</span>
              </button>
            </div>
          </div>
        </div>

        <!-- COLUMN 3: READY / DELIVERING -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div class="p-4 border-b border-emerald-100 bg-emerald-50/60 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
              <h3 class="font-bold text-sm text-emerald-950">Đang Giao & Hoàn Tất</h3>
            </div>
            <span class="text-xs bg-emerald-100 text-emerald-700 font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
              {{ kitchenOrders.filter(o => o.status === 'ready' || o.status === 'delivered').length }}
            </span>
          </div>

          <div class="p-4 space-y-4 flex-1 overflow-y-auto">
            <div
              v-for="order in kitchenOrders.filter(o => o.status === 'ready' || o.status === 'delivered')"
              :key="order.orderId"
              class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs hover:border-emerald-300 transition"
            >
              <div class="flex justify-between items-start">
                <div>
                  <span class="text-sm font-black text-emerald-700 font-mono">{{ order.orderId }}</span>
                  <span
                    class="ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                    :class="order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-100 text-cyan-800'"
                  >
                    {{ order.status === 'delivered' ? 'Đã Giao' : 'Shipper Đang Giao' }}
                  </span>
                </div>
                <span class="text-xs font-black text-slate-800">{{ formatVND(order.total) }}</span>
              </div>

              <div class="text-xs text-slate-600">
                Người nhận: <strong class="text-slate-900">{{ order.customer.fullName }}</strong> ({{ order.customer.phone }})
              </div>

              <!-- Button to mark finished -->
              <button
                v-if="order.status === 'ready'"
                @click="advanceStatus(order)"
                class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-600/20 active:scale-98"
              >
                <Bike class="w-4 h-4" />
                <span>Xác Nhận Đã Giao Tới Khách</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Lightbox for Payment Receipt -->
    <div v-if="viewingReceipt" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div @click="viewingReceipt = null" class="fixed inset-0 bg-slate-900/80 backdrop-blur-xs"></div>
      <div class="relative bg-white rounded-3xl p-4 max-w-lg w-full z-10 space-y-3 shadow-2xl">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <h4 class="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon class="w-4 h-4 text-amber-500" />
            <span>Biên Lai / Ảnh Hóa Đơn Chuyển Khoản Của Khách</span>
          </h4>
          <button
            @click="viewingReceipt = null"
            class="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-100 flex items-center justify-center bg-slate-50">
          <img :src="viewingReceipt" alt="Biên lai chi tiết" class="max-w-full h-auto object-contain rounded-xl" />
        </div>
      </div>
    </div>
  </div>
</template>
