# 2. 核心概念

## State

### 单一状态树

<br>

### 在 Vue 组件中获得 Vuex 状态

```javascript
const Counter = {
    template: `<div>{{ count }}</div>`,
    computed: {
        count() {
            return store.state.count
        }
    }
}
```

<br>

Vuex 通过 Vue 的插件系统将 store 实例从根组件中注入到所有的子组件。且子组件能通过 `this.$store` 访问到。让我们更新下 `Counter` 的实现：

```javascript
const Counter = {
    template: `<div>{{ count }}</div>`,
    computed: {
        count() {
            return this.$store.state.count
        }
    }
}
```

<br>

### `mapState` 辅助函数

当一个组件需要获取多个状态的时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 `mapState` 辅助函数帮助我们生成计算属性，让你少按几次键：

```javascript
import { mapState } from 'vuex';

export default {
    computed: mapState({
        count: state => state.count,
        countAlias: 'count',
        countPlusLocalState (state) {
            return state.count + this.localCount
        }
    })
}
```

当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 `mapState` 传一个字符串数组。

```javascript
computed: mapState([
    // 映射 this.count 为 store.state.count
    'count'
])
```

<br>

### 对象展开运算符

```javascript
computed: {
    localComputed () {},
    // 使用对象展开运算符将此对象混入到外部对象中
    ...mapState({})
}
```

<br>

### 组件仍然保有局部状态

使用 Vuex 并不意味着你需要将**所有的**状态放入 Vuex。虽然将所有的状态放到 Vuex 会使状态变化更显式和易调试，但也会使代码变得冗长和不直观。如果有些状态严格属于单个组件，最好还是作为组件的局部状态。你应该根据你的应用开发需要进行权衡和确定。

<br>

## Getter

有时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数：

```javascript
computed: {
    doneTodosCount () {
        return this.$store.state.todos.filter(todo => todo.done).length;
    }
}
```

如果有多个组件需要用到此属性，我们要么复制这个函数，或者抽取到一个共享函数然后在多处导入它，无论哪种方式都不是很理想。

Vuex 允许我们在 store 中定义 getter（可以认为是 store 的计算属性）。

Getter 接受 state 作为其第一个参数：

```javascript
const store = createStore({
    state: {
        todos: [
            { id: 1, text: "...", done: true },
            { id: 2, text: "...", done: false }
        ]
    },
    getters: {
        doneTodos (state) {
            return state.todos.filter(todo => todo.done);
        }
    }
})
```

<br>

### 通过属性访问

Getter 会暴露为 `store.getters` 对象，你可以以属性的形式访问这些值：

```javascript
store.getters.doneTodos
```

Getter 也可以接受其他 getters 作为第二个参数：

```javascript
getters: {
    doneTodosCount (state, getters) {
        return getters.doneTodos.length
    }
}
```

```javascript
store.getters.doneTodosCount
```

我们可以很容易地在任何组件中使用它：

```javascript
computed: {
    doneTodosCount () {
        return this.$store.getters.doneTodosCount
    }
}
```

注意，getter 在通过属性访问时是作为 Vue 的响应式系统的一部分缓存其中的。

<br>

### 通过方法访问

你也可以通过让 getter 返回一个函数，来实现给 getter 传参。在你对 store 里的数组进行查询时非常有用。

```javascript
getters: {
    getTodoById: (state) => (id) => {
        return state.todos.find(todo => todo.id === id)
    }
}
```

```javascript
store.getters.getTodoById(2);
```

注意，getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果。

<br>

### `mapGetters` 辅助函数

`mapGetters` 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：

```javascript
import { mapGetters } from 'vuex';

export default {
    computed: {
        // 使用对象展开运算符将 getters 混入 computed 对象中
        ...mapGetters([
            'doneTodosCount',
            'anotherGetter'
        ])
    }
}
```

如果你想将一个 getter 属性另取一个名字，使用对象形式：

```javascript
...mapGetters({
    // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
    doneCount: "doneTodosCount"
})
```











