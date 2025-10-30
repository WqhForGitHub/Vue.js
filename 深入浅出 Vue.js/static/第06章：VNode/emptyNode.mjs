import VNode from "./VNode.mjs";

// 注释节点
export default createEmptyVNode = (text) => {
  const node = new VNode();
  node.text = text;
  node.isComment = true;
  return node;
};

// 例如，一个真实的注释节点
// <!-- 注释节点 -->

/* 所对应的 vnode
  {
    text: "注释节点",
    isComment: true
  }
*/
