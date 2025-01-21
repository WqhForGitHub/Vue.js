## 3.1 如何追踪变化

可惜的是，在 ES6 之前，JavaScript 并没有提供元编程的能力，也就是没有提供可以拦截原型方法的能力。 我们可以用自定义的方法去覆盖原生的原型方法。





![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/3/3.1.png?raw=true)





## 3.2 拦截器

```javascript
const arrayProto = Array.prototype;

export const arrayMethods = Object.create(arrayProto);

['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function(method) {
    // 缓存原始方法
    const original = arrayProto[method];
    
    Object.defineProperty(arrayMethods, method, {
      	enumerable: false,
        writable: true,
        configurable: true 
        value: function mutator (...args) {  
            return original.apply(this, args);               
        }
    })
})
```

 



## 3.3 使用拦截器覆盖 Array 原型

```javascript
const arrayProto = Array.prototype;

export const arrayMethods = Object.create(arrayProto);

['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function(method) {
    // 缓存原始方法
    const original = arrayProto[method];
    
    Object.defineProperty(arrayMethods, method, {
      	enumerable: false,
        writable: true,
        configurable: true 
        value: function mutator (...args) {  
            return original.apply(this, args);               
        }
    })
})


export class Observer {
    constructor (value) {
        this.value = value;
        
        if (Array.isArray(value)) {
            value.__proto__ = arrayMethods;
        } else { 
            this.walk(value);
        }
    }
}                                                       
```

**`__proto__`** 其实是 Object.getPrototypeOf 和 Object.setPrototypeOf 的早期实现，所以使用 ES6 的 Object.setPrototypeOf 来代替 **`__proto__`** 完全可以实现同样的效果。只是到目前为止，ES6 在浏览器中的支持度并不理想。          



![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/3/3.2.png?raw=true)





## 3.4 将拦截器方法挂载到数组的属性上

 ```javascript
 const arrayProto = Array.prototype;
 
 export const arrayMethods = Object.create(arrayProto);
 
 ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function(method) {
     // 缓存原始方法
     const original = arrayProto[method];
     
     Object.defineProperty(arrayMethods, method, {
       	enumerable: false,
         writable: true,
         configurable: true 
         value: function mutator (...args) {  
             return original.apply(this, args);               
         }
     })
 })
 
 
 const hasProto = '__proto__' in {};
 const arrayKeys = Object.getOwnPropertyNames(arrayMethods);
 
 export class Observer {
     constructor (value) {
         this.value = value;
         
         if (Array.isArray(value)) {
             const augment = hasProto ? protoAugment : copyAugment;
             augment(value, arrayMethods, arrayKeys);
         } else {
             this.walk(value);
         }
     }
 }
 
 function protoAugment (target, src, keys) {
     target.__proto__ = src;
 }
 
 function copyAugment (target, src, keys) {
     for (let i = 0; i = keys.length; i < l; i++) {
         const key = keys[i];
         // def(target, key, src[key]); 
     }
 }
 ```



![](https://github.com/WqhForGitHub/Vue.js/blob/vue2%E6%BA%90%E4%BB%A3%E7%A0%81%E8%A7%A3%E6%9E%90/%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BA%20Vue.js/static/3/3.3.png?raw=true)
