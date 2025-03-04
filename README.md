# 一、响应式基础



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





# 二、计算属性



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





# 三、Class 与 Style 绑定



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





# 四、条件渲染



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





# 五、列表渲染



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





# 六、事件处理



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





# 七、表单输入绑定

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







# 八、生命周期钩子



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





# 九、模板引用



## 访问模板引用

**`3.5 的用法：要在组合式 API 中获取引用，我们可以使用辅助函数 useTemplateRef()：`**

```vue
<template>
	<input ref="my-input" />
</template>

<script setup>
import { useTemplateRef, onMounted } from "vue";

const input = useTemplateRef("my-input");
    
onMounted(() => {
    input.value.focus();
})
</script>
```





**`3.5 前的用法：我们需要声明一个与模板里 ref attribute 匹配的引用：`**

```vue
<template>
	<input ref="input" />
</template>

<script setup>
import { ref, onMounted } from "vue";

const input = ref(null);
    
onMounted(() => {
    input.value.focus();
})
</script>
```





## `v-for` 中的模板引用

**`3.5 的用法：当在 v-for 中使用模板引用时，对应的 ref 中包含的值是一个数组，它将在元素被挂载后包含对应整个列表的所有元素：`**

```vue
<template>
	<ul v-for="item in list" ref="items">
        {{ item }}
    </ul>
</template>

<script setup>
import { ref, useTemplateRef, onMounted } from "vue";

const list = ref([]);
    
const itemsRefs = useTemplateRef("items");
    
onMounted(() => console.log(itemRefs.value));
</script>
```



**`3.5 前的用法：useTemplateRef() 尚未引入，需要声明一个与模板引用 attribute 同名的 ref。该 ref 的值需要是一个数组。`**

```vue
<template>
	<ul>
       <li v-for="item in list" ref="itemRefs">
           {{ item }}
       </li> 
    </ul>
</template>

<script setup>
import { ref, onMounted } from "vue";

const list = ref([]);
    
const itemRefs = ref([]);
    
onMounted(() => console.log(itemRefs.value));
</script>
```

**`应该注意的是，ref 数组并不保证与源数组相同的顺序。`**





## 组件上的 ref

**`3.5 的用法：模板引用也可以被用在一个子组件上。这种情况下引用中获得的值是组件实例：`**

```vue
<template>
	<Child ref="child"></Child>
</template>

<script setup>
import { useTemplateRef, onMounted } from "vue";
import Child from "./Child.vue";
    
const childRef = useTemplateRef("child");

onMounted(() => {
    // childRef.value 将持有 <Child /> 的实例
})
</script>
```



**`3.5 前的用法：`**

```vue
<template>
	<Child ref="child" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import Child from "./Child.vue";
    
const child = ref(null);
    
onMounted(() => {
    // child.value 是 <Child /> 组件的实例
});
</script>
```











# 十、侦听器



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





## 即时回调的侦听器

```javascript
watch(source, (newValue, oldValue) => {}, { immediate: true })
```





## `watchEffect()`

**`在 watchEffect 中，只要 price、discount 和 finalPrice 这三个响应式数据中的任何一个发生变化，回调函数就会重新执行。watchEffect 的作用是追踪回调函数中使用的所有响应式依赖，并在任何一个依赖项发生变化时触发回调函数的重新执行。`**

```vue
<template>
  <div>
    <p>Price: {{ price }}</p>
    <p>Discount: {{ discount }}</p>
    <p>Final Price: {{ finalPrice }}</p>
    <button @click="applyDiscount">Apply Discount</button>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';

const price = ref(100);
const discount = ref(0);

const applyDiscount = () => {
  discount.value = 0.2;
};

const finalPrice = computed(() => {
  return price.value * (1 - discount.value);
});

watchEffect(() => {
  console.log(`Price: ${price.value}, Discount: ${discount.value}, Final Price: ${finalPrice.value}`);
});
</script>
```





# 十一、组件基础



## 使用组件

```vue
<script setup>
import ButtonCounter from "./ButtonCounter.vue";
</script>

<template>
	<h1>Here is a child component!</h1>
	<ButtonCounter />
</template>
```





## 传递 props

```vue
<script setup>
defineProps(["title"]);
</script>

<template>
	<h4>{{ title }}</h4>
</template>
```



