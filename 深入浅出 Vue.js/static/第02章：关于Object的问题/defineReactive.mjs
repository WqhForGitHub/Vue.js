import Observer from "./observer.mjs";

export default function defineReactive(data, key, val) {
  if (typeof val === "object") {
    new Observer(val);
  }

  const dep = new Dep(); // 依赖收集器

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      dep.depend(); // 收集依赖
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      val = newVal;
      dep.notify(); // 通知所有 Watcher 更新
    },
  });
}
