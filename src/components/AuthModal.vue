<script setup>
import { ref } from 'vue'
import { X, Lock, Mail, User, Phone, ShieldCheck, Eye, EyeOff, Sparkles, UserCheck, ChefHat } from 'lucide-vue-next'
import { authenticate, registerUser } from '../data/users'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  initialTab: {
    type: String,
    default: 'login' // 'login' | 'register'
  }
})

const emit = defineEmits(['close', 'auth-success'])

const activeTab = ref(props.initialTab || 'login')
const showPassword = ref(false)

// Form states
const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref('')

const regFullName = ref('')
const regEmail = ref('')
const regPhone = ref('')
const regPassword = ref('')
const regRole = ref('staff') // 'admin' | 'staff'
const regError = ref('')

function handleQuickFill(role) {
  activeTab.value = 'login'
  loginError.value = ''
  if (role === 'admin') {
    loginEmail.value = 'admin@phoannhe.vn'
    loginPassword.value = 'admin123'
  } else {
    loginEmail.value = 'staff@phoannhe.vn'
    loginPassword.value = 'staff123'
  }
  handleLogin()
}

function handleLogin() {
  loginError.value = ''
  if (!loginEmail.value.trim() || !loginPassword.value) {
    loginError.value = 'Vui lòng điền đầy đủ Email và Mật khẩu!'
    return
  }

  const result = authenticate(loginEmail.value, loginPassword.value)
  if (result.success) {
    emit('auth-success', { user: result.user, isNew: false })
    emit('close')
  } else {
    loginError.value = result.message || 'Email hoặc mật khẩu không chính xác'
  }
}

function handleRegister() {
  regError.value = ''
  if (!regFullName.value.trim()) {
    regError.value = 'Vui lòng nhập họ và tên'
    return
  }
  if (!regEmail.value.trim() || !regEmail.value.includes('@')) {
    regError.value = 'Vui lòng nhập email hợp lệ'
    return
  }
  if (!regPassword.value || regPassword.value.length < 6) {
    regError.value = 'Mật khẩu phải từ 6 ký tự trở lên'
    return
  }

  const result = registerUser({
    fullName: regFullName.value,
    email: regEmail.value,
    phone: regPhone.value,
    password: regPassword.value,
    role: regRole.value
  })

  if (result.success) {
    emit('auth-success', { user: result.user, isNew: true })
    emit('close')
  } else {
    regError.value = result.message
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
    <!-- Backdrop -->
    <div @click="$emit('close')" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"></div>

    <div class="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
      >
        <X class="w-4 h-4" />
      </button>

      <!-- Header with Tabs -->
      <div class="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white p-6 pt-7 text-center">
        <div class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-inner mb-3">
          🍢
        </div>
        <h3 class="text-xl font-black">Hệ Thống Phố Ăn Nhẹ</h3>
        <p class="text-xs text-amber-100 mt-1">Cổng đăng nhập & đăng ký cho Admin và Nhân Viên</p>

        <!-- Tabs -->
        <div class="flex bg-black/20 p-1 rounded-2xl mt-5">
          <button
            type="button"
            @click="activeTab = 'login'"
            class="flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer"
            :class="activeTab === 'login' ? 'bg-white text-slate-900 shadow-md' : 'text-amber-100 hover:text-white'"
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            @click="activeTab = 'register'"
            class="flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer"
            :class="activeTab === 'register' ? 'bg-white text-slate-900 shadow-md' : 'text-amber-100 hover:text-white'"
          >
            Đăng Ký Mới
          </button>
        </div>
      </div>

      <div class="p-6">
        <!-- Quick Fill Buttons for testing -->
        <div class="mb-5 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3">
          <div class="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
            <Sparkles class="w-3.5 h-3.5 text-amber-600" />
            <span>Đăng nhập thử nghiệm 1-chạm:</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="handleQuickFill('admin')"
              class="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-xs transition cursor-pointer"
            >
              <ShieldCheck class="w-3.5 h-3.5" />
              <span>Tài khoản Admin</span>
            </button>
            <button
              type="button"
              @click="handleQuickFill('staff')"
              class="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold shadow-xs transition cursor-pointer"
            >
              <ChefHat class="w-3.5 h-3.5" />
              <span>Tài khoản Staff</span>
            </button>
          </div>
        </div>

        <!-- TAB 1: LOGIN -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
          <div v-if="loginError" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
            {{ loginError }}
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email đăng nhập
            </label>
            <div class="relative">
              <input
                v-model="loginEmail"
                type="email"
                placeholder="admin@phoannhe.vn hoặc staff@phoannhe.vn"
                class="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-hidden"
              />
              <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mật khẩu
            </label>
            <div class="relative">
              <input
                v-model="loginPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Nhập mật khẩu..."
                class="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-hidden"
              />
              <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
            <div class="mt-1 text-right text-[11px] text-slate-400">
              Mật khẩu mặc định: <code class="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">admin123</code> / <code class="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">staff123</code>
            </div>
          </div>

          <button
            type="submit"
            class="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 active:scale-98 transition cursor-pointer"
          >
            Đăng Nhập Ngay
          </button>
        </form>

        <!-- TAB 2: REGISTER -->
        <form v-else @submit.prevent="handleRegister" class="space-y-3.5">
          <div v-if="regError" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
            {{ regError }}
          </div>

          <!-- Choose Role (Admin vs Staff) -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Vai trò tài khoản *
            </label>
            <div class="grid grid-cols-2 gap-2">
              <label
                class="flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition select-none"
                :class="regRole === 'admin' ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20' : 'bg-slate-50 border-slate-200 text-slate-600'"
              >
                <input type="radio" value="admin" v-model="regRole" class="hidden" />
                <ShieldCheck class="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <div class="text-xs font-bold">Admin</div>
                  <div class="text-[10px] text-slate-500">Quản trị toàn bộ</div>
                </div>
              </label>

              <label
                class="flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition select-none"
                :class="regRole === 'staff' ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20' : 'bg-slate-50 border-slate-200 text-slate-600'"
              >
                <input type="radio" value="staff" v-model="regRole" class="hidden" />
                <ChefHat class="w-5 h-5 text-orange-600 shrink-0" />
                <div>
                  <div class="text-xs font-bold">Nhân Viên (Staff)</div>
                  <div class="text-[10px] text-slate-500">Bếp & Thu ngân</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Full Name -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Họ và tên *
            </label>
            <div class="relative">
              <input
                v-model="regFullName"
                type="text"
                placeholder="Ví dụ: Nguyễn Văn Hoàng"
                class="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-hidden"
              />
              <User class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email công việc *
            </label>
            <div class="relative">
              <input
                v-model="regEmail"
                type="email"
                placeholder="hoangnv@phoannhe.vn"
                class="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-hidden"
              />
              <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Số điện thoại
            </label>
            <div class="relative">
              <input
                v-model="regPhone"
                type="tel"
                placeholder="0988 777 666"
                class="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-hidden"
              />
              <Phone class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mật khẩu (ít nhất 6 ký tự) *
            </label>
            <div class="relative">
              <input
                v-model="regPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Nhập mật khẩu..."
                class="w-full pl-10 pr-10 py-2 text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-hidden"
              />
              <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 active:scale-98 transition cursor-pointer mt-2"
          >
            Đăng Ký Tài Khoản {{ regRole === 'admin' ? 'Admin' : 'Nhân Viên' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