```javascript
const props = defineProps(["title"]);

console.log(props.title);
```



**`如果你没有使用 <script setup>，props 必须以 props 选项的方式声明，props 对象会作为 setup() 函数的第一个参数被传入：`**

```javascript
export default {
    props: ["title"],
    setup(props) {
        console.log(props.title);
    }
}
```





## 监听事件

```vue
<BlogPost @enlarge-text="postFontSize += 0.1" />
```

```vue
<template>
	<div class="blog-post">
        <h4>{{ title }}</h4>
        <button @click="$emit("enlarge-text")">Enlarge text</button>
    </div>
</template>
```



**`我们可以通过 defineEmits 宏来声明需要抛出的事件：`**

```vue
<script setup>
defineProps(["title"]);
defineEmits(["enlarge-text"]);
</script>
```



**`和 defineProps 类似，defineEmits 仅可用于 <script setup> 之中，并且不需要导入，它返回一个等同于 $emit 方法的 emit 函数。它可以被用于在组件的 <script setup> 中抛出事件，因为此处无法直接访问 $emit：`**

```vue
<script setup>
const emit = defineEmits(["enlarge-text"]);
    
emit("enlarge-text");
</script>
```



**`如果你没有在使用 <script setup>，你可以通过 emits 选项定义组件会抛出的事件。你可以从 setup() 函数的第二个参数，即 setup 上下文对象上访问到 emit 函数：`**

```javascript
export default {
    emits: ["enlarge-text"],
    setup(props, ctx) {
        ctx.emit("enlarge-text");
    }
}
```



## 通过插槽来分配内容

**`一些情况下我们会希望能和 HTML 元素一样向组件中传递内容：`**

```vue
<AlertBox>
    Something bad happened.
</AlertBox>
```



**`这可以通过 Vue 的自定义 <slot> 元素来实现：`**

```vue
<template>
	<div class="alert-box">
        <strong>This is an Error for Demo Purposes</strong>
        <slot />
    </div>
</template>
```

**`如上所示，我们使用 <slot> 作为一个占位符，父组件传递进来的内容就会渲染在这里。`**





## 动态组件

```vue
<template>
	<div>
        <component :is="currentComponent"></component>
    </div>
</template>

<script setup>
import { ref } from "vue";
import ComponentA from "./components/ComponentA.vue";
import ComponentB from "./components/ComponentB.vue";
    
const currentComponent = ref("ComponentA"); 
</script>
```



## DOM 内模板解析注意事项



### 大小写区分

```javascript
// JavaScript 中的 camelCase
const BlogPost = {
    props: ["postTitle"],
    emits: ["updatePost"],
    template: `
    	<h3>{{ postTitle }}</h3>
    `
}
```

```vue
<!-- HTML 中的 kebab-case -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```





### 闭合标签

**`我们在上面的例子中已经使用过了闭合标签：`**

```vue
<MyComponent />
```



**`这是因为 Vue 的模板解析器支持任意标签使用 /> 作为标签关闭的标志。`**

**`然而在 DOM 内模板中，我们必须显式地写出关闭标签：`**

```vue
<my-component></my-component>
```



```vue
<my-component /> <!-- 我们想要在这里关闭标签 -->
<span>hello</span>
```



**`将被解析为：`**

```vue
<my-component>
    <span>hello</span>
</my-component> <!-- 但浏览器会在这里关闭标签 -->
```



### 元素位置限制

**`某些 HTML 元素对于放在其中的元素类型有限制，例如 <ul>，<ol>，<table> 和 <select>，相应的，某些元素仅在放置于特定元素中时才会显示，例如 <li>、<tr> 和 <option>。`**

**`这将导致在使用带有此类限制元素的组件时出现问题。例如：`**

```vue
<table>
    <blog-post-row></blog-post-row>
</table>
```



**`自定义的组件 <blog-post-row> 将作为无效的内容被忽略，因而在最终呈现的输出中造成错误。我们可以使用特殊的 is attribute 作为一种解决方案：`**

```vue
<table>
    <tr is="vue:blog-post-row"></tr>
</table>
```









# 十二、注册



## 全局注册

**`我们可以使用 Vue 应用实例的 .component() 方法，让组件在当前 Vue 应用中全局可用。`**

