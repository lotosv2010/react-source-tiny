export default function createElement(type, props, ...children) {
  // 将原有 children 拷贝一份 不要在原有数组上进行操作
  const childrenElements = [].concat(...children).reduce((result, child) => {
    if (child !== false && child !== true && child !== null) {
      // 判断 child 是否是对象类型
      if (child instanceof Object) {
        // 如果是 什么都不需要做 直接返回即可
        result.push(child);
      } else {
        // 如果不是对象就是文本 手动调用 createElement 方法将文本转换为 Virtual DOM
        const temp = createElement('text', {
          textContent: child
        });
        result.push(temp);
      }
    }
    return result;
  }, []);
  return {
    type,
    props: Object.assign({children: childrenElements}, props),
    children: childrenElements
  }
}