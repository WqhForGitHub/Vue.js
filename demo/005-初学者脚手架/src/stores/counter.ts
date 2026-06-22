import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment(): void {
    count.value++
  }

  function decrement(): void {
    count.value--
  }

  function reset(): void {
    count.value = 0
  }

  return { count, doubleCount, increment, decrement, reset }
})
