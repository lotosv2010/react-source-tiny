import mountElement from './mountElement';
import updateNodeElement from './updateNodeElement';

export default function createDOMElement(virtualDOM) {
  let newElement = null;
  if(virtualDOM.type === 'text') {
    // 创建文本节点
    newElement = document.createTextNode(virtualDOM.props.textContent);
  } else {
    // 创建元素节点
    newElement = document.createElement(virtualDOM.type);
    // 更新元素属性
    updateNodeElement(newElement, virtualDOM);
  }
  // 将 Virtual DOM 挂载到真实 DOM 对象的属性中 方便在对比时获取其 Virtual DOM
  newElement._virtualDOM = virtualDOM;
  // 递归渲染子节点
  virtualDOM.children.forEach(child => {
    // 因为不确定子元素是 NativeElement 还是 Component 所以调用 mountElement 方法进行确定
    mountElement(child, newElement);
  });

  if(virtualDOM.props && virtualDOM.props.ref) {
    virtualDOM.props.ref(newElement);
  }
  return newElement;
}