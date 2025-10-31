上一章介绍了 Object 的侦测方式，本章介绍 Array 的侦测方式。

可能很多人不太理解为什么 Array 的侦测方式和 Object 的不同，下面我们举例说明：

```javascript
this.list.push(1)
```

在上面的代码中，我们使用 `push` 方法向 `list` 中新增了数字 1。

前面介绍 Object 的时候，我们说过其侦测方式是通过 getter/setter 实现的，但上面这个使用 `push` 方法来改变数组的操作，并不会触发 getter/setter。

正因为我们可以通过 Array 原型上的方法来改变数组的内容，所以 Object 那种通过 getter/setter 的实现方式就行不通了。

# 3.1 如何追踪变化

Object 的变化是靠 setter 来追踪的，只要一个数据发生了变化，一定会触发 setter。

同理，前面例子中使用 `push` 来改变数组的内容，那么我们只要能在用户使用 `push` 操作数组的时候得到通知，就能实现同样目的。

可惜的是，在 ES6 之前，JavaScript 并没有提供元编程的能力（即没有提供可以拦截原型方法的能力），但这难不倒聪明的程序员们 —— 我们可以用**自定义方法覆盖原生原型方法**的方式实现。

![](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Vue.js/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/%E4%BD%BF%E7%94%A8%E6%8B%A6%E6%88%AA%E5%99%A8%E8%A6%86%E7%9B%96%E5%8E%9F%E7%94%9F%E7%9A%84%E5%8E%9F%E5%9E%8B%E6%96%B9%E6%B3%95.png)

如上图所示，我们可以用一个**拦截器**覆盖 `Array.prototype`。之后，每当使用 Array 原型上的方法操作数组时，其实执行的都是拦截器中提供的方法，比如 push 方法。然后，在拦截器中使用原生 Array 的原型方法去操作数组。

# 3.2 拦截器的实现

上一节中，我们已经介绍了拦截器的作用，这一节介绍如何实现它。

拦截器本质是一个**和 `Array.prototype` 结构一致的 Object**：它包含与 `Array.prototype` 一模一样的属性，但其中 “能改变数组自身内容的方法” 会被我们特殊处理（封装自定义逻辑）。

经过整理，Array 原型中**能改变数组自身内容**的方法有 7 个：`push`、`pop`、`shift`、`unshift`、`splice`、`sort`、`reverse`。

下面我们写出代码：

```javascript
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // 缓存 Array 原型上的原始方法
  const original = arrayProto[method]
  // 用 Object.defineProperty 重新定义方法
  Object.defineProperty(arrayMethods, method, {
    value: function mutator (...args) {
      // 执行原生方法的逻辑（如 Array.prototype.push 的功能）
      return original.apply(this, args)
    },
    enumerable: false,
    writable: true,
    configurable: true
  })
})
```

在上面的代码中，我们创建了变量 `arrayMethods`，它继承自 `Array.prototype`，具备其所有功能。未来，我们要使用 `arrayMethods` 去覆盖 `Array.prototype`。

接下来，在 `arrayMethods` 上使用 `Object.defineProperty` 方法将那些可以改变数组自身内容的方法（`push`、`pop`、`shift`、`unshift`、`splice`、`sort` 和 `reverse`）进行封装。

所以，当使用 `push` 方法的时候，其实调用的是 `arrayMethods.push`，而 `arrayMethods.push` 是函数 `mutator`，也就是说，实际上执行的是 `mutator` 函数。

最后，在 `mutator` 中执行 `original`（它是原生 `Array.prototype` 上的方法，例如 `Array.prototype.push`）来做它应该做的事，比如 `push` 的功能。

因此，我们就可以在 `mutator` 函数中做一些其他的事，比如说发送变化通知。

# 3.3 使用拦截器覆盖 Array 原型

有了拦截器之后，想要让它生效，就需要使用它去覆盖 `Array.prototype`。但是我们又不能直接覆盖，因为这样会污染全局的 `Array`，这并不是我们希望看到的结果。我们希望拦截操作只针对那些被侦测了变化的数据生效，也就是说希望拦截器只覆盖那些响应式数组的原型。

