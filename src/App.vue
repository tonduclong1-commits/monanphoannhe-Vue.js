<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from './components/Navbar.vue'
import HeroBanner from './components/HeroBanner.vue'
import CategoryBar from './components/CategoryBar.vue'
import FilterBar from './components/FilterBar.vue'
import FoodCard from './components/FoodCard.vue'
import FoodDetailModal from './components/FoodDetailModal.vue'
import CartDrawer from './components/CartDrawer.vue'
import CheckoutModal from './components/CheckoutModal.vue'
import OrderSuccessModal from './components/OrderSuccessModal.vue'
import FavoritesModal from './components/FavoritesModal.vue'
import AuthModal from './components/AuthModal.vue'
import AdminDashboard from './components/AdminDashboard.vue'
import StaffDashboard from './components/StaffDashboard.vue'
import Footer from './components/Footer.vue'
import Toast from './components/Toast.vue'
import { CATEGORIES, MENU_ITEMS, PROMO_CODES } from './data/menu'
import { getCurrentUser, setCurrentUser } from './data/users'

// --- View Router State ---
// 'store' | 'admin' | 'staff'
const currentView = ref('store')

// Auth & Users
const currentUser = ref(getCurrentUser())
const isAuthModalOpen = ref(false)

// Menu & Orders
const categories = ref(CATEGORIES)
const menuItems = ref(MENU_ITEMS)
const placedOrders = ref([])

// Filters & Search
const activeCategory = ref('all')
const searchQuery = ref('')
const sortBy = ref('popular')
const spicyFilter = ref('all')
const activeTag = ref('all')

// Cart & Favorites
const favorites = ref([])
const cart = ref([])
const appliedPromo = ref(null)

// Modals
const selectedItemForDetail = ref(null)
const isDetailModalOpen = ref(false)
const isCartOpen = ref(false)
const isCheckoutOpen = ref(false)
const isOrderSuccessOpen = ref(false)
const isFavoritesOpen = ref(false)
const lastOrder = ref(null)

// Toast State
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

let toastTimeout = null
function triggerToast(message, type = 'success') {
  if (toastTimeout) clearTimeout(toastTimeout)
  toast.value = { show: true, message, type }
  toastTimeout = setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// LocalStorage Persistence
onMounted(() => {
  try {
    const savedFavorites = localStorage.getItem('pho_an_vat_favorites')
    if (savedFavorites) favorites.value = JSON.parse(savedFavorites)

    const savedCart = localStorage.getItem('pho_an_vat_cart')
    if (savedCart) cart.value = JSON.parse(savedCart)

    const savedOrders = localStorage.getItem('pho_an_vat_orders')
    if (savedOrders) placedOrders.value = JSON.parse(savedOrders)

    const savedMenu = localStorage.getItem('pho_an_vat_menu_custom')
    if (savedMenu) menuItems.value = JSON.parse(savedMenu)
  } catch (e) {
    console.error(e)
  }
})

watch(favorites, (newFav) => {
  localStorage.setItem('pho_an_vat_favorites', JSON.stringify(newFav))
}, { deep: true })

watch(cart, (newCart) => {
  localStorage.setItem('pho_an_vat_cart', JSON.stringify(newCart))
}, { deep: true })

watch(placedOrders, (newOrders) => {
  localStorage.setItem('pho_an_vat_orders', JSON.stringify(newOrders))
}, { deep: true })

watch(menuItems, (newMenu) => {
  localStorage.setItem('pho_an_vat_menu_custom', JSON.stringify(newMenu))
}, { deep: true })

// Helper: remove Vietnamese diacritics for search
function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
}

