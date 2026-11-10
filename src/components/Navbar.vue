<script setup>
import { Search, Heart, ShoppingBag, PhoneCall, ShieldCheck, ChefHat, LogIn, LogOut, User } from 'lucide-vue-next'
import { formatVND } from '../utils/format'

defineProps({
  cartCount: {
    type: Number,
    default: 0
  },
  cartTotal: {
    type: Number,
    default: 0
  },
  favoritesCount: {
    type: Number,
    default: 0
  },
  searchQuery: {
    type: String,
    default: ''
  },
  currentUser: {
    type: Object,
    default: null
  }
})

defineEmits([
  'open-cart',
  'open-favorites',
  'open-auth',
  'open-admin',
  'open-staff',
  'logout',
  'update:searchQuery'
])
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20 gap-4">
        <!-- Logo -->
        <a href="#" class="flex items-center gap-3 group shrink-0">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
            <span class="text-2xl">🍢</span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent tracking-tight">
                PHỐ ĂN NHẸ
              </span>
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 rounded-full border border-amber-200 hidden sm:inline-block">
                Hot Trend
              </span>
            </div>
            <p class="text-xs text-slate-500 font-medium hidden sm:block">Thiên đường ăn vặt & thức uống đường phố</p>
          </div>
        </a>

        <!-- Search Bar -->
        <div class="flex-1 max-w-md hidden md:block">
          <div class="relative">
            <input
              type="text"
              :value="searchQuery"
              @input="$emit('update:searchQuery', $event.target.value)"
              placeholder="Tìm bánh tráng, xiên que, trà sữa, chân gà..."
              class="w-full pl-11 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm rounded-full border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-hidden text-slate-800 placeholder-slate-400"
            />
            <Search class="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              v-if="searchQuery"
              @click="$emit('update:searchQuery', '')"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Auth / Role Management Area -->
          <div v-if="!currentUser" class="flex items-center">
            <button
              @click="$emit('open-auth')"
              class="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <LogIn class="w-3.5 h-3.5 text-amber-400" />
              <span>Admin / Staff</span>
            </button>
          </div>

          <!-- Logged in controls -->
          <div v-else class="flex items-center gap-2">
            <!-- Admin Button -->
            <button
              v-if="currentUser.role === 'admin'"
              @click="$emit('open-admin')"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition shadow-xs cursor-pointer"
            >
              <ShieldCheck class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Quản Trị Admin</span>
              <span class="sm:hidden">Admin</span>
            </button>

            <!-- Staff Button -->
            <button
              @click="$emit('open-staff')"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <ChefHat class="w-3.5 h-3.5 text-amber-200" />
              <span class="hidden sm:inline">Bếp (Staff)</span>
              <span class="sm:hidden">Bếp</span>
            </button>

            <!-- User Pill -->
            <div class="hidden lg:flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-700">
              <span>{{ currentUser.avatar || '👤' }}</span>
              <span class="max-w-[100px] truncate">{{ currentUser.fullName }}</span>
            </div>

            <!-- Logout -->
            <button
              @click="$emit('logout')"
              class="p-2 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut class="w-4 h-4" />
            </button>
          </div>

          <!-- Favorites Button -->
          <button
            @click="$emit('open-favorites')"
            class="relative p-2.5 rounded-full hover:bg-amber-50 text-slate-600 hover:text-amber-600 transition cursor-pointer"
            title="Món yêu thích"
          >
            <Heart class="w-5 h-5" :class="{ 'fill-rose-500 text-rose-500': favoritesCount > 0 }" />
            <span
              v-if="favoritesCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse"
            >
              {{ favoritesCount }}
            </span>
          </button>

          <!-- Cart Button -->
          <button
            @click="$emit('open-cart')"
            class="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <div class="relative">
              <ShoppingBag class="w-5 h-5" />
              <span
                v-if="cartCount > 0"
                class="absolute -top-2 -right-2 bg-slate-900 text-amber-300 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white"
              >
                {{ cartCount }}
              </span>
            </div>
            <span class="hidden sm:inline">Giỏ hàng</span>
            <span v-if="cartTotal > 0" class="hidden md:inline font-bold border-l border-amber-400/40 pl-2.5">
              {{ formatVND(cartTotal) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Mobile Search Input -->
      <div class="pb-3 md:hidden">
        <div class="relative">
          <input
            type="text"
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            placeholder="Tìm món ăn vặt, trà, xiên que..."
            class="w-full pl-10 pr-4 py-2 bg-slate-100 text-xs rounded-full border border-slate-200 focus:outline-hidden focus:border-amber-500 text-slate-800"
          />
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  </header>
</template>
