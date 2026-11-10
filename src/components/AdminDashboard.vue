<script setup>
import { ref, computed } from 'vue'
import {
  TrendingUp,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  DollarSign,
  Search,
  Eye,
  LogOut,
  ChefHat,
  Star,
  Clock,
  Image as ImageIcon,
  UploadCloud,
  X
} from 'lucide-vue-next'
import { formatVND } from '../utils/format'
import { getUsers, saveUsers } from '../data/users'
import StaffManagement from './StaffManagement.vue'

const props = defineProps({
  currentUser: {
    type: Object,
    required: true
  },
  menuItems: {
    type: Array,
    required: true
  },
  orders: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'back-to-store',
  'logout',
  'switch-to-staff',
  'add-menu-item',
  'update-menu-item',
  'delete-menu-item',
  'trigger-toast'
])

const activeTab = ref('overview') // 'overview' | 'menu' | 'users' | 'orders'

// Search in Menu
const menuSearch = ref('')

// Manage Staff Users
const userList = ref(getUsers())

// Lightbox for payment proof image
const viewingReceiptImage = ref(null)

// Add / Edit Dish Modal State
const isEditModalOpen = ref(false)
const editingDish = ref(null)
const dishFileInput = ref(null)
const dishForm = ref({
  name: '',
  category: 'banh-trang',
  price: 25000,
  originalPrice: 30000,
  spicyLevel: 1,
  badge: 'Món Mới',
  image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=700&auto=format&fit=crop&q=80',
  description: '',
  prepTime: '7 - 10 phút'
})

function handleDishUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    dishForm.value.image = e.target.result
  }
  reader.readAsDataURL(file)
}

// Statistics
const totalRevenue = computed(() => {
  return props.orders.reduce((acc, order) => acc + (order.total || 0), 1250000)
})

const totalOrdersCount = computed(() => {
  return props.orders.length + 38
})

const filteredMenuItems = computed(() => {
  if (!menuSearch.value.trim()) return props.menuItems
  const q = menuSearch.value.toLowerCase()
  return props.menuItems.filter(item => item.name.toLowerCase().includes(q))
})

function openAddModal() {
  editingDish.value = null
  dishForm.value = {
    name: '',
    category: 'banh-trang',
    price: 25000,
    originalPrice: 30000,
    spicyLevel: 1,
    badge: 'Món Mới',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=700&auto=format&fit=crop&q=80',
    description: '',
    prepTime: '7 - 10 phút'
  }
  isEditModalOpen.value = true
}

function openEditModal(dish) {
  editingDish.value = dish
  dishForm.value = { ...dish }
  isEditModalOpen.value = true
}

function saveDish() {
  if (!dishForm.value.name.trim()) {
    emit('trigger-toast', 'Vui lòng nhập tên món ăn', 'error')
    return
  }

  if (editingDish.value) {
    emit('update-menu-item', { ...dishForm.value, id: editingDish.value.id })
    emit('trigger-toast', `Đã cập nhật món "${dishForm.value.name}"!`)
  } else {
    const newDish = {
      ...dishForm.value,
      id: Date.now(),
      rating: 5.0,
      reviewsCount: 1,
      tags: ['Mới']
    }
    emit('add-menu-item', newDish)
    emit('trigger-toast', `Đã thêm món "${dishForm.value.name}" vào thực đơn!`)
  }

  isEditModalOpen.value = false
}

function handleDeleteDish(dishId, dishName) {
  if (confirm(`Bạn có chắc chắn muốn xóa món "${dishName}" không?`)) {
    emit('delete-menu-item', dishId)
    emit('trigger-toast', `Đã xóa món "${dishName}" khỏi thực đơn`, 'error')
  }
}

