# 🍢 Phố Ăn Nhẹ & Ăn Vặt (monanphoannhe-Vue.js)

Ứng dụng web đặt món ăn vặt & món ăn nhẹ đường phố (Street Food & Snacks Delivery) được phát triển bằng **Vue 3**, **Vite**, **Tailwind CSS v4** và **Lucide Icons**.

---

## 🔐 Hệ Thống Phân Quyền: Admin & Staff (Nhân Viên Bếp)

Hệ thống đã tích hợp đầy đủ tính năng **Đăng Nhập Thành Công** & **Đăng Ký Thành Công** với 2 vai trò:

### 1. Tài khoản thử nghiệm có sẵn (1-Chạm đăng nhập)
- **Tài khoản Admin (Quản trị viên)**:
  - Email: `admin@phoannhe.vn`
  - Mật khẩu: `admin123`
  - Quyền hạn: Xem doanh thu, đơn hàng, thêm/sửa/xóa món ăn, quản lý danh sách nhân viên Staff.
- **Tài khoản Staff (Nhân viên Bếp / Thu ngân)**:
  - Email: `staff@phoannhe.vn`
  - Mật khẩu: `staff123`
  - Quyền hạn: Màn hình Live Kitchen Kanban (Chờ tiếp nhận ➔ Bếp nấu ➔ Sẵn sàng giao ➔ Đã giao).

### 2. Đăng ký tài khoản mới linh hoạt
- Chọn vai trò mong muốn: **Admin** hoặc **Nhân viên (Staff)**.
- Điền Họ tên, Email, Số điện thoại, Mật khẩu.
- Đăng ký xong hệ thống sẽ tự động đăng nhập, hiển thị thông báo chào mừng và chuyển hướng trực tiếp vào Dashboard tương ứng.

---

## 🚀 Hướng Dẫn Chạy Ứng Dụng

Chạy lệnh trong PowerShell:
```powershell
npm.cmd run dev
```

Mở trình duyệt tại: **http://localhost:5173/** hoặc **http://localhost:5174/**.
