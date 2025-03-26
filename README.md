# 开始

```bash
yarn add pinia
# 或者使用 npm
npm install pinia
```



```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

<br>

<br>

# 定义 Store

**`store.js`**

```javascript
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useMyStore = defineStore("myStore", () => {
    const message = ref("Hello Pinia!");
    const count = ref(0);
    
    const doubledCount = computed(() => count.value * 2);
    
    function increment() {
        count.value++;
    }
    
    function changeMessage(newMessage) {
        message.value = newMessage;
    }
    
    return {
        message,
        count,
        doubledCount,
        increment,
        changeMessage
    }
});
```

**`myComponent.vue`**

```vue
<template>
	<div>
        <p>{{ message }}</p>
        <p>Count: {{ count }}</p>
        <p>Doubled Count: {{ doubledCount }}</p>
        <button @click="increment">Increment</button>
        <button @click="updateMessage">Update Message</button>
    </div>
</template>

<script setup>
import { useMyStore } from "./store";
import { storeToRefs } from "pinia";

const store = useMyStore();
const { message, count, doubleCount } = storeToRefs(store);
const { increment, changeMessage } = store;

const updateMessage = () => {
    changeMessage("New message from component!");
}
</script>
```

<br>

<br>

# State

## Setup Store

```javascript
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCounterStore = defineStore("counter", () => {
    const count = ref(0);
    const name = ref("Eduardo");
    
    return { count, name }
})
```

<br>

## 访问 State

```javascript
const store = useStore();

store.count++;
```

<br>

## 重置 state

```javascript
const store = useStore();

store.$reset();
```

<br>

<br>

# Getter

## Setup Store

```javascript
import { defineStore } form "pinia";
import { ref, computed } from "vue";

export const useCounterStore = defineStore("counter", () => {
    const count = ref(0);
    const doubleCount = computed(() => count.value * 2);
    
    return { count, doubleCount }
})
```

<br>

## 访问 Getters

```vue
<template>
	<p>Double count is {{ store.doubleCount }}</p>
</template>

<script setup>
import { useCounterStore } from "./stores/counter";
    
const store = useCounterStore();
store.count = 3;
store.doubleCount; // 6
</script>
```

<br>

## Getters 访问其他 Getters

```javascript
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCounterStore = defineStore("counter", () => {
    const count = ref(0);
    const doubleCount = computed(() => count.value * 2);
    const doubleCountPlusOne = computed(() => doubleCount.value + 1);
    
    return { count, doubleCount, doubleCountPlusOne }
})
```

<br>

## 向 getter 传递参数

**`store.js`**

```javascript
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
    const users = ref([
        {
            id: 1,
            name: "John"
        },
        {
            id: 2,
            name: "Jane"
        },
        {
            id: 3,
            name: "Mike"
        }
    ]);
    
    const getUserById = () => {
        return (userId) => users.value.find(user => user.id === userId);
    };
    
    return {
        users,
        getUserById
    }
})
```

**`在组件中，你可以这样使用这个 getter：`**

```vue
<template>
	<div>
        <p>User with ID 2: {{ getUserById(2) }}</p>
    </div>
</template>

<script setup>
import { useUserStore } from "./store";
import { storeToRefs } from "pinia";
    
const store = useUserStore();
const { getUserById } = storeToRefs(store);
</script>
```

<br>

## 访问其他 store 的 getter

**`userStore.js`**

```javascript
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  // State
  const userName = ref('John Doe');

  return {
    userName,
  };
});
```

**`productStore.js`**

```javascript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUserStore } from './userStore';


export const useProductStore = defineStore('product', () => {
  const userStore = useUserStore();

  // State
  const products = ref([
    { id: 1, name: 'Laptop', price: 1200 },
    { id: 2, name: 'Keyboard', price: 75 },
    { id: 3, name: 'Mouse', price: 25 },
  ]);

  // Getters
  const productCount = computed(() => products.value.length);
  const totalPrice = computed(() =>
    products.value.reduce((sum, product) => sum + product.price, 0)
  );
  const getProductById = (productId: number) =>
    products.value.find((product) => product.id === productId);

  const customizedGreeting = computed(() => {
    return `Hello ${userStore.userName.value}, there are ${productCount.value} products in the store!`;
  });

  return {
    products,
    productCount,
    totalPrice,
    getProductById,
    customizedGreeting,
  };
});
```

**`myComponent.vue`**

```vue
<template>
	<div>
        <p>{{ customizedGreeting }}</p>
    </div>
</template>

<script setup>
import { useProductStore } from "./productStore";
import { storeToRefs } from "pinia";
    
const productStore = useProductStore();
const { customizedGreeting } = storeToRefs(productStore);
</script>
```

<br>

<br>

# Actions

**`store.js`**

```javascript
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
    const users = ref([]);
    
    function addUser(newUser) {
        users.value.push(newUser);
    }
    
    function updateUser(id, newName) {
        const user = users.value.find(user => user.id === id);
        
        if (user) {
            user.name = newName;
        }
    }
    
    return {
        users,
        addUser,
        updateUser
    }
})
```

**`myComponent.vue`**

```vue
<template>
	<div>
        <button @click="addUser">Add User</button>
        <button @click="updateUser">Update User</button>
    </div>
</template>

<script setup>
import { useUserStore } from "./store";
import { onMounted } from "vue";
    
const store = useUserStore();

onMounted(() => {
    store.users = [
        {
            id: 1,
            name: "John"
        },
        {
            id: 2,
            name: "Jane"
        }
    ]
});
    
const addUser = () => {
    const newUser = {
        id: Date.now(),
        name: "Mike"
    };
    
    store.addUser(newUser);
};
    
const updateUser = () => {
    store.updateUser(1, "John Doe");
}
</script>
```



<br>

## 访问其他 store 的 action

**`userStore.js`** 

```javascript
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  // State
  const userName = ref('John Doe');

  // Actions
  function updateUserName(newName) {
    userName.value = newName;
  }

  return {
    userName,
    updateUserName,
  };
});
```

**`productStore.js`**

```javascript
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useUserStore } from './userStore';


export const useProductStore = defineStore('product', () => {
  const userStore = useUserStore();

  // State
  const products = ref([
    { id: 1, name: 'Laptop', price: 1200 },
    { id: 2, name: 'Keyboard', price: 75 },
    { id: 3, name: 'Mouse', price: 25 },
  ]);

  // Actions
  function addProduct(newProduct) {
    products.value.push(newProduct);
    // 调用 userStore 的 action
    userStore.updateUserName('Admin');
  }

  return {
    products,
    addProduct,
  };
});
```

**`myComponent.vue`**

```vue
<template>
  <div>
    <button @click="addProduct">Add Product</button>
    <p>User Name: {{ userName }}</p>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from './productStore';
import { useUserStore } from './userStore';
import { storeToRefs } from 'pinia';

const productStore = useProductStore();
const userStore = useUserStore();

const { userName } = storeToRefs(userStore);

const addProduct = () => {
  const newProduct = { id: Date.now(), name: 'New Product', price: 100 };
  productStore.addProduct(newProduct);
};
</script>
```





