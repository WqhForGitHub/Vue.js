import defineReactive from "./defineReactive.mjs";

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex(val) {
  const n = parseFloat(String(val)); // 将输入值转为字符串再解析为数字，处理字符串数字如"123"
  return n >= 0 && Math.floor(n) === n && isFinite(val); // 检查是否为非负整数且有限
}

export function set(target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }

  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }

  const ob = target.__ob__;
  if (target.__isVue || (ob && ob.vmCount)) {
    return val;
  }

  if (!ob) {
    target[key] = val;
    return val;
  }

  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val;
}
