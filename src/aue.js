import './global';
import { warn } from './utils';
import compile from './compile'
import initData from './observe'
import initRender from './render'

export default function Aue(options) {
  if(!(this instanceof Aue)) {
    warn('please use new init Aue');
  }


  const vm = this;
  const opts = (vm.$options = options);

  // 编译模板
  const { ast, code, render } = compile(vm);

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

  initRender(vm);

  const dom = render.call(vm);
  document.body.append(dom);
}
