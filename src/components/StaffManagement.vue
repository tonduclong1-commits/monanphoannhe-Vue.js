<script setup>
import { ref, computed } from 'vue'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  Clock,
  DollarSign,
  Star,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Edit2,
  Trash2,
  Key,
  ShieldCheck,
  ChefHat,
  X,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  RotateCcw
} from 'lucide-vue-next'
import { formatVND } from '../utils/format'
import { getUsers, saveUsers, resetUsersToDefault } from '../data/users'

const props = defineProps({
  currentUser: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['trigger-toast'])

// Staff list loaded from storage
const staffList = ref(getUsers())

// View mode: 'cards' | 'table'
const viewMode = ref('cards')

// Filters
const searchQuery = ref('')
const selectedDepartment = ref('all')
const selectedStatus = ref('all')

// Add / Edit Modal
const isModalOpen = ref(false)
const editingStaff = ref(null)
const staffForm = ref({
  code: '',
  fullName: '',
  email: '',
  password: '',
  phone: '',
  role: 'staff', // 'admin' | 'staff'
  position: 'Nhân viên bếp',
  department: 'Khu Vực Bếp',
  shift: 'Ca Sáng (08:30 - 16:30)',
  salary: 7500000,
  salaryType: 'monthly',
  avatar: '👨‍🍳',
  status: 'active',
  notes: ''
})

// Reset Password Modal
const isResetPassModalOpen = ref(false)
const staffForReset = ref(null)
const newPasswordInput = ref('')

// Departments list
const departments = [
  'Tất cả',
  'Ban Quản Lý',
  'Khu Vực Bếp',
  'Quầy Thu Ngân',
  'Quầy Nước',
  'Đội Giao Hàng'
]

// KPI Statistics
const totalStaff = computed(() => staffList.value.length)
const activeStaff = computed(() => staffList.value.filter(s => s.status === 'active').length)
const onLeaveStaff = computed(() => staffList.value.filter(s => s.status === 'on_leave').length)
const totalEstimatedSalary = computed(() => {
  return staffList.value.reduce((total, s) => {
    if (s.salaryType === 'monthly') return total + (s.salary || 0)
    return total + ((s.salary || 0) * (s.hoursWorked || 160))
  }, 0)
})

// Filtered Staff
const filteredStaff = computed(() => {
  let list = [...staffList.value]

  // Search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(s =>
      s.fullName?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.phone?.includes(q) ||
      s.code?.toLowerCase().includes(q) ||
      s.position?.toLowerCase().includes(q)
    )
  }

  // Department
  if (selectedDepartment.value !== 'all' && selectedDepartment.value !== 'Tất cả') {
    list = list.filter(s => s.department === selectedDepartment.value)
  }

  // Status
  if (selectedStatus.value !== 'all') {
    list = list.filter(s => s.status === selectedStatus.value)
  }

  return list
})

function openAddModal() {
  editingStaff.value = null
  const nextNum = staffList.value.length + 1
  staffForm.value = {
    code: `NV00${nextNum}`,
    fullName: '',
    email: '',
    password: 'staff123',
    phone: '',
    role: 'staff',
    position: 'Nhân viên chế biến',
    department: 'Khu Vực Bếp',
    shift: 'Ca Sáng (08:30 - 16:30)',
    salary: 7500000,
    salaryType: 'monthly',
    avatar: '👨‍🍳',
    status: 'active',
    notes: ''
  }
  isModalOpen.value = true
}

function openEditModal(staff) {
  editingStaff.value = staff
  staffForm.value = { ...staff }
  isModalOpen.value = true
}

function saveStaff() {
  if (!staffForm.value.fullName.trim()) {
    emit('trigger-toast', 'Vui lòng nhập họ và tên nhân viên', 'error')
    return
  }
  if (!staffForm.value.email.trim() || !staffForm.value.email.includes('@')) {
    emit('trigger-toast', 'Email nhân viên không hợp lệ', 'error')
    return
  }

  if (editingStaff.value) {
    // Update
    const idx = staffList.value.findIndex(s => s.id === editingStaff.value.id)
    if (idx >= 0) {
      staffList.value[idx] = {
        ...staffList.value[idx],
        ...staffForm.value
      }
      saveUsers(staffList.value)
      emit('trigger-toast', `Đã cập nhật hồ sơ nhân viên "${staffForm.value.fullName}"!`)
    }
  } else {
    // Add new
    const exists = staffList.value.some(s => s.email.toLowerCase() === staffForm.value.email.toLowerCase())
    if (exists) {
      emit('trigger-toast', 'Email này đã tồn tại trong hệ thống!', 'error')
      return
    }

    const newStaff = {
      id: `usr_${Date.now()}`,
      ...staffForm.value,
      joinedDate: new Date().toISOString().split('T')[0],
      hoursWorked: 0,
      performanceRating: 5.0
    }

    staffList.value.unshift(newStaff)
    saveUsers(staffList.value)
    emit('trigger-toast', `Đã thêm nhân viên "${newStaff.fullName}" thành công! 🎉`)
  }

  isModalOpen.value = false
}

