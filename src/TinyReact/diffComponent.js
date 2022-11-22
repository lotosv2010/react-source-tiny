import mountElement from "./mountElement"
import updateComponent from "./updateComponent";

// virtualDOM.type 更新后的组件构造函数
// oldComponent.constructor 未更新前的组件构造函数
// 两者等价就表示是同一组件
function isSameComponent(virtualDOM, oldComponent) {
  return oldComponent && virtualDOM.type === oldComponent.constructor
}

export default function diffComponent(virtualDOM, oldComponent, oldDOM, container) {
  // 判断要更新的组件和未更新的组件是否是同一个组件 只需要确定两者使用的是否是同一个构造函数就可以了
  if(isSameComponent(virtualDOM, oldComponent)) {
    // 属同一个组件 做组件更新 
    updateComponent(virtualDOM, oldComponent, oldDOM, container);
  } else {
    // 不是同一个组件 直接将组件内容显示在页面中
    // 这里为 mountElement 方法新增了一个参数 oldDOM 
    // 作用是在将 DOM 对象插入到页面前 将页面中已存在的 DOM 对象删除 否则无论是旧DOM对象还是新DOM对象都会显示在页面中
    mountElement(virtualDOM, container, oldDOM);
  }
}