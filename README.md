

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



<br>

## 5. 按键修饰符

**`在监听键盘事件时，我们经常需要检查详细的按键。Vue 允许为 v-on 在监听键盘事件时添加按键修饰符：`**

```html
<input v-on:keyup.enter="submit" >
```



<br>

<br>



# 表单输入绑定

<br>

## 修饰符

### `.lazy`

**`在默认情况下，v-model 在每次 input 事件触发后将输入框的值与数据进行同步（除了上述输入法组合文字时）。你可以添加 lazy 修饰符，从而转为在 change 事件之后进行同步：`** 

```html
<!-- 在 change 时而非 input 时更新 -->
<input v-model.lazy="msg">
```



### `.number`

**`如果想自动将用户的输入值转为数值类型，可以给 v-model 添加 number 修饰符：`**

```html
<input v-model.number="age" type="number">
```

**`这通常很有用，因为即使在 type="number" 时，HTML 输入元素的值也总会返回字符串。如果这个值无法被 parseFloat() 解析，则会返回原始的值。`**



### `.trim`

如果要自动过滤用户输入的首尾空白字符，可以给 v-model 添加 trim 修饰符：

```html
<input v-model.trim="msg" >
```

























# 组件注册

## 全局注册

```javascript
import Vue from 'vue';
import MyComponent from './components/MyComponent.vue';

Vue.component('my-component', MyComponent); // 全局注册组件

new Vue({
  el: '#app'
});
```

**`示例：`**

```vue
<template>
  <div>
    <my-component></my-component>
  </div>
</template>
```



## 局部注册

```vue
<template>
  <div>
    <my-child-component></my-child-component>
  </div>
</template>

<script>
import MyChildComponent from './MyChildComponent.vue';

export default {
  components: {
    'my-child-component': MyChildComponent // 局部注册组件
  }
};
</script>
```









# Prop



## Prop 类型

到这里，我们只看到了以字符串数组形式列出的 prop：

```javascript
props: ["title", "likes", "isPublished", "commentIds", "author"]
```

但是，通常你希望每个 prop 都有指定的值类型。这时，你可以以对象形式列出 prop，这些 property 的名称和值分别是 prop 各自的名称和类型：

```javascript
props: {
    title: String,
    likes: Number,
    isPublished: Boolean,
    commentIds: Array,
    author: Object,
    callback: Function,
    contactsPromise: Promise
}
```

<br>

## 传递静态或动态 Prop

**`像这样，你已经知道了可以像这样给 prop 传入一个静态的值：`**

```html
<blog-post title="My journey with Vue"></blog-post>
```

**`你也知道 prop 可以通过 v-bind 动态赋值，例如：`** 

```html
<blog-post v-bind:title="post.title"></blog-post>

<blog-post v-bind:title="post.title + 'by ' + post.author.name"></blog-post>
```

**`在上述两个示例中，我们传入的值都是字符串类型的，但实际上任何类型的值都可以传给一个 prop。`**

## 传入一个数字

```html
<blog-post v-bind:likes="42"></blog-post>

<blog-post v-bind:likes="post.likes"></blog-post>
```



## 传入一个布尔值

```html
<!-- 包含该 prop 没有值的情况在内，都意味着 true -->
<blog-post is-published></blog-post>


<blog-post v-bind:is-published="false"></blog-post>

<blog-post v-bind:is-published="post.isPublished"></blog-post>
```



## 传入一个数组

```html
<blog-post v-bind:comment-ids="[234, 266, 273]"></blog-post>

<blog-post v-bind:comment-ids="post.commentIds"></blog-post>
```



## 传入一个对象

```html
<blog-post 
v-bind:author="{name: 'Veronica', company: 'Veridian Dynamics'}"></blog-post>

<blog-post v-bind:author="post.author"></blog-post>
```



## 传入一个对象的所有 property

```javascript
post: {
    id: 1,
    title: "My Journey with Vue"
}
```

**`下面的模板：`** 

```html
<blog-post v-bind="post"></blog-post>
```

**`等价于：`** 

```html
<blog-post v-bind:id="post.id" v-bind:title="post.title">
</blog-post>
```



## 单向数据流

1. **`这个 prop 用来传递一个初始值，这个子组件接下来希望将其作为一个本地的 prop 数据来使用。`** 

```javascript
props: ["initialCounter"],
data: function () {
    return {
        counter: this.initialCounter
    }
}
```

2. **`这个 prop 以一种原始的值传入且需要进行转换。在这种情况下，最好使用这个 prop 的值来定义一个计算属性：`** 

