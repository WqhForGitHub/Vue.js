

# 动态路由匹配

**`我们经常需要把某种匹配到的所有路由，全都映射到同一个组件。例如，我们有一个 User 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 vue-router 的路由路径中使用动态路径参数来达到这个效果：`**

```javascript
const User = {
    template: "<div>User</div>"
}


const router = new VueRouter({
    routes: [
        {
            // 动态路径参数以冒号开头
            path: "/user/:id",
            component: User
        }
    ]
})
```

**`现在呢，像 /user/foo 和 /user/bar 都将映射到相同的路由。`**

**`一个路径参数使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 this.$route.params，可以在每个组件内使用。于是，我们可以更新 User 的模板，输出当前用户的 ID：`**

```javascript
const User = {
    template: "<div>User {{ $route.params.id }}</div>"
}
```



| 模式                                | 匹配路径                  | $route.params                              |
| ----------------------------------- | ------------------------- | ------------------------------------------ |
| **`/user/:username`**               | **`/user/evan`**          | **` { username: "evan" } `**               |
| **`/user/:username/post/:post_id`** | **`/user/evan/post/123`** | **`{ username: "evan", post_id: "123" }`** |

**`除了 $route.params 外，$route 对象还提供了其他有用的信息，例如，$route.query（如果 URL 中有查询参数）、$route.hash 等等。`**





## 响应路由参数的变化

**`提醒一下，当使用路由参数时，例如从 /user/foo 导航到 /user/bar，原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，这也意味着组件的生命周期钩子不会再被调用。`**

**`复用组件时，想对路由参数的变化作出响应的话，你可以简单地 watch（监测变化）$route 对象：`**

```javascript
const User = {
    template: "",
    watch: {
        $route(to, from) {}
    }
}
```

**`或者使用 2.2 中引入的 beforeRouteUpdate 导航守卫：`**

```javascript
const User = {
    template: "",
    beforeRouteUpdate(to, from, next) {}
}
```





## 捕获所有路由或 404 Not found 路由

**`常规参数只会匹配被 / 分隔的 URL 片段中的字符。如果想匹配任意路径，我们可以使用通配符（*）：`**

```javascript
{
    // 会匹配所有路径
    path: "*"
}
{
    // 会匹配以 `/user-` 开头的任意路径
    path: "/user-*"
}
```

**`当使用通配符路由时，请确保路由的顺序是正确的，也就是说含有通配符的路由应该放在最后。路由 { path: "*" } 通常用于客户端 404 错误。`**







# 嵌套路由

**`借助 vue-router，使用嵌套路由配置，就可以很简单地表达这种关系。`**

**`接着上节创建的 app：`**

```html
<div id="app">
    <router-view></router-view>
</div>
```

```javascript
const User = {
    template: "<div>User {{ $route.params.id }}</div>"
}

const router = new VueRouter({
    routes: [{ path: "/user/:id", component: User }]
})
```

**`这里的 <router-view> 是最顶层的出口，渲染最高级路由匹配到的组件。同样地，一个被渲染组件同样可以包含自己的嵌套 <router-view>。例如，在 User 组件的模板添加一个 <router-view>：`**

```javascript
const User = {
    template: `
    	<div class="user">
    		<h2>User {{ $route.params.id }}</h2>
    		<router-view></router-view>
    	</div>
    `
}
```

**`要在嵌套的出口中渲染组件，需要在 VueRouter 的参数中使用 children 配置：`**

```javascript
const router = new VueRouter({
    routes: [
        {
            path: "/user/:id",
            component: User,
            children: [
                {
                    // 当 /user/:id/profile 匹配成功，
                    // UserProfile 会被渲染在 User 的 <router-view> 中
                    path: "profile",
                    component: UserProfile
                },
                {
                    // 当 /user/:id/posts 匹配成功
                    // UserPosts 会被渲染在 User 的 <router-view> 中
                    path: "posts",
                    component: UserPosts
                }
            ]
        }
    ]
})
```

**`要注意，以 / 开头的嵌套路径会被当作根路径。这让你充分的使用嵌套组件而无须设置嵌套的路径。`**

**`你会发现，children 配置就是像 routes 配置一样的路由配置数组，所以呢，你可以嵌套多层路由。`**

**`此时，基于上面的配置，当你访问 /user/foo 时，User 的出口是不会渲染任何东西，这是因为没有匹配到合适的子路由。如果你想要渲染点什么，可以提供一个空的子路由：`**

