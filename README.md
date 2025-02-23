# 响应式基础



## 声明响应式状态



### `ref()`

**`在组合式 API 中，推荐使用 ref() 函数来声明响应式状态：`** 

```javascript
import { ref } from "vue";

const count = ref(0);
```



**`ref() 接收参数，并将其包裹在一个带有 .value 属性的 ref 对象中返回：`**

```javascript
const count = ref(0);

console.log(count); // { value: 0 }
console.log(count.value); // 0

count.value++;
console.log(count.value); // 1
```



**`要在组件模板中访问 ref，请从组件的 setup() 函数中声明并返回它们：`**

```javascript
import { ref } from "vue";

export default {
    setup() {
        const count = ref(0);
        
        return {
            count
        }
    }
}
```

```vue
<div>{{ count }}</div>
```



**`注意，在模板中使用 ref 时，我们不需要附加 .value。为了方便起见，当在模板中使用时，ref 会自动解包。`**

**`你也可以直接在事件监听器中改变一个 ref：`**

```vue
<button @click="count++">
    {{ count }}
</button>
```

**`对于更复杂的逻辑，我们可以在同一作用域内声明更改 ref 的函数，并将它们作为方法与状态一起公开：`**

```javascript
import { ref } from "vue";

export default {
    setup() {
        const count = ref(0);
        
        function increment() {
            count.value++;
        }
        
        return {
            count,
            increment
        }
    }
}
```

**`然后，暴露的方法可以被用作事件监听器：`** 

```html
<button @click="increment">
    {{ count }}
</button>
```





### `<script setup>`

**`在 setup() 函数中手动暴露大量的状态和方法非常繁琐。幸运的是，我们可以通过使用单文件组件（SFC）来避免这种情况。我们可以使用 <script setup> 来大幅度地简化代码：`**

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);
    
function increment() {
    count.value++;
}
</script>

<template>
	<button @click="increment">
        {{ count }}
    </button>
</template>
```





### `reactive()`

**`还有另一种声明响应式状态的方式，即使用 reactive() API。与将内部值包装在特殊对象中的 ref 不同，reactive() 将使对象本身具有响应性：`**

```javascript
import { reactive } from "vue";

const state = reactive({ count: 0 });
```



**`在模板中使用：`**

```vue
<button @click="state.count++">
    {{ state.count }}
</button>
```





### `reactive() 的局限性`

**`reactive() API 有一些局限性：`**

**`1. 有限的值类型：它只能用于对象类型（对象、数组和如 Map、Set 这样的集合类型）。它不能持有如 string、number 或 boolean 这样的原始类型。`**

**`2. 不能替换整个对象：由于 Vue 的响应式跟踪是通过属性访问实现的，因此我们必须始终保持对响应式对象的相同引用。这意味着我们不能轻易地替换响应式对象，因为这样地话与第一个引用的响应式连接将丢失：`**

```javascript
let state = reactive({ count: 0 });

state = reactive({ count: 1 });
```



**`3. 对解构操作不友好：当我们将响应式对象的原始类型属性解构为本地变量时，或者将该属性传递给函数时，我们将丢失响应式连接：`**

```javascript
const state = reactive({ count: 0 });

// 当解构时，count 已经与 state.count 断开连接
let { count } = state;

// 不会影响原始的 state
count++;

// 该函数接收到的是一个普通的数字，并且无法追踪 state.count 的变化，我们必须
// 传入整个对象以保持响应性
callSomeFunction(state.count);
```





# 计算属性



## 基础示例

**`模板中的表达式虽然方便，但也只能用来做简单的操作。如果在模板中写太多逻辑，会让模板变得臃肿，难以维护。比如说，我们有这样一个包裹嵌套数组的对象：`**

```javascript
const author = reactive({
    name: "John Doe",
    books: [
        "Vue 2 - Advanced Guide",
        "Vue 3 - Basic Guide",
        "Vue 4 - The Mystery"
    ]
})
```

**`我们想根据 author 是否已有一些书籍来展示不同的信息：`**

```vue
<p>Has published books: </p>
<span>{{ author.books.length > 0 ? "Yes" : "No" }}</span>
```

**`这里的模板看起来有些复杂。我们必须认真看好一会儿才能明白它的计算依赖于 author.books。更重要的是，如果在模板中需要不止一次这样的计算，我们可不想将这样的代码在模板里重复好多遍。`**

**`因此我们推荐使用计算属性来描述依赖响应式状态的复杂逻辑。这是重构后的示例：`**

```vue
<template>
	<p>Has published books: </p>
	<span>{{ publishedBookMessage }}</span>
