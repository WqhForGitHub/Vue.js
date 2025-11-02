import Observer from "./observer.mjs";
import Dep from "./dep.mjs";

export default function defineReactive(data, key, val) {
  let childOb = observe(val); // 修改

  const dep = new Dep(); // 依赖收集器

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      dep.depend();

      // 数组的 Observer 实例
      if (childOb) {
        childOb.dep.depend();
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

// 引用类型
function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

// 对象自身是否有某个属性
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

// 尝试为 value 创建一个 Observer 实例
function observe(value, asRootData) {
  if (!isObject(value)) {
    return;
  }

  let ob;
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
  }

  return ob;
}
