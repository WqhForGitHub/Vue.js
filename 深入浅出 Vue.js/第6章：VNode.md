# 6.1 什么是 VNode

在 Vue.js 中存在一个 VNode 类，使用它可以实例化不同类型的 vnode 实例，而不同类型的 vnode 实例各自表示不同类型的 DOM 元素。例如，DOM 元素有 **`元素节点、文本节点和注释节点`** 等，vnode 实例也会对应着有 **`元素节点、文本节点和注释节点`** 等。VNode 类的代码如下：

```                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   javascript
export default class VNode {
    constructor (tag, data, children, text, elm, context, componentOptions, asyncFactory) {
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
        this.ns = undefined;
        this.context = context;
        this.functionalContext = undefined;
        this.functionalOptions = undefined;
        this.functionalScopeId = undefined;
        this.key = data && data.key;
        this.componentOptions = componentOptions;
        this.componentInstance = undefined;
        this.parent = undefined;
        this.raw = false;
        this.isStatic = false;
        this.isRootInsert: true;
        this.isComment = false;
        this.isCloned = false;
        this.isOnce = false;
        this.asyncFactory = asyncFactory;
        this.asyncMeta = undefined;
        this.isAsyncPlaceholder = false;
    }
    
    get child() {
        return this.componentInstance;
    }
} 
```



从上面的代码可以看出，vnode 只是一个名字，本质上其实是 JavaScript 中一个普通的对象，是从 VNode 类实例化的对象。我们用这个 JavaScript 对象来描述一个真实 DOM 元素的话，那么该 DOM 元素上的所有属性在 VNode 这个对象上都存在对应的属性。简单来说，vnode 可以理解成 **`节点描述对象`**，它描述了应该怎样去创建真实的 DOM 节点。例如：tag 表示一个元素节点的名称，text 表示一个文本节点的文本，children 表示子节点等。vnode 表示一个真实的 DOM 元素，所有真实的 DOM 节点都使用 vnode 创建并插入到页面中。

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/6/6.1.png?raw=true)

上图展示了使用 vnode 创建真实 DOM 并渲染到视图的过程。可以得知，vnode 和视图是一一对应的。我们可以把 vnode 理解成 JavaScript 对象版本的 DOM 元素。从上图中可以得知，渲染视图的过程是 **`先创建 vnode，然后再使用 vnode 去生成真实的 DOM 元素，最后插入到页面渲染视图`** 。





# 6.2 VNode 的作用

由于每次渲染视图时都是先创建 vnode，然后使用它创建真实 DOM 插入到页面中，所以可以将上一次渲染视图时所创建的 vnode 缓存起来，之后每当需要重新渲染视图时，将新创建的 vnode 和上一次缓存的 vnode 进行对比，查看它们之间有哪些不一样的地方，找出这些不一样的地方并基于此去修改真实的 DOM。Vue.js 目前对状态的侦测策略采用了中等粒度。**`当状态发生变化时，只通知到组件级别，然后组件内使用虚拟 DOM 来渲染视图`** 。如图，当某个状态发生改变时，只通知使用了这个状态的组件。也就是说，只要组件使用的众多状态中有一个发生了变化，那么整个组件就要重新渲染。



![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/6/6.2.png?raw=true)



如果组件只有一个节点发生了变化，那么重新渲染整个组件的所有节点，很明显会造成很大的性能浪费。**`因此，对 vnode 进行缓存，并将上一次缓存的 vnode 和当前新创建的 vnode 进行对比，只更新发生变化的节点就变得尤为重要。这也是 vnode 最重要的一个作用`** 。

​                   





# 6.3 VNode 的类型

vnode 的类型有以下几种：

* **`注释节点`** 
* **`文本节点`** 
* **`元素节点`** 
* **`组件节点`** 
* **`函数式组件`** 
* **`克隆节点`** 



## 1. 注释节点

由于创建注释节点的过程非常简单，所以直接通过代码来介绍它有哪些属性：

