





## 2.3 如何收集依赖                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        

如何收集依赖？

思考一下，我们之所以要观察数据，其目的是当数据的属性发生变化时，可以通知那些曾经使用了该数据的地方。

举个例子：

```vue
<template>
	<h1>{{ name }}</h1>
</template>
```

该模板中使用了数据 name，所以当它发生变化时，要向使用了它的地方发送通知。

>注意：在 Vue.js 2.0 中，模板使用数据等同于组件使用数据，所以当数据发生变化时，会将通知发送到组件，然后组件内部再通过虚拟 DOM 重新渲染。

对于上面的问题，我的回答是，先收集依赖，即把用到数据 name 的地方收集起来，然后等属性发生变化时，把之前收集好的依赖循环触发一遍就好了。 

总结起来，其实就一句话， **`在 getter 中收集依赖，在 setter 中触发依赖`**。



## 2.4 依赖收集在哪里

现在我们已经有了很明确的目标，就是要在 getter 中收集依赖，那么要把依赖收集到哪里去呢？

思考一下，首先想到的是 **`每个 key 都有一个数组`** ，用来 **`存储当前 key 的依赖`** 。假设依赖是一个函数，保存在 **`window.target`**  上，现在就可以把 defineReactive 函数稍微改造一下：

```                                                                                                                                                                                                                                                                                                                                                                                                                                                   javascript
function defineReactive (data, key, val) {
    let dep = [];
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.push(window.target);
            return val;
        },
        set: function (newVal) {
            if(val === newVal) {
                return
            }
            
            for (let i = 0; i < dep.length; i++) {
                dep[i](newVal, val)
            }
            
            val = newVal;
        }
    })
}                                                                                  
```

这里我们新增了数组 dep，用来存储被收集的依赖。

然后在 set 被触发时，循环 dep 以触发收集到的依赖。

但是这样写有点耦合，我们把依赖收集的代码封装成一个 Dep 类，它专门帮助我们管理依赖。使用这个类，我们可以收集依赖、删除依赖或者向依赖发送通知等。其代码如下：

```javascript
export default class Dep {
    constructor() {
        this.subs = [];
    }
    
    addSub (sub) {
        this.subs.push(sub);
    }
    
    removeSub (sub) {
        remove(this.subs, sub);
    }
    
    depend() {
        if (window.target) {
            this.addSub(window.target);
        }
    }
    
    notify () {
        const subs = this.subs.slice();
        for (let i = 0; l = subs.length; i < l; i++) {
            subs[i].update();
        }
    }
}

function remove (arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item);
        
        if(index > -1) {
            return arr.splice(index, 1);
        }
    }
}

function defineReactive (data, key, val) {
    let dep = new Dep();
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.depend();
            return val;
        },
        set: function (newVal) {
            if(val === newVal) {
                return
            }
            
            val = newVal;
            dep.notify();
        }
    })
}
```

此时代码看起来清晰多了，这也顺便回答了上面的问题，依赖收集到哪儿？ **`收集到 Dep 中`** 。



## 2.5 依赖是谁

在上面的代码中，我们收集的依赖是 **`window.target`** ，那么它到底是什么？我们究竟要收集谁呢？

收集谁，换句话说，就是当属性发生变化后，通知谁。

我们要通知用到数据的地方，而使用这个数据的地方有很多，而且类型还不一样，既有 **`可能是模板，也有可能是用户写的一个 watch`** ，这时需要抽象出一个集中处理这些情况的类。然后，我们在依赖收集阶段只收集这个封装好的类的实例进来，通知也只通知它一个。接着，它再负责通知其他地方。所以，我们要抽象的这个东西需要先起一个好听的名字。嗯，就叫它 **`watcher`** 吧。



## 2.6 什么是 watcher

watcher 是一个中介的角色，数据发生变化时通知它，然后它再通知其他地方。

关于 watcher，先看一个经典的使用方式：

```                                                                                                                                                                                                                                                                                                                                                                                     javascript
// keypath
vm.$watch('a.b.c', function (newVal, oldVal) {
	
}
```

这段代码表示当 data.a.b.c 属性发生变化时，触发第二个参数中的函数。

思考一下，怎么实现这个功能呢？好像只要把 **`这个 watcher 实例添加到 data.a.b.c 属性的 Dep 中就行了`** 。然后，当 data.a.b.c 的值发生变化时，通知 watcher。接着，watcher 再执行参数中的回调函数。

