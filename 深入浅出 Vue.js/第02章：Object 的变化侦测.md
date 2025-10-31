大部分人不会想到 Object 和 Array 的变化侦测采用不同的处理方式。事实上，它们的侦测方式确实不一样。在这一章中，我们将详细介绍 Object 的变化侦测。

# 2.1 什么是变化侦测

Vue.js 会自动通过状态生成 DOM，并将其输出到页面上显示出来，这个过程叫渲染。Vue.js 的渲染过程是声明式的，我们通过模板来描述状态与 DOM 之间的映射关系。

通常，在运行时应用内部的状态会不断发生变化，此时需要不停地重新渲染。这时如何确定状态中发生了什么变化？

变化侦测就是用来解决这个问题的，它分为两种类型：一种是 "推"(push)，另一种是 "拉"(pull)。

Angular 和 React 中的变化侦测都属于 "拉"，这就是说当状态发生变化时，它不知道哪个状态变了，只知道状态有可能变了，然后会发送一个信号告诉框架，框架内部收到信号后，会进行一个暴力比对来找出哪些 DOM 节点需要重新渲染。这在 Angular 中是脏检查的流程，在 React 中使用的是虚拟 DOM。

而 Vue.js 的变化侦测属于 "推"。当状态发生变化时，Vue.js 立刻就知道了，而且在一定程度上知道哪些状态变了。因此，它知道的信息更多，也就可以进行更细粒度的更新。

所谓更细粒度的更新，就是说：假如有一个状态绑定着好多个依赖，每个依赖表示一个具体的 DOM 节点，那么当这个状态发生变化时，向这个状态的所有依赖发送通知，让它们进行 DOM 更新操作。相比较而言，"拉" 的粒度是最粗的。

但是它也有一定的代价，因为粒度越细，每个状态所绑定的依赖就越多，依赖追踪在内存上的开销就会越大。因此，从 Vue.js 2.0 开始，它引入了虚拟 DOM，将粒度调整为中等粒度，即一个状态所绑定的是具体的 DOM 节点，而是一个组件。这样状态变化后，会通知到组件，组件内部再使用虚拟 DOM 进行比对。这可以大大降低依赖数量，从而降低依赖追踪所消耗的内存。

Vue.js 之所以能随意调整粒度，本质上还要归功于变化侦测。因为 "推" 类型的变化侦测可以随意调整粒度。

# 2.2 如何追踪变化

关于变化侦测，首先要问一个问题，在 JavaScript (简称 JS) 中，如何侦测一个对象的变化？

其实这个问题还是比较简单的。学过 JavaScript 的人都知道，有两种方法可以侦测到变化：使用 Object.defineProperty 和 ES6 的 Proxy。

由于 ES6 在浏览器中的支持度并不理想，到目前为止 Vue.js 还是使用 Object.defineProperty 来实现的，所以书中也会使用它来介绍变化侦测的原理。

由于使用 Object.defineProperty 来侦测变化会有很多缺陷，所以 Vue.js 的作者尤雨溪说日后会使用 Proxy 重写这部分代码。好在本章讲的是原理和思想，所以即便以后用 Proxy 重写了这部分代码，书中介绍的原理也不会变。

知道了 Object.defineProperty 可以侦测到对象的变化，那么我们可以写出这样的代码：

```javascript
function defineReactive (data, key, val) {
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      return val
    },
    set: function (newVal) {
      if (val === newVal) {
        return
      }
      val = newVal
    }
  })
}
```

这里的函数 defineReactive 用来对 Object.defineProperty 进行封装。从函数的名字可以看出，其作用是定义一个响应式数据。也就是在这个函数中进行变化追踪，封装后只需要传递 data、key 和 val 就行了。

封装好之后，每当从 data 的 key 中读取数据时，get 函数被触发；每当往 data 的 key 中设置数据时，set 函数被触发。

# 2.3 如何收集依赖

如果只是把 Object.defineProperty 进行封装，那其实没什么实际用处，真正有用的是收集依赖。

现在我要问第二个问题：如何收集依赖？