function toggleStaffStatus(staff) {
  const nextStatus = staff.status === 'active' ? 'on_leave' : staff.status === 'on_leave' ? 'inactive' : 'active'
  staff.status = nextStatus
  saveUsers(staffList.value)
  const statusLabels = {
    active: 'Đang làm việc',
    on_leave: 'Đang nghỉ phép',
    inactive: 'Đã tạm khóa tài khoản'
  }
  emit('trigger-toast', `Đã chuyển "${staff.fullName}" sang: ${statusLabels[nextStatus]}`)
}

function openResetPassword(staff) {
  staffForReset.value = staff
  newPasswordInput.value = '123456'
  isResetPassModalOpen.value = true
}

function confirmResetPassword() {
  if (!newPasswordInput.value || newPasswordInput.value.length < 6) {
    emit('trigger-toast', 'Mật khẩu phải từ 6 ký tự trở lên', 'error')
    return
  }
  if (staffForReset.value) {
    const s = staffList.value.find(item => item.id === staffForReset.value.id)
    if (s) {
      s.password = newPasswordInput.value
      saveUsers(staffList.value)
      emit('trigger-toast', `Đã đặt lại mật khẩu cho "${s.fullName}" thành công!`)
    }
  }
  isResetPassModalOpen.value = false
}

function deleteStaff(staff) {
  if (staff.id === props.currentUser.id) {
    emit('trigger-toast', 'Không thể xóa tài khoản của chính bạn!', 'error')
    return
  }
  if (confirm(`Bạn có chắc chắn muốn xóa nhân viên "${staff.fullName}" (${staff.code})?`)) {
    staffList.value = staffList.value.filter(s => s.id !== staff.id)
    saveUsers(staffList.value)
    emit('trigger-toast', `Đã xóa nhân viên "${staff.fullName}"`, 'error')
  }
}

