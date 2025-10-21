import { arrayMethods } from "./array";
import { def, isObject } from "./util";

// __proto__ 是否可用
const hasProto = "__proto__" in {};
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

export class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep(); // 新增 dep

    def(value, "__ob__", this);

    if (Array.isArray(value)) {
      // 修改
      const augument = hasProto ? protoAugment : copyAugment;
      augument(value, arrayMethods, arrayKeys);
      // value.__proto__ = arrayMethods; // 新增
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]]);
    }
  }

  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

function protoAugment(target, src, keys) {
  target.__proto__ = src;
}

// const arr = [1,2,3];
// protoAugment(arr, arrayMethods);
// arr.push(4); // 会触发响应式更新

function copyAugment(target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    def(target, key, src[key]);
  }
}

// const arr = [1,2,3];
// copyAugment(arr, arrayMethods, ["push", "pop", "splice"]);
// arr.push(1); // 也能触发响应式更新

function defineReactive(data, key, val) {
  let childOb = observe(val); // 修改
  let dep = new Dep();
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      dep.depend();

      // 新增
      if (childOb) {
        childOb.dep.depend();
      }
      return val;
    },
    set: function (newVal) {
      if (val === newVal) {
        return;
      }

      dep.notify();

      val = newVal;
    },
  });
}

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
