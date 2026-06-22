<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  msg?: string
}>(), {
  title: 'Demo',
  msg: 'Vue 3 + TypeScript + Vite + Vue Router + Pinia'
})
</script>

<template>
  <div class="hello">
    <div class="logo">Vue</div>
    <h1>{{ title }}</h1>
    <p class="subtitle">{{ msg }}</p>
  </div>
</template>

<style scoped>
.hello {
  text-align: center;
  padding: 2rem 0;
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #42b883, #35495e);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 12px;
  margin-bottom: 1rem;
}

h1 {
  color: #35495e;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}
</style>