function handleResetDefaults() {
  if (confirm('Khôi phục danh sách đầy đủ 5 nhân viên mẫu ban đầu?')) {
    staffList.value = resetUsersToDefault()
    selectedDepartment.value = 'all'
    selectedStatus.value = 'all'
    searchQuery.value = ''
    emit('trigger-toast', 'Đã khôi phục dữ liệu 5 nhân viên mẫu thành công!')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Top Statistics / KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Nhân Sự</span>
          <div class="text-2xl font-black text-slate-900">{{ totalStaff }} người</div>
          <span class="text-[11px] text-slate-400">Đầy đủ hồ sơ lưu trữ</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <Users class="w-6 h-6" />
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đang Trực Ca</span>
          <div class="text-2xl font-black text-emerald-600">{{ activeStaff }} nhân viên</div>
          <span class="text-[11px] text-emerald-600 font-semibold">● Sẵn sàng phục vụ khách</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <CheckCircle2 class="w-6 h-6" />
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đang Nghỉ Phép</span>
          <div class="text-2xl font-black text-orange-600">{{ onLeaveStaff }} người</div>
          <span class="text-[11px] text-orange-600 font-semibold">Nghỉ đổi ca / off tuần</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
          <Clock class="w-6 h-6" />
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quỹ Lương Tháng</span>
          <div class="text-2xl font-black text-indigo-600">{{ formatVND(totalEstimatedSalary) }}</div>
          <span class="text-[11px] text-indigo-600 font-semibold">Ước tính toàn bộ nhân sự</span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
          <DollarSign class="w-6 h-6" />
        </div>
      </div>
    </div>

    <!-- Filter & Action Bar -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <!-- Search input -->
        <div class="relative flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm theo tên, mã NV, số điện thoại, chức vụ..."
            class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-hidden"
          />
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- View mode toggle (Cards / Table) -->
          <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-slate-600">
            <button
              @click="viewMode = 'cards'"
              class="p-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
              :class="viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'"
              title="Xem dạng thẻ"
            >
              <LayoutGrid class="w-4 h-4" />
            </button>
            <button
              @click="viewMode = 'table'"
              class="p-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
              :class="viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'"
              title="Xem bảng chi tiết"
            >
              <TableIcon class="w-4 h-4" />
            </button>
          </div>

          <!-- Reset default demo staff -->
          <button
            @click="handleResetDefaults"
            class="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer border border-slate-200"
            title="Khôi phục dữ liệu 5 nhân viên mẫu ban đầu"
          >
            <RotateCcw class="w-3.5 h-3.5 text-slate-500" />
            <span class="hidden sm:inline">Khôi phục mẫu</span>
          </button>

          <!-- Add Button -->
          <button
            @click="openAddModal"
            class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-98 transition cursor-pointer"
          >
            <UserPlus class="w-4 h-4" />
            <span>Thêm Nhân Viên Mới</span>
          </button>
        </div>
      </div>

      <!-- Department Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
        <span class="text-xs font-bold text-slate-400 shrink-0">Bộ phận:</span>
        <button
          v-for="dept in departments"
          :key="dept"
          @click="selectedDepartment = dept"
          class="px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap"
          :class="selectedDepartment === dept || (selectedDepartment === 'all' && dept === 'Tất cả')
            ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'"
        >
          {{ dept }}
        </button>

        <div class="h-4 w-px bg-slate-200 mx-1 shrink-0"></div>

        <!-- Status Filter -->
        <select
          v-model="selectedStatus"
          class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 focus:outline-hidden cursor-pointer"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang làm việc</option>
          <option value="on_leave">Đang nghỉ phép</option>
          <option value="inactive">Đã tạm khóa</option>
        </select>
      </div>
    </div>

    <!-- VIEW 1: CARD VIEW -->
    <div v-if="viewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="staff in filteredStaff"
        :key="staff.id"
        class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
      >
        <div>
          <!-- Header: Code, Role badge, Status badge -->
          <div class="flex items-start justify-between gap-2 mb-3">
            <div class="flex items-center gap-2">
              <span class="text-3xl p-2 rounded-2xl bg-amber-50 border border-amber-100 shrink-0">
                {{ staff.avatar || '👨‍🍳' }}
              </span>
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="font-mono text-xs font-black text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                    {{ staff.code || 'NV' }}
                  </span>
                  <span
                    class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
                    :class="staff.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-orange-100 text-orange-800 border border-orange-200'"
                  >
                    {{ staff.role === 'admin' ? 'Admin' : 'Staff' }}
                  </span>
                </div>
                <h3 class="font-bold text-slate-900 text-sm mt-1 line-clamp-1">{{ staff.fullName }}</h3>
              </div>
            </div>

            <!-- Status Badge clickable to toggle -->
            <button
              @click="toggleStaffStatus(staff)"
              class="px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition flex items-center gap-1"
              :class="staff.status === 'active'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : staff.status === 'on_leave'
                ? 'bg-orange-100 text-orange-800 border border-orange-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'"
              title="Nhấn để đổi trạng thái"
            >
              <span class="w-2 h-2 rounded-full" :class="staff.status === 'active' ? 'bg-emerald-500' : staff.status === 'on_leave' ? 'bg-orange-500' : 'bg-rose-500'"></span>
              <span>{{ staff.status === 'active' ? 'Đang làm' : staff.status === 'on_leave' ? 'Nghỉ phép' : 'Tạm khóa' }}</span>
            </button>
          </div>

          <!-- Position & Department -->
          <div class="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-1.5 text-xs text-slate-600 mb-3">
            <div class="flex justify-between">
              <span class="text-slate-400">Vị trí:</span>
              <strong class="text-slate-800 font-bold">{{ staff.position }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Bộ phận:</span>
              <span class="font-medium text-slate-700">{{ staff.department }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Ca làm việc:</span>
              <span class="font-medium text-slate-700">{{ staff.shift }}</span>
            </div>
            <div class="flex justify-between border-t border-slate-200/60 pt-1.5">
              <span class="text-slate-400">Mức lương:</span>
              <strong class="text-emerald-700 font-black">
                {{ formatVND(staff.salary) }} {{ staff.salaryType === 'hourly' ? '/ giờ' : '/ tháng' }}
              </strong>
            </div>
          </div>

          <!-- Contact details -->
          <div class="space-y-1 text-xs text-slate-500 px-1">
            <div class="flex items-center gap-2">
              <Phone class="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{{ staff.phone || 'Chưa cập nhật SĐT' }}</span>
            </div>
            <div class="flex items-center gap-2 truncate">
              <Mail class="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span class="truncate">{{ staff.email }}</span>
            </div>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div class="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
            <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{{ staff.performanceRating || 5.0 }}</span>
            <span class="text-slate-400 font-normal">({{ staff.hoursWorked || 0 }}h)</span>
          </div>

          <div class="flex items-center gap-1.5">
            <button
              @click="openResetPassword(staff)"
              class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              title="Đổi / Cấp lại mật khẩu"
            >
              <Key class="w-3.5 h-3.5" />
            </button>
            <button
              @click="openEditModal(staff)"
              class="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition cursor-pointer"
              title="Chỉnh sửa hồ sơ"
            >
              <Edit2 class="w-3.5 h-3.5" />
            </button>
            <button
              v-if="staff.id !== currentUser.id"
              @click="deleteStaff(staff)"
              class="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
              title="Xóa nhân viên"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW 2: TABLE VIEW -->
    <div v-else class="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th class="p-3.5">Mã & Nhân Viên</th>
              <th class="p-3.5">Bộ Phận & Vị Trí</th>
              <th class="p-3.5">Ca Trực</th>
              <th class="p-3.5">Mức Lương</th>
              <th class="p-3.5">Liên Hệ</th>
              <th class="p-3.5">Trạng Thái</th>
              <th class="p-3.5 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="staff in filteredStaff" :key="staff.id" class="hover:bg-slate-50/80 transition">
              <td class="p-3.5 flex items-center gap-3">
                <span class="text-2xl p-1.5 rounded-xl bg-slate-100 shrink-0">{{ staff.avatar || '👨‍🍳' }}</span>
                <div>
                  <div class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{{ staff.fullName }}</span>
                    <span
                      class="px-1.5 py-0.2 rounded text-[9px] font-black uppercase"
                      :class="staff.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'"
                    >
                      {{ staff.role }}
                    </span>
                  </div>
                  <span class="font-mono text-[11px] text-amber-700 font-bold">{{ staff.code }}</span>
                </div>
              </td>
              <td class="p-3.5">
                <div class="font-bold text-slate-800">{{ staff.position }}</div>
                <div class="text-[11px] text-slate-500">{{ staff.department }}</div>
              </td>
              <td class="p-3.5 text-slate-600 font-medium">{{ staff.shift }}</td>
              <td class="p-3.5">
                <span class="font-bold text-emerald-700">{{ formatVND(staff.salary) }}</span>
                <span class="text-[10px] text-slate-400 block">{{ staff.salaryType === 'hourly' ? '/ giờ' : '/ tháng' }}</span>
              </td>
              <td class="p-3.5">
                <div class="text-slate-800 font-medium">{{ staff.phone }}</div>
                <div class="text-[11px] text-slate-400">{{ staff.email }}</div>
              </td>
              <td class="p-3.5">
                <button
                  @click="toggleStaffStatus(staff)"
                  class="px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition"
                  :class="staff.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : staff.status === 'on_leave'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-rose-100 text-rose-800'"
                >
                  {{ staff.status === 'active' ? 'Đang làm' : staff.status === 'on_leave' ? 'Nghỉ phép' : 'Tạm khóa' }}
                </button>
              </td>
              <td class="p-3.5 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    @click="openResetPassword(staff)"
                    class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                    title="Đổi mật khẩu"
                  >
                    <Key class="w-3.5 h-3.5" />
                  </button>
                  <button
                    @click="openEditModal(staff)"
                    class="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition cursor-pointer"
                    title="Sửa hồ sơ"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>
                  <button
                    v-if="staff.id !== currentUser.id"
                    @click="deleteStaff(staff)"
                    class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                    title="Xóa nhân viên"
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

    <!-- Empty State -->
    <div
      v-if="filteredStaff.length === 0"
      class="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3"
    >
      <div class="text-4xl">🔍</div>
      <h4 class="font-bold text-slate-800">Không tìm thấy nhân viên nào</h4>
      <p class="text-xs text-slate-500">Hãy thử đổi từ khóa tìm kiếm hoặc lọc theo bộ phận khác.</p>
    </div>

    <!-- Modal: Add / Edit Staff -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div @click="isModalOpen = false" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"></div>

      <div class="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10 p-6 space-y-4 my-6 max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Users class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">
                {{ editingStaff ? 'Chỉnh Sửa Hồ Sơ Nhân Viên' : 'Thêm Nhân Viên Mới' }}
              </h3>
              <p class="text-[11px] text-slate-500">Hệ thống phân quyền & quản lý nhân sự</p>
            </div>
          </div>
          <button @click="isModalOpen = false" class="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="saveStaff" class="overflow-y-auto space-y-3.5 text-xs flex-1 pr-1">
          <!-- Code & Avatar Emoji -->
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Mã nhân viên *</label>
              <input
                v-model="staffForm.code"
                type="text"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-amber-700 focus:outline-hidden focus:border-amber-500"
              />
            </div>
            <div class="col-span-2">
              <label class="block font-bold text-slate-700 mb-1">Biểu tượng / Avatar</label>
              <select
                v-model="staffForm.avatar"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-amber-500 cursor-pointer"
              >
                <option value="👨‍🍳">👨‍🍳 Bếp trưởng / Đầu bếp</option>
                <option value="🧾">🧾 Thu ngân / Kế toán</option>
                <option value="🧋">🧋 Pha chế đồ uống</option>
                <option value="🛵">🛵 Shipper giao hàng</option>
                <option value="👑">👑 Quản trị viên / Chủ quán</option>
                <option value="👩‍🍳">👩‍🍳 Nữ phụ bếp</option>
              </select>
            </div>
          </div>

          <!-- Full name -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Họ và tên nhân viên *</label>
            <input
              v-model="staffForm.fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          <!-- Email & Password -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Email đăng nhập *</label>
              <input
                v-model="staffForm.email"
                type="email"
                placeholder="nhanvien@phoannhe.vn"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Mật khẩu *</label>
              <input
                v-model="staffForm.password"
                type="text"
                placeholder="staff123"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <!-- Phone & Role -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Số điện thoại</label>
              <input
                v-model="staffForm.phone"
                type="tel"
                placeholder="0988 123 456"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Vai trò hệ thống</label>
              <select
                v-model="staffForm.role"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-amber-500 cursor-pointer"
              >
                <option value="staff">Nhân viên (Staff / Bếp)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>
          </div>

          <!-- Department & Position -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Bộ phận làm việc</label>
              <select
                v-model="staffForm.department"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-amber-500 cursor-pointer"
              >
                <option value="Khu Vực Bếp">Khu Vực Bếp</option>
                <option value="Quầy Thu Ngân">Quầy Thu Ngân</option>
                <option value="Quầy Nước">Quầy Nước</option>
                <option value="Đội Giao Hàng">Đội Giao Hàng</option>
                <option value="Ban Quản Lý">Ban Quản Lý</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Chức danh / Vị trí</label>
              <input
                v-model="staffForm.position"
                type="text"
                placeholder="Ví dụ: Bếp chính nướng"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          <!-- Shift & Salary -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Ca làm việc</label>
              <select
                v-model="staffForm.shift"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-amber-500 cursor-pointer"
              >
                <option value="Ca Sáng (08:30 - 16:30)">Ca Sáng (08:30 - 16:30)</option>
                <option value="Ca Chiều - Tối (15:00 - 23:00)">Ca Chiều - Tối (15:00 - 23:00)</option>
                <option value="Ca Tối (17:30 - 23:30)">Ca Tối (17:30 - 23:30)</option>
                <option value="Toàn thời gian (09:00 - 22:00)">Toàn thời gian</option>
                <option value="Linh hoạt theo giờ">Linh hoạt theo giờ</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Mức lương (VNĐ)</label>
              <input
                v-model.number="staffForm.salary"
                type="number"
                step="1000"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Ghi chú & Kỹ năng</label>
            <input
              v-model="staffForm.notes"
              type="text"
              placeholder="Kinh nghiệm, thế mạnh món ăn..."
              class="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:outline-hidden"
            />
          </div>
        </form>

        <!-- Footer -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            @click="isModalOpen = false"
            class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            @click="saveStaff"
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs shadow-md shadow-orange-500/20 cursor-pointer"
          >
            Lưu Nhân Viên
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Reset Password -->
    <div v-if="isResetPassModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div @click="isResetPassModalOpen = false" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"></div>

      <div class="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-5 z-10 space-y-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Key class="w-4 h-4" />
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-sm">Cấp Lại Mật Khẩu</h4>
            <p class="text-[11px] text-slate-500">{{ staffForReset?.fullName }} ({{ staffForReset?.code }})</p>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới (tối thiểu 6 ký tự)</label>
          <input
            v-model="newPasswordInput"
            type="text"
            class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold focus:bg-white focus:border-amber-500 focus:outline-hidden"
          />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            @click="isResetPassModalOpen = false"
            class="px-3.5 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
          >
            Hủy
          </button>
          <button
            @click="confirmResetPassword"
            class="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer"
          >
            Xác Nhận
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