```javascript
props: ["size"],
computed: {
    normalizedSize: function () {
        return this.size.trim().toLowerCase()
    }
}
```



## Prop 验证

```javascript
Vue.component("my-component", {
    props: {
        // 基础的类型检查（null 和 undefined 会通过任何类型验证）
        propA: Number,
        // 多个可能的类型
        propB: [String, Number],
        // 必填的字符串
        propC: {
            type: String,
            required: true
        },
        // 带有默认值的数字
        propD: {
            type: Number,
            default: 100
        },
        // 带有默认值的对象
        propE: {
            type: Object,
            default: function () {
                return { message: "hello" }
            }
        },
        // 自定义验证函数
        propF: {
            validator: function (value) {
                return ["success", "warning", "danger"].includes(value)
            }
        }
    }
})
```



<br>

## 非 prop 的 attribute

```vue
// ParentComponent.vue
<template>
  <div>
    <my-button class="btn btn-primary" data-id="123"></my-button>
  </div>
</template>
```

**`渲染结果：`**

```html
<button class="btn btn-primary" data-id="123">
  Click me
</button>
```

<br>

### 多根组件

**`与单根节点组件不同，多根节点组件不会自动继承 attribute。如果没有显式绑定 $attrs，Vue 会发出一个运行时警告。`**

```vue
// MyComponent.vue
<template>
  <div></div>
  <div></div>
</template>
```

```vue
// ParentComponent.vue
<template>
  <div>
    <my-component class="my-component"></my-component>
  </div>
</template>
```

**`要解决这个问题，你需要手动将 $attrs 绑定到其中一个根节点上。`**

```vue
// MyComponent.vue
<template>
  <div v-bind="$attrs"></div>
  <div></div>
</template>
```







# 自定义事件



## 事件名

**`父组件（ParentComponent.vue）：`**

```vue
<template>
  <div>
    <p>来自子组件的消息：{{ messageFromChild }}</p>
    <child-component @custom-event="handleCustomEvent"></child-component>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: {
    ChildComponent
  },
  data() {
    return {
      messageFromChild: ''
    };
  },
  methods: {
    handleCustomEvent(message) {
      this.messageFromChild = message;
    }
  }
};
</script>
```

**`子组件（ChildComponent.vue）：`**

```vue
<template>
  <button @click="emitCustomEvent">触发自定义事件</button>
</template>

<script>
export default {
  methods: {
    emitCustomEvent() {
      this.$emit('custom-event', '你好，我是来自子组件的消息！');
    }
  }
};
</script>
```



## `.native`

**`CustomButton.vue 组件：`**

```vue
<template>
  <button class="custom-button">
    <slot></slot>
  </button>
</template>

<style scoped>
.custom-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
```

**`ParentComponent.vue 组件：`**

```vue
<template>
	<div>
        <custom-button @click.native="handleClick">点击我</custom-button>
    </div>
</template>

<script>
import CustomButton from "./CustomButton.vue";
    
export default {
    components: {
        CustomButton
    },
    methods: {
        handleClick(event) {}
    }
}
</script>
```

**`为什么要使用 .native`**

**`默认情况下，Vue 会将组件上的事件监听器视为自定义事件。如果你不使用 .native，Vue 会尝试在 CustomButton 组件中寻找名为 click 的自定义事件，但它不存在，所以事件处理函数不会被调用。`** 

<br>

## `$attrs 和 $listeners`

**`CustomInput.vue 组件`**

```vue
<template>
	<input v-bind="$attrs" v-on="$listeners">
</template>

<script>
export default {
    inheritAttrs: false,
    props: {
        value: {
            type: String,
            default: ""
        }
    },
    watch: {
        value(newValue) {
            this.$emit("input", newValue);
        }
    }
}
</script>
```

**`ParentComponent.vue 组件：`**

```vue
<template>
  <div>
    <custom-input
      type="text"
      placeholder="请输入内容"
      class="my-input"
      :value="inputValue"
      @input="handleInput"
      @focus="handleFocus"
    ></custom-input>
    <p>输入的值：{{ inputValue }}</p>
  </div>
</template>

<script>
import CustomInput from './CustomInput.vue';

export default {
  components: {
    CustomInput
  },
  data() {
    return {
      inputValue: ''
    };
  },
  methods: {
    handleInput(value) {
      this.inputValue = value;
    },
    handleFocus() {
      console.log('输入框获得焦点');
    }
  }
};
</script>

<style scoped>
.my-input {
  border: 1px solid #ccc;
  padding: 8px;
  font-size: 16px;
}
</style>
```