</template>

<script setup>
import { reactive, computed } from "vue";

const author = reactive({
    name: "John Doe",
    books: [
        "Vue 2 - Advanced Guide",
        "Vue 3 - Basic Guide",
        "Vue 4 - The Mystery"
    ]
})

const publishedBooksMessage = computed(() => {
    return author.books.length > 0 ? "Yes" : "No"
})
</script>
```





# Class 与 Style 绑定



## 绑定 HTML class



### 绑定对象

**`我们可以给 :class （v-bind:class 的缩写）传递一个对象来动态切换 class：`**

```vue
<div :class="{ active: isActive }"></div>
```

**`上面的语法表示 active 是否存在取决于数据属性 isActive 的真假值。`**

**`你可以在对象中写多个字段来操作多个 class。此外，:class 指令也可以和一般的 class attribute 共存。举例来说，下面这样的状态：`** 

```vue
<template>
	<div class="static" :class="{ active: isActive, 'text-danger': hasError }"></div>
</template>

<script setup>
    const isActive = ref(true);
    const hasError = ref(false);
</script>
```

**`渲染的结果会是：`** 

```vue
<div class="static active"></div>
```

**`当 isActive 或者 hasError 改变时，class 列表会随之更新。举例来说，如果 hasError 变为 true，class 列表也会变成 "static active text-danger"。`**

绑定的对象并不一定需要写成内联字面量的形式，也可以直接绑定一个对象：

```vue
<template>
	<div :class="classObject"></div>
</template>

<script setup>
import { reactive } from "vue";
    
const classObject = reactive({
    active: true,
    'text-danger': false
})
</script>
```

**`这将渲染：`**  

```vue
<div class="active"></div>
```

**`我们也可以绑定一个返回对象的计算属性。这是一个常见且很有用的技巧：`**

```vue
<template>
	<div :class="classObject"></div>
</template>

<script setup>
import { ref, computed } from "vue";
    
const isActive = ref(true);
const error = ref(null);

const classObject = computed(() => ({
    active: isActive.value && !error.value,
    'text-danger': error.value && error.value.type === 'fatal'
}))
</script>
```



### 绑定数组

**`我们可以给 :class 绑定一个数组来渲染多个 CSS class：`**

```vue
<template>
	<div :class="[activeClass, errorClass]"></div>
</template>

<script setup>
import { ref } from "vue";
    
const activeClass = ref('active');
const errorClass = ref('text-danger');
</script>
```

**`渲染的结果是：`**

```vue
<div class="active text-danger"></div>
```

如果你也想在数组中有条件地渲染某个 class，你可以使用三元表达式：

```vue
<div :class="[isActive ? activeClass : "", errorClass]"></div>
```

**`errorClass 会一直存在，但 activeClass 只会在 isActive 为真时才存在。`**

**`然而，这可能在有多个依赖条件的 class 时会有些冗长。因此也可以在数组中嵌套对象：`**  

```vue
<div :class="[{ [activeClass]: isActive }, errorClass]"></div>
```



## 绑定内联样式



### 绑定对象

**`:style 支持绑定 JavaScript 对象值，对应的是 HTML 元素的 style 属性：`**

```vue
<template>
	<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
</template>

<script setup>
import { ref } from "vue";

const activeColor = ref("red");
const fontSize = ref(30);
</script>
```

尽管推荐使用 camelCase，但 :style 也支持 kebab-cased 形式的 CSS 属性 key （对应其 CSS 中的实际名称），例如：

```html
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

**`直接绑定一个样式对象通常是一个好主意，这样可以使模板更加简洁：`**

```vue
<template>
	<div :style="styleObject"></div>
</template>

<script setup>
import { reactive } from "vue";

const styleObject = reactive({
    color: 'red',
    fontSize: '30px'
})
</script>
```

**`同样的，如果样式对象需要更复杂的逻辑，也可以使用返回样式对象的计算属性。`**



### 绑定数组

**`我们还可以给 :style 绑定一个包含多个样式对象的数组。这些对象会被合并后渲染到同一元素上：`**

```vue
<div :style="[baseStyles, overridingStyles]"></div>
```



