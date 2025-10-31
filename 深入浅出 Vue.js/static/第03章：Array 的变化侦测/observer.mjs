import defineReactive from "./defineReactive.mjs";
import { arrayMethods } from "./arrayMethod.mjs";
import Dep from "./dep.mjs";

// __proto__ 是否可用
const hasProto = "__proto__" in {};
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

export default class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep(); // 新增 dep
    def(value, "__ob__", this); // 新增

    if (Array.isArray(value)) {
      // 修改
      const argument = hasProto ? protoAugment : copyAugment;
      argument(value, arrayMethods, arrayKeys); // 覆盖数组原来的方法
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
}

function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  });
}

function protoAugment(target, src, keys) {
  target.__proto__ = src;
}

function copyAugment(target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    def(target, key, src[key]);
  }
}
