<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  Ticket,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-vue-next'

const emit = defineEmits(['apply-code'])

// 3 Moving Banner Slides
const slides = [
  {
    id: 1,
    tag: 'Món Hot Bán Chạy',
    tagIcon: 'Flame',
    tagColor: 'bg-red-500/80 text-white',
    title: 'Đại Tiệc Bánh Tráng & Xiên Nướng Nóng Giòn',
    highlight: 'Bánh Tráng Nướng Đà Lạt & Cá Viên Chiên Mắm',
    description: 'Bánh tráng nướng than hồng phô mai kéo sợi, cá viên chiên xóc mắm tỏi bơ đậu bắp thơm nức mũi.',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=1600&auto=format&fit=crop&q=85',
    promoCode: 'PHOANVAT',
    promoDesc: 'Giảm 15% tối đa 40k',
    promoDiscount: '-15%',
    accentColor: 'from-amber-600 via-orange-600 to-rose-700'
  },
  {
    id: 2,
    tag: 'Ăn Vặt Đậm Đà',
    tagIcon: 'Sparkles',
    tagColor: 'bg-orange-500/80 text-white',
    title: 'Chân Gà Sốt Thái & Món Nhậu Chua Cay Đưa Miệng',
    highlight: 'Chân Gà Rút Xương Cóc Non & Nem Chua Rán',
    description: 'Chân gà rút xương ngâm sả tắc chua cay sần sật, nem chua rán phố cổ Hà Nội giòn rụm chấm tương ớt cay xè.',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=1600&auto=format&fit=crop&q=85',
    promoCode: 'FREESHIP',
    promoDesc: 'Miễn phí ship 18k cho đơn từ 60k',
    promoDiscount: 'FREESHIP',
    accentColor: 'from-orange-600 via-rose-600 to-red-800'
  },
  {
    id: 3,
    tag: 'Giải Nhiệt Cực Đã',
    tagIcon: 'Clock',
    tagColor: 'bg-emerald-500/80 text-white',
    title: 'Trà Mãng Cầu & Trà Sữa Hoàng Kim Thanh Mát',
    highlight: 'Trà Đào Cam Sả & Chè Dừa Dầm Hải Phòng',
    description: 'Hạ nhiệt tức thì cùng cốt trà lài thơm dịu, mãng cầu xiêm chua ngọt giòn giòn và trân châu đường đen dẻo bùi.',
    image: 'https://images.unsplash.com/photo-1558857563-b371f30ca6a5?w=1600&auto=format&fit=crop&q=85',
    promoCode: 'ANVATHOMNAY',
    promoDesc: 'Giảm ngay 20k cho đơn từ 100k',
    promoDiscount: '-20K',
    accentColor: 'from-amber-700 via-teal-700 to-slate-900'
  }
]

const currentSlide = ref(0)
const copiedCode = ref('')
let timer = null

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

function goToSlide(index) {
  currentSlide.value = index
}

function startAutoplay() {
  stopAutoplay()
  timer = setInterval(() => {
    nextSlide()
  }, 4500)
}

function stopAutoplay() {
  if (timer) clearInterval(timer)
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})

function copyAndApply(code) {
  navigator.clipboard?.writeText(code)
  copiedCode.value = code
  emit('apply-code', code)
  setTimeout(() => {
    copiedCode.value = ''
  }, 2000)
}
</script>

