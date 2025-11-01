import defineReactive from "./defineReactive.mjs";
// import { arrayMethods } from "./arrayMethod.mjs";
import Dep from "./dep.mjs";

// __proto__ 是否可用
// const hasProto = "__proto__" in {};
// const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

export default class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep(); // 新增 dep
    def(value, "__ob__", this); // 新增

    if (Array.isArray(value)) {
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  // 对象每个属性都变成响应式
  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]]);
    }
  }

  // 侦测 Array 中的每一项
  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  });
}

// function protoAugment(target, src, keys) {
//   target.__proto__ = src;
// }

// function copyAugment(target, src, keys) {
//   for (let i = 0, l = keys.length; i < l; i++) {
//     const key = keys[i];
//     def(target, key, src[key]);
//   }
// }

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
