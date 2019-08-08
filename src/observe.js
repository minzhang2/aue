import { isObject } from './utils'

export default function initData(vm) {
  const opts = vm.$options;
  let data;
  vm._data = data = opts.data;
  if(typeof data === 'function') {
    data = data();
  }

  observe(data);
  proxyData(vm, data);
}

function observe(data) {
  if(Array.isArray(data)) {
    observeArray(data);
  } else {
    for(let key in data) {
      defineReactive(data, key, data[key]);
    }
  }
}

function observeArray(obj) {

}

function defineReactive(obj, key, value) {
  Object.defineProperty(obj, key, {
    get() {
      isObject(value) && observe(value);
      return value;
    },
    set(newVal) {
      if(newVal !== value) {
        isObject(newVal) && observe(newVal);
        obj[key] = value = newVal;
      }
    }
  });
}

function proxyData(vm, data) {
  for(let key in data) {
    defineReactive(vm, key, data[key]);
  }
}
