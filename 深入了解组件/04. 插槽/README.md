# 插槽

>在 2.6.0 中，我们为具名插槽和作用域插槽引入了一个新的统一的语法 (即 `v-slot` 指令)。它取代了 `slot` 和 `slot-scope` 这两个目前已被废弃但未被移除且仍在[文档中](https://v2.cn.vuejs.org/v2/guide/components-slots.html#废弃了的语法)的 attribute。新语法的由来可查阅这份 [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md)。

<br>

## 插槽内容

Vue 实现了一套内容分发的 API，这套 API 的设计灵感源自**Web Components 规范草案**，将 `<slot>` 元素作为承载分发内容的出口。

它允许你像这样合成组件：

```vue
<navigation-link url="/profile">
	Your Profile
</navigation-link>
```

然后你在 `<navigation-link>` 的模板中可能会写为：

```vue
<a
	v-bind:href="url"
	class="nav-link"
>
	<slot></slot>
</a>
```

当组件渲染的时候，`<slot></slot>` 将会被替换为 "Your Profile"。插槽内可以包含任何模板代码，包括 HTML：

```vue
<navigation-link url="/profile">
	<!-- 添加一个 Font Awesome 图标 -->
    <span class="fa fa-user"></span>
    Your Profile
</navigation-link>
```

甚至其他的组件：

```vue
<navigation-link url="/profile">
	<!-- 添加一个图标的组件 -->
    <font-awesone-icon name="user"></font-awesone-icon>
    Your Profile
</navigation-link>
```

如果 `<navigation-link>` 的 `template` 中**没有**包含一个 `<slot>` 元素，则该组件起始标签和结束标签之间的任何内容都会被抛弃。

<br>

## 编译作用域

当你想在一个插槽中使用数据时。例如：

```vue
<navigation-link url="/profile">
    Logged in as {{ user.name }}
</navigation-link>
```

该插槽跟模板的其他地方一样可以访问相同的实例 property（也就是相同的作用域），而**不能**访问`<navigation-link>` 的作用域。例如 `url` 是访问不到的：

```vue
<navigation-link url="/profile">
	Clicking here will send you to: {{ url }}
    <!--
		这里的 `url` 会是 undefined，因为其（指该插槽的）内容是
		传递给 <navigation-link> 的而不是
		在 <navigation-link> 组件内部定义
	-->
</navigation-link>
```

作为一条规则，请记住：

>父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

<br>

## 后备内容

有时为一个插槽设置具体的后备 (也就是默认的) 内容是很有用的，它只会在没有提供内容的时候被渲染。例如在一个 `<submit-button>` 组件中：

```vue
<button type="submit">
	<slot></slot>
</button>
```

我们可能希望这个 `<button>` 内绝大多数情况下都渲染文本“Submit”。为了将“Submit”作为后备内容，我们可以将它放在 `<slot>` 标签内：

```vue
<button type="submit">
	<slot>Submit</slot>
</button>
```

现在当我在一个父级组件中使用 `<submit-button>` 并且不提供任何插槽内容时：

```vue
<submit-button></submit-button>
```

后备内容“Submit”将会被渲染：

```vue
<button type="submit">
	Submit
</button>
```

但是如果我们提供内容：

```vue
<submit-button>
	Save
</submit-button>
```

则这个提供的内容将会被渲染从而取代后备内容：

```vue
<button type="submit">
	Save
</button>
```

<br>

## 具名插槽

>自 2.6.0 起有所更新。已废弃的使用 `slot` attribute 的语法在[这里](https://v2.cn.vuejs.org/v2/guide/components-slots.html#废弃了的语法)。

有时我们需要多个插槽。例如对于一个带有如下模板的 `<base-layout>` 组件：

```vue
<div class="container">
    <header>
		<!-- 我们希望把页头放这里 -->
    </header>
    <main>
        <!-- 我们希望把主要内容放这里 -->
    </main>
    <footer>
		<!-- 我们希望把页脚放这里 -->
    </footer>
</div>
```

对于这样的情况，`<slot>` 元素有一个特殊的 attribute：`name`。这个 attribute 可以用来定义额外的插槽：

```vue
<div class="container">
    <header>
		<slot name="header"></slot>
    </header>
    <main>
		<slot></slot>
    </main>
    <footer>
		<slot name="footer"></slot>
    </footer>
</div>
```

一个不带 `name` 的 `<slot>` 出口会带有隐含的名字“default”。

在向具名插槽提供内容的时候，我们可以在一个 `<template>` 元素上使用 `v-slot` 指令，并以 `v-slot` 的参数的形式提供其名称：

```vue
<base-layout>
	<template v-slot:header>
		<h1>Here might be a page title</h1>
    </template>
    
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
    
    <template v-slot:footer>
		<p>Here's some contact info</p>
    </template>
</base-layout>
```

现在 `<template>` 元素中的所有内容都将会被传入相应的插槽。任何没有被包裹在带有 `v-slot` 的 `<template>` 中的内容都会被视为默认插槽的内容。

然而，如果你希望更明确一些，仍然可以在一个 `<template>` 中包裹默认插槽的内容：

```vue
<base-layout>
	<template v-slot:header>
		<h1>Here might be a page title</h1>
    </template>
    
    <template v-slot:default>
		<p>A paragraph for the main content.</p>
		<p>And another one.</p>
    </template>
    
    <template v-slot:footer>
		<p>Here's some contact info</p>
    </template>
</base-layout>
```

任何一种写法都会渲染出：

```vue
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

注意 **`v-slot` 只能添加在 `<template>` 上** (只有[一种例外情况](https://v2.cn.vuejs.org/v2/guide/components-slots.html#独占默认插槽的缩写语法))，这一点和已经废弃的 [`slot` attribute](https://v2.cn.vuejs.org/v2/guide/components-slots.html#废弃了的语法) 不同。

<br>

## 作用域插槽

>自 2.6.0 起有所更新。已废弃的使用 `slot-scope` attribute 的语法在[这里](https://v2.cn.vuejs.org/v2/guide/components-slots.html#废弃了的语法)。

有时让插槽内容能够访问子组件中才有的数据是很有用的。例如，设想一个带有如下模板的 `<current-user>` 组件：

```vue
<span>
	<slot>{{ user.lastName }}</slot>
</span>
```

我们可能想换掉备用内容，用名而非姓来显示。如下：

```vue
<current-user>
	{{ user.firstName }}
</current-user>
```

然而上述代码不会正常工作，因为只有 `<current-user>` 组件可以访问到 `user`，而我们提供的内容是在父级渲染的。

为了让 `user` 在父级的插槽内容中可用，我们可以将 `user` 作为 `<slot>` 元素的一个 attribute 绑定上去：

```vue
<span>
	<slot v-bind:user="user">
		{{ user.lastName }}
    </slot>
</span>
```

绑定在 `<slot>` 元素上的 attribute 被称为 **插槽 prop**。现在在父级作用域中，我们可以使用带值的 `v-slot` 来定义我们提供的插槽 prop 的名字：

```vue
<current-user>
	<template v-slot:default="slotProps">
		{{ slotProps.user.firstName }}
    </template>
</current-user>
```

在这个例子中，我们选择将包含所有插槽 prop 的对象命名为 `slotProps`，但你也可以使用任意你喜欢的名字。

<br>

### 独占默认插槽的缩写语法

在上述情况下，当被提供的内容只有默认插槽时，组件的标签才可以被当作插槽的模板来使用。这样我们就可以把 `v-slot` 直接用在组件上：

```vue
<current-user v-slot:default="slotProps">
	{{ slotProps.user.firstName }}
</current-user>
```

这种写法还可以更简单。就像假定未指明的内容对应默认插槽一样，不带参数的 `v-slot` 被假定对应默认插槽：

```vue
<current-user v-slot="slotProps">
	{{ slotProps.user.firstName }}
</current-user>
```

注意默认插槽的缩写语法**不能**和具名插槽混用，因为它会导致作用域不明确：

```vue
<!-- 无效，会导致警告 -->
<current-user v-slot="slotProps">
	{{ slotProps.user.firstName }}
    <template v-slot:other="otherSlotProps">
		slotProps is NOT available here
    </template>
</current-user>
```

只要出现多个插槽，请始终为所有的插槽使用完整的基于 `<template>` 的语法：

```vue
<current-user>
	<template v-slot:default="slotProps">
		{{ slotProps.user.firstName }}
    </template>
    
    <template v-slot:other="otherSlotProps">
    </template>
</current-user>
```

<br>

### 解构插槽 Prop

作用域插槽的内部工作原理是将你的插槽内容包裹在一个拥有单个参数的函数里：

```javascript
function (slotProps) {
    // 插槽内容
}
```

这意味着 `v-slot` 的值实际上可以是任何能够作为函数定义中的参数的 JavaScript 表达式。所以在支持的环境下 ([单文件组件](https://v2.cn.vuejs.org/v2/guide/single-file-components.html)或[现代浏览器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#浏览器兼容))，你也可以使用 [ES2015 解构](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#解构对象)来传入具体的插槽 prop，如下：

```vue
<current-user v-slot="{ user }">
	{{ user.firstName }}
</current-user>
```

这样可以使模板更简洁，尤其是在该插槽提供了多个 prop 的时候。它同样开启了 prop 重命名等其它可能，例如将 `user` 重命名为 `person`：

```vue
<current-user v-slot="{ user: person }">
	{{ person.firstName }}
</current-user>
```

你甚至可以定义后备内容，用于插槽 prop 是 undefined 的情形：

```vue
<current-user v-slot="{ user = { firstName: 'Guest' } }">
	{{ user.firstName }}
</current-user>
```

<br>

## 动态插槽名

>2.6.0 新增

**动态指令参数** 也可以用在 `v-slot` 上，来定义动态的插槽名：

```vue
<base-layout>
	<template v-slot:[dynamicSlotName]>
    </template>
</base-layout>
```

<br>

## 具名插槽的缩写

>2.6.0 新增

跟 `v-on` 和 `v-bind` 一样，`v-slot` 也有缩写，即把参数之前的所有内容 (`v-slot:`) 替换为字符 `#`。例如 `v-slot:header` 可以被重写为 `#header`：

```vue
<base-layout>
	<template #header>
		<h1>Here might be a page title</h1>
	</template>
    
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
    
    <template #footer>
		<p>Here's some contact info</p>
    </template>
</base-layout>
```

然而，和其它指令一样，该缩写只在其有参数的时候才可用。这意味着以下语法是无效的：

```vue
<!-- 这样会触发一个警告 -->
<current-user #="{ user }">
	{{ user.firstName }}
</current-user>
```

如果你希望使用缩写的话，你必须始终以明确插槽名取而代之：

```vue
<current-user #default="{ user }">
	{{ user.firstName }}
</current-user>
```

<br>

## 其他示例

**插槽 prop 允许我们将插槽转换为可复用的模板，这些模板可以基于输入的 prop 渲染出不同的内容。**这在设计封装数据逻辑同时允许父级组件自定义部分布局的可复用组件时是最有用的。

例如，我们要实现一个 `<todo-list>` 组件，它是一个列表且包含布局和过滤逻辑：

```vue
<ul>
	<li
		v-for="todo in filteredTodos"
        v-bind:key="todo.id"
	></li>
</ul>
```

我们可以将每个 todo 作为父级组件的插槽，以此通过父级组件对其进行控制，然后将 `todo` 作为一个插槽 prop 进行绑定：

```vue
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    <!--
    我们为每个 todo 准备了一个插槽，
    将 `todo` 对象作为一个插槽的 prop 传入。
    -->
    <slot name="todo" v-bind:todo="todo">
      <!-- 后备内容 -->
      {{ todo.text }}
    </slot>
  </li>
</ul>
```

现在当我们使用 `<todo-list>` 组件的时候，我们可以选择为 todo 定义一个不一样的 `<template>` 作为替代方案，并且可以从子组件获取数据：

```vue
<todo-list v-bind:todos="todos">
  <template v-slot:todo="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```

这只是作用域插槽用武之地的冰山一角。想了解更多现实生活中的作用域插槽的用法，我们推荐浏览诸如 [Vue Virtual Scroller](https://github.com/Akryum/vue-virtual-scroller)、[Vue Promised](https://github.com/posva/vue-promised) 和 [Portal Vue](https://github.com/LinusBorg/portal-vue) 等库。

<br>

## 废弃了的语法

>`v-slot` 指令自 Vue 2.6.0 起被引入，提供更好的支持 `slot` 和 `slot-scope` attribute 的 API 替代方案。`v-slot` 完整的由来参见这份 [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md)。在接下来所有的 2.x 版本中 `slot` 和 `slot-scope` attribute 仍会被支持，但已经被官方废弃且不会出现在 Vue 3 中。

### 带有 `slot` attribute 的具名插槽

>自 2.6.0 起被废弃。新推荐的语法请查阅[这里](https://v2.cn.vuejs.org/v2/guide/components-slots.html#具名插槽)。

在 `<template>` 上使用特殊的 `slot` attribute，可以将内容从父级传给具名插槽 (把[这里](https://v2.cn.vuejs.org/v2/guide/components-slots.html#具名插槽)提到过的 `<base-layout>` 组件作为示例）：

```vue
<base-layout>
  <template slot="header">
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template slot="footer">
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

或者直接把 `slot` attribute 用在一个普通元素上：

```vue
<base-layout>
  <h1 slot="header">Here might be a page title</h1>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <p slot="footer">Here's some contact info</p>
</base-layout>
```

这里其实还有一个未命名插槽，也就是**默认插槽**，捕获所有未被匹配的内容。上述两个示例的 HTML 渲染结果均为：

```vue
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

<br>

### 带有 `slot-scope` attribute 的作用域插槽

>自 2.6.0 起被废弃。新推荐的语法请查阅[这里](https://v2.cn.vuejs.org/v2/guide/components-slots.html#作用域插槽)。

在 `<template>` 上使用特殊的 `slot-scope` attribute，可以接收传递给插槽的 prop (把[这里](https://v2.cn.vuejs.org/v2/guide/components-slots.html#作用域插槽)提到过的 `<slot-example>` 组件作为示例）：

```vue
<slot-example>
	<template slot="default" slot-scope="slotProps">
		{{ slotProps.msg }}
    </template>
</slot-example>
```

这里的 `slot-scope` 声明了被接收的 prop 对象会作为 `slotProps` 变量存在于 `<template>` 作用域中。你可以像命名 JavaScript 函数参数一样随意命名 `slotProps`。

这里的 `slot="default"` 可以被忽略为隐性写法：

```vue
<slot-example>
  <template slot-scope="slotProps">
    {{ slotProps.msg }}
  </template>
</slot-example>
```

`slot-scope` attribute 也可以直接用于非 `<template>` 元素 (包括组件)：

```vue
<slot-example>
  <span slot-scope="slotProps">
    {{ slotProps.msg }}
  </span>
</slot-example>
```

`slot-scope` 的值可以接收任何有效的可以出现在函数定义的参数位置上的 JavaScript 表达式。这意味着在支持的环境下 ([单文件组件](https://v2.cn.vuejs.org/v2/guide/single-file-components.html)或[现代浏览器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#浏览器兼容))，你也可以在表达式中使用 [ES2015 解构](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#解构对象)，如下：

```vue
<slot-example>
  <span slot-scope="{ msg }">
    {{ msg }}
  </span>
</slot-example>
```

使用[这里](https://v2.cn.vuejs.org/v2/guide/components-slots.html#其它示例)描述过的 `<todo-list>` 作为示例，与它等价的使用 `slot-scope` 的代码是：

```vue
<todo-list v-bind:todos="todos">
  <template slot="todo" slot-scope="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```



