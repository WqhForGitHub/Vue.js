

# Class 与 Style 绑定

<br>

## 1. 绑定 HTML Class

<br>

### 1. 对象语法

**`我们可以传给 v-bind:class 一个对象，以动态地切换 class：`**

```html
<div v-bind:class="{ active: isActive }"></div>
```

**`上面的语法表示 active 这个 class 存在与否取决于数据 property isActive 的真值。`**

你可以在对象中传入更多字段来动态切换多个 class。此外，v-bind:class 指令也可以与普通的 class attribute 共存。当有如下模板：

```html
<div class="static" v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>
```

和如下 data：

```javascript
data: {
    isActive: true,
    hasError: false
}
```

结果渲染为：

```html
<div class="static active"></div>
```

**`当 isActive 或者 hasError 变化时，class 列表将相应地更新。例如，如果 hasError 的值为 true，class 列表将变为 "static active text-danger"。`**

绑定的数据对象不必内联定义在模板里：

```html
<div v-bind:class="classObject"></div>
```

```javascript
data: {
    classObject: {
        active: true,
        'text-danger': false
    }
}
```

**`渲染的结果和上面一样。我们也可以在这里绑定一个返回对象的计算属性。这是一个常用且强大的模式：`**

```html
<div v-bind:class="classObject"></div>
```

```javascript
data: {
    isActive: true,
    error: null
},
computed: {
    classObject: function () {
        return {
            active: this.isActive && !this.error,
            'text-danger': this.error && this.error.type === 'fatal'
        }
    }
}
```

<br>

### 2. 数组语法

**`我们可以把一个数组传给 v-bind:class，以应用一个 class 列表：`**

```html
<div v-bind:class="[activeClass, errorClass]"></div>
```

```javascript
data: {
    activeClass: 'active',
    errorClass: 'text-danger'
}
```

渲染为：

```html
<div class="active text-danger"></div>
```

**`如果你也想根据条件切换列表中的 class，可以用三元表达式：`**

```html
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
```

**`这样写将始终添加 errorClass，但是只有在 isActive 是 true 时才添加 activeClass。`**

**`不过，当有多个条件 class 时这样写有些繁琐。所以在数组语法中也可以使用对象语法：`** 

```html
<div v-bind:class="[{ active: isActive}, errorClass]"></div>
```

<br>

### 3. 用在组件上

<br>

**`当在一个自定义组件上使用 class property 时，这些 class 将被添加到该组件的根元素上面。这个元素上已经存在的 class 不会被覆盖。`**

```html
<my-component class="baz boo"></my-component>
```

**`HTML 将被渲染为：`**  

```html
<p class="foo bar baz boo">Hi</p>
```

**`对于带数据绑定 class 也同样适用：`** 

```html
<my-component v-bind:class="{ active: isActive }"></my-component>
```

**`当 isActive 为 true 时，HTML 将被渲染成为：`** 

```html
<p class="foo bar active">Hi</p>
```

<br>

<br>

## 2. 绑定内联样式

<br>

### 1. 对象语法

v-bind:style 的对象语法十分直观，看着非常像 CSS，但其实是一个 JavaScript 对象。CSS property 名可以用驼峰式或短横线分隔来命名：

```html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

```javascript
data: {
    activeColor: 'red',
    fontSize: 30
}
```

**`直接绑定到一个样式对象通常更好，这会让模板更清晰：`**

```html
<div v-bind:style="styleObject"></div>
```

```javascript
data: {
    styleObject: {
        color: 'red',
        fontSize: '13px'
    }
}
```

<br>

### 2. 数组语法

**`v-bind:style 的数组语法可以将多个样式对象应用到同一个元素上：`**

```html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```





# 计算属性和侦听器



## 1. 计算属性

<br>

### 1. 基础例子

```vue
<div id="example">
    <p>Original message: "{{ message }}"</p>
    <p>Computed reversed message: "{{ reversedMessage }}"</p>
</div>
```

```javascript
var vm = new Vue({
    el: '#example',
    data: {
        message: 'Hello'
    },
    computed: {
        // 计算属性的 getter
        reversedMessage: function () {
            // `this` 指向 vm 实例
            return this.message.split('').reverse().join('')
        }
    }
})
```

<br>

### 2. 计算属性的 setter

**`计算属性默认只有 getter，不过在需要时你也可以提供一个 setter：`** 

```javascript
computed: {
    fullName: {
        get: function () {
            return this.firstName + ' ' + this.lastName
        },
        set: function (newValue) {
            var names = newValue.split(' ');
            this.firstName = names[0];
            this.lastName = names[names.length - 1];
        }
    }
}
```

**`现在再运行 vm.fullName = 'John Doe' 时，setter 会被调用，vm.firstName 和 vm.lastName 也会相应地被更新。`**

<br>

## 2. 侦听器

```html
<!DOCTYPE html>
<html>
<head>
  <title>Vue Watch Example</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
