function defineReactive(obj, key, val) {
  const dep = new Dep(); // 依赖收集器

  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        // 当前正在计算的 Watcher
        dep.depend(); // 收集依赖
      }
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      val = newVal;
      dep.notify(); // 通知所有 Watcher 更新
    },
  });
}