而将一个数据转换成响应式的，需要通过 `Observer`，所以我们只需要在 `Observer` 中使用拦截器覆盖那些即将被转换成响应式 `Array` 类型数据的原型就好了：

```javascript
export class Observer {
    constructor (value) {
        this.value = value

        if (Array.isArray(value)) {
          value.__proto__ = arrayMethods // 新增
        } else {
          this.walk(value)
        }
	}
}
```

在上面的代码中，我们新增了一行代码：

```javascript
value.__proto__ = arrayMethods
```

它的作用是将拦截器（加工后具备拦截功能的 `arrayMethods`）赋值给 `value.__proto__`。`__proto__` 可以很巧妙地实现覆盖 `value` 原型的功能，如下图所示。

![](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Vue.js/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/%E4%BD%BF%E7%94%A8__proto__%E8%A6%86%E7%9B%96%E5%8E%9F%E5%9E%8B.png)

`__proto__`其实是`Object.getPrototypeOf`和`Object.setPrototypeOf`的早期实现，所以使用 ES6 的`Object.setPrototypeOf`来代替`__proto__`完全可以实现同样的效果。只是到目前为止，ES6 在浏览器中的支持度并不理想。

# 3.4 将拦截器方法挂载到数组的属性上

虽然绝大多数浏览器都支持这种非标准的属性（在 ES6 之前并不是标准）来访问原型，但并不是所有浏览器都支持！因此，我们需要处理不能使用`__proto__`的情况。

Vue 的做法非常粗暴，如果不能使用`__proto__`，就直接将`arrayMethods`身上的这些方法设置到被侦测的数组上：

```javascript
import { arrayMethods } from './array'

// __proto__ 是否可用
const hasProto = '__proto__' in {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

export class Observer {
    constructor (value) {
     this.value = value

     if (Array.isArray(value)) {
       // 修改
       const augment = hasProto
         ? protoAugment
         : copyAugment
            augment(value, arrayMethods, arrayKeys)
    } else {
     this.walk(value)
    }
 }

 // ...（省略部分代码）
 }

function protoAugment (target, src, keys) {
	target.__proto__ = src
}

function copyAugment (target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i]
        def(target, key, src[key])
    }
}
```

在上面的代码中，我们新增了 `hasProto` 来判断当前浏览器是否支持 `__proto__`。还新增了 `copyAugment` 函数，用来将已经加工了拦截操作的原型方法直接添加到 `value` 的属性中。

此外，还使用 `hasProto` 判断浏览器是否支持 `__proto__`：如果支持，则使用 `protoAugment` 函数来覆盖原型；如果不支持，则调用 `copyAugment` 函数将拦截器中的方法挂载到 `value` 上。

如图 3-3 所示，在浏览器不支持 `__proto__` 的情况下，会在数组上挂载一些方法。当用户使用这些方法时，其实执行的并不是浏览器原生提供的 `Array.prototype` 上的方法，而是拦截器中提供的方法。

![](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Vue.js/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/%E5%B0%86%E6%8B%A6%E6%88%AA%E5%99%A8%E6%96%B9%E6%B3%95%E6%8C%82%E8%BD%BD%E5%88%B0%E6%95%B0%E7%BB%84%E5%B1%9E%E6%80%A7%E4%B8%8A.png)

因为当访问一个对象的方法时，只有其自身不存在这个方法，才会去它的原型上找这个方法。

# 3.5 如何收集依赖

上一节中，我们介绍并且创建了拦截器。

可能你也发现了，如果只有一个拦截器，其实还是什么事都做不了。为什么会这样呢？因为我们之所以创建拦截器，本质上是为了得到一种能力，一种当数组的内容发生变化时得到通知的能力。

而现在我们虽然具备了这样的能力，但是通知谁呢？前面我们介绍 Object 时说过，答案肯定是通知 Dep 中的依赖（Watcher），但是依赖怎么收集呢？这就是本节要介绍的内容，如何收集数组的依赖！