```javascript
import { createApp } from "vue";

const app = createApp({});

app.component("myComponent", { /* 组件的实现 */ });
```



**`如果使用单文件组件，你可以注册被导入的 .vue 文件：`**

```javascript
import MyComponent from "./App.vue";

app.component("MyComponent", MyComponent);
```



**`.component() 方法可以被链式调用：`**

```javascript
app.component("ComponentA", ComponentA).component("ComponentB", ComponentB).component("ComponentC", ComponentC);
```



**`全局注册的组件可以在此应用的任意组件的模板中使用：`**

```vue
<ComponentA />
<ComponentB />
<ComponentC />
```





## 局部注册

**`在使用 <script setup> 的单文件组件中，导入的组件可以直接在模板中使用，无需注册：`**

```vue
<template>
	<ComponentA />
</template>

<script setup>
import ComponentA from "./ComponentA.vue";
</script>
```



**`如果没有使用 <script setup>，则需要使用 components 选项来显式注册：`**

```javascript
import ComponentA from "./ComponentA.js";

export default {
    components: {
        ComponentA
    },
    setup() {}
}
```

**`请注意：局部注册的组件在后代组件中不可用。在这个例子中，ComponentA 注册后仅在当前组件可用，而在任何的子组件或更深层的子组件中都不可用。`**





# 十三、Props



## Props 声明

**`在使用 <script setup> 的单文件组件中，props 可以使用 defineProps() 宏来声明：`**

```vue
<script setup>
const props = defineProps(["foo"]);
    
console.log(props.foo);
</script>
```

**`在没有使用 <script setup> 的组件中，props 可以使用 props 选项来声明：`**

```javascript
export default {
    props: ["foo"],
    setup(props) {
        console.log(props.foo);
    }
}
```

**`注意传递给 defineProps 的参数和提供给 props 选项的值是相同的，两种声明方式背后其实使用的都是 props 选项。`**

**`除了使用字符串数组来声明 props 外，还可以使用对象的形式：`**

```javascript
<!-- 使用 <script setup> -->
defineProps({
    title: String,
    likes: Number
})
```

```javascript
// 非 <script setup>
export default {
    props: {
        title: String,
        likes: Number
    }
}
```





## 响应式 Props 解构



### 将解构的 props 传递到函数中

```javascript
const { foo } = defineProps(["foo"]);

watch(() => foo)
```





## 单向数据流

1. **`prop 被用于传入初始值；而子组件想在之后将其作为一个局部模板属性。在这种情况下，最好是新定义一个局部数据属性，从 props 上获取初始值即可：`**

```javascript
const props = defineProps(["initialCounter"]);

const counter = ref(props.initialCounter);
```

2. **`需要对传入的 prop 值做进一步转换。在这种情况下，最好是基于该 props 值定义一个计算属性：`**

```javascript
const props = defineProps(["size"]);

// 该 prop 变更时计算属性也会自动更新
const normalizedSize = computed(() => props.size.trim().toLowerCase())
```





## Prop 校验

```javascript
defineProps({
    propA: Number,
    propB: [String, Number],
    propC: {
        type: String,
        required: true
    },
    propD: {
        type: [String, null],
        required: true
    },
    propE: {
        type: Number,
        default: 100
    },
    propF: {
        type: Object,
        default(rawProps) {
            return { message: "hello" }
        }
    },
    propG: {
        validator(value) {
            return ["success", "warning", "danger"].includes(value)
        }
    },
    propH: {
        type: Function,
        default() {
            return "Default function"
        }
    }
})
```





# 十四、组件事件



## 触发与监听事件

**`在组件的模板表达式中，可以直接使用 $emit 方法触发自定义事件（例如：在 v-on 的处理函数中）：`**

```vue
<!-- MyComponent -->
<button @click="$emit("someEvent")"></button>
```



**`父组件可以通过 v-on（缩写为 @）来监听事件：`**

```html
<MyComponent @some-event="callback"></MyComponent>
```

**`同样，组件的事件监听器也支持 .once 修饰符：`**

```vue
<MyComponent @some-event.once="callback"></MyComponent>
```





## 事件参数

```vue
<button @click="$emit('increaseBy', 1)">
    Increase by 1
</button>
```