```javascript
const router = new VueRouter({
    routes: [
        {
            path: "/user/:id",
            component: User,
            children: [
                // 当 /user/:id 匹配成功，
                // UserHome 会被渲染在 User 的 <router-view> 中
                { path: "", component: UserHome }
            ]
        }
    ]
})
```





# 编程式的导航



## `router.push()`

**`注意：在 Vue 实例内部，你可以通过 $router 访问路由实例。因此你可以调用 this.$router.push。`**

**`想要导航不同的 URL，则使用 router.push 方法。这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。`**

**`当你点击 <router-link> 时，这个方法会在内部调用，所以说，点击 <router-link :to="..."> 等同于调用 router.push(...)。`**

| 声明式                        | 编程式                 |
| ----------------------------- | ---------------------- |
| **`<router-link :to="...">`** | **`router.push(...)`** |

**`该方法的参数可以是一个字符串路径，或者一个描述地址的对象。例如：`**

```javascript
// 字符串
router.push("home");


// 对象
router.push({ path: "home" });


// 命名的路由
router.push({ name: "user", params: { userId: "123" }})


// 带查询参数，变成 /register?plan=private
router.push({ path: "register", query: { plan: "private" } })
```

**`注意：如果提供了 path，params 会被忽略，上述例子中的 query 并不属于这种情况。取而代之的是下面例子的做法，你需要提供路由的 name 或手写完整的带有参数的 path：`**

```javascript
const userId = "123";

router.push({ name: "user", params: { userId } }) // /user/123
router.push({ path: `/user/${userId}` }); // /user/123

// 这里的 params 不生效
router.push({ path: "/user", params: { userId } }); // /user
```

**`同样的规则也适用于 router-link 组件的 to 属性。`**





## `router.replace()`

**`跟 router.push 很像，唯一的不同就是，它不会向 history 添加新纪录，而是跟它的方法名一样，替换掉当前的 history 记录。`**

| 声明式                                | 编程式                    |
| ------------------------------------- | ------------------------- |
| **`<router-link :to="..." replace>`** | **`router.replace(...)`** |





## `router.go(n)`

**`这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 window.history.go(n)。`**

**`例子`**

```javascript
// 在浏览器记录中前进一步，等同于 history.forward()
router.go(-1);

// 后退一步记录，等同于 history.back()
router.go(-1);

// 前进 3 步记录
router.go(3);
```





## 命名路由

**`有时候，通过一个名称来标识一个路由显得更方便一些，特别是在链接一个路由，或者是执行一些跳转的时候。你可以在创建 Router 实例的时候，在 routes 配置中给某个路由设置名称。`**

```javascript
const router = new VueRouter({
    routes: [
        {
            path: "/user/:userId",
            name: "user",
            component: User
        }
    ]
})
```

**`要链接到一个命名路由，可以给 router-link 的 to 属性传一个对象：`**

```html
<router-link :to="{ name: 'user', params: { userId: 123 } }">User</router-link>
```

**`这跟代码调用 router.push() 是一回事：`**

```javascript
router.push({ name: "user", params: { userId: 123 } });
```

**`这两种方式都会把路由导航到 /user/123 路径。`**





# 重定向和别名



## 重定向

**`重定向也是通过 routes 配置来完成，下面例子是从 /a 重定向到 /b：`**

```javascript
const router = new VueRouter({
    routes: [
        { path: "/a", redirect: "/b" }
    ]
})
```

**`重定向的目标也可以是一个命名的路由：`**

```javascript
const router = new VueRouter({
    routes: [
        { path: "/a", redirect: { name: "foo" } }
    ]
})
```



## 别名

**`重定向的意思是，当用户访问 /a 时，URL 将会被替换成 /b，然后匹配路由为 /b，那么别名又是什么呢？`**

**`/a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是匹配路由则为 /a，就像用户访问 /a 一样。`**

**`上面对应的路由配置为：`**

```javascript
const router = new VueRouter({
    routes: [
        { path: "/a", component: A, alias: "/b" }
    ]
})
```

**`别名的功能让你可以自由地将 UI 结构映射到任意的 URL，而不是受限于配置的嵌套路由结构。`**



# HTML5 History 模式

**`vue-router 默认 hash 模式，使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。`**

**`如果不想要很丑的 hash，我们可以用路由的 history 模式，这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。`**

```javascript
const router = new VueRouter({
    mode: "history",
    routes: []
})
```

**`当你使用 history 模式时，URL 就像正常的 url，例如 http://yoursite.com/user/id，也好看！`**

**`不过这种模式要玩好，还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 http://oursite.com/user.id 就会返回 404，这就不好看了。`**

**`所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。`**





