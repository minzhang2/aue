const stringify = JSON.stringify;

export default function compile(vm) {
  const opts = vm.$options;
  const defaultTemplate = "<div></div>";

  if (opts.el === undefined && opts.template === undefined) {
    opts.template = defaultTemplate;
  } else if (opts.el) {
    const el = document.querySelector(opts.el);
    opts.template = el ? el.outerHTML : defaultTemplate;
  }

  const { ast } = parse(vm);

  const code = codeGen(ast);

  const render = new Function(`with(this){ return ${code}}`);

  opts.ast = ast;
  opts.render = render;

  console.log(ast, code, render);

  return {
    code,
    ast,
    render
  };
}

function parse(vm) {
  const opts = vm.$options;

  let ast;
  let str = opts.template;
  let curr = 0;
  let stack = [];

  // 开始标签正则
  const openRegex = /^<\s*([a-zA-Z0-9-.]+)/;
  // 属性标签正则
  const attrRegex = /\s*([a-zA-Z0-9-]+)='([^']+)'\s*|\s*([a-zA-Z0-9-]+)="([^"]+)"\s*|\s*([a-zA-Z0-9-]+)=([^'"]+)\s*/;
  // 单标签正则
  const singleRegex = /(\/?)>/;
  // 表达式正则
  const expRegex = /\s*{{\s*([^{}]+)\s*}}\s*/;
  // 闭合标签正则
  const closeRegex = /^<\s*\/([^>]+)\s*>/;

  while (str) {
    let element = {
      single: false
    };

    // 解析开始标签
    parseOpen(element);

    // 解析文本和表达式
    parseText(element);

    // 解析结束标签
    parseClose(element);
  }

  return {
    ast
  };

  // 跳过文本，并设置当前指针位置
  function skip(len) {
    curr += len;
    str = str.slice(len);
  }

  function parseOpen(element) {
    // 解析开始标签
    let openTag;
    if ((openTag = str.match(openRegex))) {
      // 暂时只考虑原生标签，不考虑组件标签
      element.type = 1;
      element.tag = openTag[1];
      element.start = curr;
      stack.push(element);

      skip(openTag[0].length);
    }

    let rawAttrsMap = {};
    let attrsMap = {};
    let attrs = [];

    // 解析属性
    let attrTag;
    while ((attrTag = str.match(attrRegex))) {
      let name = attrTag[1] || attrTag[3] || attrTag[5];
      let value = attrTag[2] || attrTag[4] || attrTag[6];
      let attr = {
        name,
        value,
        start: curr
      };

      rawAttrsMap[name] = attr;
      attrsMap[name] = value;
      attrs.push(attr);
      skip(attrTag[0].length);
      attr.end = curr;
    }
    element.rawAttrsMap = rawAttrsMap;
    element.attrsMap = attrsMap;
    element.attrs = attrs;

    // 解析开始标签结束符
    let singleTag = str.match(singleRegex);
    skip(singleTag[0].length);
    // 解析单标签
    if (singleTag[1]) {
      element.single = true;
      element.end = curr;
      let child = stack.pop();
      let node = stack[stack.length - 1];
      (node.children = node.children || []).push(child);
    }
  }

  function parseText(element) {
    // 解析文本
    let index = 0;
    if ((index = str.indexOf("<")) > 0) {
      let text = str.slice(0, index);
      skip(index);

      let tokens = [];
      let expTag;

      // 解析234s<see格式的文本表达式
      while (text && !str.match(closeRegex)) {
        index = str.indexOf("<", 1);
        text += str.slice(0, index);
        skip(index);
      }

      let node = {
        type: 3,
        start: curr,
        text
      };

      // 解析表达式
      while (text) {
        if ((expTag = text.match(expRegex))) {
          let expIndex = text.indexOf(expTag[0]);
          let textCurr = expIndex + expTag[0].length;
          tokens.push(text.slice(0, expIndex));
          tokens.push({
            exp: expTag[1]
          });

          text = text.slice(textCurr);
        } else {
          tokens.push(text);
          text = "";
        }
      }

      let expression = "";
      for (let i = 0; i < tokens.length; i++) {
        const value = tokens[i];
        expression +=
          typeof value === "object"
            ? `_s(${value.exp})+`
            : `${stringify(value)}+`;
      }

      node.tokens = tokens;
      node.expression = expression.replace(/\+$/, "");
      (element.children = element.children || []).push(node);
      node.end = curr;
    }
  }

  function parseClose() {
    // 解析闭合标签
    let closeTag;
    while ((closeTag = str.match(closeRegex))) {
      skip(closeTag[0].length);
      if (closeTag[1] === stack[stack.length - 1].tag) {
        const child = stack.pop();
        const node = stack[stack.length - 1];
        child.end = curr;

        if (node) {
          (node.children = node.children || []).push(child);
        } else {
          ast = child;
        }
      }
    }
  }
}

function codeGen(node) {
  return genElement(node);

  function genElement(node) {
    let str = "";
    const { type, tag, attrs, children, expression } = node;

    if (type === 1) {
      // 元素标签
      str += `_c(${stringify(tag)},`;

      if (attrs) {
        str += genAttr(attrs);
      }
      if (children) {
        str += genChildren(children);
      }
    } else if (type === 3) {
      // 文本标签
      str += `_t(${expression}`;
    }

    return `${str.replace(/,$/, "")})`;
  }

  function genAttr(attrs) {
    let str = "";

    for (let i = 0; i < attrs.length; i++) {
      const { name, value } = attrs[i];
      str += `${stringify(name)}:${stringify(value)},`;
    }

    return `{${str.replace(/,$/, "")}},`;
  }

  function genChildren(children) {
    let str = "";
    for (let i = 0; i < children.length; i++) {
      str += `${genElement(children[i])},`;
    }
    return `[${str.replace(/,$/, "")}]`;
  }
}