**`然后我们在父组件中监听事件，我们可以先简单写一个内联的箭头函数作为监听器，此函数会接收到事件附带的参数：`**

```vue
<MyButton @increase-by="(n) => count += n"></MyButton>
```

**`或者，也可以用一个组件方法来作为事件处理函数：`**

```html
<MyButton @increase-by="increaseCount"></MyButton>
```

**`该方法也会接收到事件所传递的参数：`**

```javascript
function increaseCount(n) {
    count.value += n;
}
```





## 声明触发的事件

**`组件可以显式地通过 defineEmits() 宏来声明它要触发地事件：`**

```vue
<script setup>
defineEmits(["inFocus", "submit"]);
</script>
```



**`我们在 <template> 中使用的 $emit 方法不能在组件的 <script setup> 部分中使用，但 defineEmits() 会返回一个相同作用的函数供我们使用：`**

```vue
<script setup>
const emit = defineEmits(["inFocus", "submit"]);
    
function buttonClick() {
    emit("submit");
}
</script>
```

**`defineEmits() 宏不能在子函数中使用。如上所示，它必须直接放置在 <script setup> 的顶级作用域下。`**

**`如果你显式地使用了 setup 函数而不是 <script setup> ，则事件需要通过 emits 选项来定义，emit 函数也被暴露在 setup() 的上下文对象上：`**

```javascript
export default {
    emits: ["inFocus", "submit"],
    setup(props, ctx) {
        ctx.emit("submit");
    }
}
```

**`与 setup() 上下文对象中的其他属性一样，emit 可以安全地被解构：`**

```javascript
export default {
    emits: ["inFocus", "submit"],
    setup(props, { emit }) {
        emit("submit");
    }
}
```





## 事件校验

**`和对 props 添加类型校验的方式类似，所有触发的事件也可以使用对象形式来描述。要为事件添加校验，那么事件可以被赋值为一个函数，接受的参数就是抛出事件时传入 emit 的内容，返回一个布尔值来表明事件是否合法。`**

```vue
<script setup>
const emit = defineEmits({
    click: null,
    
    submit: ({ email, password }) => {
        if (email && password) {
            return true;
        } else {
            console.warn("Invalid submit event payload!");
         	return false;
        }
    }
});
    
function submitForm(email, password) {
    emit("submit", { email, password });
}
</script>
```





# 十五、组件 v-model



## 基本用法

**`v-model 可以在组件上使用以实现双向绑定。从 Vue 3.4 开始，推荐的实现方式是使用 defineModel() 宏：`**

```vue
<!-- Child.vue -->
<template>
	<div>Parent bound v-model is: {{ model }}</div>
	<button @click="update">Increment</button>
</template>


<script setup>
const model = defineModel();

function update() {
    model.value++;
}
</script>
```



**`父组件可以用 v-model 绑定一个值：`**

```vue
<Child v-model="countModel"></Child>
```

**`defineModel() 返回的值是一个 ref。它可以像其他 ref 一样被访问以及修改，不过它能起到在父组件和当前变量之间的双向绑定的作用：`**

* **`它的 .value 和父组件的 v-model 的值同步。`** 
* **`当它被子组件变更了，会触发父组件绑定的值一起更新。`** 

**`这意味着你也可以用 v-model 把这个 ref 绑定到一个原生 input 元素上，在提供相同的 v-model 用法的同时轻松包装原生 input 元素：`** 

```vue
<template>
	<input v-model="model" />
</template>

<script setup>
const model = defineModel();
</script>
```





## 底层机制

**`defineModel 是一个便利宏。编译器将其展开为以下内容：`**

* 一个名为 modelValue 的 prop，本地 ref 的值与其同步
* 一个名为 update:modelValue 的事件，当本地 ref 的值发生变更时触发。



**`在 3.4 版本之前，你一般会按照如下的方式实现上述相同的子组件：`**

```vue
<!-- Child.vue -->
<template>
	<input :value="props.modelValue"  @input="emit('update:modelValue', $event.target.value)"  />
</template>

<script setup>
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
</script>
```

**`然后，父组件中的 v-model="foo" 将被编译为：`**

```vue
<!-- Parent.vue -->
<Child :modelValue="foo" @update:modelValue="$event => (foo = $event)"></Child>
```

