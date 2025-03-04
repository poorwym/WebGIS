## 标记语言和脚本语言
- **标记语言**：主要用于描述数据的结构和表示方式，通常不具备逻辑控制能力。标记语言用于格式化文档、描述网页内容或存储数据，例如 HTML、XML、Markdown。
- **脚本语言**：主要用于编写可执行的程序脚本，控制程序的行为，具有逻辑控制结构（如循环、条件判断等）。脚本语言用于自动化任务、交互式网页编程、服务器端开发等，例如 Python、JavaScript、Shell 脚本。

### 脚本语言的分类
- **解释型语言**：解释型语言在运行时逐行解释代码，执行效率较低。常见的解释型语言包括 Python、JavaScript。
- **编译型语言**：编译型语言在运行前将代码编译成机器码，执行效率较高。常见的编译型语言包括 C、C++、Java。
- **混合型语言**：混合型语言结合了解释型和编译型语言的特点，执行效率介于两者之间。常见的混合型语言包括 Ruby、Lua。

---

## HW2一些知识点

1. 怎么让子组件修改父组件的state

react中可以把setState对象在props中传递给子组件。

```jsx
import { useState, useEffect } from "react";

function Child({ onStateChange }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    onStateChange(count); // 当 count 变化时，通知父组件
  }, [count, onStateChange]);

  return <button onClick={() => setCount(count + 1)}>点击增加 {count}</button>;
}

function Parent() {
  const [childState, setChildState] = useState(0);

  return (
    <div>
      <h1>子组件的 state: {childState}</h1>
      <Child onStateChange={setChildState} />
    </div>
  );
}

export default Parent;
```

2. 关于请求

貌似基于jquery的请求已经过时了，更加先进的可以用fetch函数

用`async`和`await`配合`fetch`可以使代码可读性更好。
```jsx
async function fetchData() {
  try {
    let response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态码: ${response.status}`);
    }

    let data = await response.json(); // 等待解析 JSON
    console.log(data);
  } catch (error) {
    console.error('请求失败:', error);
  }
}

fetchData();
```

3. 关于一些语法糖

showWeather 为true就渲染Weather.
```jsx
{showWeather && <Weather />}
```