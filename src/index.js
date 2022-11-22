import TinyReact from './TinyReact';

const Demo = () => <p>&hearts;!!!</p>;

const Test = () => <div className="comp-test"><Demo /></div>;

const Heart = () => <Test className="comp-heart" />;

class Alert extends TinyReact.Component {
  constructor(props) {
    // 将 props 传递给父类 子类继承父类的 props 子类自然就有 props 数据了
    // 否则 props 仅仅是 constructor 函数的参数而已
    // 将 props 传递给父类的好处是 当 props 发生更改时 父类可以帮助更新 props 更新组件视图
    super(props);
    this.state = {
      title: 'default title'
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({title: 'changed title'});
  }
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);
  }
  componentWillUpdate(nextProps, nextState) {
    console.log('componentWillUpdate', nextProps);
  }
  componentDidUpdate(prevProps, preState) {
    console.log('componentDidMount', prevProps);
  }
  render() {
    return <div className="comp-class">
      <h2>{this.state.title}</h2>
      <p>{this.props.message}</p>
      <div>
        <button onClick={this.handleClick}>改变Title</button>
      </div>
    </div>
  }
}

const virtualDOM = (
  <div className="container">
    <h1 style={{color: 'red'}}>你好 Tiny React</h1>
    <h2>(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h3>(观察: 这个将会被改变)</h3>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <span>这是一段内容</span>
    <button onClick={() => alert("你好")}>点击我</button>
    <h3>这个将会被删除</h3>
    2, 3
    <input value="这是文本框"></input>
    <Heart />
    <Alert message="Hello React" />
  </div>
);

const modifyDOM = (
  <div className="container">
    <h1 style={{color: 'blue'}}>你好 Tiny React</h1>
    <h2 data-test="test">(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h4>(观察: 这个将会被改变)</h4>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <span>这是被修改过的一段内容</span>
    <button onClick={() => alert("你好！！！！")}>点击我</button>
    {/* <h3>这个将会被删除</h3> */}
    2, 3
    <input value="这是文本框"></input>
    <Heart />
    <Alert message="Hello React" />
  </div>
);
console.log(virtualDOM);
const app = document.getElementById('app');
// TODO: 组件渲染&更新
// TinyReact.render(virtualDOM, app);
// setTimeout(() => {
//   TinyReact.render(modifyDOM, app);
// }, 2000);

// TODO：类组状态更新
// TinyReact.render(<Alert message="Hello React" />, app);

// setTimeout(() => {
//   // 是同一个组件
//   TinyReact.render(<Alert message="Hello ReactJs" />, app);

//   // 不是同一个组件
//   // TinyReact.render(<Heart />, app);
// }, 2000);

// TODO: Ref
class DemoRef extends TinyReact.Component {
  handle() {
    let value = this.input.value
    console.log(value)
    console.log(this.alert)
  }
  componentDidMount() {
    console.log('componentDidMount');
  }
  componentWillUnmount() {
    console.log('componentWillUnmount');
  }
  render() {
    return (
      <div>
        <input type="text" ref={input => (this.input = input)} />
        <button onClick={this.handle.bind(this)}>按钮</button>
        <Alert message="Hello React" ref={alert => (this.alert = alert)} />
      </div>
    )
  }
}
// TinyReact.render(<DemoRef />, app);

// TODO: key属性
class DemoKey extends TinyReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' },
        { id: 3, name: 'test3' },
        { id: 4, name: 'test4' }
      ]
    }
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    const newState = JSON.parse(JSON.stringify(this.state));
    // 测试1:位置调换
    // newState.persons.push(newState.persons.shift());
    // 测试2:新增节点
    // newState.persons.splice(1, 0, { id: 5, name: 'test5'});
    // 测试3:删除节点
    newState.persons.pop();
    this.setState(newState);
  }
  render() {
    return <div>
      <ul>
        {this.state.persons.map(p => <li key={p.id}>{p.name}<DemoRef /></li>)}
      </ul>
      <button onClick={this.handleClick}>click</button>
    </div>
  }
}
TinyReact.render(<DemoKey />, app);
