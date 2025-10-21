import { def } from "./util";

const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);

["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(
  function (method) {
    const original = arrayProto[method];

    // 重写数组方法
    def(arrayMethods, method, function mutator(...args) {
      const result = original.apply(this, args); // 数组原生方法
      const ob = this.__ob__;
      let inserted;
      switch (method) {
        case "push":
        case "unshift":
          inserted = args; // 新增的元素
          break;
        case "splice":
          inserted = args.slice(2); // 取出要新增的元素
          break;
      }
      if (inserted) ob.observeArray(inserted); // 对新增元素进行响应式处理
      ob.dep.notify(); // 通知依赖更新
      return result;
    });
  }
);
