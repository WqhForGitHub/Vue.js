本章将介绍几个与变化侦测相关的常用 API 的内部原理。

# 4.1 vm.$watch

经常使用 Vue.js 的同学肯定对 vm.$watch 并不陌生，本节将探索它的内部究竟是怎样的。

## 4.1.1 用法

在介绍 vm.$watch 的内部原理之前，先简单回顾一下它的用法：

```javascript
vm.$watch( expOrFn, callback, [options] )
```

* **参数：**

  - {string | Function} expOrFn

  - {Function | Object} callback

  - {Object} [options]
    - {boolean} deep
    - {boolean} immediate

* **返回值：** {Function} unwatch

* **用法：** 用于观察一个表达式或 computed 函数在 Vue.js 实例上的变化。回调函数调用时，会从参数得到新数据 (new value) 和旧数据 (old value)。表达式只接受以点分隔的路径，例如 a.b.c。如果是一个比较复杂的表达式，可以用函数代替表达式。

**例如：**

```javascript
vm.$watch('a.b.c', function (newVal, oldVal) {
  // 做点什么
})
```

vm.$watch 返回一个取消观察函数，用来停止触发回调：

```javascript
var unwatch = vm.$watch('a', (newVal, oldVal) => {})
// 之后取消观察
unwatch()
```

最后，简要介绍一下 [options] 的两个选项 deep 和 immediate。

* deep。为了发现对象内部值的变化，可以在选项参数中指定 deep: true：

```javascript
vm.$watch('someObject', callback, {
  deep: true
})
vm.someObject.nestedValue = 123
// 回调函数将被触发
```

这里需要注意的是，监听数组的变动不需要这么做。

* **immediate**。在选项参数中指定 immediate: true，将立即以表达式的当前值触发回调：

```javascript
vm.$watch('a', callback, {
  immediate: true
})
// 立即以'a'的当前值触发回调
```

## 4.1.2 watch 的内部原理

到底是怎么实现的：

```javascript
Vue.prototype.$watch = function (expOrFn, cb, options) {
  const vm = this
  options = options || {}
  const watcher = new Watcher(vm, expOrFn, cb, options)
  if (options.immediate) {
    cb.call(vm, watcher.value)
  }
  return function unwatchFn() {
    watcher.teardown()
  }
}
```

可以看到，代码不多，逻辑也不算复杂。先执行 new Watcher 来实现 vm.$watch 的基本功能。

这里有一个细节需要注意，expOrFn 是支持函数的，而我们在第 2 章中并没有介绍。这里我们需要对 watcher 进行一个简单的修改，具体如下：

```javascript
export default class Watcher {
  constructor (vm, expOrFn, cb) {
    this.vm = vm
    // expOrFn参数支持函数
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }
    this.cb = cb
    this.value = this.get()
  }
  ...
}
```

上面的代码新增了判断 expOrFn 类型的逻辑。如果 expOrFn 是函数，则直接将它赋值给 getter；如果不是函数，再使用 parsePath 函数来读取 keypath 中的数据。这里 keypath 指的是属性路径，例如 a.b.c.d 就是一个 keypath，说明从 vm.a.b.c.d 中读取数据。

当 expOrFn 是函数时，会发生很神奇的事情。它不只可以动态返回数据，其中读取的所有数据也都会被 watcher 观察。当 expOrFn 是字符串类型的 keypath 时，watcher 会读取这个 keypath 所指向的数据并观察这个数据的变化。而当 expOrFn 是函数时，Watcher 会同时观察 expOrFn 函数中读取的所有 Vue.js 实例上的响应式数据。也就是说，如果函数从 Vue 实例上读取了两个数据，那么 Watcher 会同时观察这两个数据的变化，当其中任意一个发生变化时，Watcher 都会得到通知。

>说明
>
>事实上，Vue.js 中计算属性 (Computed) 的实现原理与 expOrFn 支持函数有很大的关系，我们会在后面的章节中详细介绍。

执行 new Watcher 后，代码会判断用户是否使用了 immediate 参数，如果使用了，则立即执行一次 cb。

最后，返回一个函数 unwatchFn。顾名思义，它的作用是取消观察数据。

当用户执行这个函数时，实际上是执行了 watcher.teardown () 来取消观察数据，其本质是把 watcher 实例从当前正在观察的状态的依赖列表中移除。

前面介绍 watcher 时并没有介绍 teardown 方法，现在要在 watcher 中添加该方法来实现 unwatch 的功能。

