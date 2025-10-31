import Watcher from "./watcher.mjs";
import Observer from "./observer.mjs";

class Vue {
  constructor(options) {
    this._data = options.data;
    new Observer(this._data);

    new Watcher(this, "_data.test", (newVal, oldVal) => {
      console.log("newVal, oldVal: ", newVal, oldVal);
    });
  }
}

let o = new Vue({
  data: {
    test: "I am test.",
  },
});

o._data.test = "hello,test.";
