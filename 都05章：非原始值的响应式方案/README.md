# 5.1 理解 Proxy 与 Reflect

既然 Vue.js 3 的响应式数据是基于 Proxy 实现的，那么我们就有必要了解 Proxy 以及与之相关联的 Reflect。什么是 Proxy 呢？简单地说，使用 Proxy 可以创建一个代理对象。它能够实现对**其他对象**的代理，这里的关键词是**其他对象**，也就是说，Proxy 只能代理对象，无法代理非对象值，例如字符串、布尔值等。那么，**代理**指的是什么？所谓代理，指的是对一个对象**基本语义**的代理，它允许我们**拦截**并**重新定义**对一个对象的基本操作。这句话的关键词比较多，我们逐一解释。
什么是**基本语义**？给出一个对象 obj，可以对它进行一些操作，例如读取属性值、设置属性值：
```javascript
obj.foo // 读取属性 foo 的值
obj.foo++ // 读取和设置属性 foo 的值
```
类似这种读取，设置属性值的操作，就属于基本语义的操作，即基本操作。既然是基本操作，那么它它就可以使用 Proxy 拦截：
```javascript
const p = new Proxy(obj, {
	// 拦截读取属性操作
	get() { /*...*/ },
	// 拦截设置属性操作
	set() { /*...*/ }
})
```
如以上代码所示，Proxy 构造函数接受两个参数。第一个参数是被代理的对象，第二个参数也是一个对象，这个对象是一组夹子（trap）。其中 get 函数用来拦截读取操作，set 函数用来拦截设置操作。
在 JavaScript 的世界里，万物皆对象。例如一个函数也是一个对象，所以调用函数也是对一个对象的基本操作：
```javascript
const fn = (name) => {
	console.log('我是：', name);
}

// 调用函数是对对象的基本操作
fn()
```
因此，我们可以用 Proxy 来拦截函数的调用操作，这里我们使用 apply 拦截函数的调用：
```javascript
const p2 = new Proxy(fn, {
	// 使用 apply 拦截函数引用
	apply(target, thisArg, argArray) {
		target.call(thisArg, ...argArray)
	}
})

p2('hcy') // 输出：'我是：hcy'
```
上面两个例子说明了什么是基本操作。Proxy 只能够拦截对一个对象的基本操作，那么，什么是非基本操作呢？其实调用对象下的方法就是典型的非基本操作，我们叫它**复合操作**：
```javascript
obj.fn()
```
实际上，调用一个对象下的方法，是由两个基本语义组成的，第一个基本语义是 get，即先通过 get 操作得到 obj.fn 属性。第二个基本语义是函数调用，即通过 get 得到 obj.fn 的值后再调用它，也就是我们上面说的 apply。理解 Proxy 只能够代理对象的基本语义很重要，后续我们讲解如何实现对数组或 Map、Set 等数据类型的代理时，都利用了 Proxy 的这个特点。
理解了 Proxy，我们再来讨论 Reflect。Reflect 是一个全局对象，其下有许多方法，例如：
```javascript
Reflect.get()
Reflect.set()
Reflect.apply()
// ...
```
你可能已经注意到了，Reflect 下的方法与 Proxy 的拦截器方法名字相同，其实这不是偶然。任何在 Proxy 的拦截器中能够找到的方法，都能够在 Reflect 中找到同名函数，那么这些函数的作用是是什么呢？其实它们的作用一点儿都不神秘。拿 Reflect.get 函数来说，它的功能就是提供了访问一个对象属性的默认行为，例如下面两个操作是等价的：
```javascript
var obj = { foo: 1 };

// 直接读取
console.log(obj.foo); // 1
// 使用 Reflect.get 读取
console.log(Reflect.get(obj, 'foo')) // 1
```
可能有的读者会产生顾问：既然操作等价，那么它存在的意义是什么呢？实际上 Reflect.get 函数还能接受第三个参数，即指定接收者 receiver，你可以把它理解为函数调用过程中的 this，例如：
```javascript
const obj = { foo: 1 };

// 直接读取
console.log(obj.foo); // 1
// 使用 Reflect.get 读取
conole.log(Reflect.get(obj, 'foo')) // 1;
```