// --- Filtered and Sorted Menu ---
const filteredItems = computed(() => {
  let result = [...menuItems.value]

  // Category filter
  if (activeCategory.value !== 'all') {
    result = result.filter(item => item.category === activeCategory.value)
  }

  // Search filter
  if (searchQuery.value.trim()) {
    const q = removeVietnameseTones(searchQuery.value.trim())
    result = result.filter(item => {
      const name = removeVietnameseTones(item.name)
      const desc = removeVietnameseTones(item.description || '')
      return name.includes(q) || desc.includes(q)
    })
  }

  // Spicy filter
  if (spicyFilter.value !== 'all') {
    result = result.filter(item => item.spicyLevel === Number(spicyFilter.value))
  }

  // Tag filter
  if (activeTag.value !== 'all') {
    result = result.filter(item => {
      return item.badge === activeTag.value || item.tags?.includes(activeTag.value)
    })
  }

  // Sort
  if (sortBy.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'price-asc') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'popular') {
    result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0))
  }

  return result
})

// --- Cart Calculations ---
const cartCount = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0)
})

const subtotal = computed(() => {
  return cart.value.reduce((total, item) => {
    const price = item.calculatedPrice || item.price
    return total + price * item.quantity
  }, 0)
})

const shippingFee = computed(() => {
  if (cart.value.length === 0) return 0
  if (subtotal.value >= 150000) return 0
  if (appliedPromo.value?.code === 'FREESHIP') return 0
  return 18000
})

const discountAmount = computed(() => {
  if (!appliedPromo.value || subtotal.value === 0) return 0
  const promo = appliedPromo.value
  if (promo.code === 'PHOANVAT') {
    const disc = Math.round((subtotal.value * promo.discountPercent) / 100)
    return Math.min(disc, promo.maxDiscount)
  }
  if (promo.code === 'FREESHIP') {
    return 18000
  }
  if (promo.code === 'ANVATHOMNAY') {
    if (subtotal.value >= 100000) return promo.discountAmount
    return 0
  }
  return 0
})

const grandTotal = computed(() => {
  return Math.max(0, subtotal.value + shippingFee.value - discountAmount.value)
})

const favoriteItems = computed(() => {
  return menuItems.value.filter(item => favorites.value.includes(item.id))
})

// --- Auth Handlers ---
function handleAuthSuccess({ user, isNew }) {
  currentUser.value = user
  if (isNew) {
    triggerToast(`Đăng ký thành công tài khoản ${user.role === 'admin' ? 'Admin' : 'Nhân Viên'}! Xin chào ${user.fullName} 🎉`)
  } else {
    triggerToast(`Đăng nhập thành công! Chào mừng ${user.fullName} 👏`)
  }

  // Automatically switch view based on role
  if (user.role === 'admin') {
    currentView.value = 'admin'
  } else {
    currentView.value = 'staff'
  }
}

function handleLogout() {
  setCurrentUser(null)
  currentUser.value = null
  currentView.value = 'store'
  triggerToast('Đã đăng xuất an toàn khỏi hệ thống.')
}

// --- Cart Actions ---
function handleQuickAdd(item) {
  const existingIndex = cart.value.findIndex(
    c => c.id === item.id && (!c.selectedToppings || c.selectedToppings.length === 0) && (!c.customerNote)
  )

  if (existingIndex >= 0) {
    cart.value[existingIndex].quantity += 1
  } else {
    cart.value.push({
      ...item,
      quantity: 1,
      selectedToppings: [],
      selectedSpicy: item.spicyLevel === 0 ? 'Không cay' : 'Vừa',
      customerNote: '',
      calculatedPrice: item.price
    })
  }

  triggerToast(`Đã thêm "${item.name}" vào giỏ hàng!`)
}

function handleAddCustomToCart(customItem) {
  cart.value.push(customItem)
  triggerToast(`Đã thêm "${customItem.name}" vào giỏ hàng!`)
}

function handleUpdateQuantity({ index, delta }) {
  if (!cart.value[index]) return
  cart.value[index].quantity += delta
  if (cart.value[index].quantity <= 0) {
    cart.value.splice(index, 1)
  }
}

