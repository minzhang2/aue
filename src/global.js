import { observe } from './observe';

const arrayMethodsToPatch = [
  'push',
  'unshift',
  'pop',
  'shift',
  'splice',
  'sort',
  'reserve'
];
const ArrayProto = Array.prototype;

export const arrayMethods = Object.create(ArrayProto);

arrayMethodsToPatch.forEach(item => {
  const originalMethods = ArrayProto[item];
  arrayMethods[item] = function(...args) {
    const result = originalMethods.apply(this, args);
    let inserted;

    switch (item) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }

    inserted && observe(inserted);

    return result;
  };
});
