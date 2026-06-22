<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
import HelloWorld from '@/components/HelloWorld.vue'

const counter = useCounterStore()
const demoTitle = '健身管理系统'
</script>

<template>
  <div class="home">
    <HelloWorld :title="demoTitle" />

    <section class="card">
      <h2>Pinia 状态管理示例</h2>
      <div class="counter-display">
        <span class="count-value">Count: {{ counter.count }}</span>
        <span class="count-value">Double: {{ counter.doubleCount }}</span>
      </div>
      <div class="counter-actions">
        <button class="btn btn-primary" @click="counter.increment">+1</button>
        <button class="btn btn-warning" @click="counter.decrement">-1</button>
        <button class="btn btn-secondary" @click="counter.reset">重置</button>
      </div>
    </section>

    <section class="card">
      <h2>技术栈</h2>
      <ul class="tech-list">
        <li>Vue 3 - 渐进式 JavaScript 框架</li>
        <li>TypeScript - 类型安全的 JavaScript</li>
        <li>Vite - 下一代前端构建工具</li>
        <li>Vue Router - 官方路由管理器</li>
        <li>Pinia - 轻量级状态管理库</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.card {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.card h2 {
  margin-bottom: 1rem;
  color: #35495e;
}

.counter-display {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.count-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #42b883;
}

.counter-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.85;
}

.btn-primary {
  background: #42b883;
}

.btn-warning {
  background: #e6a23c;
}

.btn-secondary {
  background: #909399;
}

.tech-list {
  list-style: none;
  padding: 0;
}

.tech-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.tech-list li:last-child {
  border-bottom: none;
}
</style>