**`如你所见，这显得冗长很多。然而，这样写有助于理解其底层机制。因为 defineModel 声明一个 prop，你可以通过给 defineModel 传递选项，来声明底层 prop 的选项：`**

```javascript
// 使 v-model 必填
const model = defineModel({ required: true });


// 提供一个默认值
const model = defineModel({ default: 0 });
```





## `v-model` 的参数

**`组件上的 v-model 也可以接受一个参数：`**

```vue
<MyComponent v-model:title="bookTitle"></MyComponent>
```

**`在子组件中，我们可以通过将字符串作为第一个参数传递给 defineModel() 来支持相应的参数：`**

```vue
<!-- MyComponent.vue -->
<template>
	<input type="text" v-model="title" />
</template>

<script setup>
const title = defineModel("title");
</script>
```

**`如果需要额外的 prop 选项，应该在 model 名称之后传递：`**

```javascript
const title = defineModel("title", { required: true });
```

**`3.4 之前的用法`**

```vue
<!-- MyComponent.vue -->
<template>
	<input type="text" :value="title" @input="$emit('update:title', $event.target.value)" />
</template>

<script setup>
defineProps({
    title: {
        required: true
    }
});
    
defineEmits(["update:title"]);
</script>
```





## 多个 `v-model` 绑定

```vue
<UserName v-model:first-name="first" v-model:last-name="last"></UserName>
```

```vue
<template>
	<input type="text" v-model="firstName" />
	<input type="text" v-model="lastName" />
</template>

<script setup>
const firstName = defineModel("firstName");
const lastName = defineModel("lastName");
</script>
```



**`3.4 之前的用法`**

```vue
<template>
	<input type="text" :value="firstName" @input="$emit('update:firstName', $event.target.value)" />
	<input type="text" :value="lastName" @input="$emit('update:lastName', $event.target.value)" />
</template>

<script setup>
defineProps({
    firstName: String,
    lastName: String
});
    
defineEmits(['update:firstName', 'update:lastName']);
</script>
```



## 处理 `v-model` 修饰符

```vue
<MyComponent v-model.capitalize="myText"></MyComponent>
```

```vue
<template>
	<input type="text" v-model="model" />
</template>

<script setup>
const [model, modifiers] = defineModel();

console.log(modifiers); // { capitalize: true }
</script>
```



```vue
<template>
	<input type="text" v-model="model" />
</template>

<script setup>
const [model, modifiers] = defineModel({
    set(value) {
        if (modifiers.capitalize) {
            return value.charAt(0).tpUpperCase() + value.slice(1);
        }
        
        return value;
    }
})
</script>
```



**`3.4 之前的用法`**

```vue
<template>
	<input type="text" :value="props.modelValue" @input="emitValue" />
</template>

<script setup>
const props = defineProps({
    modelValue: String,
    modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue']);

function emitValue(e) {
    let value = e.target.value;
    if (props.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    emit('update:modelValue', value);
}
</script>
```





## 带参数的 `v-model` 修饰符

```vue
<UserName v-model:first-name.capitalize="first" v-model:last-name.uppercase="last" ></UserName>
```



```vue
<script setup>
const [firstName, firstNameModifiers] = defineModel('firstName');
const [lastName, lastNameModifiers] = defineModel('lastName');
    
console.log(firstNameModifiers); // { capitalize: true }
console.log(lastNameModifiers); // { uppercase: true }
</script>
```



**`3.4 之前的用法`**

```vue
<script setup>
const props = defineProps({
    firstName: String,
    lastName: String,
    firstNameModifiers: { default: () => ({}) },
    lastNameModifiers: { default: () => ({}) }
});
    
defineEmits(['update:firstName', 'update:lastName'])
 
console.log(props.firstNameModifiers); // { capitalize: true }
console.log(props.lastNameModifiers); // { uppercase: true }
</script>
```





# 十六、透传 Attributes



## Attribute 继承

```vue
<!-- <MyButton> 的模板 -->
<button>Click Me</button>
```

**`一个父组件使用了这个组件，并且传入了 class：`**

```vue
<MyButton class="large"></MyButton>
```

**`最后渲染出的 DOM 结果是：`**

```vue
<button class="large">Click Me</button>
```

