





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

<br>

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

<br>

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

<br>

## 钩子函数

**`一个指令定义对象可以提供如下几个钩子函数（均为可选）：`**

* **`bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。`**
* **`inserted：被绑定元素插入父节点时调用（仅保证父节点存在，但不一定已被插入文档中）。`**
* **`update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新。`**
* **`componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。`**
* **`unbind：只调用一次，指令与元素解绑时调用。`**

<br>

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

<br>

## 函数简写

**`在很多时候，你可能想在 bind 和 update 时触发相同行为，而不关心其他的钩子。比如这样写：`**

```javascript
Vue.directive("color-swatch", function (el, binding) {
    el.style.backgroundColor = binding.value;
})
```

<br>

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

## 全局指令示例

```javascript
// 注册一个全局自定义指令 v-focus
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus();
  }
});
```

**`使用：`**

```vue
<template>
  <div>
    <input type="text" v-focus placeholder="Focus me" />
  </div>
</template>
```

<br>

## 局部指令示例

```vue
<template>
  <div>
    <input type="text" v-color="textColor" placeholder="Change my color" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      textColor: 'red'
    };
  },
  directives: {
    // 注册一个局部自定义指令 v-color
    color: {
      bind: function (el, binding) {
        el.style.color = binding.value;
      },
      update: function (el, binding) {
        el.style.color = binding.value;
      }
    }
  }
};
</script>
```



<br>

<br>

# 过滤器

<br>

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

<br>

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

<br>

## 过滤器链

```vue
<template>
  <div>
    <p>{{ message | filterA | filterB }}</p>
  </div>
</template>
```

<br>

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



