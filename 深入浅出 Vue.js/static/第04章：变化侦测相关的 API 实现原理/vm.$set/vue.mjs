import Observer from "./observer.mjs";
import Watcher from "./watcher.mjs";

class Vue {
  constructor(options) {
    this._data = options.data;
    observe(this._data);

    // new Watcher(this, "_data.list", (newVal, oldVal) => {
    //   console.log("newVal, oldVal: ", newVal, oldVal);
    // });
  }
}

// let o = new Vue({
//   data: {
//     list: [1, 2, 3],
//     user: { name: "Jack" },
//   },
// });

Vue.prototype.$watch = function (expOrFn, cb, options) {
  const vm = this;
  options = options || {};
  const watcher = new Watcher(vm, expOrFn, cb, options);

  if (options.immediate) {
    cb.call(vm, watcher.value);
  }

  return function unwatchFn() {
    watcher.teardown();
  };
};

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
