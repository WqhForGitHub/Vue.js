前文没有提到响应系统，响应系统也是 Vue.js 的重要组成部分，所以我们会花费大量篇幅介绍。在本章中，我们首先讨论什么是响应式数据和副作用函数，然后尝试实现一个相对完善的响应系统。在这个过程中，我们会遇到各种各样的问题，例如如何避免无限递归？为什么需要嵌套的副作用函数？两个副作用函数之间会产生哪些影响？以及其他很多需要考虑的细节。接下来我们会详细讨论与响应式数据相关的内容。我们知道 Vue.js 3 采用 Proxy 实现响应式数据，这涉及到语言规范层面的知识。这部分内容包括如何根据语言规范实现对数据对象的代理，以及其中的一些重要细节。接下来，我们就从认识响应式数据和副作用函数开始，一步一步地了解响应系统的设计与实现。

# 4.1 响应式数据与副作用函数

副作用函数指的是会产生副作用的函数，如下面的代码所示：

```javascript
function effect() {   
	document.body.innerText = 'hello vue3'
}
```

当 `effect` 函数执行时，它会设置 `body` 的文本内容，但除了 `effect` 函数之外的任何函数都可以读取或设置 `body` 的文本内容。也就是说，`effect` 函数的执行会直接或间接影响其他函数的执行，这时我们说 `effect` 函数产生了副作用。副作用很容易产生，例如一个函数修改了全局变量，这其实也是一个副作用，如下面的代码所示：

```javascript
// 全局变量
let val = 1

function effect() {
	val = 2 // 修改全局变量，产生副作用
}
```

理解了什么是副作用函数，再来说说什么是响应式数据。假设在一个副作用函数中读取了某个对象的属性：

```javascript
const obj = { text: 'hello world' }
function effect() {
    // effect 函数的执行会读取 obj.text
    document.body.innerText = obj.text
}
```

如上面的代码所示，副作用函数 `effect` 会设置 `body` 元素的 `innerText` 属性，其值为 `obj.text`。当 `obj.text` 的值发生变化时，我们希望副作用函数 `effect` 会重新执行：

```javascript
obj.text = 'hello vue3' // 修改 obj.text 的值，同时希望副作用函数会重新执行
```

这句代码修改了字段 `obj.text` 的值，我们希望当值变化后，副作用函数自动重新执行。如果能实现这个目标，那么对象 `obj` 就是响应式数据。但很明显，以上面的代码来看，我们还做不到这一点 —— 因为 `obj` 是一个**普通对象**，当我们修改它的值时，除了值本身发生变化之外，不会有任何其他反应。下一节中我们会讨论如何让数据变成响应式数据。

# 4.2 响应式数据的基本实现

接着上文思考，如何才能让 `obj` 变成响应式数据呢？通过观察我们能发现两点线索：

- 当副作用函数 `effect` 执行时，会触发字段 `obj.text` 的**读取操作**；
- 当修改 `obj.text` 的值时，会触发字段 `obj.text` 的**设置操作**。

如果我们能**拦截**一个对象的读取和设置操作，事情就变得简单了：当读取字段 `obj.text` 时，我们可以把副作用函数 `effect` 存储到一个 “桶” 里（如图 4-1 所示）

![](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Vue.js/Vue.js%20%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0/%E7%AC%AC4%E7%AB%A0%EF%BC%9A%E5%93%8D%E5%BA%94%E7%B3%BB%E7%BB%9F%E7%9A%84%E4%BD%9C%E7%94%A8%E4%B8%8E%E5%AE%9E%E7%8E%B0/%E5%B0%86%E5%89%AF%E4%BD%9C%E7%94%A8%E5%87%BD%E6%95%B0%E5%AD%98%E5%82%A8%E5%88%B0%E6%A1%B6%E4%B8%AD.png)

接着，当设置 `obj.text` 时，再把副作用函数 `effect` 从 “桶” 里取出并执行即可（如图 4-2 所示）。

![](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Vue.js/Vue.js%20%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0/%E7%AC%AC4%E7%AB%A0%EF%BC%9A%E5%93%8D%E5%BA%94%E7%B3%BB%E7%BB%9F%E7%9A%84%E4%BD%9C%E7%94%A8%E4%B8%8E%E5%AE%9E%E7%8E%B0/%E6%8A%8A%E5%89%AF%E4%BD%9C%E7%94%A8%E5%87%BD%E6%95%B0%E4%BB%8E%E6%A1%B6%E5%86%85%E5%8F%96%E5%87%BA%E5%B9%B6%E6%89%A7%E8%A1%8C.png)