思考一下，我们之所以要观察数据，其目的是当数据的属性发生变化时，可以通知那些曾经使用了该数据的地方。

举个例子：

```html
<template>
  <h1>{{name}}</h1>
</template>
```

该模板中使用了数据 name，所以当它发生变化时，要向使用了它的地方发送通知。

>注意
>
>在 Vue.js 2.0 中，模板使用数据等同于组件使用数据，所以当数据发生变化时，会将通知发送到组件，然后组件内部再通过虚拟 DOM 重新渲染。

对于上面的问题，我的回答是，先收集依赖，即把用到数据 name 的地方收集起来，然后等属性发生变化时，把之前收集好的依赖循环触发一遍就好了。

总结起来，其实就一句话，在 getter 中收集依赖，在 setter 中触发依赖。

# 2.4 依赖收集在哪里

现在我们已经有了很明确的目标，就是要在 getter 中收集依赖，那么要把依赖收集到哪里去呢？

思考一下，首先想到的是每个 key 都有一个数组，用来存储当前 key 的依赖。假设依赖是一个函数，保存在 window.target 上，现在就可以把 defineReactive 函数稍微改造一下：

```javascript
function defineReactive (data, key, val) {
  let dep = [] // 新增
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      dep.push(window.target) // 新增
      return val
    },
    set: function (newVal) {
      if (val === newVal) {
        return
      }
      val = newVal
      // 新增
      for (let i = 0; i < dep.length; i++) {
        dep[i](newVal, val)
      }
    }
  })
}
```

这里我们新增了数组 dep，用来存储被收集的依赖。

然后在 set 被触发时，循环 dep 以触发收集到的依赖。

但是这样写有点耦合，我们把依赖收集的代码封装成一个 Dep 类，它专门帮助我们管理依赖。使用这个类，我们可以收集依赖、删除依赖或者向依赖发送通知等。其代码如下：

```javascript
export default class Dep {
  constructor () {
    this.subs = []
  }

  addSub (sub) {
    this.subs.push(sub)
  }

  removeSub (sub) {
    remove(this.subs, sub)
  }

  depend () {
    if (window.target) {
      this.addSub(window.target)
    }
  }

  notify () {
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
```

之后再改造一下 defineReactive：

```javascript
function defineReactive (data, key, val) {
  const dep = new Dep() // 修改
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      dep.depend() // 修改
      return val
    },
    set: function (newVal) {
      if (val === newVal) {
        return
      }
      val = newVal
      dep.notify() // 新增
    }
  })
}
```

此时代码看起来清晰多了，这也顺便回答了上面的问题，依赖收集到哪儿？收集到 Dep 中。

# 2.5 依赖是谁

在上面的代码中，我们收集的依赖是 window.target，那么它到底是什么？我们究竟要收集谁呢？

收集谁，换句话说，就是当属性发生变化后，通知谁。

我们要通知用到数据的地方，而使用这个数据的地方有很多，而且类型还不一样，既有可能是模板，也有可能是用户写的一个 watch，这时需要抽象出一个能集中处理这些情况的类。然后，我们在依赖收集阶段只收集这个封装好的类的实例进来，通知也只通知它一个。接着，它再负责通知其他地方。所以，我们要抽象的这个东西需要先起一个好听的名字。嗯，就叫它 Watcher 吧。

现在就可以回答上面的问题了，收集谁？Watcher！

# 2.6 什么是 Watcher

Watcher 是一个中介的角色，数据发生变化时通知它，然后它再通知其他地方。

关于 Watcher，先看一个经典的使用方式：

```javascript
// keypath
vm.$watch('a.b.c', function (newVal, oldVal) {
  // 做点什么
})
```

这段代码表示当 data.a.b.c 属性发生变化时，触发第二个参数中的函数。

思考一下，怎么实现这个功能呢？好像只要把这个 watcher 实例添加到 data.a.b.c 属性的 dep 中就行了，然后，当 data.a.b.c 的值发生变化时，通知 watcher。接着，watcher 再执行参数中的这个回调函数。

好，思考完毕，写出如下代码：