**`这里，<MyButton> 并没有将 class 声明为一个它所接受的 prop，所以 class 被视作透传 attribute，自动透传到了 <MyButton> 的根元素上。`**



## 对 `class` 和 `style` 的合并

**`如果一个子组件的根元素已经有了 class 或 style attribute，它会和从父组件上继承的值合并。如果我们将之前的 <MyButton> 组件的模板改成这样：`**

```vue
<!-- <MyButton> 的模板 -->
<button class="btn">Click Me</button>
```

**`则最后渲染出的 DOM 结果会变成：`**

```vue
<button class="btn large">Click Me</button>
```



## `v-on` 监听器继承

**`同样的规则也适用于 v-on 事件监听器：`**

```vue
<MyButton @click="onClick"></MyButton>
```





## 深层组件继承

```vue
<!-- <MyButton /> 的模板，只是渲染另一个组件 -->
<BaseButton />
```







## 禁用 Attributes 继承

**`如果你不想要一个组件自动地继承 attribute，你可以在组件选项中设置 inheritAttrs: false。从 3.3 开始你也可以直接在 <script setup> 中使用 defineOptions：`**

```vue
<script setup>
defineOptions({
    inheritAttrs: false
})
</script>
```





## 多根节点的 Attributes 继承

```vue
<CustomLayout id="custom-layout" @click="changeValue" />
```

**`如果 <CustomLayout> 有下面这样的多根节点模板，由于 Vue 不知道要将 attribute 透传到哪里，所以会抛出一个警告。`**

```vue
<header>...</header>
<main>...</main>
<footer>...</footer>
```

**`如果 $attrs 被显式绑定，则不会有警告：`**

```vue
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```





## 在 JavaScript 中访问透传 Attributes

**`如果需要，你可以在 <script setup> 中使用 useAttrs() API 来访问一个组件的所有透传 attribute：`**

```vue
<script setup>
import { useAttrs } from 'vue';

const attrs = useAttrs();
</script>
```

**`如果没有使用 <script setup>，attrs 会作为 setup() 上下文对象的一个属性暴露：`**

```javascript
export default {
	setup(props, ctx) {
        // 透传 attribute 被暴露为 ctx.attrs
        console.log(ctx.attrs)
    }
}
```

**`需要注意的是，虽然这里的 attrs 对象总是反映为最新的透传 attribute，但它并不是响应式的（考虑到性能因素）。你不能通过侦听器去监听它的变化。如果你需要响应性，可以使用 prop。或者你也可以使用 onUpdated() 使得在每次更新时结合最新的 attrs 执行副作用。`**





# 十七、插槽 Slots



## 插槽内容与出口

**`举例来说，这里有一个 <FancyButton> 组件，可以像这样使用：`**

```vue
<FancyButton>
    Click me! <!-- 插槽内容 -->
</FancyButton>
```

**`而 <FancyButton> 的模板是这样的：`**

```vue
<button class="fancy-btn">
    <slot></slot> <!-- 插槽出口 -->
</button>
```

**`<slot> 元素是一个插槽出口，标示了父元素提供的插槽内容将在哪里被渲染。`**

**`最终渲染出的 DOM 是这样：`**

```vue
<button class="fancy-btn">Click me!</button>
```





## 默认内容

**`在外部没有提供任何内容的情况下，可以为插槽指定默认内容。比如有这样一个 <SubmitButton> 组件：`**

```vue
<button type="submit">
    <slot></slot>
</button>
```



**`如果我们想要在父组件没有提供任何插槽内容时在 <button> 内渲染 "Submit"，只需要将 "Submit" 写在 <slot> 标签之间来作为默认内容：`**

```vue
<button type="submit">
    <slot>
        Submit <!-- 默认内容 -->
    </slot>
</button>
```

**`现在，当我们在父组件中使用 <SubmitButton> 且没有提供任何插槽内容时：`**

```vue
<SubmitButton />
```

**`"Submit" 将会被作为默认内容渲染：`**

```vue
<button type="submit">Submit!</button>
```

**`但如果我们提供了插槽内容：`**

```vue
<SubmitButton>Save</SubmitButton>
```

**`那么被显式提供的内容会取代默认内容：`**

```vue
<button type="submit">Save</button>
```





## 具名插槽