好，思考完毕，写出如下代码：

```javascript
export default class Watcher {
    constructor (vm, expOrFn, cb) {
        this.vm = vm;
        this.getter = parsePath(expOrFn);
        this.cb = cb;
        this.value = this.get();
    }
    
    get() {
        window.target = this;
        let value = this.getter.call(this.vm, this.vm);
        window.target = undefined;
        return value;                                  
    }
    
    update () {
        const oldValue = this.value;
        this.value = this.get();
        this.cb.call(this.vm, this.value, oldValue);
    }
}

const bailRE = /[^\w.$]/;
function parsePath (path) {
    if (bailRE.test(path)) {                                                                                                     
        return
    }
    
    const segments = path.split('.');
    return function (obj) {
        for (let i = 0; i < segments.length; i++) {
            if (!obj) return;
            obj = obj[segments[i]];
        }
        
        return obj;
    }
}
```

 **`parsePath`** 函数的用法：

```javascript
const getPath = parsePath('a.b.c');
const myObject = { a: { b: { c: 10 } } };
const value = getPath(myObject); // value will be 10

const getPath2 = parsePath('x.y.z');
const myObject2 = { x: { y: { z: 'hello' } } };
const value2 = getPath2(myObject2); // value2 will be 'hello'

const invalidPath = parsePath('a.b[0]'); // returns undefined because of '['
```





## 2.7 递归侦测所有 key

```                           javascript
export class Observer {
    constructor (value) {
        this.value = value;
        
        if(!Array.isArray(value)) {
            this.walk(value);                                                                                                   
        }                    
    }
    
    /** 
     * walk 会将每一个属性都转换成 getter/setter 的形式来侦测变化
     * 这个方法只有在数据类型为 Object 时被调用
     */
     walk (obj) {
         const keys = Object.keys(obj);
         for (let i = 0; i < keys.length; i++) {
             defineReactive(obj, keys[i], obj[keys[i]]);
         } 
     }
}

function defineReactive (data, key, val) {
    // 新增，递归子属性
    if (typeof val === 'object') {
        new Observer(val);
    }
    
    let dep = new Dep();
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.depend();
            return val;
        },
        set: function (newVal) {
            if(val === newVal) {
                return
            }
            
            val = newVal;
            dep.notify();
        }
    })
}
```



在上面的代码中，我们定义了 Observer 类，它用来将一个正常的 object 转换成被侦测的 object。

然后判断数据的类型，只有 object 类型的数据才会调用 walk 将每一个属性转换成 getter/setter 的形式来侦测变化。

最后，在 defineReactive 中新增 new Observer(val) 来递归子属性，这样我们就可以把 data 中的所有属性（包括子属性）都转换成 getter/setter 的形式来侦测变化。

当 data 中的属性发生变化时，与这个属性对应的依赖就会接收到通知。

也就是说，只要我们将一个 object 传到 Observer 中，那么这个 object 就会变成响应式的 object。



## 2.8 关于 Object 的问题                    

比如，向 object 添加属性：

```                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                javascript
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



在 action 方法中，我们在 obj 上面新增了 name 属性，Vue.js 无法侦测到这个变化，所以不会向依赖发送通知。

再比如，从 obj 中删除一个属性：

```javascript
var vm = new Vue({
    el: '#el',
    template: '#demo-template',
    methods: {
        action() {
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

在上面的代码中，我们在 action 方法中删除了 obj 中的 name 属性，而 Vue.js 无法侦测到这个变化，所以不会向依赖发送通知。

Vue.js 通过 Object.defineProperty 来将对象的 key 转换成 getter/setter 的形式来追踪变化，但 getter/setter **`只能追踪一个数据是否被修改`** ， **`无法追踪新增属性和删除属性，所以才会导致上面例子中提到的问题`** 。                                                                                                                                                                                                                                                                                                                                                                                                                                                

但这也是没有办法的事，因为在 ES6 之前，JavaScript 没有提供元编程的能力，无法侦测到一个新属性被添加到了对象中，也无法侦测到一个属性从对象中删除了。为了解决这个问题，Vue.js 提供了两个 API，vm.$set 与 vm.$delete 。

​                                                                                                                                                                                                                                                                                                                                                     

