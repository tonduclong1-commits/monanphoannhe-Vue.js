// Initial default demo accounts for Admin & Staff
export const INITIAL_USERS = [
  {
    id: 'usr_admin',
    code: 'NV001',
    email: 'admin@phoannhe.vn',
    password: 'admin123',
    fullName: 'Nguyễn Quản Trị (Admin)',
    role: 'admin',
    position: 'Chủ Quán / Quản Lý Điều Hành',
    department: 'Ban Quản Lý',
    shift: 'Toàn thời gian (09:00 - 22:00)',
    salary: 15000000,
    salaryType: 'monthly', // 'monthly' | 'hourly'
    phone: '0901 234 567',
    avatar: '👑',
    status: 'active', // 'active' | 'on_leave' | 'inactive'
    hoursWorked: 196,
    performanceRating: 5.0,
    joinedDate: '2025-11-01',
    notes: 'Quản lý toàn bộ chi nhánh và doanh thu quán'
  },
  {
    id: 'usr_staff_1',
    code: 'NV002',
    email: 'staff@phoannhe.vn',
    password: 'staff123',
    fullName: 'Trần Văn Bếp (Staff)',
    role: 'staff',
    position: 'Bếp Trưởng Món Chiên & Nướng',
    department: 'Khu Vực Bếp',
    shift: 'Ca Sáng (08:30 - 16:30)',
    salary: 8500000,
    salaryType: 'monthly',
    phone: '0912 345 678',
    avatar: '👨‍🍳',
    status: 'active',
    hoursWorked: 180,
    performanceRating: 4.9,
    joinedDate: '2026-01-15',
    notes: 'Chuyên gia nướng bánh tráng Đà Lạt và xóc cá viên chiên mắm'
  },
  {
    id: 'usr_staff_2',
    code: 'NV003',
    email: 'thungan@phoannhe.vn',
    password: 'staff123',
    fullName: 'Lê Thu Ngân (Staff)',
    role: 'staff',
    position: 'Thu Ngân & Kiểm Soát Đơn',
    department: 'Quầy Thu Ngân',
    shift: 'Ca Chiều - Tối (15:00 - 23:00)',
    salary: 7500000,
    salaryType: 'monthly',
    phone: '0933 445 566',
    avatar: '🧾',
    status: 'active',
    hoursWorked: 172,
    performanceRating: 4.8,
    joinedDate: '2026-02-01',
    notes: 'Tiếp nhận đơn online, quét mã VietQR và in hóa đơn'
  },
  {
    id: 'usr_staff_3',
    code: 'NV004',
    email: 'phache@phoannhe.vn',
    password: 'staff123',
    fullName: 'Hoàng Minh Trà',
    role: 'staff',
    position: 'Pha Chế Trà Sữa & Thức Uống',
    department: 'Quầy Nước',
    shift: 'Ca Tối (17:30 - 23:30)',
    salary: 32000,
    salaryType: 'hourly',
    phone: '0988 667 788',
    avatar: '🧋',
    status: 'active',
    hoursWorked: 125,
    performanceRating: 4.9,
    joinedDate: '2026-02-15',
    notes: 'Pha chế trà mãng cầu xiêm, trà đào cam sả và sữa tươi trân châu'
  },
  {
    id: 'usr_staff_4',
    code: 'NV005',
    email: 'shipper@phoannhe.vn',
    password: 'staff123',
    fullName: 'Đặng Tuấn Giao Hàng',
    role: 'staff',
    position: 'Tài Xế Giao Hàng Hỏa Tốc',
    department: 'Đội Giao Hàng',
    shift: 'Linh hoạt theo ca (10:00 - 22:00)',
    salary: 30000,
    salaryType: 'hourly',
    phone: '0944 556 677',
    avatar: '🛵',
    status: 'on_leave',
    hoursWorked: 98,
    performanceRating: 4.7,
    joinedDate: '2026-03-01',
    notes: 'Phụ trách giao hàng bán kính 5km, thông thạo đường phố'
  }
]

const STORAGE_USERS_KEY = 'pho_an_vat_users'
const STORAGE_CURRENT_USER_KEY = 'pho_an_vat_current_user'

