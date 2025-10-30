import VNode from "./VNode.mjs";

// 文本节点
export default function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val));
}

/*
  {
    text: "Hello Berwin"
  }
 */