首先，需要在 watcher 中记录自己都订阅了谁，也就是 watcher 实例被收集进了哪些 Dep 里。然后当 Watcher 不想继续订阅这些 Dep 时，循环自己记录的订阅列表来通知它们 (Dep) 将自己从它们 (Dep) 的依赖列表中移除掉。

因此，我们要把收集依赖那部分的代码做一个小小的改动。

先在 Watcher 中添加 addDep 方法，该方法的作用是在 watcher 中记录自己都订阅过哪些 Dep：

```javascript
export default class Watcher {
  constructor (vm, expOrFn, cb) {
    this.vm = vm
    this.deps = [] // 新增
    this.depIds = new Set() // 新增
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }
    this.cb = cb
    this.value = this.get()
  }
  ...
  addDep (dep) {
    const id = dep.id
    if (!this.depIds.has(id)) {
      this.depIds.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  ...
}
```

在上述代码中，我们使用 depIds 来判断如果当前 watcher 已经订阅了该 Dep，则不会重复订阅。在第 2 章中，我们介绍过 watcher 读取 value 时，会触发收集依赖的逻辑。当依赖发生变化时，会通知 watcher 重新读取最新的数据。如果没有这个判断，就会发现每当数据发生了变化，watcher 都会读取最新的数据。而读数据就会再次收集依赖，这就会导致 Dep 中的依赖有重复。这样当数据发生变化时，会同时通知多个 watcher。为了避免这个问题，只有第一次触发 getter 的时候才会收集依赖。

接着，执行 this.depIds.add 来记录当前 watcher 已经订阅了这个 Dep。

然后执行 this.deps.push (dep) 记录当前 watcher 已经订阅了哪些 Dep。

最后，触发 dep.addSub (this) 记录自己都订阅了哪些 Dep。

在 watcher 中新增 addDep 方法后，Dep 中收集依赖的逻辑也需要有所改变：

```javascript
let uid = 0 // 新增
export default class Dep {
  constructor () {
    this.id = uid++ // 新增
    this.subs = []
  }
  ...
  depend () {
    if (window.target) {
      window.target.addDep(this) // 变更
    }
  }
  ...
}
```

此时，Dep 会记录数据发生变化时，需要通知哪些 watcher，而 watcher 中也同样记录了自己会被哪些 Dep 通知。它们其实是多对多的关系，如图 4-1 所示。

![](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Vue.js/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/%E7%AC%AC02%E7%AB%A0%EF%BC%9AObject%20%E7%9A%84%E5%8F%98%E5%8C%96%E4%BE%A6%E6%B5%8B/Watcher%E4%B8%8EDep%E7%9A%84%E5%85%B3%E7%B3%BB.png)

有些人可能会感到困惑，为什么是多对多的关系。watcher 每次只读一个数据，不是应该只有一个 Dep 吗？

其实不是。如果 watcher 中的 expOrFn 参数是一个表达式，那么肯定只收集一个 Dep，并且大部分都是这样。但凡事总有例外，expOrFn 可以是一个函数，此时如果该函数中使用了多个数据，那么这时 watcher 就要收集多个 Dep 了，例如：

```javascript
this.$watch(function () {
  return this.name + this.age
}, function (newValue, oldValue) {
  console.log(newValue, oldValue)
})
```

在上面这个例子中，我们的表达式是一个函数，并且在函数中访问了 name 和 age 两个数据，这种情况下 watcher 内部会收集两个 Dep——name 的 Dep 和 age 的 Dep，同时这两个 Dep 中也会收集 watcher，这导致 age 和 name 中的任意一个数据发生变化时，watcher 都会收到通知。

言归正传，当我们已经在 watcher 中记录自己都订阅了哪些 Dep 之后，就可以在 watcher 中新增 teardown 方法来通知这些订阅的 Dep，让它们把自己从依赖列表中移除掉：

```javascript
/**
 * 从所有依赖项的Dep列表中将自己移除
 */
teardown () {
  let i = this.deps.length
  while (i--) {
    this.deps[i].removeSub(this)
  }
}
```

上面做的事情很简单，只是循环订阅列表，然后分别执行它们的 removeSub 方法，来把自己从它们的依赖列表中移除掉。接下来，看看 removeSub 中都发生了什么：

