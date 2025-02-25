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





# 条件渲染



## **`v-if`**

**`v-if 指令用于条件地渲染一块内容。这块内容只会在指令的表达式返回真值时才被渲染。`**

```vue
<h1 v-if="awesome">Vue is awesome!</h1>
```



## `v-else`

**`你也可以使用 v-else 为 v-if 添加一个 else 区块。`**

```vue
<button @click="awesome = !awesome">Toggle</button>

<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no</h1>
```

**`一个 v-else 元素必须跟在一个 v-if 或者 v-else-if 元素后面，否则它将不会被识别。`**



## `v-else-if`

顾名思义，v-else-if 提供的是相应于 v-if 的 else if 区块。它可以连续多次重复使用：

```vue
<div v-if="type === 'A'">
    A
</div>

<div v-if="type === 'B'">
    B
</div>

<div v-if="type === 'C'">
    C
</div>

<div v-else>
    Not A/B/C
</div>
```

**`和 v-else 类似，一个使用 v-else-if 的元素必须紧跟在一个 v-if 或一个 v-else-if 元素后面。`**



## `v-show`

**`另一个可以用来按条件显示一个元素的指令是 v-show。其用法基本一样：`**

```vue
<h1 v-show="ok">Hello!</h1>
```

**`不同之处在于 v-show 会在 DOM 渲染中保留该元素，v-show 仅切换了该元素上名为 display 的 CSS 属性。`**

**`v-show 不支持在 <template> 元素上使用，也不能和 v-else 搭配使用。`**





# 列表渲染



## `v-for`

**`我们可以使用 v-for 指令基于一个数组来渲染一个列表。v-for 指令的值需要使用 item in items 形式的特殊语法，其中 items 是源数据的数组，而 item 是迭代项的别名：`**

```javascript
const items = ref([{ message: "Foo" }, { message: "Bar" }]);
```

```vue
<li v-for="item in items">
    {{ item.message }}
</li>
```





## `v-for` 与对象

**`你也可以使用 v-for 来遍历一个对象的所有属性。遍历的顺序会基于对该对象调用 Object.values() 的返回值来决定。`**

```javascript
const myObject = reactive({
    title: "How to do lists in Vue",
    author: "Jane Doe",
    publishedAt: "2016-04-10"
})
```

```vue
<ul>
    <li v-for="value in myObject">
        {{ value }}
    </li>
</ul>
```

**`可以通过提供第二个参数表示属性名（例如 key）：`**

```vue
<li v-for="(value, key) in myObject">
    {{ key }}: {{ value }}
</li>
```

**`第三个参数表示位置索引：`**

```vue
<li v-for="(value, key, index) in myObject">
    {{ index }}. {{ key }}: {{ value }}
</li>
```





## 在 v-for 里使用范围值

**`v-for 可以直接接受一个整数值。在这种用例中，会将模板基于 1...n 的取值范围重复多次。`**

```vue
<span v-for="n in 10">{{ n }}</span>
```

**`注意此处 n 的初值是从 1 开始而非 0`**。





# 事件处理



## 监听事件

**`我们可以使用 v-on 指令（简写为 @）来监听 DOM 事件，并在事件触发时执行对应的 JavaScript。用法：v-on:click="handler" 或 @click="handler"。`**

**`事件处理器（handler）的值可以是：`** 

**`1. 内联事件处理器：事件被触发时执行的内联 JavaScript 语句（与 onclick 类似）。`**

**`2. 方法事件处理器：一个指向组件上定义的方法的属性名或是路径。`**



## 内联事件处理器

**`内联事件处理器通常用于简单场景，例如：`**

```javascript
const count = ref(0);
```

```vue
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```





## 方法事件处理器

**`随着事件处理器的逻辑变得愈发复杂，内联代码方式变得不够灵活。因此 v-on 也可以接受一个方法名或对某个地方的调用。`**

**`举例来说：`**

```javascript
const name = ref("Vue.js");

function greet(event) {
    console.log(`Hello ${name.value}`);
    
    if (event) {
        console.log(event.target.tagName);
    }
}
```