<br>

## `.sync`

**`MyComponent.vue 组件：`**

```vue
<template>
  <div>
    <p>Title: {{ title }}</p>
    <button @click="updateTitle">Update Title</button>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },
  methods: {
    updateTitle() {
      const newTitle = 'New Title from Child';
      this.$emit('update:title', newTitle); // 触发 update:title 事件
    }
  }
};
</script>
```

**`ParentComponent.vue 组件：`**

```vue
<template>
  <div>
    <my-component :title.sync="documentTitle"></my-component>
    <p>Parent Title: {{ documentTitle }}</p>
  </div>
</template>

<script>
import MyComponent from './MyComponent.vue';

export default {
  components: {
    MyComponent
  },
  data() {
    return {
      documentTitle: 'Initial Title'
    };
  }
};
</script>
```





# 插槽



## 默认插槽

**`MyComponent.vue 组件：`**

```vue
<template>
  <div class="my-component">
    <h2>Component Title</h2>
    <div class="content">
      <slot>
        <!-- 默认内容，当父组件没有提供内容时显示 -->
        <p>This is default content.</p>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.my-component {
  border: 1px solid #ccc;
  padding: 20px;
}
.content {
  margin-top: 10px;
}
</style>
```

**`ParentComponent.vue 组件：`**

```vue
<template>
  <div>
    <my-component>
      <!-- 父组件提供的内容 -->
      <p>This is content from the parent component.</p>
      <button>Click me</button>
    </my-component>
  </div>
</template>

<script>
import MyComponent from './MyComponent.vue';

export default {
  components: {
    MyComponent
  }
};
</script>
```



<br>

## 具名插槽

**`BaseLayout 组件：`**

```vue
<template>
  <div class="container">
    <header>
      <slot name="header">
        <!-- header 插槽的默认内容 -->
        <h1>Default Header</h1>
      </slot>
    </header>
    <main>
      <slot>
        <!-- 默认插槽的默认内容 -->
        <p>Default Main Content</p>
      </slot>
    </main>
    <footer>
      <slot name="footer">
        <!-- footer 插槽的默认内容 -->
        <p>Default Footer</p>
      </slot>
    </footer>
  </div>
</template>

<style scoped>
.container {
  border: 1px solid #ccc;
  padding: 20px;
}
header, footer {
  background-color: #f0f0f0;
  padding: 10px;
  text-align: center;
}
main {
  padding: 20px;
}
</style>
```

**`ParentComponent.vue 组件：`**

```vue
<template>
  <div>
    <base-layout>
      <template v-slot:header>
        <h1>Page Title</h1>
      </template>
      <template v-slot:default>
        <p>Main content of the page.</p>
      </template>
      <template v-slot:footer>
        <p>Copyright 2023</p>
      </template>
    </base-layout>
  </div>
</template>

<script>
import BaseLayout from './BaseLayout.vue';

export default {
  components: {
    BaseLayout
  }
};
</script>
```

<br>

## 作用域插槽

**`MyList.vue 组件：`**

```vue
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item">
        <!-- 默认内容，如果父组件没有提供内容 -->
        {{ item.name }}
      </slot>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, name: 'Item 1', description: 'Description 1' },
        { id: 2, name: 'Item 2', description: 'Description 2' },
        { id: 3, name: 'Item 3', description: 'Description 3' }
      ]
    };
  }
};
</script>
```

**`ParentComponent.vue 组件：`**

```vue
<template>
  <div>
    <my-list>
      <template v-slot:default="slotProps">
        <strong>{{ slotProps.item.name }}</strong>:
        <span>{{ slotProps.item.description }}</span>
      </template>
    </my-list>
  </div>
</template>

<script>
import MyList from './MyList.vue';

export default {
  components: {
    MyList
  }
};
</script>
```



<br>

<br>



# 动态组件和异步组件

## 动态组件

**`ParentComponent.vue 组件：`**

```vue
<template>
  <div>
    <button @click="currentTab = 'tab-home'">Home</button>
    <button @click="currentTab = 'tab-posts'">Posts</button>
    <button @click="currentTab = 'tab-archive'">Archive</button>

    <component :is="currentTab"></component>
  </div>
</template>

<script>
import TabHome from './TabHome.vue';
import TabPosts from './TabPosts.vue';
import TabArchive from './TabArchive.vue';

export default {
  components: {
    TabHome,
    TabPosts,
    TabArchive
  },
  data() {
    return {
      currentTab: 'tab-home' // 默认显示的组件
    };
  }
};
</script>
```

