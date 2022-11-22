import diff from './diff';

export default function render(virtualDOM, container, oldDOM = container.firstChild) {
  // 在 diff 方法内部判断是否需要对比 对比也好 不对比也好 都在 diff 方法中进行操作  
  diff(virtualDOM, container, oldDOM)
}