# 导航守卫



## 全局前置守卫

```javascript
const router = new VueRouter({});

router.beforeEach((to, rom, next) => {})
```



**`每个守卫方法接受三个参数：`** 

* **`to: Route：即将要进入的目标路由对象`**
* **`from：Route：当前导航正要离开的路由`**
* **`next：Function：一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。`**
  * **`next()：进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed（确认的）。`**
  * **`next(false)：中断当前的导航。如果浏览器的 URL 改变了（可能是用户手动或者浏览器后退按钮），那么 URL 地址会重置到 from 路由对应的地址。`**
  * **`next("/") 或者 next({ path: "/" })：跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 next 传递任意位置对象，且允许设置诸如 replace: true、name: 'home' 之类的选项以及任何用在 router-link 的 to prop 或 router.push 中的选项。`**
  * **`next(error)：如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。`**

**`确保 next 函数在任何给定的导航守卫中都被严格调用一次。它可以出现多于一次，但是只能在所有的逻辑路径都不重叠的情况下，否则钩子永远都不会被解析或报错。这里有一个在用户未能验证身份时重定向到 /login 的示例：`**

```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: { template: '<div>Home</div>' } },
  { path: '/profile', component: { template: '<div>Profile</div>' }, meta: { requiresAuth: true } },
  { path: '/login', component: { template: '<div>Login</div>' } }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 检查该路由是否需要登录
    if (!isAuthenticated()) {
      // 如果未登录，则重定向到登录页面
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 将要访问的页面路径传递给登录页面，以便登录后重定向
      })
    } else {
      // 如果已登录，则允许访问
      next()
    }
  } else {
    // 如果不需要登录，则允许访问
    next()
  }
})

function isAuthenticated () {
  // 这里应该是你的身份验证逻辑
  // 例如，检查 localStorage 中是否存在 token
  return localStorage.getItem('token') !== null
}

new Vue({
  router,
  template: `
    <div id="app">
      <h1>Vue Router Example</h1>
      <router-link to="/">Home</router-link> |
      <router-link to="/profile">Profile</router-link> |
      <router-link to="/login">Login</router-link>
      <router-view></router-view>
    </div>
  `
}).$mount('#app')
```





## 全局解析守卫

**`router.beforeResolve`**

```javascript
router.beforeResolve((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 如果路由需要登录权限
    if (用户已登录) {
      // 如果用户已登录，则允许进入路由
      next()
    } else {
      // 如果用户未登录，则重定向到登录页面
      next({
        path: '/登录',
        query: { redirect: to.fullPath } // 将要访问的页面路径作为参数传递给登录页面，方便登录后重定向
      })
    }
  } else {
    // 如果路由不需要登录权限，则直接进入
    next()
  }
})
```





## 全局后置钩子

**`你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身：`**

```javascript
router.afterEach((to, from) => {})
```





## 路由独享的守卫

**`你可以在路由配置上直接定义 beforeEnter 守卫：`**

```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/profile',
      component: Profile,
      beforeEnter: (to, from, next) => {
        if (isAuthenticated()) {
          next() // 允许访问
        } else {
          next('/login') // 重定向到登录页面
        }
      }
    },
    {
      path: '/login',
      component: Login
    }
  ]
})

function isAuthenticated () {
  // 这里应该是你的身份验证逻辑
  // 例如，检查 localStorage 中是否存在 token
  return localStorage.getItem('token') !== null
}
```





## 组件内的守卫

* **`beforeRouteEnter`**
* **`beforeRouteUpdate`**
* **`beforeRouteLeave`**

```javascript
const Foo = {
    template: "",
    beforeRouteEnter(to, from, next) {
        // 在渲染该组件的对应路由被 confirm 前调用
        // 不能获取组件实例 this
        // 因为当守卫执行前，组件实例还没被创建
    },
    beforeRouteUpdate(to, from, next) {
        // 在当前路由改变，但是该组件被复用时调用
        // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候
        // 由于会渲染同样的 Foo 组件，因为组件实例会被复用。而这个钩子就会在这个情况下被调用。
        // 可以访问组件实例 this
    },
    beforeRouteLeave(to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 this
    }
}
```

**`beforeRouteEnter 守卫不能访问 this，因为守卫在导航确认前被调用，因此即将登场的新组件还没被创建。`**

**`不过，你可以通过传一个回调给 next 来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。`**

```javascript
beforeRouteEnter (to, from, next) {
    next(vm => {
        // 通过 vm 访问组件实例
    })
}
```