在这之前，我们先简单回顾一下 Object 的依赖是如何收集的。

Object 的依赖前面介绍过，是在 `defineReactive` 中的 getter 里使用 Dep 收集的，每个 key 都会有一个对应的 Dep 列表来存储依赖。

简单来说，就是在 getter 中收集依赖，依赖被存储在 Dep 里。

那么，数组在哪里收集依赖呢？其实数组也是在 getter 中收集依赖的。

有些同学可能不明白了，没关系，我们举例说明一下：

```javascript
{
	list: [1,2,3,4,5]
}
```

如果是上面这样的数据，那么想得到 list 数组，肯定是要访问 list 这个 key，对吧？

也就是说，其实不管 value 是什么，要想在一个 Object 中得到某个属性的数据，肯定要通过 key 来读取 value。

因此，在读取 list 的时候，肯定会先触发这个名字叫作 list 的属性的 getter，举个例子：

```javascript
this.list
```

上面这行代码从 this 上读取 list，所以肯定会触发 list 这个属性的 getter。

而 Array 的依赖和 Object 一样，也在 `defineReactive` 中收集：

```javascript
function defineReactive (data, key, val) {
	if (typeof val === 'object') new Observer(val)
	let dep = new Dep()
	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: true,     
		get: function () {
			dep.depend()
             // 这里收集Array的依赖
             return val
   		},
       set: function (newVal) {
         if(val === newVal){
           return
         }

         dep.notify()
         val = newVal
       }
 	})
 }
```

上面的代码新增了一段注释，接下来要在这个位置去收集 Array 的依赖。

所以，**Array 在 getter 中收集依赖，在拦截器中触发依赖**。

# 3.6 依赖列表存在哪儿

知道了如何收集依赖后，下一个要面对的问题是这些依赖列表存在哪儿。Vue.js 把 Array 的依赖存放在 Observer 中：

```javascript
export class Observer {
    constructor (value) {
     this.value = value
     this.dep = new Dep() // 新增dep

     if (Array.isArray(value)) {
       const augment = hasProto
         ? protoAugment
         : copyAugment
       augment(value, arrayMethods, arrayKeys)
     } else {
       this.walk(value)
     }
    }

    // ...（省略部分代码）
}
```

这个地方有些同学可能会有疑问，为什么数组的 dep（依赖）要保存在 Observer 实例上呢？

上一节中我们介绍了数组在 getter 中收集依赖，在拦截器中触发依赖，所以这个依赖保存的位置就很关键，它必须在 getter 和拦截器中都可以访问到。

我们之所以将依赖保存在 Observer 实例上，是因为在 getter 中可以访问到 Observer 实例，同时在 Array 拦截器中也可以访问到 Observer 实例。

后面会介绍如何在 getter 中访问 Dep 开始收集依赖，以及在拦截器中如何访问 Observer 实例。

# 3.7 收集依赖

把 Dep 实例保存在 Observer 的属性上之后，我们可以在 getter 中像下面这样访问并收集依赖：

```javascript
function defineReactive (data, key, val) {
    let childOb = observe(val) // 修改
    let dep = new Dep()
    Object.defineProperty(data, key, {
     enumerable: true,
     configurable: true,
     get: function () {
       dep.depend()

         // 新增
       if (childOb) {
         childOb.dep.depend()
       }
       return val
     },
     set: function (newVal) {
       if(val === newVal){
         return
       }

       dep.notify()
       val = newVal
     }
    })
}

/**
* 尝试为 value 创建一个 Observer 实例，
* 如果创建成功，直接返回新创建的 Observer 实例。
* 如果 Value 已经存在一个 Observer 实例，则直接返回它
*/
export function observe (value, asRootData) {
    if (!isObject(value)) {
     return
    }
    let ob
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
		ob = value.__ob__
    } else {
		ob = new Observer(value)
    }
    return ob
}
```