function handleRemoveCartItem(index) {
  cart.value.splice(index, 1)
  triggerToast('Đã xóa món khỏi giỏ hàng', 'error')
}

function toggleFavorite(itemId) {
  const index = favorites.value.indexOf(itemId)
  if (index >= 0) {
    favorites.value.splice(index, 1)
    triggerToast('Đã bỏ yêu thích món ăn')
  } else {
    favorites.value.push(itemId)
    triggerToast('Đã thêm vào danh sách yêu thích! ❤️')
  }
}

function applyPromo(code) {
  const upper = code.toUpperCase().trim()
  if (PROMO_CODES[upper]) {
    appliedPromo.value = PROMO_CODES[upper]
    triggerToast(`Đã áp dụng mã "${upper}" thành công! 🎉`)
  } else {
    triggerToast('Mã ưu đãi không hợp lệ!', 'error')
  }
}

function removePromo() {
  appliedPromo.value = null
  triggerToast('Đã hủy áp dụng mã ưu đãi')
}

function openDetailModal(item) {
  selectedItemForDetail.value = item
  isDetailModalOpen.value = true
}

function handleResetFilters() {
  sortBy.value = 'popular'
  spicyFilter.value = 'all'
  activeTag.value = 'all'
  searchQuery.value = ''
  activeCategory.value = 'all'
}

