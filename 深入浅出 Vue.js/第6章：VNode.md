# 6.1 什么是 VNode





# 6.3 VNode 的类型

vnode 的类型有以下几种：

* **`注释节点`** 
* **`文本节点`** 
* **`元素节点`** 
* **`组件节点`** 
* **`函数式组件`** 
* **`克隆节点`** 



## 1. 注释节点

``` javascript
export const createEmptyNode = text => {
    const node = new VNode();
    node.text = text;
    node.isComment = true;
    return node;
}
```

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

**`克隆节点和被克隆节点之间的唯一区别是 isCloned 属性，克隆节点的 isCloned 为 true，被克隆的原始节点的 isCloned 为 false`**

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







## 4. 元素节点

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