在上面的代码中，我们新增了函数 `observe`，它尝试创建一个 Observer 实例。如果 `value` 已经是响应式数据，不需要再次创建 Observer 实例，直接返回已经创建的 Observer 实例即可，避免了重复侦测 `value` 变化的问题。

此外，我们在 `defineReactive` 函数中调用了 `observe`，它把 `val` 当作参数传了进去并拿到一个返回值，那就是 Observer 实例。

前面我们介绍过数组为什么在 getter 中收集依赖，而 `defineReactive` 函数中的 `val` 很有可能会是一个数组。通过 `observe` 我们得到了数组的 Observer 实例（`childOb`），最后通过 `childOb` 的 `dep` 执行 `depend` 方法来收集依赖。

通过这种方式，我们就可以实现在 getter 中将依赖收集到 Observer 实例的 `dep` 中。更通俗的解释是：通过这样的方式可以为数组收集依赖。

# 3.8 在拦截器中获取 Observer 实例

在本节中，我们将介绍如何在拦截器中访问 Observer 实例。

因为 Array 拦截器是对原型的一种封装，所以可以在拦截器中访问到 `this`（当前正在被操作的数组）。

而 `dep` 保存在 Observer 中，所以需要在 `this` 上读到 Observer 的实例：

```javascript
// 工具函数
function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
     value: val,
     enumerable: !!enumerable,
     writable: true,
     configurable: true
    })
}

export class Observer {
    constructor (value) {
     this.value = value
     this.dep = new Dep()
     def(value, '__ob__', this) // 新增

     if (Array.isArray(value)) {
       const augment = hasProto
         ? protoAugment
         : copyAugment
       augment(value, arrayMethods, arrayKeys)
    } else {
       this.walk(value)
     }
    }

    // ...（省略部分代码）
}
```

在上面的代码中，我们在 Observer 中新增了一段代码，它可以在 `value` 上新增一个不可枚举的属性 `__ob__`，这个属性的值就是当前 Observer 的实例。

这样我们就可以通过数组数据的 `__ob__` 属性拿到 Observer 实例，然后就可以拿到 `__ob__` 上的 dep 啦。

当然，`__ob__` 的作用不仅仅是为了在拦截器中访问 Observer 实例这么简单，还可以用来标记当前 value 是否已经被 Observer 转换成了响应式数据。

也就是说，所有被侦测了变化的数据身上都会有一个 `__ob__` 属性来表示它们是响应式的。上一节中的 `observe` 函数就是通过 `__ob__` 属性来判断：如果 value 是响应式的，则直接返回 `__ob__`；如果不是响应式的，则使用 `new Observer` 来将数据转换成响应式数据。

当 value 身上被标记了 `__ob__` 之后，就可以通过 `value.__ob__` 来访问 Observer 实例。如果是 Array 拦截器，因为拦截器是原型方法，所以可以直接通过 `this.__ob__` 来访问 Observer 实例。例如：

```javascript
;[
'push',
'pop',
'shift',
'unshift',
'splice',
'sort',
'reverse'
]
.forEach(function (method) {
	// 缓存原始方法
    const original = arrayProto[method]
    Object.defineProperty(arrayMethods, method, {
     value: function mutator (...args) {
       const ob = this.__ob__ // 新增
       return original.apply(this, args)
     },
     enumerable: false,
     writable: true,
     configurable: true
    })
})
```

在上面的代码中，我们在 `mutator` 函数里通过 `this.__ob__` 来获取 Observer 实例。

# 3.9 向数组的依赖发送通知

当侦测到数组发生变化时，会向依赖发送通知。此时，首先要能访问到依赖。前面已经介绍过如何在拦截器中访问 Observer 实例，所以这里只需要在 Observer 实例中拿到 `dep` 属性，然后直接发送通知就可以了：

