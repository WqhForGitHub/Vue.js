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





# 7.3 删除节点

删除节点的过程非常简单。在 Vue.js 源码中，删除元素的代码并不多，其实现逻辑如下：

```javascript
function removeVnodes(vnodes, startIdx, endIdx) {
    for(;startIdx <= endIdx; ++startIdx) {
        const ch = vnodes[startIdx];
        if(isDef(ch)) {
            removeNode(ch.elm);
        }
    }
}
```



removeNode 用于删除视图中的单个节点，而 removeVnodes 用于删除一组指定的节点。

```javascript
const nodeOps = {
    removeChild(node, child) {
        node.removeChild(child);
    }
}

function removeNode(el) {
    const parent = nodeOps.parentNode(el);
    if(isDef(parent)) {
        nodeOps.removeChild(parent, el);
    }
}
```





# 7.4 更新节点                                               



## 1. 静态节点

什么是静态节点？ **`静态节点指的是那些一旦渲染到界面上之后，无论日后状态如何变化，都不会发生任何变化的节点`**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         。例如：

```html
<p>我是静态节点，我不需要发生变化</p>
```

上面这个 HTML 就是一个静态节点，它不会因为状态的变化而发生变化。这个节点一旦被渲染到视图之后，当应用在运行时，无论状态是否发生变化，都不会影响到这个节点，这个节点永远都不需要重新渲染。





## 2. 新虚拟节点有文本属性                                                                                                                      

vnode 和 oldVnode 不是静态节点，并且有不同的属性时，要以 vnode 为准来更新视图。根据 vnode 是否有 text 属性，更新节点可以分为两种不同的情况。

如果 vnode 有 text 属性，那么不论之前的旧节点的子节点是什么，直接调用 **`setTextContent`**  方法（在浏览器环境下是 **`node.textContent`** 方法）来将视图中 DOM 节点的内容改为虚拟节点（vnode）的 text 属性所保存的文字。



​                                                                                                                                                                                                                                                                                                                                                                                                                                                                       

## 3. 新虚拟节点无文本属性

**`如果新创建的虚拟节点没有 text 属性，那么它就是一个 元素节点 。元素节点通常会有子节点，也就是 children 属性，但也有可能没有子节点，所以存在两种不同的情况`** 。



### 1. 有 children 的情况

#### 1. oldVnode 有 children 属性   

**`详细的对比并更新`**                                                                                                                                                                  



#### 2. oldVnode 没有 children 属性

**`oldVnode 要么是一个 空标签 ，要么是有 文本的文本节点。如果是文本节点，那么先把文本清空让它变成空标签，然后将 vnode 中的 children 挨个创建成真实的 DOM 元素节点并将其插入到视图中的 DOM 节点下面`** 。                                                                                                                                                                                                                                                             



### 2. 无 children 的情况

**`当新创建的虚拟节点既没有 text 属性也没有 children 属性时，这说明这个新创建的节点是一个空节点，它下面既没有文本也没有子节点，这时如果 oldVnode 中有子节点就删除子节点，有文本就删除文本。有什么删什么，最后达到视图中是空标签的目的`** 。





# 7.5 更新子节点



## 1. 更新策略

**`本节主要针对新增节点、更新节点、移动节点、删除节点等操作进行讨论`** 。



### 1. 创建子节点                      

如果在 oldChildren 中没有找到与本次循环所指向的新子节点相同的节点，那么说明本次循环所指向的新子节点是一个新增节点。对于新增节点，我们需要执行创建节点的操作，并将新创建的节点插入到 oldChildren 中所有未处理节点的前面。当节点成功插入 DOM 后，这一轮的循环就结束了。

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.11.png?raw=true)

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.12.png?raw=true)

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.13.png?raw=true)

### 2. 更新子节点

更新节点本质上是当一个节点同时存在于 newChildren 和 oldChildren 中时需要执行的操作。如下图，两个节点是同一个节点并且位置相同，这种情况下只需要进行更新节点的操作即可。

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.14.png?raw=true)



### 3. 移动子节点

移动节点通常发生在 newChildren 中的某个节点和 oldChildren 中的某个节点是同一个节点，但是位置不同，所以在真实的 DOM 中需要将这个节点的位置以新虚拟节点的位置为基准进行移动。

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.15.png?raw=true)

但怎么得知新虚拟节点的位置是在哪里？换句话说，怎么知道应该把节点移动到哪里？

其实得到这个位置并不难。对比两个子节点列表是通过从左到右循环 newChildren 这个列表，然后每循环一个节点，就去 oldChildren 中寻找与这个节点相同的节点进行处理。也就是说，newChildren 中当前被循环到的这个节点的左边都是被处理过的。那就不难发现，**`这个节点的位置是所有未处理节点的第一个节点。所以，只要把需要移动的节点移动到所有未处理节点的最前面，就能实现我们的目的`**                                    。

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.16.png?raw=true)



