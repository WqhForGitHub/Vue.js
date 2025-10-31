export default class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm;
    this.cb = cb;
    this.getter = parsePath(expOrFn); // 解析路径，如 'a.b.c'
    this.value = this.get();

    if (options.deep) {
      this.deep = true;
      this.traverse(value); // 递归遍历对象
    }
  }

  get() {
    Dep.target = this; // 设置当前 Watcher
    const value = this.getter.call(this.vm, this.vm); // 触发 getter，收集依赖
    Dep.target = null; // 清理
    return value;
  }

  update() {
    const oldValue = this.value;
    const newValue = this.get();
    if (oldValue !== newValue) {
      this.cb.call(this.vm, newValue, oldValue);
    }
  }

  // 深度监听
  traverse(val) {
    if (isObject(val)) {
      for (const key in val) {
        this.traverse(val[key]); // 递归访问每个属性，触发 getter
      }
    }
  }
}
