import { warn } from './utils';
import compile from './compile'

export default function Aue(options) {
  if(!(this instanceof Aue)) {
    warn('please use new init Aue');
  }

  const vm = this;
  const opts = (vm.$options = options);

  compile(vm);

  if(opts.methods) {
    initMethods(vm);
  }
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}
