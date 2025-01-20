以下是针对 Vue 2.5.2 源代码进行文件用途解析



### 变化侦测

1. 依赖收集：`/src/core/observer/dep.js`

2. 依赖是谁？一般来讲是用到属性的组件实例：`/src/core/observer/watcher.js`

3. Array 的变化侦测：`/src/core/observer/array.js`

4. vm.$watch：`/src/core/observer/watcher.js`
5. vm.$set：`/src/core/observer/index.js`
6. vm.$delete：`/src/core/observer/index.js`



### 虚拟 DOM

1. vnode 节点的定义：`/src/core/vdom/vnode.js`
2. 元素节点的创建：`/src/core/vdom/create-element.js`
3. 组件节点的创建：`/src/core/vdom/create-component.js`
4. 函数式组件的创建：`/src/core/vdom/create-functional-component.js`
5. diff 算法，新旧虚拟 DOM 比对：`src/core/vdom/patch.js`