</head>
<body>
  <div id="app">
    <p>
      Ask a yes/no question:
      <input v-model="question" :disabled="loading" />
    </p>
    <p>{{ answer }}</p>
  </div>

  <script>
    new Vue({
      el: '#app',
      data: {
        question: '',
        answer: 'Questions usually contain a question mark. ;-)',
        loading: false
      },
      watch: {
        question: function (newQuestion, oldQuestion) {
          if (newQuestion.indexOf('?') > -1) {
            this.getAnswer()
          }
        }
      },
      methods: {
        getAnswer: function () {
          this.loading = true
          this.answer = 'Thinking...'
          var vm = this
          axios.get('https://yesno.wtf/api')
            .then(function (response) {
              vm.answer = response.data.answer
            })
            .catch(function (error) {
              vm.answer = 'Error! Could not reach the API. ' + error
            })
            .finally(function () {
              vm.loading = false
            })
        }
      }
    })
  </script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</body>
</html>
```

<br>

<br>





# 事件处理

<br>

## 1. 监听事件

<br>

**`可以用 v-on 指令监听 DOM 事件，并在触发时运行一些 JavaScript 代码。`**

**`示例：`**

```html
<div id="example-1">
    <button v-on:click="counter += 1">Add 1</button>
    <p>The button above has been clicked {{ counter }} times.</p>
</div>
```

```javascript
var example1 = new Vue({
    el: '#example-1',
    data: {
        counter: 0
    }
})
```

<br>

## 2. 事件处理方法

**`然而许多事件处理逻辑会更为复杂，所以直接把 JavaScript 代码写在 v-on 指令中是不可行的。因此 v-on 还可以接收一个需要调用的方法名称。`** s

**`示例：`** 

```html
<div id="example-2">
    <button v-on:click="greet">Greet</button>
</div>
```

```javascript
var example2 = new Vue({
    el: '#example-2',
    data: {
        name: 'Vue.js'
    },
    methods: {
        greet: function (event) {}
    }
})
```

<br>

## 3. 内联处理器中的方法

```html
<div id="example-3">
    <button v-on:click="say('hi')">Say hi</button>
    <button v-on:click="say('what')">Say what</button>
</div>
```

```javascript
new Vue({
    el: '#example-3',
    methods: {
        say: function (message) {}
    }
})
```

<br>

**`有时也需要在内联语句处理器中访问原始的 DOM 事件。可以用特殊变量 $event 把它传入方法：`** 

```html
<button v-on:click="warn('Form cannot be submitted yet.', $event)">Submit</button>
```

```javascript
methods: {
    warn: function (message, event) {}
}
```



<br>

## 4. 事件修饰符

**`在事件处理程序中调用 event.preventDefault() 或 event.stopPropagation() 是非常常见的需求。尽管我们可以在方法中轻松实现这点，但更好的方式是：方法只有纯粹的数据逻辑，而不是去处理 DOM 事件细节。`** 

**`为了解决这个问题，Vue.js 为 v-on 提供了事件修饰符。之前提过，修饰符是由点开头的指令后缀来表示的。`** 

* **`.stop`** 
* **`.prevent`** 
* **`.capture`** 
* **`.self`** 
* **`.once`** 
* **`.passive`** 



```html
<a v-on:click.stop="doThis"></a>


<form v-on:submit.prevent="onSubmit"></form>


<a v-on:click.stop.prevent="doThat"></a>


<form v-on:submit.prevent></form>


<div v-on:click.capture="doThis"></div>


<div v-on:click.self="doThat"></div>
```















# 自定义指令



## 简介

```javascript
Vue.directive("focus", {
    // 当被绑定的元素插入到 DOM 中时
    inserted: function (el) {
        // 聚焦元素
        el.focus();
    }
})
```



**`如果想注册局部指令，组件中也接受一个 directives 的选项：`**

```javascript
directives: {
	focus: {
        // 指令的定义
        inserted: function (el) {
            el.focus();
        }
    }
}
```

**`然后你可以在模板中任何元素上使用新的 v-focus property，如下：`**

```html
<input v-focus>
```





## 钩子函数

**`一个指令定义对象可以提供如下几个钩子函数（均为可选）：`**

* **`bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。`**
* **`inserted：被绑定元素插入父节点时调用（仅保证父节点存在，但不一定已被插入文档中）。`**
* **`update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新。`**
* **`componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。`**
* **`unbind：只调用一次，指令与元素解绑时调用。`**



## 钩子函数参数

**`指令钩子函数会被传入以下参数：`**

* **`el：指令所绑定的元素，可以用来直接操作 DOM。`**
* **`binding：一个对象，包括以下 property：`**
  * **`name：指令名，不包括 v- 前缀`**
  * **`value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。`**
  * **`oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。`**
  * **`expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。`**
  * **`arg：传给指令的参数，可选。例如 v-my-directive: foo 中，参数为 "foo"`**。
  * **`modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。`**
* **`vnode：Vue 编译生成的虚拟节点。`**
* **`oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。`**







## 函数简写

**`在很多时候，你可能想在 bind 和 update 时触发相同行为，而不关心其他的钩子。比如这样写：`**

```javascript
Vue.directive("color-swatch", function (el, binding) {
    el.style.backgroundColor = binding.value;
})
```







## 对象字面量

```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```javascript
Vue.directive("demo", function (el, binding) {
    console.log(binding.value.color); // "white"
    console.log(binding.value.text); // "hello!"
})
```



