export default function initRender(vm) {
  vm._c = createElement;
  vm._t = createText;
  vm._s = toString;
}

export function createElement(tag, attrs, children) {
  const ele = document.createElement(tag);
  if(attrs) {
    Object.keys(attrs).forEach(value => ele.setAttribute(value, attrs[value]))
  }
  if(children) {
    for(let i = 0; i < children.length; i++) {
      ele.append(children[i])
    }
  }
  return ele;
}

export function createText(text) {
  return document.createTextNode(text);
}

export function toString(val) {
  return val == null ? '' : val.toString();
}