现在问题的关键变成了我们如何才能拦截一个对象属性的读取和设置操作。在 ES5 只能通过 `Object.defineProperty` 函数实现，这也是 Vue.js 2 所采用的方式。在 ES6 我们可以使用代理对象 `Proxy` 来实现，这也是 Vue.js 3 所采用的方式。

接下来我们就根据如上思路，采用 `Proxy` 来实现：

```javascript
// 存储副作用函数的桶
const bucket = new Set()

// 原始数据
const data = { text: 'hello world' }
// 对原始数据的代理
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数 effect 添加到存储副作用函数的桶中
    bucket.add(effect)
    // 返回属性值
    return target[key]
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal
    // 把副作用函数从桶里取出并执行
    bucket.forEach(fn => fn())
    // 返回 true 代表设置操作成功
    return true
  }
})
```

首先，我们创建了一个用于存储副作用函数的桶 `bucket`，它是 `Set` 类型。接着定义原始数据 `data`，`obj` 是原始数据的代理对象，我们分别设置了 `get` 和 `set` 拦截函数，用于拦截读取和设置操作。当读取属性时将副作用函数 `effect` 添加到桶里，即 `bucket.add(effect)`，然后返回属性值；当设置属性值时先更新原始数据，再将副作用函数从桶里取出并重新执行，这样我们就实现了响应式数据。可以使用下面的代码来测试一下：

```javascript
// 副作用函数
function effect() {
  document.body.innerText = obj.text
}
// 执行副作用函数，触发读取
effect()
// 1秒后修改响应式数据
setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)
```

在浏览器中运行上面这段代码，会得到期望的结果。

但是目前的实现还存在很多缺陷，例如我们直接通过名字（`effect`）来获取副作用函数，这种硬编码的方式很不灵活。副作用函数的名字可以任意取，我们完全可以把副作用函数命名为 `myEffect`，甚至是一个匿名函数，因此我们要想办法去掉这种硬编码的机制。下一节会详细讲解这一点，这里大家只需要理解响应式数据的基本实现和工作原理即可。

# 4.3 设计一个完善的响应系统

在上一节中，我们了解了如何实现响应式数据。但其实在这个过程中我们已经实现了一个微型响应系统，之所以说 “微型”，是因为它还不完善，本节我们将尝试构造一个更加完善的响应系统。

从上一节的例子中不难看出，一个响应系统的工作流程如下：

- 当读取操作发生时，将副作用函数收集到 “桶” 中；
- 当设置操作发生时，从 “桶” 中取出副作用函数并执行。

看上去很简单，但需要处理的细节还真不少。例如在上一节的实现中，我们硬编码了副作用函数的名字（`effect`），导致一旦副作用函数的名字不叫 `effect`，那么这段代码就不能正确地工作了。而我们希望的是，哪怕副作用函数是一个匿名函数，也能够被正确地收集到 “桶” 中。为了实现这一点，我们需要提供一个用来注册副作用函数的机制，如以下代码所示：

```javascript
// 用一个全局变量存储被注册的副作用函数
let activeEffect
// effect 函数用于注册副作用函数
function effect(fn) {
	// 当调用 effect 注册副作用函数时，将副作用函数 fn 赋值给 activeEffect
	activeEffect = fn;
    // 执行副作用函数
    fn();
}
```

首先，定义了一个全局变量 activeEffect，初始值是 undefined，它的作用是存储被注册的副作用函数。接着重新定义了 effect 函数，它变成了一个用来注册副作用函数的函数，effect 函数接收一个参数 fn，即要注册的副作用函数。我们可以按照如下所示的方式使用 effect 函数：

```javascript
// 一个匿名的副作用函数
effect(() => {
    documnt.body.innerText = obj.text
})
```

可以看到，我们使用一个匿名的副作用函数作为 effect 函数的参数。当 effect 函数执行时，首先会把匿名的副作用函数 fn 赋值给全局变量 activeEffect。接着执行被注册的匿名副作用函数 fn，这将会触发响应式数据 obj.text 的读取操作，进而触发代理对象 Proxy 的 get 拦截函数：

