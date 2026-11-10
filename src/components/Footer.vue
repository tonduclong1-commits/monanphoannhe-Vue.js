<script setup>
import { Phone, MapPin, Clock, Heart, Award, ShieldCheck, Sparkles, ExternalLink } from 'lucide-vue-next'
</script>

<template>
  <footer class="mt-20 bg-white text-slate-600 border-t border-slate-200 shadow-2xs">
    <!-- Value highlights bar -->
    <div class="border-b border-slate-100 py-8 bg-slate-50/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div class="flex items-center justify-center sm:justify-start gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles class="w-6 h-6" />
            </div>
            <div>
              <h4 class="text-slate-900 font-bold text-sm">Chế Biến Nóng Tại Chỗ</h4>
              <p class="text-xs text-slate-500">Chiên nướng ngay khi nhận đơn</p>
            </div>
          </div>

          <div class="flex items-center justify-center sm:justify-start gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div class="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
              <Clock class="w-6 h-6" />
            </div>
            <div>
              <h4 class="text-slate-900 font-bold text-sm">Giao Nhanh 15 - 30 Phút</h4>
              <p class="text-xs text-slate-500">Đóng hộp giữ nhiệt giòn rụm</p>
            </div>
          </div>

          <div class="flex items-center justify-center sm:justify-start gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck class="w-6 h-6" />
            </div>
            <div>
              <h4 class="text-slate-900 font-bold text-sm">Vệ Sinh Chuẩn Sạch</h4>
              <p class="text-xs text-slate-500">Nguồn gốc nguyên liệu rõ ràng</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand Info -->
        <div class="space-y-3 md:col-span-1">
          <div class="flex items-center gap-2">
            <span class="text-3xl">🍢</span>
            <span class="text-xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent tracking-tight">
              PHỐ ĂN NHẸ
            </span>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed">
            Hệ thống món ăn nhẹ đường phố trứ danh 3 miền. Phục vụ các món ăn vặt giòn ngon chuẩn vị, trà sữa, trà trái cây và các set combo hội bạn tan ca.
          </p>
          <div class="pt-1 text-xs text-amber-700 flex items-center gap-1.5 font-bold">
            <Award class="w-4 h-4 text-amber-500" />
            <span>Top 1 Quán ăn vặt yêu thích 2026</span>
          </div>
        </div>

        <!-- Social Links (Facebook & YouTube) -->
        <div class="space-y-3 text-xs md:col-span-1">
          <h4 class="text-slate-900 font-bold uppercase tracking-wider text-xs">Kênh Mạng Xã Hội</h4>
          <p class="text-slate-500 text-[11px]">Theo dõi video review món ăn và ưu đãi hot mỗi ngày:</p>
          
          <div class="space-y-2">
            <!-- Facebook Link -->
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition duration-200"
            >
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Facebook Fanpage</div>
                  <div class="text-[10px] text-slate-400">@phoannhe.official</div>
                </div>
              </div>
              <ExternalLink class="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </a>

            <!-- YouTube Link -->
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 transition duration-200"
            >
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-[#FF0000] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-bold text-slate-800 group-hover:text-rose-700 transition-colors">YouTube Channel</div>
                  <div class="text-[10px] text-slate-400">Ẩm Thực Phố Ăn Nhẹ</div>
                </div>
              </div>
              <ExternalLink class="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition-colors" />
            </a>
          </div>
        </div>

        <!-- Working Hours & Contact -->
        <div class="space-y-3 text-xs md:col-span-1">
          <h4 class="text-slate-900 font-bold uppercase tracking-wider text-xs">Thời Gian & Liên Hệ</h4>
          <div class="space-y-2 text-slate-600">
            <div class="flex items-center gap-2">
              <Clock class="w-4 h-4 text-amber-600 shrink-0" />
              <span>Mở cửa: <strong>09:00 - 23:00</strong> (Mỗi ngày)</span>
            </div>
            <div class="flex items-center gap-2">
              <Phone class="w-4 h-4 text-amber-600 shrink-0" />
              <span>Hotline: <strong class="text-slate-900 font-bold">0988.123.456</strong></span>
            </div>
          </div>
        </div>

        <!-- Locations -->
        <div class="space-y-3 text-xs md:col-span-1">
          <h4 class="text-slate-900 font-bold uppercase tracking-wider text-xs">Địa Điểm Quán</h4>
          <div class="space-y-2 text-slate-600">
            <div class="flex items-start gap-2">
              <MapPin class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Cơ sở 1: 128 Phố Ẩm Thực, Quận 1, TP. HCM</span>
            </div>
            <div class="flex items-start gap-2">
              <MapPin class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Cơ sở 2: 45 Phố Hàng Bông, Hoàn Kiếm, Hà Nội</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-10 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026 Món Ăn Phố & Ăn Nhẹ. Xây dựng trên nền tảng Vue 3 + Tailwind CSS.</p>
        <div class="flex items-center gap-4">
          <a href="https://facebook.com" target="_blank" class="hover:text-blue-600 font-medium transition">Facebook</a>
          <span>•</span>
          <a href="https://youtube.com" target="_blank" class="hover:text-red-600 font-medium transition">YouTube</a>
          <span>•</span>
          <span class="flex items-center gap-1">
            <span>Yêu ẩm thực đường phố</span>
            <Heart class="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
