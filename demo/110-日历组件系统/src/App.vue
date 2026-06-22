<template>
  <div id="app" class="layout-showcase">
    <div class="demo-header">
      <span class="demo-seq">110</span>
      <h1>日历组件系统</h1>
    </div>
    <nav class="app-nav">
      <router-link to="/" class="nav-link">首页</router-link>
      <router-link to="/components/calendar" class="nav-link">Calendar 日历</router-link>
      <router-link to="/demo" class="nav-link">示例</router-link>
      <router-link to="/settings" class="nav-link">设置</router-link>
      <router-link to="/about" class="nav-link">关于</router-link>
    </nav>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
}

.demo-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.demo-seq {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #42b983;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.demo-header h1 {
  font-size: 28px;
  color: #2c3e50;
}

.app-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  width: 100%;
  max-width: 1200px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.nav-link {
  padding: 6px 16px;
  color: #606266;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
}

.nav-link:hover {
  color: #42b983;
  background: #f0f9eb;
}

.nav-link.router-link-active {
  color: #fff;
  background: #42b983;
}

.app-main {
  width: 100%;
  max-width: 1200px;
  flex: 1;
  padding: 0 20px 40px;
}
</style>