```javascript
const obj = new Proxy(data, {
    get(target, key) {
        if (activeEffect) {
            bucket.add(activeEffect); // 新增
        }
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal;
        bucket.forEach(fn => fn());
        return true;
    }
})
```

如上面的代码所示，由于副作用函数已经存储到了 activeEffect 中，所以在 get 拦截函数内应该把 activeEffect 收集到桶中，这样响应式系统就不依赖副作用函数的名字了。

但如果我们再对讨论这个系统稍加测试，例如在响应式数据 obj 上设置一个不存在的属性时：

```javascript
// 匿名副作用函数
effect(() => {
    console.log('effect run'); // 会打印 2 次
    document.body.innerText = obj.txt;
})
```

```javascript
setTimeout(() => {
	// 副作用函数中并没有读取 notExist 属性的值
    obj.notExist = 'hello vue3';
}, 1000);
```

可以看到，匿名副作用函数内部读取了字段 obj.text 的值，于是匿名副作用函数与字段 obj.text 之间会建立响应联系。接着，我们开启了一个定时器，一秒钟后为对象 obj 添加新的 notExist 属性。我们知道，在匿名副作用函数内并没有读取 obj.notExist 属性的值，所以理论上，字段 obj.notExist 并没有与副作用建立响应联系，因此，定时器内语句的执行不应该触发匿名副作用函数重新执行。但如果我们执行上述这段代码就会发现，定时器到时后，匿名副作用函数却重新执行了，这是不正确的。为了解决这个问题，我们需要重新设计桶的数据结构。

在上一节的例子中，我们使用一个 Set 数据结构作为存储副作用函数的桶。导致该问题的根本原因是，我们**没有在副作用函数与被操作的目标字段之间建立明确的联系**。例如当读取属性时，无论读取的是哪一个属性，其实都一样，都会把副作用函数收集到桶里。当设置属性时，无论设置的是哪一个属性，也都会把桶里的副作用取出并执行。副作用函数与被操作的字段之间没有明确的联系。解决方法很简单，只需要在副作用函数与被操作的字段之间建立联系即可，这就需要我们重新设计桶的数据结构，而不能简单地使用一个 Set 类型的数据作为桶了。

那应该设计怎样的数据结构呢？在回答这个问题之前，我们需要先仔细观察下面的代码：

```javascript
effect(function effectFn() {
    document.body.innerText = obj.text;
})
```

在这段代码中存在三个角色：

* 被操作（读取）的代理对象 obj
* 被操作（读取）的字段名 text
* 使用 effect 函数注册的副作用函数 effectFn

如果用 target 来表示一个代理对象所代理的原始对象，用 key 来表示被操作的字段名，用 effectFn 来表示被注册的副作用函数，那么可以为这三个角色建立如下关系：

![](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Vue.js/Vue.js%20%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0/%E7%AC%AC4%E7%AB%A0%EF%BC%9A%E5%93%8D%E5%BA%94%E7%B3%BB%E7%BB%9F%E7%9A%84%E4%BD%9C%E7%94%A8%E4%B8%8E%E5%AE%9E%E7%8E%B0/%E4%B8%89%E4%B8%AA%E8%A7%92%E8%89%B2%E5%BB%BA%E7%AB%8B%E5%85%B3%E7%B3%BB.png)

这是一种树型结构，下面举几个例子来对其进行补充说明。

如果有两个副作用函数同时读取同一个对象的属性值：

```javascript
effect(function effectFn1() {
    obj.text
})
effect(function effectFn2() {
    obj.text
})
```

那么关系如下：

![](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Vue.js/Vue.js%20%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0/%E7%AC%AC4%E7%AB%A0%EF%BC%9A%E5%93%8D%E5%BA%94%E7%B3%BB%E7%BB%9F%E7%9A%84%E4%BD%9C%E7%94%A8%E4%B8%8E%E5%AE%9E%E7%8E%B0/%E5%85%B3%E7%B3%BB2.png)

如果一个副作用函数中读取了同一个对象的两个不同属性：

```javascript
effect(function effectFn() {
    obj.text1;
    obj.text2;
})
```

那么关系如下：

