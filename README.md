# Vue 计算属性和侦听属性



## 计算属性



### 1. 介绍

**`计算属性是自动监听依赖值的变化，从而动态返回内容，监听是一个过程，在监听的值变化时，可以触发一个回调，并做一个事情。它有以下几个特点：`** 

* **`数据可以进行逻辑处理，减少模板中计算逻辑。`** 
* **`对计算属性中的数据进行监视`** 
* **`依赖固定的数据类型（响应式数据）`** 

**`计算属性由两部分组成：get 和 set，分别用来获取计算属性和设置计算属性。默认只有 get，如果需要 set，要自己添加。另外 set 设置属性，并不是直接修改计算属性，而是修改它的依赖。`** 

```vue
computed: {
	fullName: {
		get: function () {
			return this.firstName + " " + this.lastName;
		},
		set: function (newValue) {
			var names = newValue.split(" ");
			this.firstName = names[0];
			this.lastName = names[names.length - 1];
		}
	}
}
```

**`现在再运行 vm.fullName = "John Doe" 时，setter 会被调用，vm.firstName 和 vm.lastName 也会相应地被更新。`** 



### 2. 计算属性 vs 普通属性

**`可以像绑定普通属性一样在模板中绑定计算属性，在定义上有区别：计算属性的属性值必须是一个函数。`** 

```vue
data: {
	msg: "浪里行舟",
},

computed: {
	msg2: function () {
		return "浪里行舟";
	},
	reverseMsg: function() {
		return this.msg.split(" ").reverse().join();
	}
}
```





## 侦听属性

**`Vue 提供了一种更通用的方式来观察和响应 Vue 实例上的数据变动：侦听属性 watch。watch 中可以执行任何逻辑，如函数节流，Ajax 异步获取数据，甚至操作 DOM（不建议）。`** 



### 1. 常规用法

```vue
<template>
	<div class="attr">
        <h1>watch 属性</h1>
        <h2>{{ $data }}</h2>
        <button @click="() => (a += 1)">修改 a 的值</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            a: 1,
            b: { c: 2, d: 3 },
            e: {
                f: {
                    g: 4
                }
            },
            h: []
        };
    },
    watch: {
        a: function(val, oldVal) {
            this.b.c += 1;
        },
        "b.c": function(val, oldVal) {
            this.b.d += 1;
        },
        "b.d": function(val, oldVal) {
            this.e.f.g += 1;
        },
        e: {
            handler: function(val, oldVal) {
                this.h.push("浪里行舟");
            },
            deep: true
        }
    }
}
</script>
```



### 2. 使用 watch 的深度遍历和立即调用功能

**`使用 watch 来监听数据变化的时候除了常用到 handler 的回调，其实其还有两个参数，便是：`** 

* **`deep 设置为 true 用于监听对象内部值的变化`** 
* **`immediate 设置为 true 将立即以表达式的当前值触发回调`** 

```vue
<template>
	<button @click="obj.a = 2">修改</button>
</template>

<script>
export default {
    data() {
        return {
            obj: {
                a: 1
            }
        }
    },
    watch: {
        obj: {
            handler: function(newVal, oldVal) {
                console.log(newVal);
            },
            deep: true,
            immediate: true
        }
    }
}
</script>
```

**`以上代码我们修改了 obj 对象中 a 属性的值，我们可以触发其 watch 中的 handler 回调输出新的对象，而如果不加 deep: true，我们只能监听 obj 的改变，并不会触发回调。同时我们也添加了 immediate: true 配置，其会立即以 obj 的当前值触发回调。我们再看一个实际工作中常遇到的场景：组件创建的时候我们获取一次列表的数据，同时监听 input 框，每当发生变化的时候重新获取一次筛选后的列表。`** 

```vue
created() {
	this.fetchPostList();
},

watch: {
	searchInputValue() {
		this.fetchPostList();
	}
}
```

**`有没有办法优化一下呢？`** 

```vue
watch: {
	searchInputValue: {
		handler: "fetchPostList",
		immediate: true
	}
}
```



## 两者之间对比

**`从上面流程图中，我们可以看出它们之间的区别：`** 

* **`watch：监测的是属性值，只要属性值发生变化，其都会触发执行回调函数来执行一系列操作。`** 
* **`computed：监测的是依赖值，依赖值不变的情况下其会直接读取缓存进行复用，变化的情况下才会重新计算。`** 

**`除此之外，有点很重要的区别是：计算属性不能执行异步任务，计算属性必须同步执行。也就是说计算属性不能向服务器请求或者执行异步任务。如果遇到异步任务，就交给侦听属性。watch 也可以检测 computed 属性。`** 

**`接下来我们看个用 watch 来实现防抖的例子：直到用户停止输入超过 1 秒后，才更新视图。`** 

```vue
<template>
	<div>
        {{ fullName }}
        <div>firstName: <input v-model="firstName" /></div>
     	<div>lastName: <input v-model="lastName" /></div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            firstName: "浪里行舟",
            lastName: "前端工匠",
            fullName: "浪里行舟 前端工匠"
        };
    },
    watch: {
        firstName: function(val) {
            clearTimeout(this.firstTimeout);
            this.firstTimeout = setTimeout(() => {
                this.fullName = val + " " + this.lastName;
            }, 1000);
        },
        lastName: function(val) {
            clearTimeout(this.lastTimeout);
            this.lastTimeout = setTimeout(() => {
                this.fullName = this.firstName + " " + val;
            }, 1000);
        }
    }
}
</script>
```



## 总结

**`计算属性适合用在模板渲染中，某个值是依赖了其他的响应式对象甚至是计算属性计算而来，而侦听属性适用于观测某个值的变化去完成一段复杂的业务逻辑。`** 

* **`computed 能做的，watch 都能做，反之则不行`** 
* **`能用 computed的尽量用 computed`** 



