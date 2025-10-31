import Watcher from "./watcher.mjs";

class Vue {
  constructor(options) {
    this._data = options.data;
    // observer(this._data);
    // new Watcher();
    // console.log("render~", this._data.test);
  }
}

Vue.prototype.$watch = function (expOrFn, cb, options) {
  const vm = this;
  options = options || {};

  // 创建 Watcher 实例
  const watcher = new Watcher(vm, expOrFn, cb, {
    deep: options.deep,
    sync: options.sync,
    before: options.before,
  });

  // 立即执行回调
  if (options.immediate) {
    cb.call(vm, watcher.value);
  }

  // 返回取消监听的函数
  return function unwatchFn() {
    watcher.teardown();
  };
};

let o = new Vue({
  data: {
    test: "I am test.",
  },
});
o._data.test = "hello,test.";

// 监听 user.name
const unwatch = o.$watch(
  "user.name",
  function (newVal, oldVal) {
    console.log(`name changed: ${oldVal} -> ${newVal}`);
  },
  {
    deep: true, // 深度监听
    immediate: true, // 立即执行
  }
);

// 取消监听
// unwatch()