function handleDeleteUser(userId, userName) {
  if (confirm(`Xóa tài khoản nhân viên "${userName}"?`)) {
    userList.value = userList.value.filter(u => u.id !== userId)
    saveUsers(userList.value)
    emit('trigger-toast', `Đã xóa tài khoản nhân viên "${userName}"`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
    <!-- Top Bar -->
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
          <div class="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center text-lg font-bold border border-amber-200">
            👑
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-sm sm:text-base font-black tracking-tight text-slate-900">
                ADMIN DASHBOARD
              </h1>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                Toàn Quyền
              </span>
            </div>
            <p class="text-[11px] text-slate-500 font-medium">Hệ thống quản trị Phố Ăn Nhẹ</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Switch to Staff Board button -->
        <button
          @click="$emit('switch-to-staff')"
          class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold transition cursor-pointer"
        >
          <ChefHat class="w-3.5 h-3.5 text-orange-600" />
          <span>Xem Bếp (Staff)</span>
        </button>

        <!-- Current User Info -->
        <div class="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span class="text-base">{{ currentUser.avatar || '👑' }}</span>
          <div class="hidden sm:block text-left text-xs">
            <div class="font-bold text-slate-900 leading-none">{{ currentUser.fullName }}</div>
            <div class="text-[10px] text-amber-700 font-semibold capitalize">{{ currentUser.role }}</div>
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

    <!-- Sub Navigation Tabs -->
    <div class="bg-white border-b border-slate-200 px-4 sm:px-6 shadow-2xs">
      <div class="flex gap-2 sm:gap-4 overflow-x-auto py-2.5">
        <button
          @click="activeTab = 'overview'"
          class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2"
          :class="activeTab === 'overview' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          <TrendingUp class="w-4 h-4" />
          <span>Tổng Quan & Doanh Thu</span>
        </button>

        <button
          @click="activeTab = 'menu'"
          class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2"
          :class="activeTab === 'menu' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          <UtensilsCrossed class="w-4 h-4" />
          <span>Quản Lý Món Ăn ({{ menuItems.length }})</span>
        </button>

        <button
          @click="activeTab = 'users'"
          class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2"
          :class="activeTab === 'users' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          <Users class="w-4 h-4" />
          <span>Quản Lý Nhân Sự Staff</span>
        </button>

        <button
          @click="activeTab = 'orders'"
          class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2"
          :class="activeTab === 'orders' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
        >
          <ShoppingBag class="w-4 h-4" />
          <span>Đơn Hàng Gần Đây</span>
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      <!-- TAB 1: OVERVIEW -->
      <div v-if="activeTab === 'overview'" class="space-y-6">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div class="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Doanh thu ước tính</span>
              <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign class="w-4 h-4" />
              </div>
            </div>
            <div class="text-2xl font-black text-emerald-600">{{ formatVND(totalRevenue) }}</div>
            <p class="text-[11px] text-emerald-600 font-semibold">↑ +18.4% so với hôm qua</p>
          </div>

          <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div class="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Tổng số đơn đặt</span>
              <div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShoppingBag class="w-4 h-4" />
              </div>
            </div>
            <div class="text-2xl font-black text-slate-900">{{ totalOrdersCount }} đơn</div>
            <p class="text-[11px] text-amber-700 font-semibold">100% tỷ lệ hoàn thành</p>
          </div>

          <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div class="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Món đang phục vụ</span>
              <div class="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <UtensilsCrossed class="w-4 h-4" />
              </div>
            </div>
            <div class="text-2xl font-black text-slate-900">{{ menuItems.length }} món</div>
            <p class="text-[11px] text-slate-500 font-medium">6 danh mục ẩm thực</p>
          </div>

          <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div class="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Nhân sự đang trực</span>
              <div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users class="w-4 h-4" />
              </div>
            </div>
            <div class="text-2xl font-black text-slate-900">{{ userList.length }} người</div>
            <p class="text-[11px] text-indigo-700 font-semibold">Bếp & Thu ngân sẵn sàng</p>
          </div>
        </div>

        <!-- Quick actions & Best sellers -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Best Sellers -->
          <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>🔥 Món Ăn Bán Chạy Nhất Hôm Nay</span>
              </h3>
              <button @click="activeTab = 'menu'" class="text-xs text-amber-600 hover:text-amber-700 font-bold hover:underline cursor-pointer">
                Xem tất cả
              </button>
            </div>

            <div class="space-y-3">
              <div
                v-for="(item, idx) in menuItems.slice(0, 4)"
                :key="item.id"
                class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition"
              >
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 text-xs font-black flex items-center justify-center">
                    #{{ idx + 1 }}
                  </span>
                  <img :src="item.image" :alt="item.name" class="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <h4 class="text-xs font-bold text-slate-800 line-clamp-1">{{ item.name }}</h4>
                    <span class="text-[11px] text-amber-600 font-black">{{ formatVND(item.price) }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-xs font-bold text-slate-700">{{ item.reviewsCount }} lượt</span>
                  <div class="text-[10px] text-amber-500 font-bold">★ {{ item.rating }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <h3 class="font-bold text-sm text-slate-900">⚡ Lối Tắt Quản Trị Nhanh</h3>
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="openAddModal"
                class="p-4 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-900 font-bold text-xs flex flex-col items-center gap-2 transition cursor-pointer shadow-2xs"
              >
                <Plus class="w-6 h-6 text-amber-600" />
                <span>Thêm Món Mới Vào Menu</span>
              </button>
              <button
                @click="$emit('switch-to-staff')"
                class="p-4 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-orange-900 font-bold text-xs flex flex-col items-center gap-2 transition cursor-pointer shadow-2xs"
              >
                <ChefHat class="w-6 h-6 text-orange-600" />
                <span>Mở Bảng Điều Khiển Bếp</span>
              </button>
              <button
                @click="activeTab = 'users'"
                class="p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-900 font-bold text-xs flex flex-col items-center gap-2 transition cursor-pointer shadow-2xs"
              >
                <Users class="w-6 h-6 text-indigo-600" />
                <span>Xem Tài Khoản Nhân Viên</span>
              </button>
              <button
                @click="$emit('back-to-store')"
                class="p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 font-bold text-xs flex flex-col items-center gap-2 transition cursor-pointer shadow-2xs"
              >
                <ArrowLeft class="w-6 h-6 text-emerald-600" />
                <span>Trải Nghiệm Khách Hàng</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: MENU MANAGEMENT -->
      <div v-else-if="activeTab === 'menu'" class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <!-- Search -->
          <div class="relative flex-1 max-w-sm">
            <input
              v-model="menuSearch"
              type="text"
              placeholder="Tìm kiếm món trong kho..."
              class="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-amber-500"
            />
            <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            @click="openAddModal"
            class="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition cursor-pointer"
          >
            <Plus class="w-4 h-4" />
            <span>Thêm Món Ăn Mới</span>
          </button>
        </div>

        <!-- Table of Menu Items -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th class="p-3.5">Món Ăn</th>
                  <th class="p-3.5">Phân loại</th>
                  <th class="p-3.5">Giá bán</th>
                  <th class="p-3.5">Đánh giá</th>
                  <th class="p-3.5">Thời gian</th>
                  <th class="p-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="item in filteredMenuItems" :key="item.id" class="hover:bg-slate-50/80 transition">
                  <td class="p-3.5 flex items-center gap-3">
                    <img :src="item.image" :alt="item.name" class="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100" />
                    <div>
                      <div class="font-bold text-slate-900 text-sm">{{ item.name }}</div>
                      <span v-if="item.badge" class="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                        {{ item.badge }}
                      </span>
                    </div>
                  </td>
                  <td class="p-3.5 font-medium text-slate-500">#{{ item.category }}</td>
                  <td class="p-3.5">
                    <span class="font-black text-amber-600">{{ formatVND(item.price) }}</span>
                    <span v-if="item.originalPrice" class="text-[10px] text-slate-400 line-through block">
                      {{ formatVND(item.originalPrice) }}
                    </span>
                  </td>
                  <td class="p-3.5 font-medium">★ {{ item.rating }} ({{ item.reviewsCount }})</td>
                  <td class="p-3.5 text-slate-500">{{ item.prepTime }}</td>
                  <td class="p-3.5 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        @click="openEditModal(item)"
                        class="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition cursor-pointer"
                        title="Chỉnh sửa món"
                      >
                        <Edit2 class="w-3.5 h-3.5" />
                      </button>
                      <button
                        @click="handleDeleteDish(item.id, item.name)"
                        class="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                        title="Xóa món"
                      >
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 3: STAFF USER MANAGEMENT -->
      <div v-else-if="activeTab === 'users'">
        <StaffManagement
          :current-user="currentUser"
          @trigger-toast="$emit('trigger-toast', $event)"
        />
      </div>

      <!-- TAB 4: ORDERS -->
      <div v-else-if="activeTab === 'orders'" class="space-y-4">
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <h3 class="font-bold text-slate-900 text-sm">Các Đơn Hàng Giao Nhận</h3>
          <span class="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            Tự động đồng bộ với Bếp
          </span>
        </div>

        <div v-if="orders.length === 0" class="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-xs">
          Chưa có đơn hàng mới nào được đặt trong phiên này. Hãy đặt thử từ giao diện Cửa Hàng!
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="order in orders"
            :key="order.orderId"
            class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div class="flex items-start gap-3">
              <!-- Uploaded Payment Proof Thumbnail if available -->
              <div v-if="order.paymentProofImage" class="relative group shrink-0">
                <img
                  :src="order.paymentProofImage"
                  alt="Biên lai thanh toán"
                  class="w-16 h-16 object-cover rounded-xl border border-indigo-200 shadow-xs cursor-pointer group-hover:scale-105 transition-transform"
                  @click="viewingReceiptImage = order.paymentProofImage"
                />
                <button
                  @click="viewingReceiptImage = order.paymentProofImage"
                  class="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition cursor-pointer"
                  title="Phóng to ảnh biên lai"
                >
                  <Eye class="w-4 h-4" />
                </button>
              </div>

              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-mono font-black text-amber-600 text-sm">{{ order.orderId }}</span>
                  <span class="text-xs text-slate-400">• {{ order.orderTime }}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    {{ order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod === 'qr' ? 'VietQR' : 'Thẻ' }}
                  </span>
                  <span
                    v-if="order.paymentProofImage"
                    class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 flex items-center gap-1 cursor-pointer"
                    @click="viewingReceiptImage = order.paymentProofImage"
                  >
                    <ImageIcon class="w-3 h-3" />
                    <span>Có ảnh biên lai</span>
                  </span>
                </div>
                <p class="text-xs text-slate-800 font-bold">{{ order.customer.fullName }} ({{ order.customer.phone }})</p>
                <p class="text-[11px] text-slate-500">{{ order.customer.address }}</p>
              </div>
            </div>

            <div class="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <button
                v-if="order.paymentProofImage"
                @click="viewingReceiptImage = order.paymentProofImage"
                class="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-indigo-200"
              >
                <Eye class="w-3.5 h-3.5" />
                <span>Xem ảnh hóa đơn</span>
              </button>

              <div class="text-right">
                <div class="text-base font-black text-amber-600">{{ formatVND(order.total) }}</div>
                <span class="text-xs text-slate-400">{{ order.items?.length || 1 }} món</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Add/Edit Dish (Light Theme) -->
    <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div @click="isEditModalOpen = false" class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"></div>

      <div class="relative bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl p-6 z-10 space-y-4">
        <h3 class="text-base font-bold text-slate-900">
          {{ editingDish ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Ăn Mới' }}
        </h3>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-slate-600 font-bold mb-1">Tên món ăn *</label>
            <input
              v-model="dishForm.name"
              type="text"
              class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:bg-white focus:border-amber-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-600 font-bold mb-1">Phân loại</label>
              <select
                v-model="dishForm.category"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:bg-white focus:border-amber-500 cursor-pointer"
              >
                <option value="banh-trang">Bánh tráng & Cuốn</option>
                <option value="chien-nuong">Chiên & Nướng</option>
                <option value="chua-cay">Chua cay Sốt Thái</option>
                <option value="no-nhe">Ăn nhẹ no bụng</option>
                <option value="giai-khat">Trà & Nước</option>
                <option value="trang-mieng">Chè & Tráng miệng</option>
              </select>
            </div>

            <div>
              <label class="block text-slate-600 font-bold mb-1">Huy hiệu (Badge)</label>
              <input
                v-model="dishForm.badge"
                type="text"
                placeholder="Best Seller, Hot Trend..."
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:bg-white focus:border-amber-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-600 font-bold mb-1">Giá bán (VNĐ) *</label>
              <input
                v-model.number="dishForm.price"
                type="number"
                step="1000"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:bg-white focus:border-amber-500"
              />
            </div>

            <div>
              <label class="block text-slate-600 font-bold mb-1">Giá gốc (Gạch bỏ)</label>
              <input
                v-model.number="dishForm.originalPrice"
                type="number"
                step="1000"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:bg-white focus:border-amber-500"
              />
            </div>
          </div>

          <!-- Dish Image with File Upload -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-slate-600 font-bold">Hình ảnh món ăn</label>
              <input
                ref="dishFileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleDishUpload"
              />
              <button
                type="button"
                @click="dishFileInput?.click()"
                class="text-[11px] text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <UploadCloud class="w-3.5 h-3.5" />
                <span>Tải ảnh từ máy tính</span>
              </button>
            </div>
            <div class="flex gap-2">
              <input
                v-model="dishForm.image"
                type="text"
                placeholder="https://..."
                class="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:bg-white focus:border-amber-500"
              />
              <img
                v-if="dishForm.image"
                :src="dishForm.image"
                alt="Preview"
                class="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
              />
            </div>
          </div>

          <div>
            <label class="block text-slate-600 font-bold mb-1">Mô tả món ăn</label>
            <textarea
              v-model="dishForm.description"
              rows="2"
              class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:bg-white focus:border-amber-500"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            @click="isEditModalOpen = false"
            class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 cursor-pointer"
          >
            Hủy
          </button>
          <button
            @click="saveDish"
            class="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black cursor-pointer shadow-md shadow-orange-500/20"
          >
            Lưu Món
          </button>
        </div>
      </div>
    </div>

    <!-- Lightbox for Payment Receipt -->
    <div v-if="viewingReceiptImage" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div @click="viewingReceiptImage = null" class="fixed inset-0 bg-slate-900/80 backdrop-blur-xs"></div>
      <div class="relative bg-white rounded-3xl p-4 max-w-lg w-full z-10 space-y-3 shadow-2xl">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <h4 class="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon class="w-4 h-4 text-amber-500" />
            <span>Biên Lai / Hóa Đơn Thanh Toán</span>
          </h4>
          <button
            @click="viewingReceiptImage = null"
            class="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-100 flex items-center justify-center bg-slate-50">
          <img :src="viewingReceiptImage" alt="Biên lai chi tiết" class="max-w-full h-auto object-contain rounded-xl" />
        </div>
      </div>
    </div>
  </div>
</template>
