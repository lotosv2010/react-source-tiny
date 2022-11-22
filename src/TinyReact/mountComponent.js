import { isFunction } from './mountElement';
import mountNativeElement from './mountNativeElement';

// Virtual DOM 是否为函数型组件
// 条件有两个: 1. Virtual DOM 的 type 属性值为函数 2. 函数的原型对象中不能有render方法
// 只有类组件的原型对象中有render方法 
export function isFunctionalComponent(virtualDOM) {
  const type = virtualDOM?.type;
  return type && isFunction(virtualDOM) && !(type.prototype && type.prototype.render)
}

// 函数组件处理 
export function buildFunctionalComponent(virtualDOM) {
  // 通过 Virtual DOM 中的 type 属性获取到组件函数并调用
  // 调用组件函数时将 Virtual DOM 对象中的 props 属性传递给组件函数 这样在组件中就可以通过 props 属性获取数据了
  // 组件返回要渲染的 Virtual DOM
  return virtualDOM && virtualDOM.type(virtualDOM.props || {})
}

// 处理类组件
export function buildStatefulComponent(virtualDOM) {
  // 实例化类组件 得到类组件实例对象 并将 props 属性传递进类组件
  const component = new virtualDOM.type(virtualDOM.props || {});
  // 调用类组件中的render方法得到要渲染的 Virtual DOM
  const nextVirtualDOM = component.render();
  nextVirtualDOM.component = component;
  // 返回要渲染的 Virtual DOM
  return nextVirtualDOM; 
  
}

export default function mountComponent(virtualDOM, container, oldDOM) {
  // 存放组件调用后返回的 Virtual DOM 的容器
  let nextVirtualDOM = null;
  let component = null;
  // 区分函数型组件和类组件
  if(isFunctionalComponent(virtualDOM)) {
    // 函数组件 调用 buildFunctionalComponent 方法处理函数组件
    nextVirtualDOM = buildFunctionalComponent(virtualDOM);
  } else {
    // 类组件
    nextVirtualDOM = buildStatefulComponent(virtualDOM);
    // 获取组件实例对象
    component = nextVirtualDOM.component;
  }

  // console.log(nextVirtualDOM, container)
  // 判断得到的 Virtual Dom 是否是组件
  if(isFunction(nextVirtualDOM)) {
    // 如果是组件 继续调用 mountComponent 解剖组件
    mountComponent(nextVirtualDOM, container, oldDOM);
  } else {
    // 如果是 Navtive Element 就去渲染
    mountNativeElement(nextVirtualDOM, container, oldDOM);
  }

  // 如果组件实例对象存在的话
  if(component) {
    component.componentDidMount();
    // 判断组件实例对象身上是否有 props 属性 props 属性中是否有 ref 属性
    if(component.props && component.props.ref) {
      // 调用 ref 方法并传递组件实例对象
      component.props.ref(component);
    }
  }
}