```javascript
;[
    'push',
    'pop',
    'shift',   
    'unshift',
    'splice',
    'sort',
    'reverse'
]
.forEach(function (method) {
    // 缓存原始方法
    const original = arrayProto[method]
    def(arrayMethods, method, function mutator (...args) {
        const result = original.apply(this, args)
        const ob = this.__ob__
        ob.dep.notify() // 向依赖发送消息
        return result
    })
})
```

在上面的代码中，我们调用了 `ob.dep.notify()` 去通知依赖（Watcher）数据发生了改变。

# 3.10 侦测数组中元素的变化

前面说过如何侦测数组的变化，指的是数组自身的变化，比如是否新增一个元素，是否删除一个元素等。

其实数组中保存了一些元素，它们的变化也是需要侦测的。比如，当数组中 object 身上某个属性的值发生了变化时，也需要发送通知。

此外，如果用户使用了 `push` 往数组中新增了元素，这个新增元素的变化也需要侦测。

也就是说，所有响应式数据的子数据都要侦测，不论是 Object 中的数据还是 Array 中的数据。

这里我们先介绍如何侦测所有数据子集的变化，下一节再来介绍如何侦测新增元素的变化。

前面介绍 Observer 时说过，其作用是将 object 的所有属性转换为 getter/setter 的形式来侦测变化。现在 Observer 类不光能处理 Object 类型的数据，还可以处理 Array 类型的数据。

所以，我们要在 Observer 中新增一些处理，让它可以将 Array 也转换成响应式的：

```javascript
export class Observer {
    constructor (value) {
        this.value = value
        def(value, '__ob__', this)

        // 新增
        if (Array.isArray(value)) {
        	this.observeArray(value)
        } else {
        	this.walk(value)
        }
	}
    /**
    * 侦测Array中的每一项
    */
    observeArray (items) {
        for (let i = 0, l = items.length; i < l; i++) {
    		observe(items[i])
        }
    }
}
```

在上面的代码中，我们在 Observer 中新增了对 Array 类型数据的处理逻辑。

这里新增了 `observeArray` 方法，其作用是循环 Array 中的每一项，执行 `observe` 函数来侦测变化。前面介绍过 `observe` 函数，其实就是将数组中的每个元素都执行一遍 `new Observer`，这很明显是一个递归的过程。

现在只要将一个数据丢进去，Observer 就会把这个数据的所有子数据转换成响应式的。接下来，我们介绍如何侦测数组中新增元素的变化。

# 3.11 侦测新增元素的变化

数组中有一些方法是可以新增数组内容的，比如 `push`，而新增的内容也需要转换成响应式来侦测变化，否则会出现修改数据时无法触发消息等问题。因此，我们必须侦测数组中新增元素的变化。

## 3.11.1 获取新增元素

想要获取新增元素，我们需要在拦截器中对数组方法的类型进行判断。如果操作数组的方法是 `push`、`unshift` 和 `splice`（可以新增数组元素的方法），则把参数中新增的元素拿过来，用 Observer 来侦测：

```javascript
;[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]
.forEach(function (method) {
    // 缓存原始方法
    const original = arrayProto[method]
    def(arrayMethods, method, function mutator (...args) {
        const result = original.apply(this, args)
     	const ob = this.__ob__
        let inserted
         switch (method) {
           case 'push':
           case 'unshift':
             inserted = args
             break
           case 'splice':
             inserted = args.slice(2)
             break
         }
         ob.dep.notify()
         return result
    })
 })
```

在上面的代码中，我们通过 `switch` 对 `method` 进行判断，如果 `method` 是 `push`、`unshift`、`splice` 这种可以新增数组元素的方法，那么从 `args` 中将新增元素取出来，暂存在 `inserted` 中。

接下来，我们要使用 Observer 把 `inserted` 中的元素转换成响应式的。

## 3.11.2 使用 Observer 侦测新增元素

前面介绍过 Observer 会将自身的实例附加到 `value` 的 `__ob__` 属性上。所有被侦测了变化的数据都有一个 `__ob__` 属性，数组元素也不例外。

因此，我们可以在拦截器中通过 `this` 访问到 `__ob__`，然后调用 `__ob__` 上的 `observeArray` 方法就可以了：

