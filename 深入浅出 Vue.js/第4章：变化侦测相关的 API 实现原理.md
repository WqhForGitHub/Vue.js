# 4.1 vm.$watch



## 1. 用法

在介绍 vm.$watch 的内部原理之前，先简单回顾一下它的用法：

```javascript
vm.$watch(expOrFn, callback, [options])
```



* 参数：
  * { string | Function }   expOrFn
  * { Function | Object }   callback
  * { Object }   [options]
    * { boolean }   deep
    * { boolean }  immediate

* 返回值：{ Function }  unwatch

* 用法：

* deep。为了发现对象内部值的变化，可以在选项参数中指定 deep: true：

  ```javascript
  vm.$watch('someObject', callback, {
      deep: true
  })
  
  vm.someObject.nestedValue = 123;
  ```

  

* immediate。在选项参数中指定 immediate: true，将立即以表达式的当前值触发回调：

  ```javascript
  // 立即以 'a' 的当前值触发回调
  vm.$watch('a', callback, {
      immediate: true
  })
  ```



## 2. watch 的内部原理

```javascript
Vue.prototype.$watch = function (expOrFn, cb, options) {
    const vm = this;
    options = options || {};
    const watcher = new Watcher(vm, expOrFn, options);
    
    if (options.immediate) {
       cb.call(vm, watcher.value); 
    }
    
    return function unwatchFn() {
        watcher.teardown();
    }
}
```





```javascript
export default class Watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm;
        if(typeof expOrFn === "function") {
            this.getter = expOrFn;
        } else {                                                                                                    
            this.getter = parsePath(expOrFn);
        }
        
        this.cb = cb;
        this.value = this.get();
    }
}
```

 

```              javascript
export default class Watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm;
        this.deps = [];
        this.depIds = new Set();
        this.getter = parsePath(expOrFn);
        this.cb = cb;
        this.value = this.get();
    }
    
    addDep(dep) {
        const id = dep.id;
        if(!this.depIds.has(id)) {
            this.depIds.add(id);
            this.deps.push(dep);
            dep.addSub(this);                                                                                                   
        }
    }
}
```





# 4.2 vm.$set



## 1. 用法

vm.$set 的用法如下。

```javascript
vm.$set(target, key, value);
```

* 参数：
  * { Object | Array }  target
  * { string | number }  key
  * { any }  value
* 返回值：{ Function }：unwatch 

举个例子：

```javascript
var vm = new Vue({
    el: "#el",
    template: "#demo-template",
    data: {
        obj: {}
    }
})
```



**`在上述代码中，data 中有一个 obj 对象。如果直接给 obj 设置一个属性，例如：`**

```javascript
var vm = new Vue({
    el: "#el",
    template: "#demo-template",
    methods: {
        action() {
            this.obj.name = "berwin"
        }
    },
    data： {
    	obj: {}
	}
})
```

​                                                                                                                                                                                                                                   

## 2. Array 的处理

```javascript
export function set(target, key, val) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key);
        target.splice(key, 1, val);
        return val;
    }                                                                    
}
```

