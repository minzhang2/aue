import { isObject } from './utils';
import { arrayMethods } from './global'

export default function initData(vm) {
  const opts = vm.$options;
  let data;
  vm._data = data = opts.data;
  if (typeof data === 'function') {
    data = data();
  }

  observe(data);
  proxyData(vm, data);
}

 export function observe(data) {
  if (Array.isArray(data)) {
    observeArray(data);
  } else {
    for (let key in data) {
      defineReactive(data, key, data[key]);
    }
  }
}

function observeArray(obj) {
  proxyArray(obj);
  obj.forEach(value => isObject(value) && observe(value));
}

function defineReactive(obj, key, value) {
  Object.defineProperty(obj, key, {
    get() {
      isObject(value) && observe(value);
      return value;
    },
    set(newVal) {
      if (newVal !== value) {
        isObject(newVal) && observe(newVal);
        obj[key] = value = newVal;
      }
    }
  });
}

function proxyData(vm, data) {
  for (let key in data) {
    defineReactive(vm, key, data[key]);
  }
}

function proxyArray(obj) {
  obj.__proto__ = arrayMethods;
}