```javascript
;[
'push',
'pop',
'shift',
'unshift',
'splice',
'sort',
'reverse'
]
.forEach(function (method) {
	// 缓存原始方法
   	const original = arrayProto[method]
   	def(arrayMethods, method, function mutator (...args) {
         const result = original.apply(this, args)
         const ob = this.__ob__
         let inserted
         switch (method) {
           case 'push':
           case 'unshift':
             inserted = args
             break
           case 'splice':
            inserted = args.slice(2)
             break
        }
       if (inserted) ob.observeArray(inserted) // 新增
       ob.dep.notify()
       return result
	})
})
```

在上面的代码中，我们从 `this.__ob__` 上拿到 Observer 实例后，如果有新增元素，则使用 `ob.observeArray` 来侦测这些新增元素的变化。

# 3.12 关于 Array 的问题

前面介绍过，对 Array 的变化侦测是通过拦截原型的方式实现的。正是因为这种实现方式，其实有些数组操作 Vue.js 是拦截不到的，例如：

```javascript
this.list[0] = 2
```

即修改数组中第一个元素的值时，无法侦测到数组的变化，所以并不会触发 re-render 或 watch 等。

例如：

```javascript
this.list.length = 0
```

这个清空数组操作也无法侦测到数组的变化，所以也不会触发 re-render 或 watch 等。

因为 Vue.js 的实现方式决定了无法对上面举的两个例子做拦截，也就没有办法响应。在 ES6 之前，无法做到模拟数组的原生行为，所以拦截不到也是没有办法的事情。ES6 提供了元编程的能力，所以有能力拦截，我猜测未来 Vue.js 很有可能会使用 ES6 提供的 Proxy 来实现这部分功能，从而解决这个问题。

# 3.13 总结

Array 追踪变化的方式和 Object 不一样。因为它是通过方法来改变内容的，所以我们通过创建拦截器去覆盖数组原型的方式来追踪变化。

为了不污染全局 `Array.prototype`，我们在 Observer 中只针对那些需要侦测变化的数组使用 `__proto__` 来覆盖原型方法，但 `__proto__` 在 ES6 之前并不是标准属性，不是所有浏览器都支持它。因此，针对不支持 `__proto__` 属性的浏览器，我们直接循环拦截器，把拦截器中的方法直接设置到数组身上来拦截 `Array.prototype` 上的原生方法。

Array 收集依赖的方式和 Object 一样，都是在 getter 中收集。但是由于使用依赖的位置不同，数组要在拦截器中向依赖发消息，所以依赖不能像 Object 那样保存在 `defineReactive` 中，而是把依赖保存在了 Observer 实例上。

在 Observer 中，我们对每个侦测了变化的数据都标上印记 `__ob__`，并把 this（Observer 实例）保存在 `__ob__` 上。这主要有两个作用，一方面是为了标记数据是否被侦测了变化（保证同一个数据只被侦测一次），另一方面可以很方便地通过数据取到 `__ob__`，从而拿到 Observer 实例上保存的依赖。当拦截到数组发生变化时，向依赖发送通知。

除了侦测数组自身的变化外，数组中元素发生的变化也要侦测。我们在 Observer 中判断如果当前被侦测的数据是数组，则调用 `observeArray` 方法将数组中的每一个元素都转换成响应式的并侦测变化。

除了侦测已有数据外，当用户使用 `push` 等方法向数组中新增数据时，新增的数据也要进行变化侦测。我们使用当前操作数组的方法来进行判断，如果是 `push`、`unshift` 和 `splice` 方法，则从参数中将新增数据提取出来，然后使用 `observeArray` 对新增数据进行变化侦测。

由于在 ES6 之前，JavaScript 并没有提供元编程的能力，所以对于数组类型的数据，一些语法无法追踪到变化，只能拦截原型上的方法，而无法拦截数组特有的语法，例如使用 `length` 清空数组的操作就无法拦截。