```javascript
export default class Watcher {
  constructor (vm, expOrFn, cb) {
    this.vm = vm
    // 执行 this.getter()，就可以读取 data.a.b.c 的内容
    this.getter = parsePath(expOrFn)
    this.cb = cb
    this.value = this.get()
  }

  get () {
    window.target = this
    let value = this.getter.call(this.vm, this.vm)
    window.target = undefined
    return value
  }

  update () {
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }
}
```

这段代码可以把自己主动添加到 data.a.b.c 的 Dep 中去，是不是很神奇？

因为我在 get 方法中先把 window.target 设置成了 this，也就是当前 watcher 实例，然后再读一下 data.a.b.c 的值，这肯定会触发 getter。

触发了 getter，就会触发收集依赖的逻辑。而关于收集依赖，上面已经介绍了，会从 window.target 中读取一个依赖并添加到 dep 中。

这就导致，只要先在 window.target 赋一个 this，然后再读一下值，去触发 getter，就可以把 this 主动添加到 keypath 的 Dep 中。有没有很神奇的感觉啊？

依赖注入到 Dep 中后，每当 data.a.b.c 的值发生变化时，就会让依赖列表中所有的依赖循环触发 update 方法，也就是 watcher 中的 update 方法。而 update 方法会执行参数中的回调函数，将 value 和 oldValue 传到参数中。

所以，其实不管是用户执行的 vm.$watch ('a.b.c', (value, oldValue) => {})，还是模板中用到的 data，都是通过 Watcher 来通知自己是否需要发生变化。

下面用一段代码来介绍其实现原理：

```javascript
/**
 * 解析简单路径
 */
const bailRE = /[^\w.$]/
export function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
```

可以看到，这其实并不复杂。先将 `keypath` 用 `.` 分割成数组，然后循环数组一层一层去读数据，最后拿到的 `obj` 就是 `keypath` 中想要读的数据。

# 2.7 递归侦测所有 key

现在，其实已经可以实现变化侦测的功能了，但是前面介绍的代码只能侦测数据中的某一个属性，我们希望把数据中的所有属性（包括子属性）都侦测到，所以要封装一个 `Observer` 类。这个类的作用是将一个数据内的所有属性（包括子属性）都转换成 `getter/setter` 的形式，然后去追踪它们的变化：

```javascript
/**
 * Observer 类会附加到每一个被侦测的 object 上。
 * 一旦被附加，Observer 会将 object 的所有属性转换为 getter/setter 的形式
 * 来收集属性的依赖，并且当属性发生变化时会通知这些依赖
 */
export class Observer {
  constructor (value) {
    this.value = value
    if (!Array.isArray(value)) {
      this.walk(value)
    }
  }

  /**
   * walk 将每一个属性都转换成 getter/setter 的形式来侦测变化
   * 这个方法只有在数据类型为 Object 时被调用
   */
  walk (obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
}

function defineReactive (data, key, val) {
  // 新增，适用于子属性
  if (typeof val === 'object') {
    new Observer(val)
  }
  let dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      dep.depend()
      return val
    },
    set: function (newVal) {
      if (val === newVal) {
        return
      }
      val = newVal
      dep.notify()
    }
  })
}
```

在上面的代码中，我们定义了 `Observer` 类，它用来将一个正常的 `object` 转换成被侦测的 `object`。

然后判断数据的类型，只有 `Object` 类型的数据才会调用 `walk` 将每一个属性转换成 `getter/setter` 的形式来侦测变化。

最后的，在 `defineReactive` 中新增 `new Observer(val)` 来递归子属性，这样我们就可以把 `data` 中的所有属性（包括子属性）都转换成 `getter/setter` 的形式来侦测变化。

当 `data` 中的属性发生变化时，与这个属性对应的依赖就会接收到通知。

也就是说，只要我们将一个 `object` 传到 `Observer` 中，那么这个 `object` 就会变成响应式的 `object`。

# 2.8 关于 Object 的问题

