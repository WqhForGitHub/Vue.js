function createASTElement(tag, attrs, parent) {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    parent,
    children: [],
  };
}

const options = {
  start(tag, attrs, unary) {
    let element = createASTElement(tag, attrs, currentParent);
  },
  end() {},
  chars(text) {
    let element = { type: 3, text };
  },
  comment(text) {
    let element = { type: 3, text, isComment: true };
  },
};

function parseHTML(html, options) {}
