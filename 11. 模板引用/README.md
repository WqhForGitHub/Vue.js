# 模板引用

虽然 Vue 的声明性渲染模型为你抽象了大部分对 DOM 的直接操作，但在某些情况下，我们仍然需要直接访问底层 DOM 元素。要实现这一点，我们可以使用特殊的 `ref` attribute：

```vue
<input ref="input">
```

`ref` 是一个特殊的 attribute，和 `v-for` 章节中提到的 `key` 类似。它允许我们在一个特定的 DOM 元素或子组件实例被挂载后，获得对它的直接引用。这可能很有用，比如说在组件挂载时将焦点设置到一个 input 元素上，或在一个元素上初始化一个第三方库。

<br>

## 访问模板引用

要在组合式 API 中获取引用，我们可以使用辅助函数 `useTemplateRef()`（3.5+）：

```vue
<template>
	<input ref="my-input" />
</template>

<script setup>
import { useTemplateRef, onMounted } from "vue";
    
// 第一个参数必须与模板中的 ref 值匹配
const input = useTemplateRef("my-input");

onMounted(() => {
    input.value.focus();
})
</script>
```

在使用 TypeScript 时，Vue 的 IDE 支持和 `vue-tsc` 将根据匹配的 `ref` attribute 所用的元素或组件自动推断 `input.value` 的类型。

3.5 前的用法

在 3.5 之前的版本尚未引入 `useTemplateRef()`，我们需要声明一个与模板里 ref attribute 匹配的引用：

```vue
<template>
	<input ref="input" />
</template>

<script setup>
import { ref, onMounted } from "vue";

// 声明一个 ref 来存放该元素的引用
// 必须和模板里的 ref 同名
const input = ref(null);
    
onMounted(() => {
	input.value.focus();
})
</script>
```

如果不使用 `<script setup>`，需确保从 `setup()` 返回 ref：

```javascript
export default {
    setup() {
        const input = ref(null);
        
        return {
            input
        }
    }
}
```

注意，你只可以**在组件挂载后**才能访问模板引用。如果你想在模板中的表达式上访问 `input`，在初次渲染时会是 `null`。这是因为在初次渲染前这个元素还不存在。

如果你需要侦听一个模板引用 ref 的变化，确保考虑到其值为 `null` 的情况：

```javascript
watchEffect(() => {
    if (input.value) {
        input.value.focus();
    } else {
        // 此时还未挂载，或此元素已经被卸载（例如通过 v-if 控制）
    }
})
```

<br>

## 组件上的 ref

模板引用也可以被用在一个子组件上。这种情况下引用中获得的值是组件实例：

```vue
<template>
	<Child ref="child" />
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

3.5 前的用法

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
})
</script>
```

如果一个子组件使用的是选项式 API 或没有使用 `<script setup>`，被引用的组件实例和该子组件的 `this` 完全一致，这意味着父组件对子组件的每一个属性和方法都有完全的访问权。这使得在父组件和子组件之间创建紧密耦合的实现细节变得很容易，当然也因此，应该只在绝对需要时，才使用组件引用。大多数情况下，你应该首先使用标准的 props 和 emit 接口来实现父子组件交互。

