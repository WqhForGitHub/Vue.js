import VNode from "./VNode.mjs";

// 克隆节点
export function cloneVNode(node, deep) {
  const cloned = new VNode(
    node.tag,
    node.data,
    node.children,
    node.text,
    node.elm,
    node.context,
    node.componentOptions,
    node.asyncFactory
  );
  cloned.ns = node.ns;
  cloned.isStatic = node.isStatic;
  cloned.key = node.key;
  cloned.isComment = node.isComment;
  cloned.fnContext = node.fnContext;
  cloned.fnOptions = node.fnOptions;
  cloned.fnScopeId = node.fnScopeId;
  cloned.isCloned = true;

  if (deep && node.children) {
    cloned.children = cloneVNode(node.children);
  }
  return cloned;
}