export function getUsers() {
  try {
    const data = localStorage.getItem(STORAGE_USERS_KEY)
    if (data) {
      let parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        let needsSave = false

        // Schema migration check: enrich old records with missing fields
        const migrated = parsed.map((user, index) => {
          const matchInitial = INITIAL_USERS.find(i => i.id === user.id || i.email?.toLowerCase() === user.email?.toLowerCase())

          const enriched = {
            id: user.id || `usr_${Date.now()}_${index}`,
            code: user.code || matchInitial?.code || `NV00${index + 1}`,
            fullName: user.fullName || matchInitial?.fullName || 'Nhân Viên',
            email: user.email || matchInitial?.email || `nv${index}@phoannhe.vn`,
            password: user.password || matchInitial?.password || 'staff123',
            phone: user.phone || matchInitial?.phone || '0900 000 000',
            avatar: user.avatar || matchInitial?.avatar || (user.role === 'admin' ? '👑' : '👨‍🍳'),
            role: user.role || matchInitial?.role || 'staff',
            position: user.position || matchInitial?.position || (user.role === 'admin' ? 'Chủ Quán / Quản Lý Điều Hành' : user.fullName?.includes('Thu Ngân') ? 'Thu Ngân & Kiểm Soát Đơn' : 'Bếp Trưởng Món Chiên & Nướng'),
            department: user.department || matchInitial?.department || (user.role === 'admin' ? 'Ban Quản Lý' : user.fullName?.includes('Thu Ngân') ? 'Quầy Thu Ngân' : 'Khu Vực Bếp'),
            shift: user.shift || matchInitial?.shift || (user.role === 'admin' ? 'Toàn thời gian (09:00 - 22:00)' : 'Ca Sáng (08:30 - 16:30)'),
            salary: typeof user.salary === 'number' ? user.salary : (matchInitial?.salary || (user.role === 'admin' ? 15000000 : 7500000)),
            salaryType: user.salaryType || matchInitial?.salaryType || 'monthly',
            status: user.status || matchInitial?.status || 'active',
            hoursWorked: typeof user.hoursWorked === 'number' ? user.hoursWorked : (matchInitial?.hoursWorked || 160),
            performanceRating: typeof user.performanceRating === 'number' ? user.performanceRating : (matchInitial?.performanceRating || 4.9),
            joinedDate: user.joinedDate || user.createdAt || '2026-01-01',
            notes: user.notes || matchInitial?.notes || ''
          }

          if (
            !user.department ||
            !user.status ||
            typeof user.salary !== 'number' ||
            !user.code ||
            !user.position
          ) {
            needsSave = true
          }

          return enriched
        })

        // Also merge any new default staff from INITIAL_USERS if missing
        for (const initUser of INITIAL_USERS) {
          if (!migrated.some(u => u.email?.toLowerCase() === initUser.email?.toLowerCase())) {
            migrated.push(initUser)
            needsSave = true
          }
        }

        if (needsSave) {
          localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(migrated))
        }
        return migrated
      }
    }
  } catch (e) {
    console.error(e)
  }
  // Initialize with default users
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS))
  return INITIAL_USERS
}

export function resetUsersToDefault() {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS))
  return [...INITIAL_USERS]
}

export function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser() {
  try {
    const data = localStorage.getItem(STORAGE_CURRENT_USER_KEY)
    if (data) return JSON.parse(data)
  } catch (e) {
    console.error(e)
  }
  return null
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY)
  }
}

export function authenticate(email, password) {
  const users = getUsers()
  const found = users.find(
    u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  )
  if (found) {
    if (found.status === 'inactive') {
      return { success: false, message: 'Tài khoản nhân viên này hiện đang bị tạm khóa!' }
    }
    const { password: _, ...safeUser } = found
    setCurrentUser(safeUser)
    return { success: true, user: safeUser }
  }
  return { success: false, message: 'Email hoặc mật khẩu không chính xác' }
}

export function registerUser({ email, password, fullName, role = 'staff', phone = '' }) {
  const users = getUsers()
  const exists = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())
  if (exists) {
    return { success: false, message: 'Email này đã tồn tại trong hệ thống!' }
  }

  const nextCode = `NV00${users.length + 1}`
  const newUser = {
    id: `usr_${Date.now()}`,
    code: nextCode,
    email: email.trim().toLowerCase(),
    password,
    fullName: fullName.trim(),
    role: role === 'admin' ? 'admin' : 'staff',
    position: role === 'admin' ? 'Quản Trị Viên' : 'Nhân Viên Mới',
    department: role === 'admin' ? 'Ban Quản Lý' : 'Khu Vực Phục Vụ',
    shift: 'Ca Linh hoạt (09:00 - 17:00)',
    salary: 7000000,
    salaryType: 'monthly',
    phone: phone.trim(),
    avatar: role === 'admin' ? '👑' : '👨‍🍳',
    status: 'active',
    hoursWorked: 0,
    performanceRating: 5.0,
    joinedDate: new Date().toISOString().split('T')[0],
    notes: 'Tài khoản nhân viên đăng ký qua hệ thống'
  }

  users.push(newUser)
  saveUsers(users)

  const { password: _, ...safeUser } = newUser
  setCurrentUser(safeUser)
  return { success: true, user: safeUser }
}