```javascript
export default class Dep {
    .....
    
    removeSub(sub) {
        const index = this.subs.indexOf(sub);
        if (index > -1) {
            return this.subs.splice(index, 1);
        }
    }

	.....
}
```

上面的代码把 Watcher 从 subs 中删除掉，然后当数据发生变化时，将不再通知这个已经删除的 watcher，这就是 unwatch 的原理。

## 4.1.3 deep 参数的实现原理

上面的代码把 Watcher 从 subs 中删除掉，然后当数据发生变化时，将不再通知这个已经删除的 watcher，这就是 unwatch 的原理。

在本书第一章中，我们主要介绍的无非是收集依赖和触发依赖，Watcher 想监听某个数据就会触发某个数据收集依赖的逻辑，将自己收集进去，然后当它发生变化时，就会通知 Watcher。要想实现 deep 的功能，其实就是除了要触发当前这个被监听数据的收集依赖的逻辑之外，还要把当前监听的这个值在内的所有子值都触发一遍收集依赖逻辑。这就可以实现当这个被监听数据或其子数据发生变化时，通知当前 watcher 了。

具体实现如下：

```javascript
export default class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm
    // 新增
    if (options) {
      this.deep = !!options.deep
    } else {
      this.deep = false
    }
    this.deps = []
    this.depIds = new Set()
    this.cb = cb
    this.value = this.get()
  }

  get() {
    window.target = this
    let value = this.getter.call(vm, vm)
    if (this.deep) {
      traverse(value)
    }
    window.target = undefined
    return value
  }
}
```

在上面的代码中，如果用户使用了 deep 参数，则在 `window.target = undefined` 之前调用 traverse 来处理 deep 的逻辑。

这里非常强调的一点是，一定要在 `window.target = undefined` 之前去触发子值的收集依赖逻辑，这样才能保证子集收集的依赖是当前这个 watcher。如果在 `window.target = undefined` 之后去触发收集依赖的逻辑，那么其实当前的 Watcher 并不会被收集到子值的依赖列表中，也就无法实现 deep 的功能。

接下来，要递归 value 的所有子值来触发它们收集依赖的功能：

```javascript
const seenObjects = new Set()
export function traverse(val) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse(val, seen) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
```

这里我们先判断 val 的类型，如果它不是 Array 和 Object，或者已经被冻结，那么直接返回，什么都不干。

然后拿到 val 的 dep.id，用这个 id 来保证不会重复收集依赖。

如果是数组，则循环数组，将数组中的每一项递归调用 _traverse。

最后，重点来了，如果是 Object 类型的数据，则循环 Object 中的所有 key，然后执行一次读操作，再递归子值：

```javascript
while (i--) _traverse(val[keys[i]], seen)
```

其中 val [keys [i]] 会触发 getter，也就是说会触发收集依赖的操作，这时 window.target 还没有被清空，会将当前的 Watcher 收集进去。这也是前面我强调的一定要在 window.target = undefined 这个语句之前触发收集依赖的原因。

而 _traverse 函数其实是一个递归操作，所以这个 value 的子值也会触发同样的逻辑，这样就可以实现通过 deep 参数来监听所有子值的变化。

# 4.2 vm.$set

在 Vue.js 中，vm.$set 也是一个比较常用的 API，我们先简单回顾一下它的用法。

## 4.2.1 用法

vm.$set 的用法如下：

```javascript
vm.$set( target, key, value )
```

* 参数：

  - {Object | Array} target

  - {string | number} key

  - {any} value

* 返回值：{Function} unwatch

* 用法：在 object 上设置一个属性。如果 object 是响应式的，Vue.js 会保证属性被创建后也是响应式的，并且触发视图更新。这个方法主要用来避开 Vue.js 不能侦测属性被添加的限制。

>注意 target 不能是 Vue.js 实例或者 Vue.js 实例的根数据对象。

前面我们介绍了变化侦测原理，所以对于追踪变化的方式，大家应该已经很熟了。只有已经存在的属性的变化会被追踪到，新增的属性无法被追踪到。因为在 ES6 之前，JavaScript 并没有提供元编程的能力，所以根本无法侦测 object 什么时候被添加了一个新属性。

而 vm.$set 就是为了解决这个问题而出现的。使用它，可以为 object 新增属性，然后 Vue.js 就可以将这个新属性转换成响应式的。

举个例子：

```javascript
var vm = new Vue({
  el: '#el',
  template: '#demo-template',
  data: {
    obj: {}
  }
})
```

