import mountElement from './mountElement';
import updateTextNode from './updateTextNode';
import updateNodeElement from './updateNodeElement';
import createDOMElement from './createDOMElement';
import unmount from './unmount';
import diffComponent from './diffComponent';

export default function diff(virtualDOM, container, oldDOM) {
  // 获取未更新前的 Virtual DOM
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM;
  const oldComponent = oldVirtualDOM && oldVirtualDOM.component;
  // 判断 oldDOM 是否存在
  if (!oldDOM) {
    // 如果不存在 不需要对比 直接将 Virtual DOM 转换为真实 DOM
    mountElement(virtualDOM, container)
  }  else if (virtualDOM.type !== oldVirtualDOM.type && typeof virtualDOM.type !== 'function') { // 如果 Virtual DOM 类型不一样,并且 Virtual DOM 不是组件 因为组件要单独进行处理
    // 根据 Virtual DOM 创建真实 DOM 元素
    const newDOMElement = createDOMElement(virtualDOM);
    // 用创建出来的真实 DOM 元素 替换旧的 DOM 元素
    oldDOM.parentNode.replaceChild(newDOMElement, oldDOM);
  } else if (typeof virtualDOM.type === 'function') {
    // 要更新的是组件
    // 1) 组件本身的 virtualDOM 对象 通过它可以获取到组件最新的 props
    // 2) 要更新的组件的实例对象 通过它可以调用组件的生命周期函数 可以更新组件的 props 属性 可以获取到组件返回的最新的 Virtual DOM
    // 3) 要更新的 DOM 象 在更新组件时 需要在已有DOM对象的身上进行修改 实现DOM最小化操作 获取旧的 Virtual DOM 对象
    // 4) 如果要更新的组件和旧组件不是同一个组件 要直接将组件返回的 Virtual DOM 显示在页面中 此时需要 container 做为父级容器
    diffComponent(virtualDOM, oldComponent, oldDOM, container);
  }else if (oldVirtualDOM && virtualDOM.type === oldVirtualDOM.type) { // 类型相同
    if(virtualDOM.type === 'text') {
      // 文本节点 对比文本内容是否发生变化
      updateTextNode(virtualDOM, oldVirtualDOM, oldDOM);
    } else {
      // 元素节点 对比元素属性是否发生变化
      updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM);
    }

    // 将拥有key属性的元素放入 keyedElements 对象中
    let keyedElements = {};
    for (let i = 0, len = oldDOM.childNodes.length; i < len; i++) {
      let domElement = oldDOM.childNodes[i];
      if (domElement.nodeType === 1) {
        let key = domElement.getAttribute("key");
        if (key) {
          keyedElements[key] = domElement;
        }
      }
    }

    // 看一看是否有找到了拥有 key 属性的元素
    let hasNoKey = Object.keys(keyedElements).length === 0
    // 如果没有找到拥有 key 属性的元素 就按照索引进行比较
    if (hasNoKey) {
      // 递归对比 Virtual DOM 的子元素
      virtualDOM.children.forEach((child, i) => {
        diff(child, oldDOM, oldDOM.childNodes[i])
      });
    } else {
      // 使用key属性进行元素比较
      virtualDOM.children.forEach((child, i) => {
        // 获取要进行比对的元素的 key 属性
        let key = child.props.key;
        // 如果 key 属性存在
        if (key) {
          // 到已存在的 DOM 元素对象中查找对应的 DOM 元素
          let domElement = keyedElements[key];
          // 如果找到元素就说明该元素已经存在 不需要重新渲染
          if (domElement) {
            // 虽然 DOM 元素不需要重新渲染 但是不能确定元素的位置就一定没有发生变化
            // 所以还要查看一下元素的位置
            // 看一下 oldDOM 对应的(i)子元素和 domElement 是否是同一个元素 如果不是就说明元素位置发生了变化
            if (oldDOM.childNodes[i] && oldDOM.childNodes[i] !== domElement) {
              // 元素位置发生了变化
              // 将 domElement 插入到当前元素位置的前面 oldDOM.childNodes[i] 就是当前位置
              // domElement 就被放入了当前位置
              oldDOM.insertBefore(domElement, oldDOM.childNodes[i]);
            }
          } else {
            // 新增元素
            mountElement(child, oldDOM, oldDOM.childNodes[i]);
          }
        }
      });
    }

    // !删除多余节点
    // 获取就节点的数量
    let oldChildNodes = oldDOM.childNodes
    // 如果旧节点的数量多于要渲染的新节点的长度
    if (oldChildNodes.length > virtualDOM.children.length) {
      if (hasNoKey) {
        for (
          let i = oldChildNodes.length - 1;
          i >= virtualDOM.children.length;
          i--
        ) {
          // oldDOM.removeChild(oldChildNodes[i])
          unmount(oldChildNodes[i]);
        }
      } else {
        // 通过 key 属性删除节点
        for (let i = 0; i < oldChildNodes.length; i++) {
          let oldChild = oldChildNodes[i]
          let oldChildKey = oldChild._virtualDOM.props.key
          let found = false
          for (let n = 0; n < virtualDOM.children.length; n++) {
            if (oldChildKey === virtualDOM.children[n].props.key) {
              found = true
              break
            }
          }
          if (!found) {
            unmount(oldChild)
            i--
          }
        }
      }
    }
  }
}