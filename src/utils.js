export function warn(msg) {
  console.error(`[Aue error]: ${msg}`);
}

function toString(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

export function isObject(obj) {
  return toString(obj) === 'Object';
}
