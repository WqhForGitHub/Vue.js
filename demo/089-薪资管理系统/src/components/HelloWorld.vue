<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <p>这是「薪资管理系统」项目的欢迎组件。</p>
    <p>本项目使用 Vue Router 管理路由，Vuex 管理状态。</p>

    <h3>常用命令</h3>
    <ul>
      <li><code>npm install</code> &mdash; 安装依赖</li>
      <li><code>npm run serve</code> &mdash; 启动开发服务器</li>
      <li><code>npm run build</code> &mdash; 构建生产版本</li>
      <li><code>npm run lint</code> &mdash; 代码检查</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.hello {
  max-width: 600px;
  margin: 0 auto;
}

h2 {
  color: #42b983;
  margin-bottom: 20px;
}

h3 {
  margin: 40px 0 16px;
  color: #2c3e50;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 8px 0;
  color: #666;
}

code {
  background: #f4f4f4;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: Consolas, Monaco, 'Courier New', monospace;
  color: #d63384;
}
</style>