### 4. 删除子节点

**`删除子节点，本质上是删除那些 oldChildren 中存在但 newChildren 中不存在的节点`** 。                                                                                                                                                                                                                                                                                                                                                                                                                      



## 2. 优化策略

如果我们把这种很快速的查找节点的方式称为快捷查找，那么它共有 4 种查找方式，分别是：

* **`新前与旧前`** 
* **`新后与旧后`** 
* **`新后与旧前`** 
* **`新前与旧后`** 



* **`新前：newChildren 中所有未处理的第一个节点`** 
* **`新后：newChildren 中所有未处理的最后一个节点`** 
* **`旧前：oldChildren 中所有未处理的第一个节点`** 
* **`旧后：oldChildren 中所有未处理的最后一个节点`** 

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.17.png?raw=true)



### 1. 新前与旧前

顾名思义，新前与旧前的意思就是尝试使用新前这个节点与旧前这个节点对比，对比它们俩是不是同一个节点。如果是同一个节点，则说明我们不费吹灰之力就在 oldChildren 中找到了这个虚拟节点，然后使用 7.4 节中介绍的更新节点操作将它们俩进行对比并更新视图。

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.18.png?raw=true)

由于新前与旧前的位置相同，所以并不需要执行移动节点的操作，只需要更新节点即可。



### 2. 新后与旧后

当新前与旧前对比后发现不是同一个节点，这时可以尝试用新后与旧后的方式来比对它们俩是否是同一个节点。新后与旧后的意思是使用新后这个节点和旧后这个节点对比，对比它们俩是不是同一个节点。如果是同一个节点，就将这两个节点进行对比并更新视图。

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.19.png?raw=true)

由于新后与旧后这两个节点的位置相同，所以只需要执行更新节点的操作即可，不需要执行移动节点的操作。                                                                                                                                           



### 3. 新后与旧前

新后与旧前的意思是使用新后这个节点与旧前这个节点进行对比，通过对比来分辨它们俩是不是同一个节点。如果是同一个节点，就对比它们俩并更新视图。

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.20.png?raw=true)

如果新后与旧前是同一个节点，那么由于它们的位置不同，所以除了更新节点外，还需要执行移动节点的操作。

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.21.png?raw=true)

当新后与旧前是同一个节点时，在真实 DOM 中除了做更新操作外，还需要将节点移动到 oldChildren 中所有未处理节点的最后面。你可能对为什么移动到 oldChildren 中所有未处理节点的最后面感到困惑，接下来我们会详细介绍为什么移动到这个位置。更新节点是以新虚拟节点为基准，子节点也不例外，因为新后这个节点是最后一个节点，所以真实 DOM 中将节点移动到最后不难理解，让我们感到困惑的是为什么移动到 **`oldChildren 中所有未处理节点的最后面`**。

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.22.png?raw=true)

​                        

### 4. 新前与旧后

新前与旧后的意思是使用新前与旧后这两个节点进行对比，对比它们是否是同一个节点，如果是同一个节点，则进行更新节点的操作。

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.23.png?raw=true)

由于新前与旧后这两个节点的位置不同，所以除了更新节点的操作外，还需要进行移动节点的操作。

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.24.png?raw=true)

当新前与旧后是同一个节点时，在真实 DOM 中除了做更新操作外，还需要将节点移动到 oldChildren 中所有未处理节点的最前面。

![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/7/7.25.png?raw=true)



## 3. 哪些节点是未处理过的

如何从两边向中间循环？

首先，我们先准备 4 个变量：**`oldStartIdx、oldEndIdx、newStartIdx 和 newEndIdx`** 。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       

当开始位置大于等于结束位置时，说明所有节点都遍历过了，则结束循环  ：

```javascript
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {}
```

因为如果 oldChildren 先循环完毕，这个时候如果 newChildren 中还有剩余的节点，那么说明什么问题？说明这些节点都是需要新增的节点，直接把这些节点插入到 DOM 中就行了，不需要循环比对了。如果是 newChildren 先循环完毕，这时如果 oldChildren 还有剩余的节点，又说明了什么问题？这说明 oldChildren 中剩余的节点都是被废弃的节点，是应该被删除的节点。这时不需要循环对比就可以知道需要将这些节点从 DOM 中移除。找到 newChildren 中所有剩余的节点并不难，由于 oldChildren 先被循环完，所以此时 newStartIdx 肯定是小于 newEndIdx 的，那么在 newChildren 中，下标在 newStartIdx 和 newEndIdx 之间的所有节点都是未处理的节点。同理，找到 oldChildren 中所有剩余的节点也很简单。由于 newChildren 先被循环完，所以 oldStartIdx 小于 oldEndIdx，那么在 oldChildren 中，下标在 oldStartIdx 和 oldEndIdx 之间的所有节点都是未处理的节点。       