<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

const demoTitle = '电商后台系统'
</script>

<template>
  <div class="app-container">
    <nav class="nav-bar">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/about">关于</RouterLink>
    </nav>
    <main class="main-content">
      <RouterView />
    </main>
    <footer class="footer">
      <p>{{ demoTitle }} &copy; 2024 | Vue 3 + TypeScript + Vite + Vue Router + Pinia</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #42b883, #35495e);
}

.nav-bar a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.nav-bar a:hover {
  opacity: 0.8;
}

.nav-bar a.router-link-active {
  border-bottom: 2px solid #ffffff;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.footer {
  padding: 1rem 2rem;
  background: #f5f5f5;
  text-align: center;
  color: #666;
  font-size: 0.875rem;
}
</style>