前面介绍了 `Object` 类型数据的变化侦测原理，了解了数据的变化是通过 `getter/setter` 来追踪的。也正是由于这种追踪方式，有些语法中即便是数据发生了变化，Vue.js 也追踪不到。

比如，向 `object` 添加属性：

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

在 `action` 方法中，我们在 `obj` 上新增了 `name` 属性，Vue.js 无法侦测到这个变化，所以不会向依赖发送通知。

再比如，从 `obj` 中删除一个属性：

```javascript
var vm = new Vue({
  el: '#el',
  template: '#demo-template',
  methods: {
    action () {
      delete this.obj.name
    }
  },
  data: {
    obj: {
      name: 'berwin'
    }
  }
})
```

在上面的代码中，我们在 `action` 方法中删除了 `obj` 中的 `name` 属性，而 Vue.js 无法侦测到这个变化，所以不会向依赖发送通知。

Vue.js 通过 `Object.defineProperty` 来将对象的 `key` 转换成 `getter/setter` 的形式来追踪变化，但 `getter/setter` 只能追踪一个数据是否被修改，无法追踪新增属性和删除属性，所以才会导致上面例子中提到的问题。

但这也是没有办法的事，因为在 ES6 之前，JavaScript 没有提供元编程的能力，无法侦测到一个新属性被添加到了对象中，也无法侦测到一个属性从对象中删除了。为了解决这个问题，Vue.js 提供了两个 API——`vm.$set` 与 `vm.$delete`，第 4 章会详细介绍它们。

# 2.9 总结

变化侦测就是侦测数据的变化。当数据发生变化时，要能侦测到并发出通知。

`Object` 可以通过 `Object.defineProperty` 将属性转换成 `getter/setter` 的形式来追踪变化。读取数据时会触发 `getter`，修改数据时会触发 `setter`。

我们需要在 `getter` 中收集有哪些依赖使用了数据。当 `setter` 被触发时，去通知 `getter` 中收集的依赖数据发生了变化。

收集依赖需要为依赖找一个存储依赖的地方，为此我们创建了 `Dep`，它用来收集依赖、删除依赖和向依赖发送消息等。

所谓的依赖，其实就是 `Watcher`。只有 `Watcher` 触发的 `getter` 才会收集依赖，哪个 `Watcher` 触发了 `getter`，就把哪个 `Watcher` 收集到 `dep` 中。当数据发生变化时，会循环依赖列表，把所有的 `Watcher` 都通知一遍。

`Watcher` 的原理是先把自己设置到全局唯一的指定位置（例如 `window.target`），然后读取数据。因为读取了数据，所以会触发这个数据的 `getter`。接着，在 `getter` 中就会从全局唯一的那个位置读取当前正在读取数据的 `Watcher`，并把这个 `Watcher` 收集到 `dep` 中去。通过这样的方式，`Watcher` 可以主动去订阅任意一个数据的变化。

此外，我们创建了 `Observer` 类，它的作用是把一个 `object` 中的所有数据（包括子数据）都转换成响应式的，也就是它会侦测 `object` 中所有数据（包括子数据）的变化。

由于在 ES6 之前 JavaScript 并没有提供元编程的能力，所以在对象上新增属性和删除属性都无法被追踪到。

图 2-1 给出了 `Data`、`Observer`、`Dep` 和 `Watcher` 之间的关系。

![](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Vue.js/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/%E7%AC%AC02%E7%AB%A0%EF%BC%9AObject%20%E7%9A%84%E5%8F%98%E5%8C%96%E4%BE%A6%E6%B5%8B/Data%E3%80%81Observer%E3%80%81Dep%E5%92%8CWatcher%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%B3%E7%B3%BB.png)

`Data` 通过 `Observer` 转换成了 `getter/setter` 的形式来追踪变化。

当外界通过 `watcher` 读取数据时，会触发 `getter` 从而将 `watcher` 添加到依赖中。

当数据发生了变化时，会触发 `setter`，从而向 `Dep` 中的依赖（`watcher`）发送通知。

`Watcher` 接收到通知后，会向外界发送通知，变化通知到外界后可能会触发视图更新，也有可能触发用户的某个回调函数等。