在上述代码中，data 中有一个 obj 对象。如果直接给 obj 设置一个属性，例如：

```javascript
var vm = new Vue({
  el: '#el',
  template: '#demo-template',
  methods: {
    action () {
      this.obj.name = 'berwin'
    }
  },
  data: {
    obj: {}
  }
})
```

当 action 方法被调用时，会为 obj 新增一个 name 属性，而 Vue.js 并不会得到任何通知。新增的这个属性也不是响应式的，Vue.js 根本不知道这个 obj 新增了属性，就好像 Vue.js 无法知道我们使用 array.length = 0 清空了数组一样。

vm.$set 就可以解决这个事情。我们来看看 vm.$set 是如何实现的：

```javascript
import { set } from '../observer/index'
Vue.prototype.$set = set
```

这里我们在 Vue.js 的原型上设置 $set 属性。其实我们使用的所有以 vm.$ 开头的方法都是在 Vue.js 的原型上设置的。vm.$set 的具体实现其实是在 observer 中抛出的 set 方法。

所以，我们先创建一个 set 方法：

```javascript
export function set (target, key, val) {
  // 做点什么
}
```

## 4.2.2 Array 的处理

上面我们创建了 set 方法并且规定它接收 3 个参数，这 3 个参数与 vm.$set API 规定的需要传递的参数一致。

接下来，我们需要对 target 是数组的情况进行处理：

```javascript
export function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
}
```

在上面的代码中，如果 target 是数组并且 key 是一个有效的索引值，就先设置 length 属性。这样如果我们传递的索引值大于当前数组的 length，就需要让 target 的 length 等于索引值。

接下来，通过 splice 方法把 val 设置到 target 中的指定位置（参数中提供的索引值的位置）。当我们使用 splice 方法把 val 设置到 target 中的时候，数组拦截器会侦测到 target 发生了变化，并且会自动帮助我们把这个新增的 val 转换成响应式的。

最后，返回 val 即可。

## 4.2.3 key 已经存在于 target 中

接下来，需要处理参数中的 key 已经存在于 target 中的情况：

```javascript
export function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }

  // 新增
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
}
```

由于 key 已经存在于 target 中，所以其实这个 key 已经被侦测了变化。也就是说，这种情况属于修改数据，直接用 key 和 val 修改数据就好了。修改数据的动作会被 Vue.js 侦测到，所以数据发生变化后，会自动向依赖发送变化通知。

## 4.2.4 处理新增的属性

终于到了重头戏，现在来处理在 target 上新增的 key：

```javascript
export function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }

  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }

  // 新增
  const ob = target.__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```

在上面的代码中，我们最先做的事情是获取 target 的 **ob** 属性。

然后要处理文档中所说的 “target 不能是 Vue.js 实例或 Vue.js 实例的根数据对象” 的情况。

实现这个功能并不难，只需要使用 target._isVue 来判断 target 是不是 Vue.js 实例，使用 ob.vmCount 来判断它是不是根数据即可。

对于 ob.vmCount，我们是陌生的，后面会详细介绍，这里只要知道通过它可以判断 target 是不是根数据就行了。

那么，什么是根数据？this.$data 就是根数据。

接下来，我们处理 target 不是响应式的情况。如果 target 身上没有 **ob** 属性，说明它并不是响应式的，并不需要做什么特殊处理，只需要通过 key 和 val 在 target 上设置就行了。

如果前面的所有判断条件都不满足，那么说明用户是在响应式数据上新增了一个属性，这种情况下需要追踪这个新增属性的变化，即使用 defineReactive 将新增属性转换成 getter/setter 的形式即可。

最后，向 target 的依赖触发变化通知，并返回 val。

# 4.3 vm.$delete

vm.delete 的作用是删除数据中的某个属性。由于 Vue.js 的变化侦测是使用 Object.defineProperty 实现的，所以如果数据是使用 delete 关键字删除的，那么无法发现数据发生了变化。为了解决这个问题，Vue.js 提供了 vm.$delete 方法来删除数据中的某个属性，并且此时 Vue.js 可以侦测到数据发生了变化。

## 4.3.1 用法

vm.$delete 的用法如下：

```javascript
vm.$delete( target, key )
```

* 参数：

  - {Object | Array} target

  - {string | number} key/index

> 说明：仅在 2.2.0+ 版本中支持 Array+index 的用法。

