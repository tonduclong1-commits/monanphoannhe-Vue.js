<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  },
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'success'
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-4 opacity-0 scale-95"
    enter-to-class="transform translate-y-0 opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100 scale-100"
    leave-to-class="transform translate-y-4 opacity-0 scale-95"
  >
    <div
      v-if="show"
      class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white font-medium text-sm backdrop-blur-md"
      :class="type === 'error' ? 'bg-rose-600/95' : 'bg-slate-900/95 border border-amber-500/30'"
    >
      <span class="text-xl">{{ type === 'error' ? '⚠️' : '✨' }}</span>
      <span>{{ message }}</span>
    </div>
  </Transition>
</template>