``` javascript
export const createEmptyNode = text => {
    const node = new VNode();
    node.text = text;
    node.isComment = true;
    return node;
}
```

可以看出，一个注释节点只有两个有效属性，**`text 和 isComment`** ，其余属性全是默认的 undefined 或者 false。

**`例如，一个真实的注释节点：`**

```html
<!-- 注释节点 -->
```



**`所对应的 vnode 是下面的样子：`** 

```javascript
{
    text: "注释节点",
    isComment: true
}
```

 

## 2. 文本节点

**`文本节点的创建过程也非常简单，我们也可以直接通过代码来了解它有哪些有效属性：`**

```javascript
export function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val));
}
```

**`通过上面的代码可以了解到，当文本类型的 vnode 被创建时，它只有一个 text 属性：`**

```javascript
{
	text: "Hello Berwin"
}
```



## 3. 克隆节点   

**`克隆节点是将现有节点的属性复制到新节点中，让新创建的节点和被克隆节点的属性保持一致，从而实现克隆效果。它的作用是优化静态节点和插槽节点。`**

以静态节点为例，当组件内的某个状态发生变化后，当前组件会通过虚拟 DOM 重新渲染视图，静态节点因为它的内容不会改变，所以除了 **`首次渲染需要执行渲染函数获取 vnode 之外，后续更新不需要执行渲染函数重新生成 vnode`** 。因此，这时就会 **`使用创建克隆节点的方法将 vnode 克隆一份，使用克隆节点进行渲染`** 。这样就不需要重新执行渲染函数生成新的静态节点的 vnode，从而提升一定程度的性能。                                                                                                                                                                                                                                                                                   

```javascript
export function cloneVNode(vnode, deep) {
    const cloned = new VNode(
        vnode.tag,
        vnode.data,
        vnode.children,
        vnode.text,
        vnode.elm,
        vnode.context,
        vnode.componentOptions,
        vnode.asyncFactory
    )
    
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.isCloned = true;
    
    if(deep && vnode.children) {
        cloned.children = cloneVNodes(vnode.children);
    }
    
    return cloned;
}
```

**`克隆节点和被克隆节点之间的唯一区别是 isCloned 属性，克隆节点的 isCloned 为 true，被克隆的原始节点的 isCloned 为 false`**。





## 4. 元素节点

元素节点通常会存在以下 4 种有效属性。

* **`tag`** ：顾名思义，tag 就是一个节点的名称，例如 p、ul、li 和 div 等。
* **`data`** ：该属性包含了一些节点上的数据，比如 attrs、class 和 style 等。
* **`children`** ：当前节点的子节点列表。
* **`context`** ：它是当前组件的 Vue.js 实例。

例如，一个真实的元素节点：

```html
<p><span>Hello</span><span>Berwin</span></p>
```

所对应的 vnode 是下面的样子：

```javascript
{
    children: [VNode, VNode],
    context: {},                                 
    data: {},
    tag: "p"
}
```

​                                                          

## 5. 组件节点

组件节点和元素节点类似，有以下两个独有的属性。

* **`componentOptions`**：组件节点的选项参数，其中包含 propsData、tag 和 children 等信息。
* **`componentInstance`**：组件的实例，也是 Vue.js 的实例。事实上，在 Vue.js 中，每个组件都是一个 Vue.js 实例。

一个组件节点：

```html
<child></child>
```

所对应的 vnode 是下面的样子：

```javascript
{
    componentInstance: {},
    componentOptions: {},
    context: {},
    data: {},
    tag: "vue-component-1-child"
}
```



## 6. 函数式组件

函数式组件和组件节点类似，它有两个独有的属性 **`functionalContext`** 和 **`functional-Options`**。

通常，一个函数式组件的 vnode 是下面的样子：

```javascript
{
    functionalContext: {},
    functionalOptions: {},
    context: {},
    data: {},
    tag: "div"
}
```

