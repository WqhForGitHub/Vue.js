<template>
  <div class="view-page view-logs">
    <div class="page-header">
      <h2>日志</h2>
      <p class="page-desc">日志查看与管理</p>
    </div>
    <div class="page-content">
      <div class="content-card">
        <h3>日志管理</h3>
        <button @click="clearLogs">清空日志</button>
        <div class="log-list">
          <div v-for="log in logs" :key="log.id" class="log-item" :class="'log-' + log.level">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-level">{{ log.level }}</span>
            <span class="log-msg">{{ log.message }}</span>
          </div>
          <p v-if="logs.length === 0" class="empty-state">暂无日志</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogsView',
  computed: {
    logs() { return this.$store.state.monitor ? this.$store.getters['monitor/latestLogs'] : [] },
    metrics() { return this.$store.state.monitor ? this.$store.state.monitor.metrics : {} }
  },
  methods: {
    refresh() { this.$store.dispatch('monitor/updateMetrics') },
    clearLogs() { this.$store.dispatch('monitor/clearLogs') }
  },
  created() {
    if (this.$store.state.monitor) {
      this.$store.dispatch('monitor/updateMetrics')
    }
  }
}
</script>

<style scoped>
.view-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.page-header h2 {
  font-size: 22px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.page-desc {
  color: #909399;
  font-size: 14px;
}

.page-content {
  min-height: 300px;
}

.content-card,
.welcome-card,
.info-card,
.practice-card,
.demo-card,
.settings-card {
  background: #f9fafc;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
}

.content-card h3,
.welcome-card h3,
.info-card h3,
.practice-card h3,
.demo-card h3,
.settings-card h3 {
  color: #2c3e50;
  margin-bottom: 12px;
}

.content-card p,
.welcome-card p,
.info-card p {
  color: #606266;
  line-height: 1.8;
  margin-bottom: 8px;
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin-top: 12px;
}

.info-card li {
  padding: 6px 0;
  color: #606266;
}

.counter-demo {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.counter-demo button {
  width: 36px;
  height: 36px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
}

.counter-demo button:hover {
  border-color: #42b983;
  color: #42b983;
}

.counter-demo .count {
  font-size: 24px;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.feature-item {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  padding: 16px;
}

.feature-item h4 {
  color: #42b983;
  margin-bottom: 8px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.setting-item label {
  color: #606266;
}

.setting-item button,
.setting-item select {
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.setting-item button:hover {
  border-color: #42b983;
  color: #42b983;
}

code {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 3px;
  color: #d63384;
  font-family: Consolas, monospace;
}
</style>