**`注意 beforeRouteEnter 是支持给 next 传递回调的唯一守卫。对于 beforeRouteUpdate 和 beforeRouteLeave 来说，this 已经可用了，所以不支持传递回调，因为没必要了。`**

```javascript
beforeRouteUpdate (to, from, next) {
    this.name = to.params.name;
    next();
}
```

**`这个离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过 next(false) 来取消。`**

```javascript
beforeRouteLeave (to, from, next) {
    const answer = window.confirm("Do you really want to leave? you have unsaved changes!");
    
    if (answer) {
        next()
    } else {
        next(false);
    }
}
```



**`应用`**

```vue
<template>
  <div>
    <h1>{{ article.title }}</h1>
    <p>{{ article.content }}</p>
    <button @click="saveChanges">保存更改</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article: {
        title: '',
        content: ''
      },
      hasChanges: false
    }
  },
  beforeRouteEnter(to, from, next) {
    // 在组件创建之前调用，无法访问 `this`
    // 可以通过 `next` 的回调函数来访问组件实例
    getArticle(to.params.id).then(article => {
      next(vm => {
        vm.article = article // 在组件创建后更新数据
      })
    })
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前组件被复用时调用，可以访问 `this`
    getArticle(to.params.id).then(article => {
      this.article = article // 更新数据
      next()
    })
  },
  beforeRouteLeave(to, from, next) {
    // 在离开当前组件时调用，可以访问 `this`
    if (this.hasChanges) {
      const confirmLeave = window.confirm('你有未保存的更改，确定要离开吗？')
      if (confirmLeave) {
        next() // 允许离开
      } else {
        next(false) // 阻止离开
      }
    } else {
      next() // 允许离开
    }
  },
  methods: {
    saveChanges() {
      // 保存更改的逻辑
      this.hasChanges = false
    }
  }
}

function getArticle(id) {
  // 模拟获取文章数据的 API 调用
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: id,
        title: `文章 ${id}`,
        content: `这是文章 ${id} 的内容。`
      })
    }, 500)
  })
}
</script>
```





## 完整的导航解析流程

1. **`导航被触发。`** 
2. **`在失活的组件里调用 beforeRouteLeave 守卫。`** 
3. **`调用全局的 beforeEach 守卫。`** 
4. **`在重用的组件里调用 beforeRouteUpdate 守卫。`** 
5. **`在路由配置里调用 beforeEnter`** 。
6. **`解析异步路由组件`** 。
7. **`在被激活的组件里调用 beforeRouteEnter。`** 
8. **`调用全局的 beforeResolve 守卫。`** 
9. **`导航被确认。`** 
10. **`调用全局的 afterEach 钩子。`** 
11. **`触发 DOM 更新。`** 
12. **`调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。`** 





# 路由元信息

```javascript
const router = new VueRouter({
    routes: [
        {
            path: "/foo",
            component: Foo,
            children: [
                {
                    path: "bar",
                    component: Bar,
                    meta: {
                        requiresAuth: true
                    }
                }
            ]
        }
    ]
})
```



**`下面例子展示在全局导航守卫中检查元字段：`**

```javascript
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
```





# 滚动行为

**`注意：这个功能只在支持 history.pushState 的浏览器中可用。`**

**`当创建一个 Router 实例，你可以提供一个 scrollBehavior 方法：`**

```javascript
const router = new VueRouter({
    routes: [],
    scrollBehavior (to, from, savedPosition) {}
})
```

**`scrollBehavior 方法接收 to 和 from 路由对象。第三个参数 savedPosition 当且仅当 popState 导航（通过浏览器的前进/后退按钮触发）时可用。`**

**`这个方法返回滚动位置的对象信息，长这样：`**

* **`{ x: number, y: number }`**
* **`{ selector: string, offset? : { x: number, y: number } }`**

**`举例：`**

```javascript
scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
}
```

**`对于所有路由导航，简单地让页面滚动到顶部。`**

**`返回 savedPosition，在按下后退/前进按钮时，就会像浏览器的原生表现那样：`**

```javascript
scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
        return savedPostion;
    } else {
        return { x: 0, y: 0 }
    }
}
```

**`如果你要模拟滚动到锚点的行为：`**

```javascript
scrollBehavior (to, from, savedPosition) {
	if (to.hash) {
		return {
			selector: to.hash
		}
	}
}
```



## 平滑滚动

**`只需将 behavior 选项添加到 scrollBehavior 内部返回的对象中，就可以为支持它的浏览器启用原生平滑滚动：`**

```javascript
scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
        return {
            selector: to.hash,
            behavior: "smooth"
        }
    }
}
```