function handleConfirmOrder(payload) {
  const orderId = `#PHO-${Math.floor(1000 + Math.random() * 9000)}`
  const newOrder = {
    ...payload,
    orderId,
    status: 'pending',
    orderTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  lastOrder.value = newOrder
  placedOrders.value.unshift(newOrder)

  // Clear cart
  cart.value = []
  appliedPromo.value = null

  isCheckoutOpen.value = false
  isCartOpen.value = false
  isOrderSuccessOpen.value = true
}

// Menu Management Actions (from Admin)
function handleAddMenuItem(newItem) {
  menuItems.value.unshift(newItem)
}

function handleUpdateMenuItem(updatedItem) {
  const index = menuItems.value.findIndex(item => item.id === updatedItem.id)
  if (index >= 0) {
    menuItems.value[index] = { ...menuItems.value[index], ...updatedItem }
  }
}

function handleDeleteMenuItem(dishId) {
  menuItems.value = menuItems.value.filter(item => item.id !== dishId)
}
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans">
    <!-- VIEW 1: ADMIN DASHBOARD -->
    <AdminDashboard
      v-if="currentView === 'admin' && currentUser?.role === 'admin'"
      :current-user="currentUser"
      :menu-items="menuItems"
      :orders="placedOrders"
      @back-to-store="currentView = 'store'"
      @switch-to-staff="currentView = 'staff'"
      @logout="handleLogout"
      @add-menu-item="handleAddMenuItem"
      @update-menu-item="handleUpdateMenuItem"
      @delete-menu-item="handleDeleteMenuItem"
      @trigger-toast="triggerToast"
    />

    <!-- VIEW 2: STAFF KITCHEN DASHBOARD -->
    <StaffDashboard
      v-else-if="currentView === 'staff' && currentUser"
      :current-user="currentUser"
      :orders="placedOrders"
      :menu-items="menuItems"
      @back-to-store="currentView = 'store'"
      @switch-to-admin="currentView = 'admin'"
      @logout="handleLogout"
      @trigger-toast="triggerToast"
    />

    <!-- VIEW 3: MAIN STOREFRONT VIEW (For Customers / Browse) -->
    <div v-else class="min-h-screen flex flex-col bg-amber-50/40">
      <!-- Navbar -->
      <Navbar
        :cart-count="cartCount"
        :cart-total="subtotal"
        :favorites-count="favorites.length"
        :current-user="currentUser"
        v-model:search-query="searchQuery"
        @open-cart="isCartOpen = true"
        @open-favorites="isFavoritesOpen = true"
        @open-auth="isAuthModalOpen = true"
        @open-admin="currentView = 'admin'"
        @open-staff="currentView = 'staff'"
        @logout="handleLogout"
      />

      <!-- Hero Banner with Promo Vouchers -->
      <HeroBanner @apply-code="applyPromo" />

      <!-- Main Content Section -->
      <main class="flex-1">
        <!-- Category Pills Bar -->
        <CategoryBar
          :categories="categories"
          :active-category="activeCategory"
          @select-category="activeCategory = $event"
        />

        <!-- Filters & Sort Bar -->
        <FilterBar
          v-model:sort-by="sortBy"
          v-model:spicy-filter="spicyFilter"
          v-model:active-tag="activeTag"
          :total-results="filteredItems.length"
          @reset-filters="handleResetFilters"
        />

        <!-- Food Menu Grid -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Empty Results -->
          <div
            v-if="filteredItems.length === 0"
            class="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto space-y-4 my-8"
          >
            <div class="text-5xl">🔍</div>
            <h3 class="text-base font-bold text-slate-800">Không tìm thấy món ăn phù hợp</h3>
            <p class="text-xs text-slate-500">
              Hãy thử tìm với từ khóa khác hoặc đặt lại bộ lọc để khám phá các món ăn vặt đường phố hấp dẫn nhé!
            </p>
            <button
              @click="handleResetFilters"
              class="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Xem toàn bộ món ăn
            </button>
          </div>

          <!-- Products Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            <FoodCard
              v-for="item in filteredItems"
              :key="item.id"
              :item="item"
              :is-favorite="favorites.includes(item.id)"
              @open-detail="openDetailModal"
              @quick-add="handleQuickAdd"
              @toggle-favorite="toggleFavorite"
            />
          </div>
        </div>
      </main>

      <!-- Footer -->
      <Footer />

      <!-- Modals & Drawers -->
      <!-- Auth Modal (Login / Register for Admin & Staff) -->
      <AuthModal
        :is-open="isAuthModalOpen"
        @close="isAuthModalOpen = false"
        @auth-success="handleAuthSuccess"
      />

      <!-- Food Detail Modal -->
      <FoodDetailModal
        :item="selectedItemForDetail"
        :is-open="isDetailModalOpen"
        @close="isDetailModalOpen = false"
        @add-to-cart="handleAddCustomToCart"
      />

      <!-- Cart Drawer -->
      <CartDrawer
        :is-open="isCartOpen"
        :cart-items="cart"
        :subtotal="subtotal"
        :shipping-fee="shippingFee"
        :discount-amount="discountAmount"
        :applied-promo="appliedPromo"
        :grand-total="grandTotal"
        @close="isCartOpen = false"
        @update-quantity="handleUpdateQuantity"
        @remove-item="handleRemoveCartItem"
        @apply-promo="applyPromo"
        @remove-promo="removePromo"
        @open-checkout="isCheckoutOpen = true"
      />

      <!-- Checkout Modal -->
      <CheckoutModal
        :is-open="isCheckoutOpen"
        :cart-items="cart"
        :grand-total="grandTotal"
        @close="isCheckoutOpen = false"
        @confirm-order="handleConfirmOrder"
      />

      <!-- Order Success Modal with confetti & simulated tracker -->
      <OrderSuccessModal
        :is-open="isOrderSuccessOpen"
        :order-data="lastOrder"
        @close="isOrderSuccessOpen = false"
      />

      <!-- Favorites Modal -->
      <FavoritesModal
        :is-open="isFavoritesOpen"
        :favorites="favoriteItems"
        @close="isFavoritesOpen = false"
        @remove-favorite="toggleFavorite"
        @quick-add="handleQuickAdd"
        @open-detail="openDetailModal"
      />
    </div>

    <!-- Toast Notification (Always Visible Across Views) -->
    <Toast :show="toast.show" :message="toast.message" :type="toast.type" />
  </div>
</template>
