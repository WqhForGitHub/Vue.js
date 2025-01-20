## 3.1 如何追踪变化

可惜的是，在 ES6 之前，JavaScript 并没有提供元编程的能力，也就是没有提供可以拦截原型方法的能力。 我们可以用自定义的方法去覆盖原生的原型方法。



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



  

 