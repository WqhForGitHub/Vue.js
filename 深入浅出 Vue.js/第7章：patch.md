虚拟 DOM 最核心的部分是 **`patch`** ，它可以将  **`vnode 渲染成真实的 DOM`** 。 



# 7.1 patch 介绍

对比两个 vnode 之间的差异只是 patch 的一部分，这是手段，而不是目的。patch 的目的其实是 **`修改 DOM 节点`** ，也可以理解为渲染视图。上面说过，patch 不是暴力替换节点，而是在现有 DOM 上进行修改来达到渲染视图的目的。对现有 DOM 进行修改需要做三件事：

* **`创建新增的节点`** 
* **`删除已经废弃的节点`** 
* **`修改需要更新的节点`**                                                                                                                                                                                                                                                                                                                                                                                                                                                                        

   

## 1. 新增节点                                      

首先，新增节点的一个很明显的场景就是，当 oldVnode 不存在而 vnode 存在时，就需要使用 vnode 生成真实的 DOM 元素并将其插入到视图当中去。                   这通常会发生在首次渲染中。因为首次渲染时，DOM 中不存在任何节点，所以 oldVnode 是不存在的。 

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.1.png?raw=true)

还有一种情况也需要新增节点：当 vnode 和 oldVnode 完全不是同一个节点时，需要使用 vnode 生成真实的 DOM 元素并将其插入到视图当中.

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.2.png?raw=true)

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.3.png?raw=true)



## 2. 删除节点

所以 vnode 中不存在的节点都属于被废弃的节点，而被废弃的节点需要从 DOM 中删除。当 oldVnode 和 vnode 完全不是同一个节点时，在 DOM 中需要使用 vnode 创建的新节点替换 oldVnode 所对应的旧节点，而替换过程是将新创建的 DOM 节点插入到旧节点的旁边，然后再将旧节点删除，从而完成替换过程。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       



## 3. 更新节点

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.4.png?raw=true)



## 4. 小结

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.5.png?raw=true)





# 7.2 创建节点

事实上，只有三种类型的节点会被创建并插入到 DOM 中：**`元素节点、注释节点和文本节点`**。                                                                                        

**`而要判断 vnode 是否是元素节点，只需要判断它是否具有 tag 属性即可`** 。如果一个 vnode 具有 tag 属性，就认为它是元素属性。接着，我们就可以调用当前环境下的 createElement 方法（在浏览器环境下就是 **`document.createElement`** ）来创建真实的元素节点，当一个元素节点被创建后，接下来要做的事情就是将它插入到指定的父节点中。将元素渲染到视图的过程非常简单。只需要调用当前环境下的 **`appendChild`** 方法（在浏览器环境下就是调用 **`parentNode.appendChild`** ），就可以将一个元素插入到指定的父节点中。如果这个指定的父节点已经被渲染到视图，那么把元素插入到它的下面将会自动将元素渲染到视图。其实创建元素节点还缺了一个步骤，我们刚刚没有说。元素节点通常都会有 **`子节点（children） ，所以当一个元素节点被创建后，我们需要将它的子节点也创建出来并插入到这个刚创建出的节点下面`** 。创建子节点的过程是一个递归过程。vnode 中的 children 属性保存了当前节点的所有子虚拟节点（child virtual node），所以只需要将 vnode 中的 children 属性循环一遍，将每个子虚拟节点都执行一遍创建元素的逻辑，就可以实现我们想要的                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      功能。创建子节点时，子节点的父节点就是当前刚创建出来的这个节点，所以子节点被创建后，会被插入到当前节点的下面。当所有子节点都创建完并插入到当前节点中之后，我们把当前节点插入到指定父节点的下面。如果这个指定的父节点已经被渲染到视图中，那么将当前这个节点插入进去之后，会将当前节点（包括其子节点）渲染到视图中。



![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.6.png?raw=true)



![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.7.png?raw=true)

除了元素节点外，其实还要创建注释节点和文本节点。

在创建节点时，如果 vnode 中不存在 tag 属性，那么它可能会是另外两种节点：**`注释节点和文本节点`**。当发现一个 vnode 的 tag 属性不存在时，我们可以用 isComment 属性来判断它是注释节点还是文本节点。如果是文本节点，则调用当前环境下的 **`createTextNode`** 方法（浏览器环境下调用 **`document.createTextNode`** ）来创建真实的文本节点并将其插入到指定的父节点中；如果是注释节点，则调用当前环境下的 **`createComment`** 方法（浏览器环境下调用 **`document.createComment`** 方法）来创建真实的注释节点并将其插入到指定的父节点中。



下图给出了创建一个节点并将其渲染到视图的全过程。

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.8.png?raw=true)



# 7.4 更新节点                                               



## 1. 静态节点

什么是静态节点？**`静态节点指的是那些一旦渲染到界面上之后，无论日后状态如何变化，都不会发生任何变化的节点`**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         。例如：

```html
<p>我是静态节点，我不需要发生变化</p>
```



## 2. 新虚拟节点有文本属性                                                                                                                      

vnode 和 oldVnode 不是静态节点，并且有不同的属性时，要以 vnode 为准来更新视图。根据 vnode 是否有 text 属性，更新节点可以分为两种不同的情况。

如果 vnode 有 text 属性，那么不论之前的旧节点的子节点是什么，直接调用 **`setTextContent`**  方法来将视图中 DOM 节点的内容改为 vnode 的 text 属性所保存的文字。                                                                                                                                                                                                                                                                    



## 3. 新虚拟节点无文本属性

如果新创建的虚拟节点没有 text 属性，那么它就是一个 **`元素节点`** 。元素节点通常会有子节点，也就是 children 属性，但也有可能没有子节点，所以存在两种不同的情况。



### 1. 有 children 的情况

#### 1. oldVnode 有 children 属性

详细的对比并更新                                                                                                                                                                 



#### 2. oldVnode 没有 children 属性

oldVnode 要么是一个 **`空标签`** ，要么是有 **`文本的文本节点`** 。如果是文本节点，那么先把文本清空让它变成空标签，然后将 vnode 中的 children 挨个创建成真实的 DOM 元素节点并将其插入到视图中的 DOM 节点下面。                                                                                                                                                                                                                                                             



### 2. 无 children 的情况

当新创建的虚拟节点既没有 text 属性也没有 children 属性时，这说明这个新创建的节点是一个空节点，它下面既没有文本也没有子节点，这时如果 oldVnode 中有子节点就删除子节点，有文本就删除文本。有什么删什么，最后达到视图中是空标签的目的。





# 7.5 更新子节点



## 1. 更新策略



### 1. 创建子节点                      

插入到 oldChildren 中所有未处理节点的前面

### 2. 更新子节点



### 3. 移动子节点



### 4. 删除子节点                                                                                                                                                                                                                                                                 



## 2. 优化策略

  





## 3. 哪些节点是未处理过的

​                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     