**`TabHome.vue，TabPosts.vue，TabArchive.vue 组件：`**

```vue
// TabHome.vue
<template>
  <div>
    <h2>Home Tab</h2>
    <p>This is the home tab content.</p>
  </div>
</template>

// TabPosts.vue
<template>
  <div>
    <h2>Posts Tab</h2>
    <p>This is the posts tab content.</p>
  </div>
</template>

// TabArchive.vue
<template>
  <div>
    <h2>Archive Tab</h2>
    <p>This is the archive tab content.</p>
  </div>
</template>
```

<br>

## 异步组件

**`ParentComponent.vue 组件：`**

```vue
<template>
  <div>
    <async-component></async-component>
  </div>
</template>

<script>
export default {
  components: {
    AsyncComponent: (resolve, reject) => {
      setTimeout(() => {
        // 模拟异步加载组件
        resolve({
          template: '<div>I am an async component!</div>'
        });
      }, 1000);
    }
  }
};
</script>
```

**`使用 import() 语法`**

```vue
<script>
export default {
  components: {
    AsyncComponent: () => import('./AsyncComponent.vue')
  }
};
</script>
```



<br>

<br>

# 混入

```javascript
// myMixin.js
export default {
  data() {
    return {
      message: 'Hello from mixin!'
    };
  },
  created() {
    console.log('Mixin created hook called.');
  },
  methods: {
    mixinMethod() {
      console.log('Mixin method called.');
    }
  }
};
```

<br>

## 全局 mixin

```javascript
// main.js
import Vue from 'vue';
import myMixin from './myMixin.js';

Vue.mixin(myMixin); // 全局注册 mixin

new Vue({
  el: '#app',
  // ...
});
```

<br>

## 局部 mixin

```vue
// MyComponent.vue
<template>
  <div>
    <p>{{ message }}</p>
    <button @click="mixinMethod">Call Mixin Method</button>
  </div>
</template>

<script>
import myMixin from './myMixin.js';

export default {
  mixins: [myMixin], // 混入 mixin
  created() {
    console.log('Component created hook called.');
  }
};
</script>
```

<br>

## 选项合并

### 命名冲突组件数据优先

**`当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行合并。比如，数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。`**

```javascript
var mixin = {
    data: function () {
        return {
            message: "hello",
            foo: "abc"
        }
    }
}

new Vue({
    mixins: [mixin],
    data: function () {
        return {
            message: "goodbye",
            bar: "def"
        }
    },
    created: function () {
        console.log(this.$data);
        // { message: "goodbye", foo: "abc", bar: "def" }
    }
})
```

<br>

### 同名钩子，混入对象先执行

```javascript
var mixin = {
    created: function () {
        console.log("混入对象的钩子被调用")
    }
}

new Vue({
    mixins: [mixin],
    created: function () {
        console.log("组件钩子被调用")
    }
})

// 混入对象的钩子被调用
// 组件钩子被调用
```

<br>

### 选项方法冲突，取组件对象的键值对

```javascript
var mixin = {
    methods: {
        foo: function () {
            console.log("foo")
        },
        conflicting: function () {
    		console.log("from mixin")
		}
    }
}

var vm = new Vue({
    mixins: [mixin],
    methods: {
        bar: function () {
            console.log("bar")
        },
        conflicting: function () {
            console.log("from self");
		}
    }
})


vm.foo(); // "foo"
vm.bar(); // "bar"
vm.conflicting(); // "from self"
```





<br>

<br>

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

<br>

<br>

# 过滤器

## 全局过滤器

```javascript
// main.js
import Vue from 'vue';

Vue.filter('capitalize', function (value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

new Vue({
  el: '#app',
  // ...
});
```

**`使用过滤器`**

```vue
<template>
  <div>
    <p>{{ message | capitalize }}</p>
  </div>
</template>
```



## 局部过滤器

```vue
// MyComponent.vue
<template>
  <div>
    <p>{{ message | capitalize }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'hello world'
    };
  },
  filters: {
    capitalize: function (value) {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
};
</script>
```



## 过滤器链

```vue
<template>
  <div>
    <p>{{ message | filterA | filterB }}</p>
  </div>
</template>
```



## 过滤器参数

```javascript
Vue.filter('truncate', function (value, length) {
  if (!value) return '';
  value = value.toString();
  if (value.length <= length) return value;
  return value.substring(0, length) + '...';
});
```

```vue
<template>
  <div>
    <p>{{ message | truncate(10) }}</p>
  </div>
</template>
```



