<script setup lang="ts">
const demoTitle = '增长分析系统'
</script>

<template>
  <div class="about">
    <h1>关于本项目</h1>
    <div class="info-card">
      <p class="demo-name">项目名称：{{ demoTitle }}</p>
      <p class="demo-desc">这是一个基于 Vue 3 + TypeScript + Vite + Vue Router + Pinia 的示例项目。</p>
    </div>

    <div class="info-card">
      <h2>项目特点</h2>
      <ul>
        <li>使用 Composition API (script setup)</li>
        <li>TypeScript 全类型支持</li>
        <li>Vite 极速热更新</li>
        <li>Vue Router 路由懒加载</li>
        <li>Pinia 组合式状态管理</li>
      </ul>
    </div>

    <div class="info-card">
      <h2>快速开始</h2>
      <pre><code>npm install      # 安装依赖
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产版本</code></pre>
    </div>
  </div>
</template>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}

.about h1 {
  color: #42b883;
  margin-bottom: 1.5rem;
}

.info-card {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.info-card h2 {
  color: #35495e;
  margin-bottom: 1rem;
}

.demo-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.demo-desc {
  color: #666;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  padding: 0.4rem 0;
  padding-left: 1.2rem;
  position: relative;
}

ul li::before {
  content: '▶';
  position: absolute;
  left: 0;
  color: #42b883;
  font-size: 0.7rem;
}

pre {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
}

code {
  font-family: 'Fira Code', Consolas, 'Courier New', monospace;
  font-size: 0.9rem;
}
</style>