![](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Vue.js/Vue.js%20%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0/%E7%AC%AC4%E7%AB%A0%EF%BC%9A%E5%93%8D%E5%BA%94%E7%B3%BB%E7%BB%9F%E7%9A%84%E4%BD%9C%E7%94%A8%E4%B8%8E%E5%AE%9E%E7%8E%B0/%E5%85%B3%E7%B3%BB3.png)

如果在不同的副作用函数中读取了两个不同对象的不同属性：

```javascript
effect(function effectFn1() {
    obj1.text1
})
effect(function effectFn2() {
    obj2.text2
})
```

那么关系如下：

![](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Vue.js/Vue.js%20%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0/%E7%AC%AC4%E7%AB%A0%EF%BC%9A%E5%93%8D%E5%BA%94%E7%B3%BB%E7%BB%9F%E7%9A%84%E4%BD%9C%E7%94%A8%E4%B8%8E%E5%AE%9E%E7%8E%B0/%E5%85%B3%E7%B3%BB4.png)

总之，这其实就是一个树型数据结构。这个联系建立起来之后，就可以解决前文提到的问题了。拿上面的例子来说，如果我们设置了 obj2.text2 的值，就只会导致 effect2 函数重新执行，并不会导致 effectFn1 函数重新执行。

接下来我们尝试用代码来实现这个新的桶。首先，需要使用 WeakMap 代替 Set 作为桶的数据结构：

```javascript
// 存储副作用函数的桶
const bucket = new WeakMap();
```

然后修改 get/set 拦截器代码：

```javascript
const obj = new Proxy(data, {
    // 拦截读取操作
    get(target, key) {
        // 没有 activeEffect，直接 return
        if (!activeEffect) return target[key];
        // 根据 target 从桶中取得 depsMap，它也是一个 Map 类型：key --> effects
        let depsMap = bucket.get(target);
        // 如果不存在 depsMap，那么新建一个 Map 并与 target 关联
        if (!depsMap) {
            bucket.set(target, (depsMap = new Map()));
        }
        // 再根据 key 从 depsMap 中取得 deps，它是一个 Set 类型，
        // 里面存储着所有与当前 key 相关联的副作用函数：effects
        let deps = depsMap.get(key);
        // 如果 deps 不存在，同样新建一个 Set 并与 key 关联
        if (!deps) {
            depsMap.set(key, (deps = new Set()))
        }
        // 最后将当前激活的副作用函数添加到桶里
        deps.add(activeEffect);
        
        // 返回属性值
        return target[key];
    },
    // 拦截设置操作
    set(target, key, newVal) {
        // 设置属性值
        target[key] = newVal;
        // 根据 target 从桶中取得 depsMap，它是 key --> effects
        const depsMap = bucket.get(target);
        if (!depsMap) return
        // 根据 key 取得所有副作用函数 effects
        const effects = depsMap.get(key);
        // 执行副作用函数
        effects && effects.forEach(fn => fn());
    }
})
```

从这段代码可以看出构建数据结构的方式，我们分别使用了 WeakMap、Map 和 Set：

* WeakMao 由 target --> Map 构成
* Map 由 key --> Set 构成

其中 WeakMap 的键是原始对象 target，WeakMap 的值是一个 Map 实例，而 Map 的键是原始对象 target 的 key，Map 的值是一个由副作用函数组成的 Set。它们的关系如下图所示。

![](https://front-end-1257950569.cos.ap-guangzhou.myqcloud.com/Vue.js/Vue.js%20%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0/%E7%AC%AC4%E7%AB%A0%EF%BC%9A%E5%93%8D%E5%BA%94%E7%B3%BB%E7%BB%9F%E7%9A%84%E4%BD%9C%E7%94%A8%E4%B8%8E%E5%AE%9E%E7%8E%B0/WeakMap%E3%80%81Map%20%E5%92%8C%20Set%20%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%B3%E7%B3%BB.png)

为了方便描述，我们把上图中的 Set 数据结构所存储的副作用函数集合称为 key 的**依赖集合**。

搞清了它们之间的关系，我们有必要解释一下这里为什么要使用 WeakMap，这其实涉及 WeakMap 和 Map 的区别，我们用一段代码来讲解：

```javascript
const map = new Map();
const weakmap = new WeakMap();

(function() {
    const foo = { foo: 1 };
    const bar = { bar: 2 };
    
    map.set(foo, 1);
    weakmap.set(bar, 2);
})()
```















































 
