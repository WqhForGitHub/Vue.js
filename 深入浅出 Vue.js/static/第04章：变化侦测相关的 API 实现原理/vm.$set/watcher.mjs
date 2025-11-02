export default class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm;

    // 新增
    if (options) {
      this.deep = !!options.deep;
    } else {
      this.deep = false;
    }

    this.deps = []; // 新增
    this.depIds = new Set(); // 新增

    // expOrFn 参数支持函数
    if (typeof expOrFn === "functon") {
      this.getter = expOrFn;
    } else {
      // 执行 this.getter()，就可以读取 data.a.b.c 的内容
      this.getter = parsePath(expOrFn);
    }

    this.cb = cb;
    this.value = this.get();
  }

  get() {
    globalThis.target = this;
    let value = this.getter.call(this.vm, this.vm); // 触发读操作

    // 新增
    if (this.deep) {
      traverse(value);
    }

    globalThis.target = undefined;
    return value;
  }

  update() {
    const oldValue = this.value;
    this.value = this.get();
    this.cb.call(this.vm, this.value, oldValue);
  }

  addDep(dep) {
    const id = dep.id;
    if (!this.depIds.has(id)) {
      this.depIds.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }

  // 从依赖项的 Dep 列表中将自己移除
  teardown() {
    let i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
  }
}

const bailRE = /[^\w.$]/;
function parsePath(path) {
  if (bailRE.test(path)) {
    return;
  }

  const segments = path.split(".");

  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return;
      obj = obj[segments[i]];
    }
    return obj;
  };
}

const seenObjects = new Set();

// 引用类型
function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

// 子值触发收集依赖
function traverse(val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse(val, seen) {
  let i, keys;
  const isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    return;
  }

  if (val.__ob__) {
    const depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return;
    }

    seen.add(depId);
  }

  if (isA) {
    i = val.length;
    while (i--) _traverse(val[i], seen);
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) _traverse(val[keys[i]], seen);
  }
}