* 用法：删除对象的属性。如果对象是响应式的，需要确保删除能触发更新视图。这个方法主要用于避开 Vue.js 不能检测到属性被删除的限制，但是你应该很少会使用它。

在 2.2.0+ 中，同样支持在数组上工作。

>注意：目标对象不能是 Vue.js 实例或 Vue.js 实例的根数据对象。

## 4.3.2 实现原理

vm.$delete 方法也是为了解决变化侦测的缺陷。在 ES6 之前，JavaScript 并没有办法侦测一个属性在 object 中被删除，所以如果使用 delete 来删除一个属性，Vue.js 根本不知道这个属性被删除了。

那么，怎样才能让 Vue.js 知道我们删除了一个属性或者从数组中删除了一个元素呢？答案是使用 vm.$delete。它帮助我们在删除属性后自动向依赖发送消息，通知 Watcher 数据发生了变化。

如果你非要使用 delete 来删除属性，那么我告诉你一个特别取巧的方法，虽然我并不推荐你这样做：

```javascript
delete this.obj.name
this.obj.__ob__.dep.notify() // 手动向依赖发送变化通知
```

使用 delete 删除属性，Vue.js 虽然不知道属性被删除了，但是我们知道，我们替 Vue.js 触发消息！

我强烈不推荐这样写代码，这里主要是为了讲解 vm.$delete 的原理。

其实 vm.$delete 内部的实现原理和上面例子中写的代码非常类似，就是删除属性后向依赖发送消息：

```javascript
import { del } from './observer/index'
Vue.prototype.$delete = del
```

上面的代码先在 Vue.js 的原型上挂载 $delete 方法。而 del 函数的定义如下：

```javascript
export function del (target, key) {
  const ob = target.__ob__
  delete target[key]
  ob.dep.notify()
}
```

这里先从 target 中将属性 key 删除，然后向依赖发送消息。

接下来，要处理数组的情况：

```javascript
export function del (target, key) {
  // 新增
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = (target).__ob__
  delete target[key]
  ob.dep.notify()
}
```

数组的处理逻辑和 vm.$set 中差不多，不过没那么复杂。因为只需要处理删除的情况，所以只需要使用 splice 将参数 key 所指定的索引位置的元素删除即可。因为使用了 splice 方法，数组拦截器会自动向依赖发送通知。

与 vm.$set 一样，vm.$delete 也不可以在 Vue.js 实例或 Vue.js 实例的根数据对象上使用。

因此，我们需要对这种情况进行判断：

```javascript
export function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  // 新增
  const ob = target.__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      ' - just set it to null.'
    )
    return
  }
  delete target[key]
  ob.dep.notify()
}
```

上面的代码中新增了判断逻辑：如果 target 上有 _isVue 属性（target 是 Vue.js 实例）或者 ob.vmCount 数量大于 1（target 是根数据），则直接返回，终止程序继续执行，并且如果是开发环境，会在控制台中发出警告。

如果删除的这个 key 不是 target 自身的属性，就什么都不做，直接退出程序执行：

```javascript
export function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = target.__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      ' - just set it to null.'
    )
    return
  }
  // 如果 key 不是 target 自身的属性，则终止程序继续执行
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  ob.dep.notify()
}
```

如果删除的这个 key 在 target 中根本不存在，那么其实并不需要进行删除操作，也不需要向依赖发送通知。

最后，还要判断 target 是不是一个响应式数据，也就是说要判断 target 身上存不存在 **ob** 属性。只有响应式数据才需要发送通知，非响应式数据只需要执行删除操作即可。

下面这段代码新增了判断条件，如果数据不是响应式的，则使用 return 语句阻止执行发送通知的语句：

```javascript
export function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = target.__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      ' - just set it to null.'
    )
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  // 如果 ob 不存在，则直接终止程序
  if (!ob) {
    return
  }
  ob.dep.notify()
}
```

在上面的代码中，我们在删除属性后判断 ob 是否存在，如果不存在，则直接终止程序，继续执行下面发送变化通知的代码。

# 4.4 总结

本章中，我们详细介绍了变化侦测相关 API 的内部实现原理。

我们先介绍了 vm.$watch 的内部实现及其相关参数的实现原理，包括 deep、immediate 和 unwatch。

随后介绍了 vm.$set 的内部实现。这里介绍了几种情况，分别为 Array 的处理逻辑，key 已经存在的处理逻辑，以及最重要的新增属性的处理逻辑。

最后，介绍了 vm.$delete 的内部实现原理。