<template>
  <section class="relative overflow-hidden pt-4 pb-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Carousel Container -->
      <div
        class="relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 aspect-16/10 sm:aspect-21/9 min-h-[380px] sm:min-h-[420px]"
        @mouseenter="stopAutoplay"
        @mouseleave="startAutoplay"
      >
        <!-- 3 Sliding Images track -->
        <div
          class="flex h-full transition-transform duration-700 ease-out will-change-transform"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="(slide, index) in slides"
            :key="slide.id"
            class="relative w-full h-full shrink-0 select-none"
          >
            <!-- Background Image with Zoom -->
            <img
              :src="slide.image"
              :alt="slide.title"
              class="absolute inset-0 w-full h-full object-cover"
            />

            <!-- Gradient Overlay for readability -->
            <div
              class="absolute inset-0 bg-gradient-to-r"
              :class="slide.accentColor"
              style="mix-blend-mode: multiply; opacity: 0.82"
            ></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>

            <!-- Slide Content Overlay -->
            <div class="relative z-10 h-full p-6 sm:p-10 lg:p-12 flex flex-col justify-between text-white">
              <!-- Top Tag -->
              <div class="flex items-center justify-between">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md border border-white/20 text-xs font-bold" :class="slide.tagColor">
                  <Sparkles class="w-3.5 h-3.5 text-amber-300" />
                  <span>{{ slide.tag }}</span>
                </div>

                <div class="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-300 border border-white/15">
                  0{{ index + 1 }} / 03
                </div>
              </div>

              <!-- Center Text -->
              <div class="max-w-2xl space-y-2 sm:space-y-3">
                <h2 class="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
                  {{ slide.title }}
                </h2>
                <p class="text-amber-200 font-bold text-sm sm:text-base">
                  {{ slide.highlight }}
                </p>
                <p class="text-xs sm:text-sm text-slate-200 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
                  {{ slide.description }}
                </p>
              </div>

              <!-- Bottom Promo & Fast Action -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <!-- Promo Code Pill -->
                <div class="flex items-center gap-2 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/20 self-start">
                  <Ticket class="w-4 h-4 text-amber-300 shrink-0 ml-1" />
                  <div class="text-left">
                    <div class="flex items-center gap-1.5">
                      <span class="font-mono font-black text-amber-300 text-xs tracking-wider">{{ slide.promoCode }}</span>
                      <span class="text-[9px] bg-red-500 text-white font-black px-1.5 py-0.2 rounded">{{ slide.promoDiscount }}</span>
                    </div>
                    <span class="text-[10px] text-slate-300">{{ slide.promoDesc }}</span>
                  </div>
                  <button
                    @click.stop="copyAndApply(slide.promoCode)"
                    class="ml-2 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-black transition cursor-pointer shadow-xs flex items-center gap-1"
                  >
                    <Check v-if="copiedCode === slide.promoCode" class="w-3.5 h-3.5 text-emerald-800" />
                    <Copy v-else class="w-3.5 h-3.5" />
                    <span>{{ copiedCode === slide.promoCode ? 'Đã áp dụng' : 'Lấy Mã' }}</span>
                  </button>
                </div>

                <!-- Features Pill -->
                <div class="hidden md:flex items-center gap-3 text-xs font-bold text-amber-100">
                  <span class="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl backdrop-blur-md">
                    <Clock class="w-3.5 h-3.5 text-amber-300" />
                    <span>Giao 15 - 30p</span>
                  </span>
                  <span class="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl backdrop-blur-md">
                    <Flame class="w-3.5 h-3.5 text-orange-400" />
                    <span>Nóng giòn tại chỗ</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Left / Right Navigation Arrows -->
        <button
          @click.stop="prevSlide"
          class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition border border-white/20 z-20 cursor-pointer group active:scale-90"
          title="Ảnh trước"
        >
          <ChevronLeft class="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button
          @click.stop="nextSlide"
          class="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition border border-white/20 z-20 cursor-pointer group active:scale-90"
          title="Ảnh tiếp theo"
        >
          <ChevronRight class="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <!-- Dot Indicators & Progress bar -->
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
          <button
            v-for="(slide, idx) in slides"
            :key="slide.id"
            @click.stop="goToSlide(idx)"
            class="transition-all duration-300 rounded-full cursor-pointer"
            :class="currentSlide === idx ? 'w-7 h-2.5 bg-amber-400' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'"
            :title="`Chuyển đến ảnh ${idx + 1}`"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>