```vue
<button @click="greet">Greet</button>
```




## 在内联事件处理器中访问事件参数

**`有时我们需要在内联事件处理器中访问原生 DOM 事件。你可以向该处理器方法传入一个特殊的 $event 变量，或者使用内联箭头函数：`**

```vue
<!-- 使用特殊的 $event 变量 -->
<button @click="warn("Form cannot be submitted yet.", $event)">
    Submit
</button>

<!-- 使用内联箭头函数 -->
<button @click="(event) => warn("Form cannot be submitted yet.", event)">
    Submit
</button>
```

```javascript
function warn(message, event) {
    if (event) {
        event.preventDefault();
    }
}
```





## 事件修饰符

**`在处理事件时调用 event.preventDefault() 或 event.stopPropagation() 是很常见的。尽管我们可以直接在方法内调用，但如果方法能更专注于数据逻辑而不用去处理 DOM 事件的细节会更好。`**

**`为解决这一问题，Vue 为 v-on 提供了事件修饰符。修饰符是用 . 表示的指令后缀，包含以下这些：`**

* **`.stop`**
* **`.prevent`**
* **`.self`**
* **`.capture`**
* **`.once`**
* **`.passive`**

```vue
<!-- 单击事件将停止传递 -->
<a @click.stop="doThis"></a>

<!-- 提交事件将不再重新加载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰语可以使用链式书写 -->
<a @click.stop.prevent="doThat"></a>

<!-- 也可以只有修饰符 -->
<form @submit.prevent></form>

<!-- 仅当 event.target 是元素本身时才会触发事件处理器 -->
<!-- 例如：事件处理器不来自子元素 -->
<div @click.self="doThat"></div>
```

**`使用修饰符需要注意调用顺序，因为相关代码是以相同的顺序生成的。因此使用 @click.prevent.self 会阻止元素及其子元素的所有点击事件的默认行为，而 @click.self.prevent 则只会阻止对元素本身的点击事件的默认行为。`**



* **`.capture`**
* **`.once`**
* **`.passive`**

**`.capture、.once 和 .passive 修饰符与原生 addEventListener 事件相对应：`**

```vue
<!-- 添加事件监听器时，使用 capture 捕获模式 -->
<!-- 例如：指向内部元素的事件，在被内部元素处理前，先被外部处理 -->
<div @click.capture="doThis">...</div>

<!-- 点击事件最多被触发一次 -->
<a @click.once="doThis"></a>

<!-- 滚动事件的默认行为（scrolling）将立即发生而非等待 onScroll 完成 -->
<!-- 以防其中包含 event.preventDefault() -->
<div @scroll.passive="onScroll">...</div>
```



**`.passive 修饰符一般用于触摸事件的监听器，可以用来改善移动端设备的滚屏性能。`** 

**`请勿同时使用 .passive 和 .prevent，因为 .passive 已经向浏览器表明了你不想阻止事件的默认行为。如果你这么做了，则 .prevent 会被忽略，并且浏览器会抛出警告。`**



## 按键修饰符

**`在监听键盘事件时，我们经常需要检查特定的按键。Vue 允许在 v-on 或 @ 监听按键事件时添加按键修饰符。`**

```vue
<!-- 仅在 key 为 Enter 时调用 submit -->
<input @keyup.enter="submit" />
```



### 按键别名

**`Vue 为一些常用的按键提供了别名：`**

* **`.enter`**
* **`.tab`**
* **`.delete`**
* **`.esc`**
* **`.space`**
* **`.up`**
* **`.down`**
* **`.left`**
* **`.right`**



### 系统按键修饰符

**`你可以使用以下系统按键修饰符来触发鼠标或键盘事件监听器，只有当按键被按下时才会触发。`**

* **`.ctrl`**
* **`.alt`**
* **`.shift`**
* **`.meta`**

**`举例来说：`**

```vue
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + 点击 -->
<div @click.ctrl="doSomething">Do something</div>
```



## **`.exact` 修饰符**

**`.exact 修饰符允许精确控制触发事件所需的系统修饰符的组合。`**

```vue
<!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 仅当没有按下任何系统按键时触发 -->
<button @click.exact="onClick">A</button>
```





# 表单输入绑定

```html
<input :value="text" @input="event => text = event.target.value" />
```

**`v-model 指令帮我们简化了这一步骤：`**

```html
<input v-model="text" >
```





## 修饰符



### **`.lazy`**

**`默认情况下，v-model 会在每次 input 事件后更新数据。你可以添加 lazy 修饰符来改为在每次 change 事件后更新数据：`**

```html
<!-- 在 change 事件后同步更新而不是 input -->
<input v-model.lazy="msg" />
```



### `.number`

**`如果你想让用户输入自动转换为数字，你可以在 v-model 后添加 .number 修饰符来管理输入：`**

```html
<input v-model.number="age"  />
```



### `.trim`

**`如果你想要默认自动去除用户输入内容中两端的空格，你可以在 v-model 后添加 .trim 修饰符：`**

```html
<input v-model.trim="msg" />
```







# 生命周期钩子



## 注册周期钩子

**`举例来说，onMounted 钩子可以用来在组件完成初始渲染并创建 DOM 节点后运行代码：`**

```vue
<script setup>
import { onMounted } from "vue";

onMounted(() => {
    console.log(`the component is now mounted.`)
})
</script>
```





# 侦听器



## 基本示例

**`计算属性允许我们声明性地计算衍生值。然而在有些情况下，我们需要在状态变化时执行一些副作用：例如更改 DOM，或是根据异步操作的结果去修改另一处的状态。`**

**`在组合式 API 中，我们可以使用 watch 函数在每次响应式状态发生变化时触发回调函数：`**

```vue
<template>
	<p>
      Ask a yes/no question:
      <input v-model="question" :disabled="loading" />
    </p>

	<p>{{ answer }}</p>
</template>

<script setup>
import { ref, watch } from "vue";

const question = ref("");
const answer = ref("Questions usually contain a question mark. ;-)");
const loading = ref(false);

// 可以直接侦听一个 ref
watch(question, async (newQuestion, oldQuestion) => {
    if (newQuestion.includes("?")) {
        loading.value = true;
        answer.value = "Thinking...";
        
        try {
            const res = await fetch("https://yesno.wtf/api");
            answer.value = (await res.json()).answer;
        } catch (error) {
            answer.value = "Error! Could not reach the API. " + error
        } finally {
            loading.value = false;
        }
    }
})
</script>
```





## 侦听数据源类型

```javascript
const x = ref(0);
const y = ref(0);

// 单个 ref
watch(x, (newX) => {
    console.log(`x is ${newX}`);
})


// getter 函数
watch(
    () => x.value + y.value,
    (sum) => {
        console.log(`sum of x + y is: ${sum}`)
    }
)


// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
    console.log(`x is ${newX} and y is ${newY}`);
})
```



**`注意，你不能直接侦听响应式对象的属性值，例如：`**

```javascript
const obj = reactive({ count: 0 });

// 错误，因为 watch() 得到的参数是一个 number
watch(obj.count, (count) => {
    console.log(`Count is: ${count}`)
})
```



**`这里需要用一个返回该属性的 getter 函数：`**

```javascript
// 提供一个 getter 函数
watch(
    () => obj.count,
    (count) => {
        console.log(`Count is: ${count}`)
    }
)
```





## 深层侦听器

**`直接给 watch() 传入一个响应式对象，会隐式地创建一个深层侦听器，该回调函数在所有嵌套的变更时都会被触发：`**

```javascript
const obj = reactive({ count: 0 });

watch(obj, (newValue, oldValue) => {});
```

**`相比之下，一个返回响应式对象的 getter 函数，只有在返回不同的对象时，才会触发回调：`**

```javascript
watch(
    () => state.someObject,
    () => {}
)
```

**`你也可以给上面这个例子显式地加上 deep 选项，强制转成深层侦听器：`**

```javascript
watch(
    () => state.someObject,
    (newValue, oldValue) => {},
    { deep: true }
)
```



